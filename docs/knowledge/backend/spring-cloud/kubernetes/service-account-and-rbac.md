---
id: spring-cloud-kubernetes-service-account-and-rbac
title: Kubernetes API 접근과 권한
description: ServiceAccount와 RBAC로 API 접근을 허용하는 범위를 정리합니다.
slug: /knowledge/backend/spring-cloud/kubernetes/service-account-and-rbac
sidebar_position: 5
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Kubernetes API 접근과 권한"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Kubernetes"
  - "ConfigMap"
  - "DiscoveryClient"
  - "Kubernetes"
  - "API"
---
# Kubernetes API 접근과 권한

ServiceAccount와 RBAC로 API 접근을 허용하는 범위를 정리합니다.

## 이 글에서 다룰 범위

- 최소 권한 원칙
- Discovery와 Config 읽기에 필요한 권한
- 운영 실수 방지

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### Kubernetes API 접근과 권한은 어떤 문제를 다루나요?

이 글은 Kubernetes API 접근과 권한의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
