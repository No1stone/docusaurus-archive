---
format: "md"
id: "k-api-gateway"
title: "API GATEWAY"
description: "Spring Cloud Gateway로 라우팅, JWT 필터를 구성하는 메모입니다."
slug: "/knowledge/k-api-gateway"
status: "active"
tags:
  - "Spring"
  - "HTTP"
keywords:
  - "API GATEWAY"
  - "Spring"
  - "Spring Cloud"
  - "MSA"
  - "Gateway"
  - "HTTP"
---
# API GATEWAY

> 이전에 작성한 개념 및 적용 메모입니다.
> 현재 프로젝트의 역할과 선택 기준은 [Spring Cloud 안내](../index.md)에서 확인합니다.

## 개요

API Gateway는 클라이언트와 백엔드 사이의 관문으로, 라우팅, 인증, 공통 헤더, 서킷 브레이커를 한곳에 모읍니다.
Spring Cloud Gateway는 Netty 기반이며, Route(경로), Predicate(조건), Filter(전후 처리)가 핵심입니다.
하류는 Eureka 등과 함께 `lb://service-id`로 붙이는 경우가 많습니다.

## 코드로 라우트 등록

YAML 대신 `RouteLocator` 빈으로 경로와 필터를 묶을 수 있습니다.
`/auth/**`에 JWT 필터를 건 뒤 `lb://api-auth`로 넘기는 예입니다.

```java
@Configuration
public class ConfigFilter {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public ConfigFilter(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth", r -> r.path("/auth/**")
                        .filters(f -> f.filter(
                                jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config())
                        ))
                        .uri("lb://api-auth"))
                .build();
    }
}
```

JWT 검증과 Redis Access 확인은 [JWT](/docs/knowledge/k-jwt)와 [Gateway 권한 라우팅 패턴](/docs/patterns/architecture-patterns/gateway-authorization-routing)을 봅니다.

## YAML 라우트 예

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: recruit-service
        uri: lb://recruit
        predicates:
        - Path=/recruit/list
        - Method=GET
        filters:
        - name: CircuitBreaker
          args:
            name: recruitlist
            fallbackUri: forward:/fallbacks/7
        - RewritePath=/recruit/(?<path>.*), /${path}
```

운영에서 Admin이 DB→YAML→Git→Config Server→Gateway 순으로 설정을 밀어 넣는 사례도 있습니다.
서킷 브레이커는 장애 API로 부하가 더 들어가지 않게 막는 용도로 둡니다.

<details>
<summary>참고 자료</summary>

- [SPRING CLOUD GATEWAY를 이용한 API GATEWAY 구축기 (사람인)](https://saramin.github.io/2022-01-20-spring-cloud-gateway-api-gateway/)
- [Spring Cloud Gateway 레퍼런스](https://docs.spring.io/spring-cloud-gateway/reference/html/)
- [Spring Cloud Gateway 프로젝트](https://spring.io/projects/spring-cloud-gateway)
</details>

## 자주 묻는 질문

### API Gateway는 어디에 두나요?

클라이언트와 서비스 사이에서 라우팅, 인증, 공통 필터를 담당하는 진입점으로 둡니다.

### Spring Cloud와 Boot 버전은 어떻게 맞추나요?

릴리스 트레인과 Boot 호환표를 보고 한 세트로 올립니다.

