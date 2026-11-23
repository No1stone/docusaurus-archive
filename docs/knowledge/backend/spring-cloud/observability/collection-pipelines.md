---
id: spring-cloud-observability-collection-pipelines
title: Logback, Logstash, Collector와 수집 경로
description: 로그와 텔레메트리 수집 경로를 정리합니다. Spring Cloud 밖 프로젝트와의 연계 범위입니다.
slug: /knowledge/backend/spring-cloud/observability/collection-pipelines
sidebar_position: 6
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Logback, Logstash, Collector와 수집 경로"
  - "Spring"
  - "Spring Cloud"
  - "분산 추적"
  - "Micrometer Tracing"
  - "관측 연계"
  - "Logback"
  - "Logstash"
---
# Logback, Logstash, Collector와 수집 경로

로그와 텔레메트리 수집 경로를 정리합니다.

## 이 글에서 다룰 범위

- 앱 밖의 수집 파이프라인
- Logstash와 Collector는 Spring Cloud 소속이 아님
- 상세는 [관측성](/docs/knowledge/infrastructure/observability), [Spring Boot와 Logstash](/docs/knowledge/k-springboot-logstash)로 연결

상세 설정과 코드 예제는 이후 본문에서 채웁니다.

## 자주 묻는 질문

### Logback, Logstash, Collector와 수집 경로은 어떤 문제를 다루나요?

이 글은 Logback, Logstash, Collector와 수집 경로의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
