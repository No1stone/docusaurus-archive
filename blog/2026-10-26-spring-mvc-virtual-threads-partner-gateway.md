---
slug: spring-mvc-virtual-threads-partner-gateway
title: "외부 API 연동 서버에 Spring MVC와 Virtual Threads를 선택한 이유"
description: "Partner Gateway에서 Spring MVC와 Virtual Threads를 선택한 판단"
authors: []
tags:
  - java
  - spring-mvc
  - virtual-threads
  - spring-boot
  - partner-gateway
date: 2026-10-26
---

# 외부 API 연동 서버에 Spring MVC와 Virtual Threads를 선택한 이유

Partner Gateway는 여러 시스템 사이에서 요청을 전달하고 응답을 변환하는 서버입니다.

<!-- truncate -->

요청을 받으면 인증 정보를 확인하고, 외부 API를 호출하고, 필요한 데이터를 조회한 뒤 응답을 조립합니다. Java 25와 Spring Boot를 사용하며, 웹 요청은 Spring MVC로 처리합니다.

외부 호출이 많은 서버라면 WebFlux를 먼저 떠올릴 수 있습니다. 하지만 이번 프로젝트에서는 **MVC의 익숙한 코드 흐름을 유지하면서 Virtual Threads를 함께 사용하는 방식**을 선택했습니다.

## 업무 흐름을 코드에서도 그대로 읽고 싶었다

이 서버의 업무는 순서가 중요합니다.

```text
요청 수신
  → 인증 확인
  → 외부 요청 DTO 변환
  → 외부 API 호출
  → 응답 확인·변환
  → 결과 반환
```

이 흐름은 일반적인 메서드 호출로 표현하기 좋습니다. 비즈니스 로직을 조합하는 Facade 레이어에서도 처리 순서와 예외가 발생하는 위치를 따라가기 쉽습니다.

아래는 구조를 단순화한 예제입니다.

```java
public CarsResponse findCars(CarsRequest request) {
    tokenChecker.check(request.accessToken());

    PartnerCarsRequest partnerRequest = toPartnerRequest(request);
    PartnerCarsResponse partnerResponse = partnerClient.findCars(partnerRequest);

    return toCarsResponse(partnerResponse);
}
```

요청과 응답을 어떤 형태로 변환하는지, 외부 호출은 어디에서 발생하는지 바로 보입니다.

기존 데이터 접근은 JPA, 외부 HTTP 호출은 RestClient를 사용합니다. 두 방식 모두 호출 결과를 기다리는 blocking 모델입니다. 이 구성을 유지하면서 업무 흐름도 같은 방식으로 읽을 수 있도록 MVC를 선택했습니다.

