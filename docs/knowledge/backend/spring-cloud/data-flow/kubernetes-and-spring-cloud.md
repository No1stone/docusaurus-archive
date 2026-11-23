---
id: spring-cloud-data-flow-kubernetes-and-spring-cloud
title: Kubernetes 배포와 Cloud Kubernetes의 관계
description: SCDF의 Kubernetes 배포와 Cloud Kubernetes 통합의 경계를 정리합니다.
slug: /knowledge/backend/spring-cloud/data-flow/kubernetes-and-spring-cloud
sidebar_position: 5
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Kubernetes 배포와 Cloud Kubernetes의 관계"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Data Flow"
  - "SCDF"
  - "Skipper"
  - "Kubernetes"
  - "Cloud"
---
# Kubernetes 배포와 Cloud Kubernetes의 관계

SCDF의 Kubernetes 배포와 Cloud Kubernetes 통합의 경계를 정리합니다.

## 이 글에서 다룰 범위

- 배포 대상과 앱 라이브러리의 차이
- 필수 관계가 아님
- 입구 글의 비교를 상세화

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### Kubernetes 배포와 Cloud Kubernetes의 관계은 어떤 문제를 다루나요?

이 글은 Kubernetes 배포와 Cloud Kubernetes의 관계의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
