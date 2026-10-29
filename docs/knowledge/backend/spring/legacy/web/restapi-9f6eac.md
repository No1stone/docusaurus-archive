---
format: md
id: k-restapi-9f6eac
title: "RestAPI"
description: "Spring에서 동기 RestClient와 리액티브 WebClient로 외부 REST를 호출하는 메모입니다."
tags:
  - HTTP
  - Spring
status: active
slug: /knowledge/k-restapi-9f6eac
---
# RestAPI

## 개요

Spring에서 외부 REST API를 호출할 때 쓰는 클라이언트 선택과 호출 패턴을 정리합니다.
동기 스택에서는 `RestClient`를, 논블로킹이 필요할 때는 `WebClient`를 둡니다.
Spring Framework 6.1 / Spring Boot 3.2부터 `RestClient`가 들어왔고, `RestTemplate`의 메시지 컨버터와 요청 팩토리를 쓰면서 WebClient와 비슷한 fluent API를 제공합니다.

도메인별 호출 메모는 아래를 함께 봅니다.

- [GoogleDialogFlow](/docs/knowledge/k-googledialogflow)
- [Webex](/docs/knowledge/k-webex)
- [Json](/docs/knowledge/k-json)

## 클라이언트 선택

| 클라이언트 | 실행 모델 | 의존성 | 쓸 때 |
|---|---|---|---|
| `RestClient` | 동기 | `spring-web` (Boot 3.2+) | 서블릿 MVC에서 외부 API 호출 |
| `WebClient` | 논블로킹(블로킹도 가능) | `spring-boot-starter-webflux` | 리액티브 스택, 또는 스트리밍 |
| `RestTemplate` | 동기 | `spring-web` | 레거시. 신규는 `RestClient`를 우선 |

`RestClient`는 `RestTemplate.create(restTemplate)`처럼 기존 설정을 이어받을 수 있습니다.
WebClient가 필요할 때만 webflux 의존성을 추가합니다.

## RestClient로 요청하기

생성은 `create()` 또는 `builder()`입니다.
`baseUrl`, 기본 헤더, `requestFactory`(타임아웃)를 붙인 뒤 `get` / `post`와 `retrieve()`로 본문을 받습니다.

```java
RestClient restClient = RestClient.builder()
        .baseUrl("https://api.example.com")
        .requestFactory(requestFactory) // connect / read timeout
        .build();

Pet pet = restClient.get()
        .uri("/pets/{id}", id)
        .accept(MediaType.APPLICATION_JSON)
        .retrieve()
        .body(Pet.class);

ResponseEntity<Void> created = restClient.post()
        .uri("/pets")
        .contentType(MediaType.APPLICATION_JSON)
        .body(pet)
        .retrieve()
        .toBodilessEntity();
```

기본 동작은 4xx/5xx에서 `RestClientException` 계열을 던집니다.
상태별로 처리하려면 `onStatus`를 붙이거나, 요청과 응답을 직접 다루는 `exchange`를 씁니다.
`exchange`를 쓰면 `onStatus` 핸들러는 적용되지 않습니다.

## 공통 클라이언트로 감싸기

호출이 늘면 `RestClient`를 필드에 두고 GET/POST를 감싼 추상 클래스를 둡니다.
타임아웃과 버퍼링 팩토리를 생성자에서 한 번 맞추고, 응답은 상태 코드, 파싱된 본문, raw 문자열을 담는 래퍼로 돌립니다.

```java
public abstract class AbstractRestClient {
    private final RestClient restClient;

    protected AbstractRestClient(String baseUrl, int connectTimeoutMs, int readTimeoutMs) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeoutMs);
        factory.setReadTimeout(readTimeoutMs);

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(new BufferingClientHttpRequestFactory(factory))
                .build();
    }

    protected <T> RestResponse<T> get(String url, HttpHeaders headers, Class<T> clazz) {
        RestResponse.RestResponseBuilder<T> builder = RestResponse.builder();
        restClient.get()
                .uri(url)
                .headers(h -> {
                    if (headers != null) {
                        h.addAll(headers);
                    }
                })
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> fill(builder, req, res, clazz))
                .onStatus(HttpStatusCode::is2xxSuccessful, (req, res) -> fill(builder, req, res, clazz))
                .toBodilessEntity();
        return builder.build();
    }
}
```

Spring Boot가 제공하는 `RestClient.Builder` 빈을 주입해 서비스별 클라이언트를 만들 수도 있습니다.
파트너 API처럼 인증 교환이 붙는 호출은 `RestClient` 빈을 하나 두고, GET/POST 래퍼에서 Authorization을 채운 뒤 경로만 넘기는 식이 읽기 쉽습니다.

```java
@Bean("moplRestClient")
RestClient moplRestClient(RestClient.Builder builder) {
    return builder.build();
}

// 사용 예: exchange.post(restClient, "/partner/v1/webhooks", body)
```

## WebClient 메모

WebClient는 builder로 `baseUrl`, 기본 헤더, Reactor Netty 타임아웃을 맞춘 뒤 `retrieve().bodyToMono` / `bodyToFlux`로 받습니다.
일반 응답은 `retrieve()`를 쓰고, 상태와 헤더까지 직접 보려면 `exchangeToMono` / `exchangeToFlux`를 씁니다.
구형 `exchange()`는 응답 본문 미소비 시 누수 위험이 있어 권장하지 않습니다.

동기 코드에서만 결과를 당장 써야 하면 `.block()`을 쓸 수 있지만, 서블릿 스택의 단순 호출은 `RestClient`가 의존성 부담이 적습니다.

<details>
<summary>참고 자료</summary>

- [New in Spring 6.1: RestClient](https://spring.io/blog/2023/07/13/new-in-spring-6-1-restclient) — RestClient 도입 배경, `retrieve` / `exchange`, 상태 핸들러
- [Spring Boot 3.2 RestClient](https://mangkyu.tistory.com/303) — RestTemplate·WebClient 대비와 Boot에서의 사용
- [Spring WebClient, 어렵지 않게 사용하기](https://gngsn.tistory.com/154) — WebClient 생성, 타임아웃, `retrieve` / `exchangeToXXXX`, 에러 처리
</details>
