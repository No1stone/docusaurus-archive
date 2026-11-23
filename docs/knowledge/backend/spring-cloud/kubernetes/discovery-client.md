---
id: spring-cloud-kubernetes-discovery-client
title: Kubernetes 기반 DiscoveryClient
description: Kubernetes API 기반 DiscoveryClient를 정리합니다.
slug: /knowledge/backend/spring-cloud/kubernetes/discovery-client
sidebar_position: 2
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Kubernetes 기반 DiscoveryClient"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Kubernetes"
  - "ConfigMap"
  - "DiscoveryClient"
  - "Kubernetes"
---
# Kubernetes 기반 DiscoveryClient

Kubernetes API 기반 DiscoveryClient를 정리합니다.

## 이 글에서 다룰 범위

- Service와 Endpoints 활용
- Eureka 생략 조건과의 연결
- 캐시와 권한 요구

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### Kubernetes 기반 DiscoveryClient은 어떤 문제를 다루나요?

이 글은 Kubernetes 기반 DiscoveryClient의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
