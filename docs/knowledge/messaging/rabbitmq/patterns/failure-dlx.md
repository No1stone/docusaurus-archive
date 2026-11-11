---
id: rabbitmq-pattern-failure-dlx
title: "실패 처리 — 재시도, 재큐잉, Dead Letter Exchange"
description: "RabbitMQ에서 nack/requeue와 Dead Letter Exchange로 실패 메시지를 다루는 기준을 정리합니다."
slug: /knowledge/messaging/rabbitmq/patterns/failure-dlx
sidebar_position: 3
tags: [RabbitMQ, Messaging]
---
# 실패 처리 — 재시도, 재큐잉, Dead Letter Exchange

> **개요:** 처리 실패 시 즉시 재큐잉할지, 재시도 한도 후 DLX로 보낼지 정합니다.

## 선택

| 정책 | 요지 |
|---|---|
| `basicNack(..., requeue=true)` | 같은 큐로 다시 |
| 재시도 헤더 + 지연/별도 큐 | 폭발적 재시도를 완화 |
| DLX / DLQ | 한도 초과, 독성 메시지를 격리 |

독성 메시지를 무한 requeue하면 큐가 막힐 수 있습니다.<br />
멱등 키와 함께 설계합니다.<br />
→ [소비자 ACK](/docs/knowledge/messaging/brokers/spring-amqp-consumer-ack)

비즈니스 보상 흐름은 [Saga](/docs/patterns/architecture-patterns/saga), 신뢰 발행은 [Outbox](/docs/patterns/architecture-patterns/outbox-and-inbox)를 봅니다.
