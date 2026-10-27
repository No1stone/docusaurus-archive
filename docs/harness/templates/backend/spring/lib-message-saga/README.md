---
sidebar_position: 1
format: md
id: t-spring-lib-message-saga
title: "lib-message-saga (발행 gRPC · 컨슘 Kafka)"
description: "전통 오케스트레이션 Saga. 앱은 gRPC 발행·Kafka 컨슘. event-saga는 Outbox+지휘."
tags:
  - Spring
  - Kafka
  - gRPC
  - Outbox
  - Saga
status: active
---

# lib-message-saga

> **원칙:** [오케스트레이션 Saga와 Outbox](/docs/patterns/architecture-patterns/own-events-outbox)  
> Rabbit 실시간: [lib-message-routing](../lib-message-routing/)

## 전통 흐름

```text
주문 시작 발행 → Saga 소비·다음 요청 → 서비스 결과 발행
→ Saga 소비·진행/보상 결정·발행
```

코레오그래피가 아니라 **Saga 지휘**. 발행은 Outbox로 모아 이벤트 지옥을 줄인다.

## 역할

| lib (앱) | event-saga (**Saga = 컨슈머**) |
|----------|------------|
| gRPC 시작·**결과** 발행 | 결과 토픽 **소비** → 결정 → Outbox 발행 |
| Kafka **요청·보상** 컨슘 | Kafka producer 릴레이 |

Gradle에 넣으면 발행+컨슘 API를 쓴다.
