---
id: spring-cloud-clients-and-resilience-index
title: 서비스 호출과 장애 제어
description: OpenFeign, RestClient, WebClient, LoadBalancer, Circuit Breaker와 Istio 비교를 다루는 묶음입니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "서비스 호출과 장애 제어"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
  - "서비스"
---
# 서비스 호출과 장애 제어

OpenFeign, RestClient, WebClient, LoadBalancer, Circuit Breaker와 Istio 비교를 다루는 묶음입니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [OpenFeign, RestClient와 WebClient 선택](./client-selection.md) | 서비스 호출 클라이언트의 선택 기준을 정리합니다. |
| [동기, 비동기와 논블로킹의 차이](./blocking-and-nonblocking.md) | 동기 호출, 비동기 실행, 논블로킹 I/O를 구분합니다. |
| [OpenFeign 의존성과 기본 호출](./openfeign.md) | OpenFeign의 의존성과 기본 동기 호출을 정리합니다. |
| [HTTP Service Clients와 클라이언트 연결](./http-service-clients.md) | HTTP Service Clients와 기존 클라이언트 방식을 비교합니다. |
| [클라이언트 측 LoadBalancer](./loadbalancer.md) | 클라이언트 측 LoadBalancer의 책임을 정리합니다. |
| [Circuit Breaker와 Resilience4j](./circuit-breaker.md) | Circuit Breaker API와 Resilience4j 구현을 정리합니다. |
| [OpenFeign과 Circuit Breaker 조합](./feign-and-circuit-breaker.md) | OpenFeign 호출에 Circuit Breaker를 연결하는 예제 범위를 정리합니다. |
| [Timeout, Retry와 Bulkhead의 차이](./timeout-retry-bulkhead.md) | Timeout, Retry, Bulkhead의 목적 차이를 정리합니다. |
| [앱의 장애 제어와 Istio 비교](./circuit-breaker-and-istio.md) | 앱 내부 Circuit Breaker와 Istio 통신 제어를 비교합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [Legacy](../legacy/index.md)

## 자주 묻는 질문

### 서비스 호출과 장애 제어 묶음에서는 무엇을 다루나요?

서비스 호출과 장애 제어의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### 서비스 호출과 장애 제어부터 읽어야 하나요?

입구 글에서 하위 글의 역할만 확인한 뒤 필요한 주제로 들어가면 됩니다.
