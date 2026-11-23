---
id: spring-cloud-clients-and-resilience-http-service-clients
title: HTTP Service Clients와 클라이언트 연결
description: HTTP Service Clients와 기존 클라이언트 방식을 비교합니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience/http-service-clients
sidebar_position: 4
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "HTTP Service Clients와 클라이언트 연결"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
  - "HTTP"
---
# HTTP Service Clients와 클라이언트 연결

Spring의 HTTP Service Clients는 HTTP 계약을 인터페이스로 선언하고 실제 클라이언트 어댑터에 연결합니다.
OpenFeign과 문법이 비슷해 보이지만 별도 구현이며, Cloud 발견과 장애 제어가 전부 같은 설정으로 이전되지는 않습니다.

```java
@HttpExchange("/items")
interface CatalogHttpService {
    @GetExchange("/{id}")
    CatalogItem find(@PathVariable("id") Long id);
}
```

```java
@Bean
CatalogHttpService catalogHttpService(RestClient.Builder builder) {
    RestClient client = builder.baseUrl("http://localhost:8081").build();
    HttpServiceProxyFactory factory = HttpServiceProxyFactory
            .builderFor(RestClientAdapter.create(client)).build();
    return factory.createClient(CatalogHttpService.class);
}
```

Framework 6.2와 Boot 3.5의 동기 RestClient 어댑터 예제입니다.
Boot가 구성한 Builder를 받아 사용하면 관측 등 통합을 유지하기 쉽습니다.
import와 DTO는 생략했으며, 시간 제한과 오류 변환은 사용하는 요청 팩터리와 클라이언트 설정에 추가합니다.

## 인터페이스와 전송 엔진을 나눕니다

| 어댑터 | 실행 방식 | 계약의 예 |
|---|---|---|
| RestClientAdapter | 동기 | CatalogItem 반환 |
| WebClientAdapter | 리액티브 | Mono 또는 Flux 반환 |

같은 이름의 인터페이스를 사용하는 것이 실행 모델의 동일성을 보장하지 않습니다.
트랜잭션과 호출자 컨텍스트, 오류 전파와 취소를 실행 방식에 맞춰 봅니다.

## Feign에서 옮길 때 비교할 것

URL 매핑뿐 아니라 헤더, codec과 상태별 오류, 타임아웃 및 추적 전파를 목록으로 적습니다.
Feign의 fallbackFactory와 Circuit Breaker가 자동으로 이전되는 것은 아닙니다.
기존 상위 유즈케이스가 사용하는 포트 계약을 유지하고 어댑터만 바꾸면 비교 범위를 줄일 수 있습니다.

정상 JSON, 빈 응답, 상대 4xx와 5xx, 지연 및 취소를 양쪽 클라이언트에서 시험합니다.
운영 결과가 같아야 하는 항목과 의도적으로 바꿀 항목을 구분합니다.

애너테이션과 어댑터 지원은 [HTTP Interface 공식 문서](https://docs.spring.io/spring-framework/reference/6.2/integration/rest-clients.html#rest-http-interface)를 참고합니다.

## 자주 묻는 질문

### 인터페이스와 전송 엔진을 나눕니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### Feign에서 옮길 때 비교할 것에서 무엇을 확인하나요?

클라이언트 선택과 장애 제어는 호출 모델과 함께 봅니다. 동기 호출이라는 이유만으로 대체 여부를 단정하지 않습니다.
