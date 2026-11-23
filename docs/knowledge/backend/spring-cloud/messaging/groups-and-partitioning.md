---
id: spring-cloud-messaging-groups-and-partitioning
title: 소비자 그룹과 파티셔닝
description: 소비자 그룹과 파티셔닝 설정을 정리합니다.
slug: /knowledge/backend/spring-cloud/messaging/groups-and-partitioning
sidebar_position: 4
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "소비자 그룹과 파티셔닝"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Stream"
  - "Binder"
  - "Kafka"
  - "RabbitMQ"
  - "소비자"
---
# 소비자 그룹과 파티셔닝

소비자 그룹과 파티셔닝 설정을 정리합니다.

## 이 글에서 다룰 범위

- 경쟁 소비자와 순서 요구
- 파티션 키 설계
- 스케일 아웃 시 확인 항목

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### 소비자 그룹과 파티셔닝은 어떤 문제를 다루나요?

이 글은 소비자 그룹과 파티셔닝의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
