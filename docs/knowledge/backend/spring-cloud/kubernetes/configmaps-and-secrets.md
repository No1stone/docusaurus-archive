---
id: spring-cloud-kubernetes-configmaps-and-secrets
title: ConfigMap과 Secret 설정 연결
description: ConfigMap과 Secret을 Spring 설정에 연결하는 범위를 정리합니다.
slug: /knowledge/backend/spring-cloud/kubernetes/configmaps-and-secrets
sidebar_position: 3
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "ConfigMap과 Secret 설정 연결"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Kubernetes"
  - "ConfigMap"
  - "DiscoveryClient"
  - "Secret"
---
# ConfigMap과 Secret 설정 연결

ConfigMap과 Secret을 Spring 설정에 연결하는 범위를 정리합니다.

## 이 글에서 다룰 범위

- 프로퍼티 로딩 경로
- 비밀과 일반 설정의 구분
- Vault, Config와의 조합

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### ConfigMap과 Secret 설정 연결은 어떤 문제를 다루나요?

이 글은 ConfigMap과 Secret 설정 연결의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
