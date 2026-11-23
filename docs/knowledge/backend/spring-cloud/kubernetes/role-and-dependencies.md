---
id: spring-cloud-kubernetes-role-and-dependencies
title: 제공 기능과 도입 조건
description: Cloud Kubernetes가 제공하는 기능과 도입 조건을 정리합니다.
slug: /knowledge/backend/spring-cloud/kubernetes/role-and-dependencies
sidebar_position: 1
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "제공 기능과 도입 조건"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Kubernetes"
  - "ConfigMap"
  - "DiscoveryClient"
---
# 제공 기능과 도입 조건

Cloud Kubernetes가 제공하는 기능과 도입 조건을 정리합니다.

## 이 글에서 다룰 범위

- 클러스터 설치 도구가 아님
- Service DNS만으로 충분한 경우
- 앱에서 API를 읽어야 할 때

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### 제공 기능과 도입 조건은 어떤 문제를 다루나요?

이 글은 제공 기능과 도입 조건의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
