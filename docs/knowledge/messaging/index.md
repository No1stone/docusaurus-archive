---
id: messaging
title: Messaging
description: "RabbitMQ, Kafka, 기타 브로커와 전달 채널 Knowledge 진입점입니다."
slug: /knowledge/messaging
---
# Messaging

> **개요:** 메시지 브로커와 봇, 메일, 웹훅처럼 “보내기, 받기”가 주된 목적인 글입니다.
> Fan-out, Outbox, CDC 같은 해결 방식은 [Patterns](/docs/patterns/architecture-patterns)에 있습니다.

## 브로커

- [RabbitMQ란?](/docs/knowledge/messaging/rabbitmq)
- [Kafka란?](/docs/knowledge/k-kafka)
- [비교 — Redis Streams, RabbitMQ, Kafka](/docs/knowledge/messaging/compare/redis-rabbit-kafka)

## 기타

- [기타 브로커, 메모](/docs/knowledge/messaging/brokers) (Pulsar, STOMP, Debezium, 구 메모)
- [Dialogflow / Bot](/docs/knowledge/messaging/dialogflow)
- [Webex](/docs/knowledge/messaging/webex-stack)
- [Email / Webhook](/docs/knowledge/messaging/delivery)

## 관련 패턴, 하네스

- [오케스트레이션 Saga와 Outbox](/docs/patterns/architecture-patterns/own-events-outbox)
- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox)
- [CDC](/docs/patterns/architecture-patterns/cdc)
- [Fan-out](/docs/patterns/architecture-patterns/fan-out)
- [알림 vs outbox (ADR-0012)](/docs/decisions/adr-0012)
- [`spring-messaging-saga`](/docs/harness/orchestrations/spring-messaging-saga)
- [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/) ,  [lib-message-routing](/docs/harness/templates/backend/spring/lib-message-routing/)
