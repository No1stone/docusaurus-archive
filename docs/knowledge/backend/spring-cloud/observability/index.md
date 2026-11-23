---
id: spring-cloud-observability-index
title: 로그, 메트릭과 분산 추적
description: 로그, 메트릭, Trace와 Micrometer, Brave, OpenTelemetry 연계를 다루는 묶음입니다. Spring Cloud 밖 프로젝트도 포함합니다.
slug: /knowledge/backend/spring-cloud/observability
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "로그, 메트릭과 분산 추적"
  - "Spring"
  - "Spring Cloud"
  - "분산 추적"
  - "Micrometer Tracing"
  - "관측 연계"
  - "메트릭"
  - "Micrometer"
---
# 로그, 메트릭과 분산 추적

로그, 메트릭, Trace와 Micrometer, Brave, OpenTelemetry 연계를 다루는 묶음입니다. Spring Cloud 밖 프로젝트도 포함합니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [로그, 메트릭과 Trace의 역할](./logs-metrics-and-traces.md) | 로그, 메트릭, Trace의 역할을 구분합니다. |
| [Sleuth에서 Micrometer Tracing으로](./sleuth-to-micrometer.md) | Sleuth에서 Micrometer Tracing으로 옮긴 변화를 정리합니다. |
| [Micrometer Observation과 Tracing](./observation-and-tracing.md) | Micrometer Observation과 Tracing 개념을 정리합니다. |
| [Brave, OpenTelemetry와 Bridge](./brave-and-opentelemetry.md) | Brave와 OpenTelemetry, Bridge 관계를 정리합니다. |
| [서비스 호출의 추적 전파와 로그 연결](./propagation-and-correlation.md) | 서비스 간 추적 전파와 로그 상관을 정리합니다. |
| [Logback, Logstash, Collector와 수집 경로](./collection-pipelines.md) | 로그와 텔레메트리 수집 경로를 정리합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [관측성](/docs/knowledge/infrastructure/observability)
- [Spring Boot와 Logstash](/docs/knowledge/k-springboot-logstash)
- [ELK](/docs/knowledge/k-elk)
- [Legacy](../legacy/index.md)

Micrometer, Brave, OpenTelemetry, Logstash는 Spring Cloud 소속이 아닙니다.
이 묶음은 Cloud 앱과의 연계 범위만 다룹니다.

## 자주 묻는 질문

### 로그, 메트릭과 분산 추적 묶음에서는 무엇을 다루나요?

로그, 메트릭과 분산 추적의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### Micrometer나 OpenTelemetry도 Spring Cloud인가요?

아닙니다. 관측 도구는 Spring Cloud 밖 프로젝트입니다. 이 묶음은 연계 범위만 표시합니다.
