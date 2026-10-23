---
format: md
id: k-webfluxhandler
title: "WebfluxHandler"
description: "WebFlux 함수형 엔드포인트에서 ServerRequest·ServerResponse와 WebClient를 다루는 메모입니다."
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-webfluxhandler
---
# WebfluxHandler

## 개요

RouterFunction 스타일에서는 핸들러가 `ServerRequest`를 받아 `Mono<ServerResponse>`를 돌려줍니다.
본문은 `bodyToMono` / `bodyToFlux`로 읽고, 응답은 `ServerResponse.ok().contentType(...).body(...)`로 씁니다.
외부 호출은 `WebClient`의 `retrieve().bodyToFlux`를 핸들러 안에서 이어 붙입니다.

## 응답 만들기

```java
public Mono<ServerResponse> hello(ServerRequest request) {
    Map<String, Object> result = Map.of(
            "number", 1234,
            "text", "webflux"
    );
    return ServerResponse.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(BodyInserters.fromValue(result));
}
```

공유 `HashMap`을 필드에 두고 `Mono.just`로 감싸면 요청 간에 상태가 섞입니다.
요청마다 새 맵을 만들거나, 리액티브 체인이 소유한 데이터만 `body`에 넣습니다.

## 본문 읽기와 WebClient

```java
public Mono<ServerResponse> echo(ServerRequest request) {
    Flux<TestModel> model = request.bodyToFlux(TestModel.class);
    return ServerResponse.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(model, TestModel.class);
}

public Mono<ServerResponse> proxy(ServerRequest request) {
    return WebClient.create("http://localhost:8080")
            .get()
            .uri("/test1")
            .retrieve()
            .bodyToFlux(TestModel.class)
            .collectList()
            .flatMap(list -> ServerResponse.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(list));
}
```

`body(null, ...)`처럼 본문 publisher가 비어 있으면 응답이 비거나 오류가 납니다.
URI를 만들 때는 `UriComponentsBuilder`에 경로 변수·쿼리를 넣고, 리액티브 타입을 `build` 인자에 그대로 넣지 않습니다.
SSE 브로드캐스트 예는 [webflux exame](./webflux-exame.md)를 봅니다.

<details>
<summary>참고 자료</summary>

- [Spring WebFlux — Functional Endpoints](https://docs.spring.io/spring-framework/reference/web/webflux-functional.html)
</details>
