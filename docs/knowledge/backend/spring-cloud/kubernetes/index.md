---
id: spring-cloud-kubernetes-index
title: Spring Cloud Kubernetes
description: Cloud Kubernetes의 기능, DiscoveryClient, ConfigMap과 Secret, 설정 감시와 RBAC를 다루는 묶음입니다.
slug: /knowledge/backend/spring-cloud/kubernetes
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Spring Cloud Kubernetes"
  - "Spring"
  - "Spring Cloud"
  - "ConfigMap"
  - "DiscoveryClient"
  - "Cloud"
  - "Kubernetes"
---
# Spring Cloud Kubernetes

Cloud Kubernetes의 기능, DiscoveryClient, ConfigMap과 Secret, 설정 감시와 RBAC를 다루는 묶음입니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [제공 기능과 도입 조건](./role-and-dependencies.md) | Cloud Kubernetes가 제공하는 기능과 도입 조건을 정리합니다. |
| [Kubernetes 기반 DiscoveryClient](./discovery-client.md) | Kubernetes API 기반 DiscoveryClient를 정리합니다. |
| [ConfigMap과 Secret 설정 연결](./configmaps-and-secrets.md) | ConfigMap과 Secret을 Spring 설정에 연결하는 범위를 정리합니다. |
| [설정 변경 감지와 갱신](./configuration-watcher.md) | 설정 변경 감지와 앱 갱신 구성을 정리합니다. |
| [Kubernetes API 접근과 권한](./service-account-and-rbac.md) | ServiceAccount와 RBAC로 API 접근을 허용하는 범위를 정리합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [Legacy](../legacy/index.md)

## 자주 묻는 질문

### Spring Cloud Kubernetes 묶음에서는 무엇을 다루나요?

Spring Cloud Kubernetes의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### Spring Cloud Kubernetes부터 읽어야 하나요?

입구 글에서 하위 글의 역할만 확인한 뒤 필요한 주제로 들어가면 됩니다.
