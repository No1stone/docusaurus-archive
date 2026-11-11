---
id: messaging-compare-redis-rabbit-kafka
title: "Redis Streams, RabbitMQ, Kafka — 전달, 분배, 재처리"
description: "Redis Streams와 RabbitMQ, Kafka를 전달, 분배, 재처리 관점에서 비교합니다."
slug: /knowledge/messaging/compare/redis-rabbit-kafka
sidebar_position: 1
tags: [Redis, RabbitMQ, Kafka, Messaging]
---
# Redis Streams, RabbitMQ, Kafka — 전달, 분배, 재처리

> **개요:** 같은 “주문 → 알림 + 집계”라도 브로커마다 전달, 분배, 재처리 방식이 다릅니다.

## 비교

| | Redis Streams | RabbitMQ | Kafka |
|---|---|---|---|
| 모델 | 스트림 로그 + Consumer Group | Exchange → Queue | Topic 로그 + Consumer Group |
| 관심사 분배 | 키/그룹 설계 | Binding으로 큐 분리 | 그룹을 나눠 독립 소비 |
| 같은 관심사 병렬 | 그룹 내 소비자 | 한 큐의 여러 워커 | 그룹 내 파티션 분배 |
| 재처리 | pending/claim, 새 소비자 | requeue, DLX | retention + offset 재설정 |
| 확인 | `XACK` | Confirm + Consumer ACK | Producer acks + Offset Commit |

## 고를 때

- 이미 Redis를 쓰고 단순 작업 큐면 [Redis 작업 큐](/docs/knowledge/data/redis/patterns/work-queue)
- 라우팅, 큐 단위 작업, AMQP 운영이면 [RabbitMQ란?](/docs/knowledge/messaging/rabbitmq)
- 이벤트 로그, 여러 독립 소비자, 보관 재처리면 [Kafka란?](/docs/knowledge/k-kafka)

신뢰 발행, 오케스트레이션은 브로커와 별도로 [Outbox](/docs/patterns/architecture-patterns/outbox-and-inbox), [Saga](/docs/patterns/architecture-patterns/own-events-outbox)를 봅니다.
