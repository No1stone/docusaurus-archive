---
id: spring-cloud-clients-and-resilience-client-selection
title: OpenFeign, RestClient와 WebClient 선택
description: 서비스 호출 클라이언트의 선택 기준을 정리합니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience/client-selection
sidebar_position: 1
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "OpenFeign, RestClient와 WebClient 선택"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
  - "RestClient"
---
# OpenFeign, RestClient와 WebClient 선택

HTTP 클라이언트를 고를 때는 선언 방식과 실행 방식을 나눠 봅니다.
인터페이스로 선언하는 코드가 자동으로 비동기인 것은 아니며 fluent API라고 논블로킹인 것도 아닙니다.
같은 계약을 어떤 실행 모델과 실패 정책으로 호출할지 결정합니다.

| 선택 | 실행 모델 | 주로 보는 장점 |
|---|---|---|
| OpenFeign | 기본 동기, 블로킹 | 선언적 계약과 Cloud 통합 |
| RestClient | 동기, 블로킹 | Spring의 fluent HTTP API |
| WebClient | 리액티브, 논블로킹 | 스트림과 비동기 조합 |
| HTTP Service Clients | 연결한 어댑터에 따라 다름 | HTTP 인터페이스 선언과 구현 연결 |

OpenFeign이 Spring Cloud에 속한다는 사실은 실행 방식의 근거가 아닙니다.
Feign 호출 중에는 기본적으로 호출 스레드가 결과를 기다립니다.
RestClient도 같은 동기 모델이므로 단순히 비동기 전환을 위해 바꾸는 도구가 아닙니다.

## 현재 유지보수 방향을 같이 봅니다

Cloud OpenFeign은 공식적으로 feature-complete로 안내하며 Spring HTTP Service Clients로의 이동을 제안합니다.
이미 동작하는 코드가 곧바로 사용할 수 없다는 의미는 아닙니다.
신규 기능 설계와 기존 코드 유지보수에서 판단을 나눕니다.

```java
CatalogItem item = restClient.get().uri("/items/{id}", id)
        .retrieve().body(CatalogItem.class);
```

```java
Mono<CatalogItem> item = webClient.get().uri("/items/{id}", id)
        .retrieve().bodyToMono(CatalogItem.class);
```

초기화된 클라이언트와 DTO를 가정한 비교입니다.
아래 결과를 `block()`하면 그 위치의 호출자는 기다립니다.
반대로 위 호출을 실행기에 넘기면 호출자는 먼저 돌아올 수 있어도 작업 스레드는 계속 대기합니다.

타임아웃, 오류 변환과 추적 전파가 기존과 같은지도 전환 기준입니다.
문법이 짧아졌다는 이유만으로 운영 동작이 유지됐다고 보지 않습니다.

현황은 [OpenFeign 공식 안내](https://docs.spring.io/spring-cloud-openfeign/reference/), API 비교는 [Spring REST Clients](https://docs.spring.io/spring-framework/reference/6.2/integration/rest-clients.html)를 참고합니다.

## 자주 묻는 질문

### 현재 유지보수 방향을 같이 봅니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### OpenFeign, RestClient와 WebClient 선택 적용 시 확인할 점에서 무엇을 확인하나요?

클라이언트 선택과 장애 제어는 호출 모델과 함께 봅니다. 동기 호출이라는 이유만으로 대체 여부를 단정하지 않습니다.
