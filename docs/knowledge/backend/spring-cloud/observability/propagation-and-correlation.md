---
id: spring-cloud-observability-propagation-and-correlation
title: 서비스 호출의 추적 전파와 로그 연결
description: 서비스 간 추적 전파와 로그 상관을 정리합니다. Spring Cloud 밖 프로젝트와의 연계 범위입니다.
slug: /knowledge/backend/spring-cloud/observability/propagation-and-correlation
sidebar_position: 5
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "서비스 호출의 추적 전파와 로그 연결"
  - "Spring"
  - "Spring Cloud"
  - "분산 추적"
  - "Micrometer Tracing"
  - "관측 연계"
  - "서비스"
  - "Micrometer"
---
# 서비스 호출의 추적 전파와 로그 연결

서비스 간 추적 전파와 로그 상관을 정리합니다.

## 이 글에서 다룰 범위

- 헤더 전파
- 로그 상관 ID
- Gateway와 Feign 경로

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### 서비스 호출의 추적 전파와 로그 연결은 어떤 문제를 다루나요?

이 글은 서비스 호출의 추적 전파와 로그 연결의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
