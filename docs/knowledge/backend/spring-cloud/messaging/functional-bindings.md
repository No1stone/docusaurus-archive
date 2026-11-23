---
id: spring-cloud-messaging-functional-bindings
title: 함수 기반 메시지 입출력 연결
description: 함수 모델로 메시지 입출력을 연결하는 방법을 정리합니다.
slug: /knowledge/backend/spring-cloud/messaging/functional-bindings
sidebar_position: 3
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "함수 기반 메시지 입출력 연결"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Stream"
  - "Binder"
  - "Kafka"
  - "RabbitMQ"
  - "메시지"
---
# 함수 기반 메시지 입출력 연결

함수 모델로 메시지 입출력을 연결하는 방법을 정리합니다.

## 이 글에서 다룰 범위

- Supplier, Function, Consumer 연결
- Function 프로젝트와의 관계
- 설정으로 바인딩을 여는 범위

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### 함수 기반 메시지 입출력 연결은 어떤 문제를 다루나요?

이 글은 함수 기반 메시지 입출력 연결의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
