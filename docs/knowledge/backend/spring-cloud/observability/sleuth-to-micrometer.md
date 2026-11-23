---
id: spring-cloud-observability-sleuth-to-micrometer
title: Sleuth에서 Micrometer Tracing으로
description: Sleuth에서 Micrometer Tracing으로 옮긴 변화를 정리합니다. Spring Cloud 밖 프로젝트와의 연계 범위입니다.
slug: /knowledge/backend/spring-cloud/observability/sleuth-to-micrometer
sidebar_position: 2
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Sleuth에서 Micrometer Tracing으로"
  - "Spring"
  - "Spring Cloud"
  - "분산 추적"
  - "Micrometer Tracing"
  - "관측 연계"
  - "Sleuth에서"
  - "Micrometer"
---
# Sleuth에서 Micrometer Tracing으로

Sleuth에서 Micrometer Tracing으로 옮긴 변화를 정리합니다.

## 이 글에서 다룰 범위

- 과거 의존성과 현재 권장 경로
- 마이그레이션 시 확인할 API
- Boot 버전과의 맞춤

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### Sleuth에서 Micrometer Tracing으로은 어떤 문제를 다루나요?

이 글은 Sleuth에서 Micrometer Tracing으로의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
