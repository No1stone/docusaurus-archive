---
format: "md"
id: "spring-spring-web-outbound-http"
title: "외부 HTTP 호출"
description: "RestClient, WebClient와 HTTP Interface를 비교하고 타임아웃, 응답 오류와 재시도 정책의 경계를 설명합니다."
slug: "/knowledge/backend/spring/spring-web/outbound-http"
sidebar_position: 6
status: "active"
tags:
  - "Spring"
keywords:
  - "외부 HTTP 호출"
  - "Spring"
  - "Spring MVC"
  - "Controller"
  - "WebFlux"
  - "Interceptor"
  - "Validation"
  - "Virtual Threads"
---
# 외부 HTTP 호출

외부 HTTP 호출은 메서드 하나처럼 보이지만 연결, 대기, 응답 해석과 실패 정책을 포함합니다.
클라이언트 API 선택보다 먼저 어떤 실행 모델을 사용할지와 대기 시간을 정합니다.
이 글은 Framework 6.2와 Boot 3.5를 기준으로 설명합니다.

## 클라이언트 선택

| 도구 | 실행 모델 | 적합한 상황 |
|---|---|---|
| RestClient | 동기 호출 | MVC와 동기 유즈케이스 |
| WebClient | 리액티브 | 비동기 스트림과 논블로킹 조합 |
| RestTemplate | 동기 템플릿 | 기존 구현 유지와 점진 전환 |
| HTTP Interface | 선언적 계약 | 위 클라이언트의 호출을 인터페이스로 표현 |

RestClient는 Framework 6.1에서 추가됐습니다.
RestTemplate의 권장 사용 여부와 폐기 상태는 사용하는 Framework 버전에서 확인합니다.
새 API의 예제를 이전 프로젝트에 그대로 붙이면 빌드가 실패할 수 있습니다.

## 동기 클라이언트를 빈으로 구성합니다

```java
@Bean
RestClient partnerClient(RestClient.Builder builder) {
    HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(2)).build();
    var factory = new JdkClientHttpRequestFactory(httpClient);
    factory.setReadTimeout(Duration.ofSeconds(3));
    return builder.baseUrl("https://api.example.invalid")
            .requestFactory(factory).build();
}
```

```java
PartnerItem item = client.get()
        .uri("/items/{id}", id)
        .retrieve()
        .body(PartnerItem.class);
```

DTO와 오류 변환은 생략한 부분 예제입니다.
연결 시간과 응답 읽기 시간 제한을 설정했어도 풀 대기와 전체 요청 제한까지 모두 같은 값으로 적용되는 것은 아닙니다.
사용하는 HTTP 엔진과 프록시의 시간 제한도 함께 확인합니다.

## 실패를 분류한 뒤 재시도합니다

상대가 400으로 요청 오류를 응답한 경우와 연결 자체가 실패한 경우는 다릅니다.
`retrieve()`의 기본 오류 처리에만 의존하지 말고, 상대 오류 코드를 내부 예외 계약으로 변환할 위치를 정합니다.
업무 DTO에 HTTP 상태 처리를 퍼뜨리지 않도록 클라이언트 어댑터 경계에 모을 수 있습니다.

POST 요청이 타임아웃됐다고 상대가 실행하지 않았다고 단정할 수는 없습니다.
재시도가 필요하면 멱등 키, 재조회와 중복 처리 규칙을 함께 정합니다.
재시도 횟수를 늘릴수록 전체 대기와 상대 서버 부하도 늘어납니다.

## 확인할 테스트

정상 JSON, 빈 본문, 계약과 다른 JSON, 4xx, 5xx, 연결 거절과 지연 응답을 나눠 시험합니다.
코드가 요청을 만들었는지와 상대 서버가 실제 처리했는지도 구분합니다.
인증 헤더와 개인 정보를 로그에 그대로 남기지 않습니다.

Legacy의 [RestTemplate 메모](/docs/knowledge/k-resttemplate)와 [OpenFeign 메모](/docs/knowledge/k-openfeign)는 기존 호출 방식으로 연결합니다.
새 클라이언트 선택은 [공식 REST Clients 비교](https://docs.spring.io/spring-framework/reference/6.2/integration/rest-clients.html)를 참고합니다.

## 자주 묻는 질문

### MVC와 WebFlux는 같이 쓰나요?

보통 한 애플리케이션의 주 스택을 정합니다. 블로킹 JDBC와 WebFlux를 섞을 때는 스레드 모델을 따로 설계합니다.

### Interceptor와 Filter 차이는 무엇인가요?

Filter는 서블릿 단, Interceptor는 Spring MVC 핸들러 단에서 동작합니다.