Spring 공식 문서 역시 JPA·JDBC 같은 blocking API를 사용하는 일반적인 구조에서는 MVC가 적합한 선택이라고 설명합니다. [Spring MVC·WebFlux 선택 기준](https://docs.spring.io/spring-framework/reference/6.2/web/webflux/new-framework.html)

## 외부 응답을 기다릴 때 스레드는 무엇을 할까

외부 API 호출 시간에는 실제 계산보다 상대 서버의 응답을 기다리는 시간이 포함됩니다.

플랫폼 스레드로 blocking 호출을 수행하면, 기다리는 동안에도 해당 요청이 스레드를 점유합니다. 동시에 대기하는 요청이 많아지면 이를 받아줄 스레드도 필요합니다.

Virtual Threads는 이 대기를 다루는 방식을 바꿉니다.

지원되는 blocking I/O에서 가상 스레드가 대기하면, JVM은 실행 상태를 보관하고 이를 실행하던 플랫폼 스레드를 다른 작업에 사용할 수 있습니다. 응답이 도착하면 가상 스레드가 다시 실행되어 다음 코드로 진행합니다.

```text
플랫폼 스레드 기반
  요청 처리 → 외부 응답 대기 → 처리 재개
              └ 스레드 점유

가상 스레드 기반
  요청 처리 → 외부 응답 대기 → 처리 재개
              └ 플랫폼 스레드는 다른 작업에 사용 가능
```

따라서 개발자는 순차적인 코드를 유지하면서도, I/O 대기 때문에 플랫폼 스레드가 묶이는 부담을 줄일 수 있습니다. 다만 모든 blocking 동작에서 동일하게 스레드가 해제되는 것은 아니며, 네이티브 호출 등 사용하는 라이브러리의 특성도 영향을 줍니다.

**가상 스레드는 코드를 더 빠르게 실행하는 스레드가 아닙니다.** 주로 대기가 많은 동시 작업을 더 가볍게 처리하기 위한 실행 방식입니다. [Oracle Java 25 Virtual Threads 설명](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html)

## WebFlux와는 접근 방식이 다르다

WebFlux는 적은 수의 이벤트 루프 스레드로 요청을 처리하고, 비동기·논블로킹 방식으로 작업을 연결합니다. 이점을 살리려면 함께 사용하는 라이브러리와 데이터 접근 방식도 고려해야 합니다.

MVC와 Virtual Threads는 blocking 코드를 유지하면서 스레드 대기의 비용을 줄이는 접근입니다.

| 항목 | Spring MVC + Virtual Threads | Spring WebFlux |
|---|---|---|
| 업무 표현 | 일반 메서드 호출과 순차 코드 | `Mono`·`Flux` 등을 통한 작업 연결 |
| 외부 호출 예 | RestClient | WebClient |
| 데이터 접근 예 | JPA·JDBC | R2DBC 등 논블로킹 접근 |
| 대기 처리 | 가상 스레드가 대기하고 플랫폼 스레드를 다른 작업에 활용 | 완료 신호에 따라 후속 처리 |
| 이번 프로젝트와의 관계 | 기존 구현과 처리 방식을 유지하기 좋음 | blocking 의존성과 실행 경계를 추가로 고려해야 함 |

이 표는 두 기술을 배타적으로 구분하는 것은 아닙니다. MVC에서도 WebClient를 사용할 수 있습니다. 이번 선택에서는 이미 사용 중인 JPA·RestClient와 업무 코드를 함께 고려했습니다.

## 적용 설정

Spring Boot에서는 다음 설정으로 Virtual Threads를 활성화했습니다.

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

지원되는 MVC·Tomcat 구성에서는 요청 처리에 가상 스레드를 사용할 수 있습니다.

다만 이 옵션이 직접 만든 모든 Executor까지 바꿔주는 것은 아닙니다. 별도로 생성한 스레드 풀은 해당 설정과 용도를 따로 확인해야 합니다.

Netflix DGS 공식 문서도 Spring MVC·Tomcat에서 이 옵션을 사용하는 구성을 설명합니다. DGS 데이터 조회의 가상 스레드 설정과 Spring의 요청 처리 설정은 별개라는 점도 구분하고 있습니다. [Netflix DGS Virtual Threads 문서](https://netflix.github.io/dgs/advanced/virtual-threads/)

## 스레드가 가벼워져도 연결 수는 관리해야 한다

가상 스레드를 많이 만들 수 있다고 해서 외부 서버와 DB가 더 많은 요청을 처리할 수 있는 것은 아닙니다.

| 관리 대상 | 필요한 이유 |
|---|---|
| DB 연결 풀 | 실제 DB 연결 수와 처리 용량은 제한되어 있음 |
| 외부 API 동시 호출 | 상대 서버의 처리 용량과 호출 제한을 지켜야 함 |
| 타임아웃 | 지연된 호출이 오래 남아 있는 것을 방지 |
| 재시도 | 장애 중 호출이 반복해서 늘어나는 상황을 제어 |
| 대기 요청 | 대기 중에도 DTO·버퍼 등 메모리는 유지됨 |

특히 Partner Gateway는 다른 서비스와 같은 장비에서 실행됩니다. 대기 요청을 가볍게 처리하는 것과, 요청을 제한 없이 받아들이는 것은 다른 문제입니다.

현재 예상 요청량이 크지 않으므로 Virtual Threads를 대규모 처리량 확보의 근거로 삼지는 않았습니다. **기존 blocking 코드를 단순하게 유지하면서 외부 응답 대기를 다루는 수단**으로 활용합니다.

## 이번 선택에서 중요했던 것

이번 프로젝트에서는 JPA·RestClient 기반의 익숙한 코드를 유지하고 싶었습니다. 인증, 외부 호출, 데이터 변환과 예외 처리를 일반적인 메서드 흐름으로 읽을 수 있어야 했습니다.

Spring MVC는 그 구조를 유지하게 해주고, Virtual Threads는 I/O 대기 중 플랫폼 스레드 점유 부담을 줄여줍니다.

새로운 실행 모델을 적용하더라도 업무 코드의 가독성과 운영상의 제어는 유지하는 것. 이것이 이번 서버에서 MVC와 Virtual Threads를 함께 선택한 이유입니다.
