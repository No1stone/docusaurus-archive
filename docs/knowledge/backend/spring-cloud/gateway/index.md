---
id: spring-cloud-gateway-index
title: Spring Cloud Gateway
description: Gateway의 역할, WebFlux와 MVC, 라우트 설정, 필터, Discovery와 Config 조합을 다루는 묶음입니다.
slug: /knowledge/backend/spring-cloud/gateway
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Spring Cloud Gateway"
  - "Spring"
  - "Spring Cloud"
  - "Route"
  - "Predicate"
  - "Filter"
  - "Cloud"
  - "Gateway"
---
# Spring Cloud Gateway

Gateway의 역할, WebFlux와 MVC, 라우트 설정, 필터, Discovery와 Config 조합을 다루는 묶음입니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [역할, 구성 요소와 함께 쓰는 의존성](./concepts-and-dependencies.md) | Gateway가 해결하는 문제와 기본 구성 요소, 함께 넣는 의존성을 정리합니다. |
| [Gateway WebFlux와 MVC](./webflux-and-mvc.md) | Gateway WebFlux 계열과 MVC 계열의 차이와 선택 기준을 정리합니다. |
| [YAML과 Java 코드로 라우트 구성](./yaml-and-java-routes.md) | YAML 라우트와 Java RouteLocator 구성을 비교합니다. |
| [기본 Predicate와 Filter 사용](./predicates-and-filters.md) | 기본 Predicate와 Filter로 요청을 거르고 변환하는 방법을 정리합니다. |
| [커스텀 필터 구현과 적용](./custom-filters.md) | 새로운 필터 로직을 구현하고 라우트에 적용하는 범위를 정리합니다. |
| [Eureka, DiscoveryClient와 LoadBalancer 연결](./discovery-and-loadbalancer.md) | Gateway에서 서비스 발견과 인스턴스 선택을 연결하는 방법을 정리합니다. |
| [Config, Bus와 RabbitMQ로 라우트 갱신](./config-bus-refresh.md) | Config와 Bus, 메시지 브로커로 라우트 설정을 갱신하는 흐름을 정리합니다. |
| [Nginx, Ingress, Istio와 BFF의 역할 비교](./ingress-and-bff.md) | Gateway와 Nginx, Ingress, Istio, BFF의 책임 경계를 비교합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [Legacy API Gateway 메모](../legacy/api-gateway.md)
- [Config, Vault와 설정 갱신](../configuration/index.md)
- [서비스 발견과 Eureka](../discovery/index.md)
- [Legacy](../legacy/index.md)

## 자주 묻는 질문

### Spring Cloud Gateway 묶음에서는 무엇을 다루나요?

Spring Cloud Gateway의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### Spring Cloud Gateway부터 읽어야 하나요?

입구 글에서 하위 글의 역할만 확인한 뒤 필요한 주제로 들어가면 됩니다.
