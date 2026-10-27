---
sidebar_position: 1
format: md
id: t-spring-lib-message-saga
title: "lib-message-saga (발행 gRPC · 컨슘 Kafka)"
description: "앱 라이브러리. gRPC로 event-saga 발행, Kafka 컨슘. 자기 이벤트 원칙."
tags:
  - Spring
  - Kafka
  - gRPC
  - Outbox
status: active
---

# lib-message-saga

> **원칙:** [자기 이벤트와 Outbox 중앙 전달](/docs/patterns/architecture-patterns/own-events-outbox)  
> 실시간 Rabbit: [lib-message-routing](../lib-message-routing/)

Gradle에 넣으면 MSA 앱이 **발행(gRPC)** 과 **컨슘(Kafka)** 을 쓸 수 있다.

## 왜

이벤트 지옥 → 발행을 event-saga로 모음 → 중앙이 이벤트까지 관리하면 또 지옥 →  
**자기 이벤트만** 발행, **보상도 이벤트**, **필요한 소비 쪽이 보상**.

중앙(event-saga) = **전달 창구(Outbox)** 이지 이벤트 관리 시스템이 아니다.

## 역할

| lib (앱) | event-saga |
|----------|------------|
| gRPC `SagaPublishPort` | REST/gRPC Accept → `event_outbox` → Kafka **producer** |
| Kafka consume + Handler | 컨슘·사가 상태 없음 |
| `SagaPublishPolicy` | 동일 정책 |

성공 `COMPLETE` · 실패 `FAIL+COMPENSATE*` → 컨슈머 보상.

## Kafka

- 앱: consumer + `origemite.message.saga.consume.*`
- 서버: producer + outbox relay  
- 앱은 Kafka에 직접 produce 하지 않음
