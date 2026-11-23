---
id: spring-cloud-clients-and-resilience-feign-and-circuit-breaker
title: OpenFeign과 Circuit Breaker 조합
description: OpenFeign 호출에 Circuit Breaker를 연결하는 예제 범위를 정리합니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience/feign-and-circuit-breaker
sidebar_position: 7
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "OpenFeign과 Circuit Breaker 조합"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
  - "Circuit"
---
# OpenFeign과 Circuit Breaker 조합

Feign 인터페이스의 편의와 장애 호출 제어를 함께 사용할 수 있습니다.
그러나 Feign Starter만 추가했다고 Circuit Breaker가 기본으로 켜지는 것은 아닙니다.
라이브러리, 활성화 설정과 fallback 계약을 함께 준비합니다.

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'
implementation 'org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j'
```

```yaml
spring:
  cloud:
    openfeign:
      circuitbreaker:
        enabled: true
```

OpenFeign 4.3의 동기 호출 예제입니다.
Eureka 기반 호출이면 Client와 LoadBalancer 의존성이 추가로 필요할 수 있습니다.

```java
@FeignClient(name = "catalog", url = "${clients.catalog.url}",
        fallbackFactory = CatalogFallbackFactory.class)
interface CatalogClient {
    @GetMapping("/items/{id}")
    CatalogItem find(@PathVariable("id") Long id);
}

@Component
class CatalogFallbackFactory implements FallbackFactory<CatalogClient> {
    public CatalogClient create(Throwable cause) {
        return id -> { throw new CatalogUnavailableException(cause); };
    }
}
```

DTO와 업무 예외 생성자는 생략했습니다.
여기서는 실패를 일관된 업무 예외로 전달하며, 캐시 응답이 허용되는 기능이라면 그 정책으로 바꿀 수 있습니다.
항상 null이나 가짜 성공을 반환하는 fallback을 기본으로 두지 않습니다.

## 이름과 예외를 확인합니다

Feign Circuit Breaker 이름은 인터페이스와 메서드로 만들어질 수 있고 버전에 따라 변환 정책이 있습니다.
인스턴스별 Resilience4j 설정을 넣을 때 실제 생성된 이름과 일치하는지 확인합니다.
필요하면 CircuitBreakerNameResolver로 이름 정책을 명시합니다.

상대 400, 연결 거절과 OPEN 상태의 호출 거절은 원인이 다릅니다.
fallbackFactory에서 받은 원인과 관측 지표로 구분하고 공개 응답에서는 비밀 정보가 빠지게 합니다.
Feign의 readTimeout과 TimeLimiter가 서로 다른 제한이라는 점도 확인합니다.

시험은 상대가 500을 반복할 때와 연결이 느릴 때를 나눕니다.
OPEN 이후 상대 요청 수가 멈추는지, 회복 이후 정상 결과로 돌아오는지 확인합니다.

연결 속성, 이름과 fallback은 [OpenFeign 4.3 공식 문서](https://docs.spring.io/spring-cloud-openfeign/reference/4.3/spring-cloud-openfeign.html)를 참고합니다.

## 자주 묻는 질문

### 이름과 예외를 확인합니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### OpenFeign과 Circuit Breaker 조합 적용 시 확인할 점에서 무엇을 확인하나요?

클라이언트 선택과 장애 제어는 호출 모델과 함께 봅니다. 동기 호출이라는 이유만으로 대체 여부를 단정하지 않습니다.
