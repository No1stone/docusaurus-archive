---
id: messaging
title: Messaging
description: "Messaging(Messaging) 하위 문서 목차와 학습·실무 진입 경로를 제공합니다."
slug: /knowledge/messaging
---
# Messaging

> **개요:** 메시지 브로커, 봇·채널 연동, 메일·웹훅 전달처럼 “보내기·받기”가 주된 목적인 글입니다.
> Fan-out, Outbox, CDC 같은 해결 방식은 [Patterns](/docs/patterns/architecture-patterns)에 있습니다.

## 하위

- [Brokers / PubSub](/docs/knowledge/messaging/brokers)
- [Dialogflow / Bot](/docs/knowledge/messaging/dialogflow)
- [Webex](/docs/knowledge/messaging/webex-stack)
- [Email / Webhook](/docs/knowledge/messaging/delivery)

## 관련 패턴·하네스

- [오케스트레이션 Saga와 Outbox](/docs/patterns/architecture-patterns/own-events-outbox)
- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox)
- [CDC](/docs/patterns/architecture-patterns/cdc)
- [Fan-out](/docs/patterns/architecture-patterns/fan-out)
- [알림 vs outbox (ADR-0012)](/docs/decisions/adr-0012)
- 유스케이스에 사가·Outbox가 필요하면 [`spring-messaging-saga`](/docs/harness/orchestrations/spring-messaging-saga)
- [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/) · [lib-message-routing](/docs/harness/templates/backend/spring/lib-message-routing/)
