---
id: pattern-outbox-inbox
title: Outbox와 Inbox
description: 업무 변경과 이벤트 전달의 이중 쓰기 문제를 줄이는 Outbox, 수신 멱등을 위한 Inbox. partner-gateway에서 확인한 범위를 구분합니다.
tags:
  - patterns
  - Outbox
  - Inbox
  - Spring
status: active
slug: /patterns/architecture-patterns/outbox-and-inbox
---
# Outbox와 Inbox

> **개요:** Outbox는 업무 데이터와 발행할 이벤트를 같은 DB 트랜잭션에 넣고, 별도 전달기가 브로커나 외부로 보냅니다.
> Inbox는 수신 쪽에서 이벤트 식별자로 중복을 걸러 같은 메시지를 한 번만 처리합니다.

## 적용 상황

| 패턴 | 쓰는 때 |
|------|---------|
| Outbox | DB에 상태를 쓴 뒤 메시지 브로커에도 알려야 하는데, 두 쓰기를 원자적으로 보장하고 싶을 때 |
| Inbox | 같은 이벤트가 여러 번 도착해도 처리 결과가 한 번이어야 할 때 |

둘 다 at-least-once 전달을 전제로 하는 경우가 많습니다.
락만으로 유실·중복을 모두 해결한다고 보지 않습니다.

## 개념 흐름

### Outbox

```text
업무 트랜잭션
  ├─ 주문 테이블 INSERT/UPDATE
  └─ outbox 테이블 INSERT (같은 커밋)
별도 전달기(폴링 또는 CDC)
  └─ outbox → 브로커 발행 → 발행 완료 표시
소비자
  └─ 멱등 처리 (Inbox 등과 함께 쓰는 경우가 많음)
```

트랜잭션이 롤백되면 outbox 행도 함께 사라지므로, “DB만 성공하고 이벤트만 나간” 상황을 줄입니다.
전달기는 커밋된 행만 읽습니다.

### Inbox

```text
수신
  → eventId 로 이미 처리했는지 확인
  → 없으면 처리 기록(Inbox)과 업무 처리를 같은 트랜잭션에 넣거나, 유니크 제약으로 경합을 막음
  → 있으면 성공으로 응답하고 재처리하지 않음
```

## 설명용 Outbox 스케치 (Java·Spring)

예제 가정: Spring Boot 3.x, Java 17, JPA.
업무 변경과 outbox 저장만 같은 트랜잭션에 둡니다.
브로커 발행 코드는 트랜잭션 밖에 둡니다.

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxRepository outboxRepository;

    @Transactional
    public void confirm(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.confirm();
        orderRepository.save(order);

        OutboxMessage message = OutboxMessage.pending(
                "OrderConfirmed",
                orderId.toString(),
                "{\"orderId\":" + orderId + "}"
        );
        outboxRepository.save(message);
    }
}
```

```java
@Component
@RequiredArgsConstructor
public class OutboxRelay {

    private final OutboxRepository outboxRepository;
    private final ApplicationEventPublisher publisher; // 또는 KafkaTemplate 등

    @Scheduled(fixedDelayString = "1000")
    @Transactional
    public void publishPending() {
        for (OutboxMessage message : outboxRepository.findTop50ByStatusOrderByIdAsc("PENDING")) {
            publisher.publishEvent(message.toIntegrationEvent());
            message.markPublished();
        }
    }
}
```

이 스케치는 실행 검증한 프로젝트가 아닙니다.
실제로는 발행 실패 시 상태, 순서, 독(poison) 메시지 처리를 정해야 합니다.

## partner-gateway에서 확인한 범위

참조: `partner-gateway` 커밋 `4450193`, Spring Boot 3.5.x, Java 25.
아래는 그 저장소에서 읽은 동작이며, 이름에 Outbox/Inbox 테이블이 있는 구현은 아니었습니다.

### 수신 쪽 (Inbox에 가까운 역할)

`mopl_webhook_event` 테이블에 수신 이벤트를 저장합니다.
`event_id` 유니크로 중복을 가릅니다.
저장 전에 존재하면 무시하고, 동시 저장으로 유니크 위반이 나도 이미 있으면 성공으로 처리합니다.

확인 경로:

- `db/init/01_init.sql` — `mopl_webhook_event`, `UNIQUE(event_id)`, `forward_status`
- `.../webhook/facade/MoplWebhookReceiveFacade.java` — 서명 검증 후 저장, 중복 무시
- `.../moplwebhookevent/service/MoplWebhookEventService.java` — `existsByEventId`, `save`

수신 트랜잭션의 범위는 “웹훅 행 저장”입니다.
다른 업무 테이블과 이벤트를 한 트랜잭션에 묶는 고전적 Outbox 이중 쓰기는 이 경로에서 확인하지 못했습니다.

### 전달 쪽 (Outbox 전달기에 가까운 역할)

스케줄러가 `forward_status`가 `READY` 또는 `FAILURE`인 행을 읽어 HT로 넘깁니다.
HT가 2xx이면 `SUCCESS`와 전달 시각을 기록하고, 실패면 `FAILURE`로 두어 다음 주기에 다시 시도합니다.
Mopl에 준 2xx 수신 응답과 HT 전달 성공은 별개입니다.

확인 경로:

- `.../webhook/facade/WebhookCallbackFacade.java`
- `.../infrastructure/schedule/WebhookCallbackScheduler.java`
- `forward_status`: `READY`, `SUCCESS`, `FAILURE`

현재 전달 대상 이벤트 종류는 코드 주석·상수 기준으로 `access.completed` → HT P11 한 갈래입니다.
다른 이벤트 타입은 저장될 수 있어도 전달 배치에서 빼 둔 상태가 코드에 명시되어 있습니다.

### 충족하지 않은 것으로 단정하지 않는 항목

- 임의 도메인 애그리거트 변경과 outbox 행의 단일 트랜잭션
- 메시지 브로커(Kafka 등)로의 일반 Outbox 릴레이
- 분산 락을 이용한 전달 워커 단일화 (이 경로에서 Redisson 사용은 확인되지 않음)

## 실패 처리와 주의점

- Outbox 전달은 보통 at-least-once이므로 소비자는 Inbox 등으로 멱등해야 합니다.
- Inbox만 있고 전달 상태 기계가 없으면, “받아 두고 밖으로 못 보낸” 건을 재처리하기 어렵습니다.
- partner-gateway처럼 수신 저장과 외부 전달을 나누면, 수신 성공과 전달 성공을 같은 의미로 쓰지 않습니다.

## 관련 글

- [CDC](/docs/patterns/architecture-patterns/cdc) — Outbox 릴레이를 CDC로 구현하는 방식도 있음
- [Saga](/docs/patterns/architecture-patterns/saga) — 여러 서비스 변경의 보상 흐름
- [분산 락](/docs/patterns/architecture-patterns/distributed-lock) — 동시 경합 제어
- [포트폴리오 서버 설정과 데이터 경로](/docs/postmortems/msa-iam-portfolio/runtime-data-path) — CDC 시도 사례 (Outbox와 별개)

## 참고

- [AWS Prescriptive Guidance — Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [Confluent — The Transactional Outbox Pattern](https://developer.confluent.io/courses/microservices/the-transactional-outbox-pattern/)
