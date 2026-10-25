---
id: adr-0004
title: 블로킹 기반 업무 처리에 Spring MVC와 Virtual Threads를 선택한 이유
description: JPA와 RestClient를 사용하는 업무 흐름을 명령형 코드로 유지하면서 I/O 대기 비용을 줄이기 위한 선택
tags:
  - adr
  - backend
  - mvc
status: accepted
slug: "/decisions/adr-0004"
---
# 블로킹 기반 업무 처리에 Spring MVC와 Virtual Threads를 선택한 이유

> **개요:** JPA와 RestClient를 사용하는 현재 구조에서는 Spring MVC로 업무 흐름을 표현하고, Virtual Threads로 I/O 대기 중 플랫폼 스레드 점유 부담을 줄입니다.
> 기존 비즈니스 로직과 데이터 접근 방식을 유지하면서 요청 처리에 적용합니다.

## 상태

채택됨

## 배경

비즈니스 로직은 데이터 접근과 외부 시스템 호출을 조합하여 하나의 유스케이스를 실행합니다.
작성자의 아키텍처에서는 이러한 비즈니스 로직의 조합을 Facade 계층이 담당합니다.
예를 들어 데이터를 조회한 뒤 외부 시스템의 정보를 추가하고, 권한에 맞게 결과를 가공하여 반환합니다.
이 과정에서는 실행 순서, 결과 조합과 실패 처리를 명확하게 표현할 수 있어야 합니다.

```text
REST Controller 또는 gRPC Adapter
              ↓
         비즈니스 로직
          ├─ 데이터 접근 → DB
          └─ 외부 시스템 호출
```

현재 데이터 접근에는 JPA와 JDBC를, 외부 HTTP 연동에는 RestClient를 사용합니다.
모두 호출 결과를 기다리는 블로킹 API이므로, 웹 요청의 처리 모델도 이 특성과 함께 선택해야 했습니다.
중요한 기준은 업무 순서와 실패 처리를 쉽게 읽을 수 있고, 필요한 DB 작업의 트랜잭션 범위를 명확하게 유지하는 것이었습니다.

## 검토한 대안

### Spring WebFlux

WebFlux를 사용하더라도 기존 JPA와 RestClient 호출이 자동으로 논블로킹으로 바뀌지는 않습니다.
블로킹 작업을 별도 실행기로 분리하거나 데이터 접근과 외부 연동 방식을 함께 검토해야 합니다.
현재 유스케이스에 이를 적용하면 업무 처리 외에 리액티브 실행 흐름과 트랜잭션 전파 방식도 고려해야 합니다.

