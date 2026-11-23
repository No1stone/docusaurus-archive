---
id: spring-cloud-clients-and-resilience-loadbalancer
title: 클라이언트 측 LoadBalancer
description: 클라이언트 측 LoadBalancer의 책임을 정리합니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience/loadbalancer
sidebar_position: 5
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "클라이언트 측 LoadBalancer"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
  - "클라이언트"
---
# 클라이언트 측 LoadBalancer

LoadBalancer는 같은 서비스의 여러 주소 중 이번 호출 대상을 선택합니다.
주소 목록을 보관하는 레지스트리와 실제 요청을 전송하는 HTTP 클라이언트 사이의 역할입니다.
따라서 Eureka를 사용한다고 모든 클라이언트에 부하 분산이 저절로 적용되는 것은 아닙니다.

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-loadbalancer'
```

```java
@Bean
@LoadBalanced
RestTemplate catalogRestTemplate(RestTemplateBuilder builder) {
    return builder.build();
}
```

```java
CatalogItem item = template.getForObject(
        "http://catalog-service/items/{id}", CatalogItem.class, id);
```

Boot 3.5의 동기 클라이언트 통합 예제입니다.
DiscoveryClient나 정적 목록으로 catalog-service의 인스턴스를 제공해야 합니다.
위 hostname을 일반 RestTemplate에 넣으면 서비스 발견이 아니라 DNS 이름으로 해석할 수 있습니다.

```mermaid
flowchart LR
    Client[서비스 ID 요청] --> Supplier[인스턴스 목록]
    Supplier --> Choose[선택 정책]
    Choose --> URL[실제 host와 port]
    URL --> Request[HTTP 실행]
```

| 비교 | 클라이언트 LoadBalancer | 일반 Kubernetes Service 호출 |
|---|---|---|
| 대상 선택 위치 | 앱의 호출 경로 | 플랫폼의 Service 전달 경로 |
| 앱의 정보 | 인스턴스 목록을 볼 수 있음 | 보통 안정적인 Service 이름 사용 |
| 운영 포인트 | 목록 캐시와 선택 정책 | endpoint와 readiness |

Eureka Client의 캐시와 LoadBalancer 캐시가 겹칠 수 있습니다.
목록 갱신이 느리다고 모든 캐시를 무조건 끄기보다 어느 단계가 지연되는지 확인합니다.
서비스별 하위 컨텍스트가 지연 초기화될 수 있어 첫 호출의 지연도 따로 봅니다.

테스트에서는 두 인스턴스의 응답 식별자를 비교하고 한 대 종료 후의 실패를 관찰합니다.
같은 두 번의 호출이 반드시 서로 다른 서버여야 한다는 식으로 전체 알고리즘을 추정하지 않습니다.

지원 클라이언트와 선택 정책은 [LoadBalancer 공식 문서](https://docs.spring.io/spring-cloud-commons/reference/spring-cloud-commons/loadbalancer.html)를 참고합니다.

## 자주 묻는 질문

### 클라이언트 측 LoadBalancer에서 무엇을 확인하나요?

클라이언트 선택과 장애 제어는 호출 모델과 함께 봅니다. 동기 호출이라는 이유만으로 대체 여부를 단정하지 않습니다.

### 클라이언트 측 LoadBalancer 적용 시 확인할 점에서 무엇을 확인하나요?

클라이언트 선택과 장애 제어는 호출 모델과 함께 봅니다. 동기 호출이라는 이유만으로 대체 여부를 단정하지 않습니다.
