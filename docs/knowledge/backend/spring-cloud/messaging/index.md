---
id: spring-cloud-messaging-index
title: Stream과 메시징
description: Stream Binder, Kafka와 RabbitMQ, 함수 바인딩, 그룹과 재처리를 다루는 묶음입니다.
slug: /knowledge/backend/spring-cloud/messaging
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Stream과 메시징"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Stream"
  - "Binder"
  - "Kafka"
  - "RabbitMQ"
  - "Stream"
---
# Stream과 메시징

Stream Binder, Kafka와 RabbitMQ, 함수 바인딩, 그룹과 재처리를 다루는 묶음입니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [Stream의 역할과 Binder](./stream-and-binders.md) | Spring Cloud Stream과 Binder의 역할을 정리합니다. |
| [Kafka Binder와 RabbitMQ Binder](./kafka-and-rabbitmq.md) | Kafka와 RabbitMQ Binder 선택 기준을 정리합니다. |
| [함수 기반 메시지 입출력 연결](./functional-bindings.md) | 함수 모델로 메시지 입출력을 연결하는 방법을 정리합니다. |
| [소비자 그룹과 파티셔닝](./groups-and-partitioning.md) | 소비자 그룹과 파티셔닝 설정을 정리합니다. |
| [오류, 재처리와 중복 처리](./failures-and-reprocessing.md) | 소비 실패, 재처리와 중복 처리 대응을 정리합니다. |
| [Spring Kafka, Spring AMQP와 Stream 비교](./native-clients-and-stream.md) | 네이티브 클라이언트와 Stream 추상화를 비교합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [Kafka](/docs/knowledge/k-kafka)
- [RabbitMQ](/docs/knowledge/messaging/rabbitmq)
- [Spring Kafka](/docs/knowledge/messaging/kafka/spring/spring-kafka)
- [Spring AMQP](/docs/knowledge/messaging/rabbitmq/spring/spring-amqp)
- [Legacy](../legacy/index.md)

## 자주 묻는 질문

### Stream과 메시징 묶음에서는 무엇을 다루나요?

Stream과 메시징의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### Stream과 메시징부터 읽어야 하나요?

입구 글에서 하위 글의 역할만 확인한 뒤 필요한 주제로 들어가면 됩니다.
