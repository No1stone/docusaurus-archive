---
id: kafka-pattern-failure-idempotency
title: "실패 처리, 중복 소비, 멱등성"
description: "Kafka 재처리와 at-least-once에서 중복 소비를 멱등으로 다루는 기준을 정리합니다."
slug: /knowledge/messaging/kafka/patterns/failure-idempotency
sidebar_position: 3
tags: [Kafka, Messaging]
---
# 실패 처리, 중복 소비, 멱등성

> **개요:** 기본 전달 의미는 at-least-once에 가깝습니다.
> 같은 이벤트를 두 번 받아도 결과가 같아야 합니다.

## 상황

처리 후 커밋 전에 프로세스가 죽으면 같은 레코드를 다시 받습니다.

| 대응 | 요지 |
|---|---|
| 멱등 키 (`eventId`) | 처리 여부 저장 후 스킵 |
| DLT / 에러 토픽 | 독성 메시지 격리 |
| 트랜잭션al outbox | DB와 발행을 맞출 때 |

→ [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox), [Saga](/docs/patterns/architecture-patterns/own-events-outbox)
