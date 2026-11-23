---
id: spring-cloud-messaging-native-clients-and-stream
title: Spring Kafka, Spring AMQP와 Stream 비교
description: 네이티브 클라이언트와 Stream 추상화를 비교합니다.
slug: /knowledge/backend/spring-cloud/messaging/native-clients-and-stream
sidebar_position: 6
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Spring Kafka, Spring AMQP와 Stream 비교"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Stream"
  - "Binder"
  - "Kafka"
  - "RabbitMQ"
  - "AMQP"
---
# Spring Kafka, Spring AMQP와 Stream 비교

네이티브 클라이언트와 Stream 추상화를 비교합니다.

## 이 글에서 다룰 범위

- 직접 클라이언트가 유리한 경우
- Stream이 줄여 주는 범위
- 혼합 사용 시 경계
- [Spring Kafka](/docs/knowledge/messaging/kafka/spring/spring-kafka), [Spring AMQP](/docs/knowledge/messaging/rabbitmq/spring/spring-amqp)와의 역할 구분

상세 설정과 코드 예제는 이후 본문에서 채웁니다.

## 자주 묻는 질문

### Spring Kafka, Spring AMQP와 Stream 비교은 어떤 문제를 다루나요?

이 글은 Spring Kafka, Spring AMQP와 Stream 비교의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
