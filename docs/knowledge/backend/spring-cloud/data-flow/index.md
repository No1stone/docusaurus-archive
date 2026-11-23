---
id: spring-cloud-data-flow-index
title: SCDF와 파이프라인 운영
description: SCDF의 목적과 지원 상태, 아키텍처, 스트림과 Task 파이프라인을 다루는 묶음입니다.
slug: /knowledge/backend/spring-cloud/data-flow
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "SCDF와 파이프라인 운영"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Data Flow"
  - "SCDF"
  - "Skipper"
  - "파이프라인"
---
# SCDF와 파이프라인 운영

SCDF의 목적과 지원 상태, 아키텍처, 스트림과 Task 파이프라인을 다루는 묶음입니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [SCDF의 목적과 현재 지원 상태](./purpose-and-support.md) | SCDF의 목적과 아카이브, 오픈소스 유지보수 종료 상태를 명시합니다. |
| [Data Flow Server, Skipper와 실행 앱](./architecture.md) | Data Flow Server, Skipper와 실행 앱의 역할을 정리합니다. |
| [수집, 가공과 저장 파이프라인](./stream-pipelines.md) | 스트림 파이프라인의 등록과 연결을 정리합니다. |
| [Task와 Batch의 등록, 실행 및 이력](./tasks-and-batch.md) | Task와 Batch를 SCDF에서 등록하고 실행하는 범위를 정리합니다. |
| [Kubernetes 배포와 Cloud Kubernetes의 관계](./kubernetes-and-spring-cloud.md) | SCDF의 Kubernetes 배포와 Cloud Kubernetes 통합의 경계를 정리합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [Legacy](../legacy/index.md)

## 자주 묻는 질문

### SCDF와 파이프라인 운영 묶음에서는 무엇을 다루나요?

SCDF와 파이프라인 운영의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### SCDF와 파이프라인 운영부터 읽어야 하나요?

입구 글에서 하위 글의 역할만 확인한 뒤 필요한 주제로 들어가면 됩니다.
