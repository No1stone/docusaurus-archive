---
id: spring-cloud-gateway-custom-filters
title: 커스텀 필터 구현과 적용
description: 새로운 필터 로직을 구현하고 라우트에 적용하는 범위를 정리합니다.
slug: /knowledge/backend/spring-cloud/gateway/custom-filters
sidebar_position: 5
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "커스텀 필터 구현과 적용"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Gateway"
  - "Route"
  - "Predicate"
  - "Filter"
  - "커스텀"
---
# 커스텀 필터 구현과 적용

기본 필터로 표현할 수 없는 기능은 코드로 확장합니다.
예를 들어 특정 업무 헤더가 없으면 요청을 거절하는 기능을 만들고, 필요한 라우트에서만 사용하도록 구성할 수 있습니다.
설정으로 선택할 기능과 그 기능의 구현은 별개입니다.

## 라우트 필터 팩터리를 만듭니다

아래 코드는 Gateway WebFlux 4.3의 확장 형태를 보여 줍니다.
헤더 유무만 검사하는 학습 예제이며 인증된 테넌트 권한 검증을 대신하지 않습니다.

```java
@Component
public class RequiredHeaderGatewayFilterFactory
        extends AbstractGatewayFilterFactory<RequiredHeaderGatewayFilterFactory.Config> {
    public RequiredHeaderGatewayFilterFactory() { super(Config.class); }

    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String value = exchange.getRequest().getHeaders().getFirst(config.getName());
            if (value == null || value.isBlank()) {
                exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        };
    }

    public static class Config {
        private String name;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
```

```yaml
filters:
  - name: RequiredHeader
    args:
      name: X-Request-Source
```

두 번째 블록은 라우트 안의 filters 부분입니다.
팩터리 이름과 설정 필드가 연결되며 새 Java 코드를 배포한 뒤 설정에서 사용할 수 있습니다.
배포하지 않은 필터 이름을 Config에 추가해도 기능이 생기지는 않습니다.
실제로는 Config.name 자체가 비어 있는 경우의 기동 검증도 추가합니다.

## 업무 정책을 필터 안에 모두 넣지 않습니다

외부 인증 호출이 필요하다면 논블로킹 클라이언트와 제한 시간을 사용하고, 실패를 허용할지 거절할지 정합니다.
필터 안에서 JDBC나 파일 읽기를 직접 수행하면 이벤트 루프를 막을 수 있습니다.
여러 단계의 업무 조립은 서비스나 BFF의 경계와 비교합니다.

전달 헤더가 신원을 뜻한다면 외부 입력을 제거하고 검증된 값만 내부에 전달하는 신뢰 경계가 필요합니다.
헤더 존재 검사는 위조 방지가 아닙니다.

검증은 누락, 공백, 정상 값과 여러 라우트 적용을 나눕니다.
거절된 요청이 백엔드에 도달하지 않았는지도 더미 서버의 수신 기록으로 확인합니다.

확장 API는 [Gateway 공식 문서](https://docs.spring.io/spring-cloud-gateway/reference/4.3/spring-cloud-gateway-server-webflux.html), 실행 모델은 [WebFlux와 MVC](./webflux-and-mvc.md)를 참고합니다.

## 자주 묻는 질문

### 라우트 필터 팩터리를 만듭니다에서 무엇을 확인하나요?

라우트 매칭과 필터 처리는 Gateway의 핵심입니다. YAML 설정과 Java 구성, 커스텀 필터를 구분합니다.

### 업무 정책을 필터 안에 모두 넣지 않습니다에서 무엇을 확인하나요?

라우트 매칭과 필터 처리는 Gateway의 핵심입니다. YAML 설정과 Java 구성, 커스텀 필터를 구분합니다.
