---
format: "md"
id: "spring-spring-web-webflux"
title: "WebFlux"
description: "WebFlux의 논블로킹 실행과 Mono 및 Flux 조합을 설명하고 JDBC, 파일 I/O 및 트랜잭션의 경계를 비교합니다."
slug: "/knowledge/backend/spring/spring-web/webflux"
sidebar_position: 8
status: "active"
tags:
  - "Spring"
keywords:
  - "WebFlux"
  - "Spring"
  - "Spring MVC"
  - "Controller"
  - "Interceptor"
  - "Validation"
  - "Virtual Threads"
---
# WebFlux

WebFlux는 리액티브 스트림을 바탕으로 요청과 응답을 처리하는 웹 프레임워크입니다.
적은 수의 이벤트 루프 스레드가 많은 연결을 다루려면 대기 작업이 스레드를 붙잡지 않아야 합니다.
Controller 반환 타입을 Mono로 바꾸는 것만으로 전체 경로가 논블로킹이 되지는 않습니다.

## 값 한 개와 여러 개를 표현합니다

`Mono<T>`는 0개 또는 1개의 결과, `Flux<T>`는 0개 이상의 결과를 표현합니다.
결과뿐 아니라 오류와 완료 신호도 전달합니다.
실제 실행은 구독과 연결되며, 웹 요청에서는 프레임워크가 반환된 Publisher를 구독합니다.

```java
@RestController
class CatalogReactiveController {
    private final ReactiveCatalogClient client;

    CatalogReactiveController(ReactiveCatalogClient client) {
        this.client = client;
    }

    @GetMapping("/catalogs/{id}")
    Mono<CatalogItem> find(@PathVariable("id") Long id) {
        return client.find(id).timeout(Duration.ofSeconds(2));
    }
}
```

`ReactiveCatalogClient`는 논블로킹 클라이언트 계약을 가정합니다.
Controller 안에서 직접 `subscribe()`를 호출하거나 결과를 얻으려고 `block()`하지 않습니다.
응답 생명주기를 프레임워크가 관리하게 둡니다.

## 블로킹 경로를 구분합니다

```java
Mono<CatalogItem> result = Mono.fromCallable(() -> blockingRepository.find(id))
        .subscribeOn(Schedulers.boundedElastic());
```

기존 블로킹 호출을 제한된 별도 스케줄러로 옮기는 연결 예제입니다.
JDBC 자체가 논블로킹으로 바뀌거나 무제한 처리량을 얻는 것은 아닙니다.
풀 크기, 큐와 DB 연결 수가 새로운 제한이 됩니다.
`Mono.just(blockingRepository.find(id))`는 Publisher 생성 전에 호출이 실행되므로 같은 효과가 아닙니다.

| 구분 | MVC 동기 경로 | WebFlux 경로 |
|---|---|---|
| 대기 표현 | 호출 스택에서 기다립니다. | Publisher 조합으로 연결합니다. |
| DB 접근 | JDBC와 JPA를 자연스럽게 사용합니다. | 논블로킹이면 R2DBC 등을 검토합니다. |
| 컨텍스트 | 스레드 기반 기능이 많습니다. | Reactor Context 등 전파 경계를 확인합니다. |
| 병목 | 요청 스레드와 외부 자원 | 이벤트 루프 차단과 외부 자원 |

## 트랜잭션과 취소도 실행 모델을 따릅니다

리액티브 트랜잭션은 구독 경로와 컨텍스트에 연결됩니다.
JPA의 스레드 바인딩 트랜잭션이 임의의 리액티브 스케줄 전환을 따라간다고 기대하지 않습니다.
클라이언트가 연결을 끊어 구독이 취소됐을 때 외부 요청이나 이미 진행된 쓰기가 어떻게 되는지도 확인합니다.

성능 비교는 동시 요청 수만이 아니라 지연 시간, 오류율, 스레드와 DB 풀 사용량을 함께 봅니다.
현재 시스템이 블로킹 자원 중심이라면 MVC와 가상 스레드도 비교 대상으로 둘 수 있습니다.
어느 방식이든 부하 제한과 실패 정책은 필요합니다.

설계 배경은 [WebFlux 개요](https://docs.spring.io/spring-framework/reference/6.2/web/webflux/new-framework.html), 블로킹 연결은 [Reactor FAQ](https://projectreactor.io/docs/core/release/reference/faq.html#faq.wrap-blocking)를 참고합니다.

## 자주 묻는 질문

### MVC와 WebFlux는 같이 쓰나요?

보통 한 애플리케이션의 주 스택을 정합니다. 블로킹 JDBC와 WebFlux를 섞을 때는 스레드 모델을 따로 설계합니다.

### Interceptor와 Filter 차이는 무엇인가요?

Filter는 서블릿 단, Interceptor는 Spring MVC 핸들러 단에서 동작합니다.

