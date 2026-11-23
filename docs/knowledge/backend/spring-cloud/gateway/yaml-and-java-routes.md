---
id: spring-cloud-gateway-yaml-and-java-routes
title: YAML과 Java 코드로 라우트 구성
description: YAML 라우트와 Java RouteLocator 구성을 비교합니다.
slug: /knowledge/backend/spring-cloud/gateway/yaml-and-java-routes
sidebar_position: 3
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "YAML과 Java 코드로 라우트 구성"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Gateway"
  - "Route"
  - "Predicate"
  - "Filter"
  - "YAML"
---
# YAML과 Java 코드로 라우트 구성

YAML과 Java DSL은 같은 라우팅 의도를 다른 방식으로 조립합니다.
설정 중심 운영은 배포 없이 값을 바꾸는 경로를 만들기 좋고, 코드 구성은 타입과 의존성을 따라가기 쉽습니다.
어느 쪽도 새 필터 기능을 저절로 만들어 주지는 않습니다.

## 같은 경로를 두 방식으로 만듭니다

Gateway 4.3 계열 WebFlux의 설정 예제입니다.
`/catalog/items`를 상대의 `/items`로 전달합니다.

```yaml
spring:
  cloud:
    gateway:
      server:
        webflux:
          routes:
            - id: catalog
              uri: http://localhost:8081
              predicates:
                - Path=/catalog/**
              filters:
                - StripPrefix=1
```

```java
@Bean
RouteLocator catalogRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
            .route("catalog", route -> route.path("/catalog/**")
                    .filters(filters -> filters.stripPrefix(1))
                    .uri("http://localhost:8081"))
            .build();
}
```

같은 예제를 비교하는 것이므로 두 정의를 동시에 등록하지 않습니다.
컨테이너에서는 localhost를 실제 대상 주소로 바꿉니다.
구버전의 짧은 gateway.routes 접두사와 현재 계열의 설정 키도 구분합니다.

| 선택 | 장점 | 변경 시 고려 |
|---|---|---|
| YAML | 운영값과 경로를 외부화하기 쉽습니다. | 유효성 검증과 갱신 경로가 필요합니다. |
| Java DSL | IDE 추적과 코드 테스트가 편합니다. | 코드에 고정한 변경은 보통 재배포합니다. |
| 혼합 | 기능 구현과 운영값을 나눕니다. | 동일 라우트의 정본을 하나로 정합니다. |

## 코드에서 읽은 값도 자동 갱신될까요

시작할 때 문자열을 읽어 RouteLocator를 만들었다면 설정 변경이 그 객체를 자동 재생성하는 것은 아닙니다.
동적 변경이 목적이면 RouteDefinition 공급과 캐시 갱신까지 설계합니다.
YAML 역시 Config와 Bus가 연결돼 실제로 재로딩되는 구성이 있어야 합니다.

Spring의 XML 빈 구성과 Gateway 전용 라우트 정의를 같은 설정 포맷으로 설명하지 않습니다.
이 글의 라우트 설정 비교는 YAML과 Java DSL을 대상으로 합니다.

검증에서는 대상 URI뿐 아니라 상대가 받은 최종 경로와 헤더를 확인합니다.
리다이렉트와 쿼리 문자열이 있는 요청도 포함하면 잘못된 경로 변환을 찾기 쉽습니다.

관련 API는 [Gateway WebFlux 문서](https://docs.spring.io/spring-cloud-gateway/reference/4.3/spring-cloud-gateway-server-webflux.html), 실행 중 변경은 [Config와 Bus](./config-bus-refresh.md)를 참고합니다.

## 자주 묻는 질문

### 같은 경로를 두 방식으로 만듭니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### 코드에서 읽은 값도 자동 갱신될까요에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.