현재 구조에서는 그 복잡성을 추가하기보다, 기존 블로킹 API와 명령형 업무 흐름을 유지하는 편이 적합하다고 판단했습니다.
Spring 공식 문서도 JPA와 JDBC 같은 블로킹 API가 중심인 일반적인 구조에서 MVC를 권장합니다.
[Spring MVC와 WebFlux 선택 기준](https://docs.spring.io/spring-framework/reference/6.2/web/webflux/new-framework.html)

### Spring MVC와 Virtual Threads

MVC에서는 비즈니스 로직의 처리 순서를 일반적인 메서드 호출로 표현할 수 있습니다.
여기에 Virtual Threads를 적용하면 명령형 코드를 유지하면서, 지원되는 블로킹 I/O의 대기 중 플랫폼 스레드 점유 부담을 줄일 수 있습니다.
현재 사용하는 데이터 접근 및 외부 연동 방식과 잘 맞는 선택입니다.

## 결정

블로킹 데이터 접근과 외부 연동이 중심인 현재 업무 처리에는 Spring MVC와 Virtual Threads를 사용합니다.
비즈니스 로직의 실행 순서, 결과 조합과 실패 처리는 명령형 코드로 표현하며, 기존 데이터 접근과 외부 연동 계약을 리액티브 타입으로 변경하지 않습니다.

MVC를 선택하는 것은 REST 진입점의 실행 모델에 대한 결정입니다.
같은 비즈니스 로직을 호출하는 gRPC Adapter나 외부 연동 라이브러리의 실행 방식까지 자동으로 결정하지는 않습니다.

## 코드로 비교하는 요청 처리

다음은 외부 API에서 항목을 읽어 반환하는 최소 비교 예시입니다.
두 코드는 서로 다른 웹 스택에서 사용하는 예시이며, 하나의 애플리케이션에 함께 등록하는 코드는 아닙니다.
공통으로 사용하는 `ItemView`는 `Long id`, `String name`을 가진 내부 응답 record라고 가정합니다.
URL은 예시용이며 실제 실행 환경에 맞게 변경해야 합니다.

### MVC: 결과를 받은 뒤 다음 줄을 실행합니다

```java
@RestController
class ItemController {
    private final RestClient client;

    ItemController(RestClient.Builder builder) {
        this.client = builder.baseUrl("http://partner.example").build();
    }

    @GetMapping("/items/{id}")
    ItemView find(@PathVariable Long id) {
        ItemView item = client.get()
                .uri("/items/{id}", id)
                .retrieve()
                .body(ItemView.class);
        return item;
    }
}
```

`body()` 호출은 응답을 받을 때까지 현재 Java 스레드의 실행을 기다리게 합니다.
플랫폼 스레드에서 실행하면 그 스레드는 대기 동안 다른 요청을 처리하지 못합니다.
가상 스레드에서 실행하면 코드의 순서는 같지만, 지원되는 I/O 대기 중에는 JVM이 가상 스레드를 캐리어에서 분리하여 플랫폼 스레드를 다른 작업에 사용할 수 있습니다.

이 예시는 호출 방식만 비교하기 위해 Controller에서 Client를 직접 사용합니다.
실제 애플리케이션에서는 Controller가 비즈니스 로직에 처리를 위임하고, 그 안에서 필요한 데이터 접근과 외부 호출을 조합할 수 있습니다.

### WebFlux: 응답이 도착했을 때 실행할 흐름을 반환합니다

```java
@RestController
class ReactiveItemController {
    private final WebClient client;

    ReactiveItemController(WebClient.Builder builder) {
        this.client = builder.baseUrl("http://partner.example").build();
    }

    @GetMapping("/items/{id}")
    Mono<ItemView> find(@PathVariable Long id) {
        return client.get()
                .uri("/items/{id}", id)
                .retrieve()
                .bodyToMono(ItemView.class)
                .map(item -> new ItemView(item.id(), item.name()));
    }
}
```

이 코드는 결과 자체가 아니라 결과를 처리할 `Mono`를 반환합니다.
프레임워크가 구독하고, 응답이 도착하면 이후 처리가 실행됩니다.
논블로킹 I/O 대기 동안 이벤트 루프 스레드는 해당 요청을 기다리며 묶여 있지 않고 다른 작업을 처리할 수 있습니다.

`Mono`로 감쌌다는 이유만으로 내부 작업까지 논블로킹이 되는 것은 아닙니다.
이벤트 루프에서 JPA를 호출하거나 `.block()`으로 결과를 기다리면 그 스레드를 막을 수 있습니다.
블로킹 작업을 별도 실행기로 옮겨도 작업을 수행하는 스레드가 기다린다는 사실은 남습니다.
[Spring WebFlux의 실행 모델](https://docs.spring.io/spring-framework/reference/6.2/web/webflux/new-framework.html)

## 비동기와 논블로킹의 차이

비동기는 작업을 시작한 호출자가 완료 결과를 나중에 전달받는 방식입니다.
논블로킹은 I/O 완료를 기다리는 동안 호출 스레드를 붙잡아 두지 않는 방식입니다.
두 개념은 함께 사용되는 경우가 많지만 같은 의미는 아닙니다.

예를 들어 blocking HTTP 호출을 `CompletableFuture.supplyAsync()`로 실행하면 호출자는 Future를 받고 다음 일을 할 수 있습니다.
하지만 작업을 맡은 플랫폼 스레드는 HTTP 응답을 기다리는 동안 여전히 점유됩니다.
Future를 받은 직후 `.join()`을 호출하면 결과를 사용하는 호출자도 다시 기다리게 됩니다.
따라서 비동기로 실행했다는 사실만으로 스레드 대기 비용이 사라지지는 않습니다.

| 방식 | 호출 코드 | I/O 대기 중 스레드 사용 |
|---|---|---|
| MVC와 플랫폼 스레드 | 결과를 받은 뒤 다음 단계 실행 | 요청을 맡은 플랫폼 스레드가 대기합니다. |
| 별도 플랫폼 실행기의 비동기 작업 | 완료 결과를 Future 등으로 전달 | 호출자는 다른 일을 할 수 있지만 작업 스레드는 대기합니다. |
| WebFlux와 논블로킹 Client | 완료 시 실행할 처리를 연결 | 이벤트 루프를 해당 I/O 대기 전용으로 점유하지 않습니다. |
| MVC와 가상 스레드 | 결과를 받은 뒤 다음 단계 실행 | 가상 스레드는 대기하지만, 지원되는 대기에서는 캐리어 플랫폼 스레드를 반환할 수 있습니다. |

가상 스레드도 Java 스레드입니다.
따라서 차이를 단순히 “스레드를 사용한다, 사용하지 않는다”로 설명하면 정확하지 않습니다.
가상 스레드를 실제로 실행하는 플랫폼 스레드를 캐리어라고 하며, 핵심은 대기 중인 요청이 그 캐리어를 계속 점유해야 하는지입니다.
어느 방식이든 코드를 실행하는 순간에는 CPU와 실행 스레드가 필요합니다.

가상 스레드의 분리는 모든 blocking 연산에서 보장되지 않습니다.
JDK와 라이브러리, native 호출 등의 특성에 따라 캐리어를 점유하는 경우가 있으므로 실제 사용 경로를 확인해야 합니다.
[OpenJDK JEP 444: Virtual Threads](https://openjdk.org/jeps/444)

## MVC에서 Virtual Threads 설정하기

Java 21 이상과 지원되는 Spring Boot 환경에서 다음 설정을 사용합니다.
현재 프로젝트는 Java 25와 Spring Boot 3.5 계열을 기준으로 합니다.

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

Spring Boot가 자동 구성하는 내장 Tomcat의 요청 처리에 적용하면 MVC 코드를 리액티브 타입으로 바꾸지 않고 가상 스레드에서 실행할 수 있습니다.
이 설정이 `RestClient`나 JPA 자체를 비동기 API로 바꾸거나, 순서대로 작성한 두 호출을 자동으로 병렬 실행하는 것은 아닙니다.

직접 만든 `ThreadPoolTaskExecutor`나 별도 라이브러리의 실행기는 자동으로 가상 스레드 실행기로 바뀌지 않습니다.
어떤 실행기에서 작업하는지는 별도로 확인해야 합니다.
[Spring Boot Virtual Threads 설정](https://docs.spring.io/spring-boot/reference/features/spring-application.html)

### 실제 요청 스레드 확인

다음 코드는 개발 환경에서 요청 스레드를 확인하기 위한 임시 예시입니다.
확인이 끝나면 제거하며 운영 진단 API로 공개하지 않습니다.

```java
@GetMapping("/debug/thread")
Map<String, Object> threadInfo() {
    Thread thread = Thread.currentThread();
    return Map.of("virtual", thread.isVirtual());
}
```

서버를 기동하고 HTTP로 호출했을 때 `virtual: true`인지 확인합니다.
`main()`이나 일반 단위 테스트 스레드에서 확인한 값은 MVC 요청 스레드의 적용 여부를 증명하지 않습니다.

## 참고한 Netflix 사례

Netflix는 Eureka 등을 통해 Spring Cloud 생태계에 기여해 왔으며, 대규모 Java 서비스의 실행 모델을 검토할 때 참고할 수 있는 사례를 공개하고 있습니다.
[Spring Cloud Netflix 소개](https://spring.io/projects/spring-cloud-netflix/)

Paul Bakker의 2026년 Devoxx 발표는 Netflix의 Spring Boot, DGS/GraphQL, gRPC 기반 구조와 Virtual Threads 적용 경험을 다룹니다.
같은 해 9월 Spring 공식 인터뷰에서도 리액티브 방식의 복잡성을 Virtual Threads와 Structured Concurrency로 대체하는 접근을 소개했습니다.
[2026년 Devoxx 발표](https://m.devoxx.com/events/devoxxpl26/talks/9648/how-netflix-uses-java-2026-edition), [Spring 공식 인터뷰](https://spring.io/blog/2026/09/10/a-bootiful-podcast-paul-bakker/)

DGS 공식 문서는 Spring MVC와 Tomcat의 요청 처리에 Virtual Threads를 적용하는 방법도 설명합니다.
Tomcat 요청 처리와 DGS 내부 실행은 별도로 설정한다는 점에서, 적용 범위를 구분해야 한다는 참고가 됩니다.
[Netflix DGS Virtual Threads 문서](https://netflix.github.io/dgs/advanced/virtual-threads/)

이 사례들은 MVC와 Virtual Threads의 조합을 검토하는 참고 자료입니다.
최종 선택의 근거는 현재 프로젝트가 사용하는 블로킹 API와 명령형으로 표현한 비즈니스 로직입니다.

## 결과와 제약

업무 흐름을 명령형 코드로 유지하므로, 데이터를 읽고 외부 기능을 호출한 뒤 결과를 반환하는 순서를 따라가기 쉽습니다.
기존 데이터 접근과 외부 연동 계약도 유지할 수 있습니다.

Virtual Threads는 DB 연결 수나 외부 서버의 처리 용량을 늘려 주지 않습니다.
DB 연결 풀, 외부 호출의 시간 제한과 동시 실행 제한은 별도로 관리해야 하며, 직접 만든 Executor에도 설정이 자동으로 적용되는 것은 아닙니다.

비즈니스 로직의 처리 범위에 DB 트랜잭션을 선언해도 외부 시스템의 작업까지 함께 롤백되지는 않습니다.
DB 변경 범위와 외부 호출의 실패 처리는 각각 정의해야 합니다.

성능 개선 여부는 실제 부하 테스트로 확인합니다.
처리량과 응답 시간뿐 아니라 DB 연결 대기와 외부 API 지연도 함께 측정합니다.

## 관련

- [ADR-0001 원본은 Git 안의 Markdown으로 둡니다](/docs/decisions/adr-0001)
