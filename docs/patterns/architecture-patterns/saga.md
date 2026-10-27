---
id: pattern-saga
title: Saga
description: 여러 서비스의 변경을 단계로 잇고 실패 시 보상으로 정정하는 패턴. 일반 이벤트 발행과 구분합니다.
tags:
  - patterns
  - Saga
  - Spring
status: active
slug: /patterns/architecture-patterns/saga
---
# Saga

> **개요:** Saga는 한 유스케이스가 여러 서비스의 상태 변경을 모두 끝내야 할 때, 로컬 트랜잭션을 단계로 나누고 실패하면 이미 반영된 변경을 보상 동작으로 정정하는 방식입니다.
> 아래 Java·Spring 예제는 설명용이며, 특정 프로젝트에 Saga가 이미 적용됐다는 뜻이 아닙니다.

## 적용 상황

로컬 DB 트랜잭션 하나로 묶을 수 없는 여러 서비스에 변경을 순서대로 반영해야 할 때 검토합니다.
조회만 조합하는 경우에는 Saga가 필요하지 않습니다.

일반 이벤트 발행만으로는 Saga가 되지 않습니다.
이벤트는 “무슨 일이 있었는지”를 알리는 수단일 수 있지만, Saga는 업무 단계의 실행·실패·보상·재시도 정책을 함께 정합니다.

## 동작 흐름

```text
시작
  → 단계 A (서비스 A 로컬 커밋)
  → 단계 B (서비스 B 로컬 커밋)
  → 단계 C 실패
  → 보상 B → 보상 A
  → 실패로 종료 (또는 복구 정책에 따라 재시도)
```

정할 내용의 예입니다.

| 항목 | 내용 |
|------|------|
| 실행 | 어떤 변경을 어떤 순서로 요청할지 |
| 보상 | 이후 단계 실패 시 이미 반영된 변경을 어떤 업무 동작으로 되돌릴지 |
| 멱등성 | 같은 요청이 다시 와도 변경이 한 번만 적용될지 |
| 상태 | 진행·완료·보상 중·실패를 어디에 남길지 |
| 재시도 | 어떤 실패를 다시 시도하고, 어떤 실패는 보상으로 넘길지 |

보상은 DB 롤백이 아닙니다.
이미 다른 서비스에 커밋된 변경은 “취소 주문”, “재고 복구”처럼 별도 업무 API로 정정합니다.

## 설명용 예제 (Java·Spring)

예제 가정: Spring Boot 3.x, Java 17.
오케스트레이터가 주문·결제·재고를 순서대로 호출합니다.
실제 브로커·영속 상태 저장은 생략했습니다.

```java
public class OrderSagaOrchestrator {

    private final OrderClient orderClient;
    private final PaymentClient paymentClient;
    private final InventoryClient inventoryClient;

    public void placeOrder(PlaceOrderCommand command) {
        String orderId = orderClient.create(command); // 단계 1 커밋
        try {
            paymentClient.charge(orderId, command.amount()); // 단계 2 커밋
            inventoryClient.reserve(orderId, command.items()); // 단계 3
        } catch (RuntimeException failed) {
            // 이후 단계 실패 → 이미 커밋된 단계만 보상
            safeCompensate(() -> paymentClient.refund(orderId));
            safeCompensate(() -> orderClient.cancel(orderId));
            throw failed;
        }
    }

    private void safeCompensate(Runnable action) {
        try {
            action.run();
        } catch (RuntimeException compensateFailed) {
            // 보상 실패는 운영 복구 대상으로 남긴다
            throw new IllegalStateException("compensation failed", compensateFailed);
        }
    }
}
```

이 코드는 메모리 오케스트레이션 스케치입니다.
상태 저장, 타임아웃, 중복 전달, 부분 보상 실패 처리는 운영에서 따로 설계해야 합니다.

## 실패 처리와 주의점

- 조회 조합 실패에 실행·보상 단계를 두지 않습니다.
- at-least-once 전달이면 각 단계와 보상 API를 멱등하게 만듭니다.
- 보상 자체를 실패할 수 있으므로, “보상 중” 상태를 남기고 재처리하는 경로가 필요합니다.
- 분산 락만으로 Saga를 대체할 수 없습니다. 락은 동시 경합을 줄일 뿐, 단계 실패 후 정정 흐름을 만들지 않습니다.

## 이 아카이브에서의 위치

Backend Knowledge의 Facade·Service 설계에는 원격 분리 이후 Saga를 검토할 때의 경계가 정리되어 있습니다.
`boot-base`의 `event-saga` 모듈은 미구현이므로 적용 근거로 쓰지 않습니다.

## 관련 글

- [Facade Design](../../knowledge/backend/facade/facade-design.md) — 원격 분리 이후의 Saga 경계
- [Service 설계](../../knowledge/backend/service/service-design.md) — 조회 조합과 Saga 대상 구분
- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox) — 이벤트 저장·전달 신뢰성
- [분산 락](/docs/patterns/architecture-patterns/distributed-lock) — 동시 경합 제어 (Saga와 역할이 다름)
- [자기 이벤트와 Outbox 중앙 전달](/docs/patterns/architecture-patterns/own-events-outbox) — **왜 중앙 발행이어도 이벤트 관리를 안 하는지**
- [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/) — 앱: gRPC 발행 + Kafka 컨슘

## 참고

- [AWS Prescriptive Guidance — Saga pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga.html)
- [Microsoft Learn — Saga design pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/saga)
