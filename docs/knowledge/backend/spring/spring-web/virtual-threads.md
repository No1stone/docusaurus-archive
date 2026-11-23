---
format: "md"
id: "spring-spring-web-virtual-threads"
title: "Virtual Threads"
description: "가상 스레드를 사용하는 MVC의 대기 모델과 Java 버전, DB 풀 및 동시성 제한의 관계를 설명합니다."
slug: "/knowledge/backend/spring/spring-web/virtual-threads"
sidebar_position: 7
status: "active"
tags:
  - "Spring"
keywords:
  - "Virtual Threads"
  - "Spring"
  - "Spring MVC"
  - "Controller"
  - "WebFlux"
  - "Interceptor"
  - "Validation"
---
# Virtual Threads

가상 스레드는 대기 시간이 많은 동기 코드를 더 적은 플랫폼 스레드로 실행하도록 돕습니다.
기존 호출 흐름을 유지할 수 있다는 장점이 있지만 CPU, DB 연결과 외부 서비스의 용량이 늘어나는 것은 아닙니다.
Java 17에서는 사용할 수 없으며, 이 글의 Boot 설정은 Java 21 이상을 전제로 합니다.

## Boot에서 사용하는 설정

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

Boot 3.2 이후 지원되는 설정이며, 실제 적용 대상은 웹 서버와 자동 설정된 실행기 등에 따라 달라집니다.
직접 만든 모든 스레드와 사용자 Executor가 자동으로 교체되는 옵션은 아닙니다.

```java
@GetMapping("/thread-info")
Map<String, Object> threadInfo() {
    Thread current = Thread.currentThread();
    return Map.of("name", current.getName(), "virtual", current.isVirtual());
}
```

이 엔드포인트는 로컬 확인용 예제입니다.
실제 요청 처리 스레드에서 `isVirtual()`을 확인하고 진단 후 제거합니다.
스케줄러나 별도 비동기 작업에서는 각각 확인해야 합니다.

## 대기를 줄이는 것과 자원 한도를 늘리는 것은 다릅니다

```mermaid
flowchart LR
    Requests[많은 동시 요청] --> Virtual[가상 스레드]
    Virtual --> Pool[제한된 DB 연결 풀]
    Pool --> DB[DB 처리 용량]
```

DB 풀이 10개라면 동시 요청 1000개가 모두 DB에서 병렬 실행되는 것은 아닙니다.
대기 스레드 생성 비용이 줄어도 큐와 대기 시간이 길어질 수 있습니다.
요청 제한, 타임아웃과 벌크헤드 같은 부하 제어는 여전히 필요합니다.

| 작업 | 기대할 변화 | 남는 제한 |
|---|---|---|
| 동기 HTTP 대기 | 플랫폼 스레드 점유를 줄일 수 있습니다. | 상대 서버와 연결 풀 |
| JDBC 대기 | 호출 스타일을 유지할 수 있습니다. | DB 연결과 SQL 처리량 |
| CPU 연산 | 자동으로 빨라지지 않습니다. | 코어 수와 알고리즘 |
| ThreadLocal | 기본 의미는 유지됩니다. | 대량 스레드별 값의 메모리 비용 |

## Java 버전별 차이를 확인합니다

Java 21의 pinning과 Java 24 이후의 개선을 같은 조건으로 설명하지 않습니다.
`synchronized`로 인한 주요 pinning은 JEP 491에서 개선됐지만, 네이티브 호출 등의 제한과 사용하는 라이브러리는 별도로 검토합니다.
가상 스레드를 켰다는 이유만으로 모든 동기화 코드를 제거할 필요도 없습니다.

가상 스레드는 데몬 스레드이므로 웹 서버 없는 실행에서는 JVM을 유지하는 별도 조건이 필요할 수 있습니다.
스케줄러 전용 앱에서는 Boot의 keep-alive 설정과 종료 동작도 확인합니다.

검증은 같은 부하에서 전후의 지연 시간, 오류율, 메모리, DB 풀 대기와 처리량을 비교합니다.
기동 성공과 스레드 수 감소만으로 적용 효과를 확정하지 않습니다.

지원 설정은 [Boot 스레드 안내](https://docs.spring.io/spring-boot/3.5/reference/features/spring-application.html#features.spring-application.virtual-threads), 버전 차이는 [JEP 444](https://openjdk.org/jeps/444)와 [JEP 491](https://openjdk.org/jeps/491)을 참고합니다.

## 자주 묻는 질문

### MVC와 WebFlux는 같이 쓰나요?

보통 한 애플리케이션의 주 스택을 정합니다. 블로킹 JDBC와 WebFlux를 섞을 때는 스레드 모델을 따로 설계합니다.

### Interceptor와 Filter 차이는 무엇인가요?

Filter는 서블릿 단, Interceptor는 Spring MVC 핸들러 단에서 동작합니다.

