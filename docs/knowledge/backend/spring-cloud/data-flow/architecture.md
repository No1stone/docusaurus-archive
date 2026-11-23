---
id: spring-cloud-data-flow-architecture
title: Data Flow Server, Skipper와 실행 앱
description: Data Flow Server, Skipper와 실행 앱의 역할을 정리합니다.
slug: /knowledge/backend/spring-cloud/data-flow/architecture
sidebar_position: 2
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Data Flow Server, Skipper와 실행 앱"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Data Flow"
  - "SCDF"
  - "Skipper"
  - "Data"
  - "Flow"
---
# Data Flow Server, Skipper와 실행 앱

Data Flow Server, Skipper와 실행 앱의 역할을 정리합니다.

## 이 글에서 다룰 범위

- 제어 평면과 실행 앱의 구분
- 배포 대상으로서의 Kubernetes
- Cloud Kubernetes와 혼동하지 않기

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### Data Flow Server, Skipper와 실행 앱은 어떤 문제를 다루나요?

이 글은 Data Flow Server, Skipper와 실행 앱의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
