---
sidebar_position: 1
format: md
id: t-spring-lib-message-routing
title: "lib-message-routing (Rabbit 실시간)"
description: "실시간·명령 라우팅. ApplicationEvent→비동기→MessagePublishPort. Saga와 무관."
tags:
  - Spring
  - RabbitMQ
  - Messaging
status: active
---

# lib-message-routing

RabbitMQ 기반 **실시간·명령 라우팅** 공용 모듈.  
사가(`lib-message-saga` / Kafka)와 **무관·무의존**.

- **계약 원본(코드 옆):** boot-base `lib-message-routing/README.md`
- 자매: [lib-message-saga](../lib-message-saga/)

---

## 언제 쓰나 / 언제 안 쓰나

| 쓴다 (routing) | 안 쓴다 → saga |
|----------------|----------------|
| 채팅, 콜센터 실시간, 주차 차단기 명령 | MSA 오케스트레이션 (주문→결제→재고) |
| **지금 전달**이 목적 | 다단계 트랜잭션·보상·상태 머신 |
| BFF ↔ 실시간 서버 pub/sub | 참여 서비스가 서로 상태 판단하면 안 되는 흐름 |

한 서버가 둘 다 쓸 수는 있지만 **모듈·봉투·브로커를 섞지 않는다.**

---

## 합의 계약 (잊어먹지 말 것)

### 브로커·토폴로지

| | |
|--|--|
| 브로커 | **RabbitMQ** (Kafka 아님) |
| Exchange | topic, 기본 이름 `app.topic` (`origemite.message.routing.exchange`) |
| Routing key | `{영역}.{리소스}.{…}` — `RoutingKeys.of(...)` |
| 세그먼트 | blank / `.` / `:` / 공백 금지 |
| 큐 | 호스트가 `MessageSubscribePort.bind(queue, exchange, routingKey)` |

예: `parking.barrier.{barrierId}.command`

### 봉투 `RoutingMessage`

| 필드 | 의미 |
|------|------|
| `messageId` | UUID. 메시지 한 건 식별 (기본 자동 발급) |
| `messageType` | 핸들러 분기 키 (예: `BarrierOpenRequested`) |
| `occurredAt` | 발생 시각 |
| `correlationId` | 선택. 요청-응답·로그 묶기 |
| `idempotencyKey` | 멱등 축. **미지정 시 messageId** |
| `expiresAt` | 선택. 지나면 Dispatcher가 **스킵** (만료 처리는 lib) |
| `headers` | 부가 문자열 맵 |
| `data` | **자기완결 페이로드**. 구독에 필요한 값 전부 여기 |

- 사가의 `CREATE/STATUS/FAIL/COMPLETE` · `sagaId` · Outbox **없음**.
- 멱등 **저장·중복 스킵은 호스트 핸들러 책임** (lib는 키만 실어 줌).
- AMQP 헤더에도 `idempotencyKey` / `expiresAt` 실음. `expiresAt` 있으면 Rabbit `expiration`(ms)도 설정.

### Port / 처리

| 타입 | 역할 |
|------|------|
| `MessagePublishPort` | Facade는 **이것만** 주입. Rabbit 타입 직접 쓰지 않음 |
| `MessageSubscribePort` | 큐 바인딩 + 리스너 시작 |
| `MessageHandler` | `messageType()` 단위 처리 (빈 등록) |
| `MessageHandlerDispatcher` | type 매칭 · 만료 스킵 · 핸들러 호출 |

### 연결 유지 (중요)

| | |
|--|--|
| automaticRecovery / topologyRecovery | 켜짐 |
| heartbeat | 기본 30s |
| network-recovery-interval | 기본 5s (재연결 간격) |
| missing-queues-fatal | 기본 false |
| 구독 컨테이너 | Boot `SimpleRabbitListenerContainerFactory` 우선, 없으면 recoveryInterval |

단절 후 자동 복구·토폴로지 재선언은 어댑터 쪽에 맡긴다. 앱에서 Connection 수동 재생성하지 않는다.

---

## 설정

```yaml
spring:
  rabbitmq:
    host: localhost
    port: 5672
origemite:
  message:
    routing:
      exchange: app.topic
      network-recovery-interval-ms: 5000
      requested-heartbeat-seconds: 30
      missing-queues-fatal: false
```

---

## 사용 패턴

### 권장: 도메인은 Rabbit 없이 (ApplicationEvent → 비동기 → Port)

발행 **호스트만** `lib-message-routing`(AMQP)을 둔다. BFF/도메인 모듈은 Spring 이벤트만.

```text
Facade.publishEvent(BarrierOpenRequestedEvent)
        ↓ @Async
Bridge → MessagePublishPort → Rabbit
```

예제: `example/async/BarrierOpenRequestedEvent` · `BarrierOpenAsyncBridge`  
(`@EnableAsync` · Bridge `@Component` 등록. Port 주입은 routing 어댑터 호스트에서.)

### 동기 직접 발행

```java
messagePublishPort.publish(
    RoutingKeys.of("parking", "barrier", barrierId, "command"),
    RoutingMessage.builder("BarrierOpenRequested")
        .data(new BarrierOpenRequested(...))
        .expiresAt(Instant.now().plusSeconds(30))
        .build());
```

### 구독

```java
messageSubscribePort.bind("parking.barrier.cmd", "app.topic", "parking.barrier.*.command");
```

코드 예: `example/BarrierCommandPublisherExample` · `BarrierOpenHandlerExample` · `example/async/*`
