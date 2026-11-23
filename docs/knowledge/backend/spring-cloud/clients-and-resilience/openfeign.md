---
id: spring-cloud-clients-and-resilience-openfeign
title: OpenFeign 의존성과 기본 호출
description: OpenFeign의 의존성과 기본 동기 호출을 정리합니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience/openfeign
sidebar_position: 3
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "OpenFeign 의존성과 기본 호출"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
---
# OpenFeign 의존성과 기본 호출

OpenFeign은 HTTP 호출을 인터페이스로 표현하는 선언적 클라이언트입니다.
Spring Cloud OpenFeign은 MVC 애너테이션, 설정과 발견 및 장애 제어를 연결합니다.
이 글은 OpenFeign 4.3의 동기 호출 모델을 기준으로 합니다.

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'
```

```java
@EnableFeignClients(clients = CatalogClient.class)
@Configuration
class CatalogClientConfiguration { }

@FeignClient(name = "catalog", url = "${clients.catalog.url}")
interface CatalogClient {
    @GetMapping("/items/{id}")
    CatalogItem find(@PathVariable("id") Long id);
}
```

```yaml
clients:
  catalog:
    url: http://localhost:8081
spring:
  cloud:
    openfeign:
      client:
        config:
          catalog:
            connectTimeout: 1000
            readTimeout: 2000
```

시간 값은 학습용 밀리초 설정입니다.
일반 Feign 호출은 상대 응답까지 기다리며 인터페이스 반환 타입만 임의로 Future로 바꾼다고 비동기 엔진이 되지는 않습니다.

## 고정 URL과 발견 호출

명시 URL을 사용하면 그 주소에 직접 연결합니다.
서비스 이름만 사용해 발견과 부하 분산을 하려면 LoadBalancer와 주소 공급 경로를 준비합니다.
Eureka를 쓰는 경우에는 Eureka Client도 추가합니다.
URL 속성을 지우는 것만으로 모든 환경의 발견이 자동 완성되지는 않습니다.

오류 상태와 본문은 ErrorDecoder 등의 경계에서 업무 예외로 바꿀 수 있습니다.
토큰을 전달하는 interceptor를 만든다면 허용 대상과 갱신 주기를 확인하고 비밀을 로그에 남기지 않습니다.
기본 재시도 정책도 순수 Feign과 Cloud 통합의 차이를 확인합니다.

공식 유지보수 방향은 feature-complete이며 새 설계에서는 [HTTP Service Clients](./http-service-clients.md)도 비교합니다.
기존 예제를 공부할 때는 선언적 호출의 편의와 내부 실행 모델을 분리해서 봅니다.

옵션과 기본 동작은 [OpenFeign 4.3 Features](https://docs.spring.io/spring-cloud-openfeign/reference/4.3/spring-cloud-openfeign.html)를 참고합니다.

## 자주 묻는 질문

### 고정 URL과 발견 호출에서 무엇을 확인하나요?

등록, 발견과 주소 선택은 책임이 다릅니다. Server와 Client 설정을 구분해 확인합니다.

### OpenFeign 의존성과 기본 호출 적용 시 확인할 점에서 무엇을 확인하나요?

클라이언트 선택과 장애 제어는 호출 모델과 함께 봅니다. 동기 호출이라는 이유만으로 대체 여부를 단정하지 않습니다.
