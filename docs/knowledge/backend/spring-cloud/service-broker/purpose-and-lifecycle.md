---
id: spring-cloud-service-broker-purpose-and-lifecycle
title: 서비스 카탈로그와 자원 생명주기
description: Open Service Broker API의 카탈로그와 생명주기를 정리합니다.
slug: /knowledge/backend/spring-cloud/service-broker/purpose-and-lifecycle
sidebar_position: 1
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "서비스 카탈로그와 자원 생명주기"
  - "Spring"
  - "Spring Cloud"
  - "Open Service Broker"
  - "Service Catalog"
  - "서비스"
  - "카탈로그"
  - "생명주기"
---
# 서비스 카탈로그와 자원 생명주기

Open Service Broker API의 카탈로그와 생명주기를 정리합니다.

## 이 글에서 다룰 범위

- 메시지 브로커와 다른 의미
- Catalog부터 Deprovision까지
- 실제 자원 제공 구현은 별도

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### 서비스 카탈로그와 자원 생명주기은 어떤 문제를 다루나요?

이 글은 서비스 카탈로그와 자원 생명주기의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
