---
id: spring-cloud-gateway-discovery-and-loadbalancer
title: Eureka, DiscoveryClient와 LoadBalancer 연결
description: Gateway에서 서비스 발견과 인스턴스 선택을 연결하는 방법을 정리합니다.
slug: /knowledge/backend/spring-cloud/gateway/discovery-and-loadbalancer
sidebar_position: 6
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Eureka, DiscoveryClient와 LoadBalancer 연결"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Gateway"
  - "Route"
  - "Predicate"
  - "Filter"
  - "Eureka"
---
# Eureka, DiscoveryClient와 LoadBalancer 연결

Gateway의 목적지를 고정 URL 대신 서비스 이름으로 표현하면 인스턴스 주소 변경을 발견 계층에 맡길 수 있습니다.
이때 Gateway만으로는 주소 목록과 선택 정책이 모두 준비되지 않습니다.

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-gateway-server-webflux'
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
implementation 'org.springframework.cloud:spring-cloud-starter-loadbalancer'
```

```yaml
spring:
  application:
    name: edge
  cloud:
    gateway:
      server:
        webflux:
          routes:
            - id: catalog
              uri: lb://catalog-service
              predicates:
                - Path=/catalog/**
              filters:
                - StripPrefix=1
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

Cloud 2025.0과 Gateway 4.3 계열의 로컬 예제입니다.
대상 앱은 catalog-service로 등록돼 있어야 하고, Gateway에서 광고 주소에 도달할 수 있어야 합니다.
`lb`는 Eureka 자체의 프로토콜이 아니라 이름을 인스턴스로 바꾸는 부하 분산 경로를 뜻합니다.

```mermaid
flowchart LR
    Route[라우트의 서비스 ID] --> Discovery[DiscoveryClient의 목록]
    Discovery --> LB[LoadBalancer 선택]
    LB --> HTTP[실제 주소로 요청]
```

## 자동 발견과 명시 라우트

Discovery Locator를 켜면 발견된 서비스를 바탕으로 라우트를 만들 수 있습니다.
하지만 내부 서비스를 자동으로 모두 외부에 노출하는 구성이 되지 않게 포함 조건과 경로 정책을 검토합니다.
외부 API 계약을 명확하게 관리하려면 명시적 라우트가 더 읽기 쉬울 수 있습니다.

등록은 있는데 대상 선택이 실패하면 Gateway의 목록 캐시와 서비스 ID를 확인합니다.
인스턴스를 골랐지만 연결이 안 되면 광고 hostname과 포트를 확인합니다.
레지스트리가 정상인 것과 백엔드 API가 정상인 것은 다릅니다.

시험은 인스턴스 한 대, 두 대와 한 대 종료를 순서대로 진행합니다.
응답에 로컬 테스트용 인스턴스 식별자를 넣으면 실제 분산을 볼 수 있습니다.
운영에서는 내부 주소나 민감한 정보를 그대로 노출하지 않습니다.

발견은 [Eureka Client](../discovery/eureka-client.md), 선택은 [LoadBalancer](../clients-and-resilience/loadbalancer.md)와 [공식 안내](https://docs.spring.io/spring-cloud-commons/reference/spring-cloud-commons/loadbalancer.html)를 참고합니다.

## 자주 묻는 질문

### 자동 발견과 명시 라우트에서 무엇을 확인하나요?

등록, 발견과 주소 선택은 책임이 다릅니다. Server와 Client 설정을 구분해 확인합니다.

### Eureka, DiscoveryClient와 LoadBalancer 연결 적용 시 확인할 점에서 무엇을 확인하나요?

등록, 발견과 주소 선택은 책임이 다릅니다. Server와 Client 설정을 구분해 확인합니다.
