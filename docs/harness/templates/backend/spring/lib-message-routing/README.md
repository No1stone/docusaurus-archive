---
sidebar_position: 1
format: md
id: t-spring-lib-message-routing
title: "lib-message-routing (Rabbit 실시간·명령)"
description: "실시간·명령 라우팅 공유 모듈. RabbitMQ. event-saga(자기 이벤트)와 분리."
tags:
  - Spring
  - RabbitMQ
  - Messaging
status: active
---

# lib-message-routing (Rabbit 실시간·명령)

코드·계약 원본: boot-base `lib-message-routing/README.md`.  
자기 이벤트·Outbox(Kafka)는 [lib-message-saga](../lib-message-saga/). **브로커·모듈을 섞지 않는다.**

도메인·ExampleItem과 무관한 **공유 라이브러리**. 채팅·콜센터 실시간·주차 차단기 명령처럼 **지금 전달**이 목적일 때 쓴다.

```text
lib-message-routing/   ← Rabbit · 실시간·명령 (이 폴더)
lib-message-saga/      ← Kafka · 자기 이벤트 발행/컨슘 (별도)
```

## 합의 계약

| 항목 | 규칙 |
|------|------|
| 브로커 | **RabbitMQ** (Kafka 아님) |
| Exchange | topic, 기본 `app.topic` |
| Routing key | `{영역}.{리소스}.{…}` — `RoutingKeys.of(...)` |
| 세그먼트 | blank / `.` / `:` / 공백 금지 |
| 발행 | Facade는 `MessagePublishPort`만 주입 |
| 구독 | `MessageSubscribePort.bind(queue, exchange, routingKey)` |
| 핸들러 | `MessageHandler` — `messageType` 분기 |
| 멱등 | 봉투 `idempotencyKey`(기본=messageId). **저장·중복 스킵은 호스트** |
| 만료 | `expiresAt` — Dispatcher가 스킵. AMQP expiration도 설정 |
| 연결 | automaticRecovery + topologyRecovery, heartbeat, network-recovery-interval |

### 봉투 `RoutingMessage`

`messageId` · `messageType` · `occurredAt` · `correlationId` · `idempotencyKey` · `expiresAt` · `headers` · **`data`(자기완결)**

event-saga type·Outbox **없음**.

## 설정 예

```yaml
origemite:
  message:
    routing:
      exchange: app.topic
      network-recovery-interval-ms: 5000
      requested-heartbeat-seconds: 30
      missing-queues-fatal: false
```

## 사용

- 호스트에 Rabbit 연결·큐 선언 후 Port만 주입.
- 예: boot-base `lib-message-routing` `example/` (차단기).
- 자기 이벤트·보상 버스는 [lib-message-saga](../lib-message-saga/) · [own-events-outbox](/docs/patterns/architecture-patterns/own-events-outbox).

## 코드 위치

`boot-base` 모듈 `lib-message-routing`.
