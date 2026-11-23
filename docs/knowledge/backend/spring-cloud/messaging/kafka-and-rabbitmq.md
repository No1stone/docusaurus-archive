---
id: spring-cloud-messaging-kafka-and-rabbitmq
title: Kafka Binder와 RabbitMQ Binder
description: Kafka와 RabbitMQ Binder 선택 기준을 정리합니다.
slug: /knowledge/backend/spring-cloud/messaging/kafka-and-rabbitmq
sidebar_position: 2
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Kafka Binder와 RabbitMQ Binder"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Stream"
  - "Binder"
  - "Kafka"
  - "RabbitMQ"
---
# Kafka Binder와 RabbitMQ Binder

Kafka와 RabbitMQ Binder 선택 기준을 정리합니다.

## 이 글에서 다룰 범위

- 전달 보장과 토폴로지 차이
- 운영 자원은 브로커 자체
- 브로커 상세는 [Kafka](/docs/knowledge/k-kafka), [RabbitMQ](/docs/knowledge/messaging/rabbitmq)로 연결하고 여기서는 Binder 선택만 다룹니다

상세 설정과 코드 예제는 이후 본문에서 채웁니다.

## 자주 묻는 질문

### Kafka Binder와 RabbitMQ Binder은 어떤 문제를 다루나요?

이 글은 Kafka Binder와 RabbitMQ Binder의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
