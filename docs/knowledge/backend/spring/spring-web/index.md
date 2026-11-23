---
format: "md"
id: "spring-spring-web-index"
title: "Web"
description: "Spring MVC, WebFlux, 컨트롤러, 검증, 아웃바운드 HTTP와 가상 스레드를 다루는 입구입니다."
slug: "/knowledge/backend/spring/spring-web"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "Web"
  - "Spring"
  - "Spring MVC"
  - "Controller"
  - "WebFlux"
  - "Interceptor"
  - "Validation"
  - "Virtual Threads"
---
# Web

HTTP 요청이 Controller와 업무 기능을 통과해 응답이 되는 과정을 다룹니다.
매핑과 입력 처리부터 외부 호출, MVC와 WebFlux 및 가상 스레드의 실행 모델까지 살펴봅니다.

## 읽는 순서

먼저 요청과 응답의 계약을 정하고 필터, 바인딩, 업무 판단의 책임을 나눕니다.
실행 모델은 사용하는 DB와 파일, 외부 클라이언트의 대기 방식까지 포함해 선택합니다.

| 글 | 다루는 내용 |
|---|---|
| [Spring MVC](./spring-mvc.md) | DispatcherServlet의 요청 위임 구조와 JSON 응답 처리, 동기 및 Servlet 비동기 요청의 차이를 설명합니다. |
| [Controller와 요청 매핑](./controller-and-mapping.md) | 요청 경로, HTTP 메서드와 미디어 타입 조건을 설계하고 DTO를 통해 입력과 응답 계약을 표현하는 방법을 설명합니다. |
| [요청 바인딩과 응답 변환](./binding-and-conversion.md) | 쿼리 문자열과 JSON 바인딩의 차이, Converter와 Formatter 및 과도한 필드 바인딩 방지를 설명합니다. |
| [입력 검증과 예외 처리](./validation-and-exceptions.md) | 입력 검증과 업무 실패를 구분하고 RestControllerAdvice와 ProblemDetail로 일관된 응답을 만드는 방법을 설명합니다. |
| [Filter와 Interceptor](./filter-and-interceptor.md) | Servlet Filter와 MVC Interceptor의 적용 경계, 예외 처리 위치 및 비동기 디스패치에서의 주의점을 설명합니다. |
| [외부 HTTP 호출](./outbound-http.md) | RestClient, WebClient와 HTTP Interface를 비교하고 타임아웃, 응답 오류와 재시도 정책의 경계를 설명합니다. |
| [Virtual Threads](./virtual-threads.md) | 가상 스레드를 사용하는 MVC의 대기 모델과 Java 버전, DB 풀 및 동시성 제한의 관계를 설명합니다. |
| [WebFlux](./webflux.md) | WebFlux의 논블로킹 실행과 Mono 및 Flux 조합을 설명하고 JDBC, 파일 I/O 및 트랜잭션의 경계를 비교합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### MVC와 WebFlux는 같이 쓰나요?

보통 한 애플리케이션의 주 스택을 정합니다. 블로킹 JDBC와 WebFlux를 섞을 때는 스레드 모델을 따로 설계합니다.

### Interceptor와 Filter 차이는 무엇인가요?

Filter는 서블릿 단, Interceptor는 Spring MVC 핸들러 단에서 동작합니다.

