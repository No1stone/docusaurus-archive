---
id: spring-cloud-observability-brave-and-opentelemetry
title: Brave, OpenTelemetry와 Bridge
description: Brave와 OpenTelemetry, Bridge 관계를 정리합니다. Spring Cloud 밖 프로젝트와의 연계 범위입니다.
slug: /knowledge/backend/spring-cloud/observability/brave-and-opentelemetry
sidebar_position: 4
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Brave, OpenTelemetry와 Bridge"
  - "Spring"
  - "Spring Cloud"
  - "분산 추적"
  - "Micrometer Tracing"
  - "관측 연계"
  - "Brave"
  - "OpenTelemetry"
---
# Brave, OpenTelemetry와 Bridge

Brave와 OpenTelemetry, Bridge 관계를 정리합니다.

## 이 글에서 다룰 범위

- 구현 선택과 전파 포맷
- Cloud 전용 제품이 아님
- 수집기와의 연결

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### Brave, OpenTelemetry와 Bridge은 어떤 문제를 다루나요?

이 글은 Brave, OpenTelemetry와 Bridge의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
