---
id: rabbitmq-basics-components
title: "Producer, Exchange, Queue, Consumer"
description: "RabbitMQ에서 발행, Exchange, 큐, 소비가 이어지는 기본 흐름을 정리합니다."
slug: /knowledge/messaging/rabbitmq/basics/producer-exchange-queue-consumer
sidebar_position: 1
tags: [RabbitMQ, Messaging]
---
# Producer, Exchange, Queue, Consumer

> **개요:** 메시지는 큐에 직접 쓰는 것이 아니라 Exchange를 거쳐 Binding된 큐로 들어갑니다.

## 역할

| 구성요소 | 역할 |
|---|---|
| Producer | Exchange에 publish |
| Exchange | Binding 규칙으로 라우팅 |
| Queue | 소비 대기열 |
| Consumer | 큐에서 가져와 처리 후 ACK |

```text
Producer → Exchange → (Binding) → Queue → Consumer
```

입문 흐름은 [RabbitMQ란?](/docs/knowledge/messaging/rabbitmq)을 봅니다.<br />
Exchange 타입은 [Exchange와 Binding](/docs/knowledge/messaging/brokers/spring-amqp-exchange-routing)을 봅니다.
