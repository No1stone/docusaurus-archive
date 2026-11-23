---
format: "md"
id: "spring-spring-web-validation-and-exceptions"
title: "입력 검증과 예외 처리"
description: "입력 검증과 업무 실패를 구분하고 RestControllerAdvice와 ProblemDetail로 일관된 응답을 만드는 방법을 설명합니다."
slug: "/knowledge/backend/spring/spring-web/validation-and-exceptions"
sidebar_position: 4
status: "active"
tags:
  - "Spring"
keywords:
  - "입력 검증과 예외 처리"
  - "Spring"
  - "Spring MVC"
  - "Controller"
  - "WebFlux"
  - "Interceptor"
  - "Validation"
  - "Virtual Threads"
---
# 입력 검증과 예외 처리

잘못된 요청과 업무상 거절은 모두 실패 응답일 수 있지만 발생 지점은 다릅니다.
본문이 JSON이 아니거나 필수값이 없는 문제와, 이미 완료된 작업을 다시 요청한 문제를 구분하면 오류 코드와 테스트가 명확해집니다.

## 입력 제약과 업무 정책

```java
record CreateRequest(@NotBlank @Size(max = 100) String name) { }

@PostMapping
void create(@Valid @RequestBody CreateRequest request) {
    service.create(request.name());
}
```

검증 구현이 포함된 환경을 가정합니다.
`@Valid`는 객체의 제약을 확인하고, 중복 이름이나 상태 전이 가능 여부는 업무 계층에서 판단합니다.
DB의 동시성 제약을 요청 검증만으로 대신할 수는 없습니다.

| 실패 | 대표 발생 지점 | 응답에서 설명할 것 |
|---|---|---|
| JSON 해석 실패 | 메시지 변환 | 요청 형식 오류 |
| 필드 제약 위반 | Bean Validation | 필드와 제약 |
| 메서드 인수 제약 | MVC 메서드 검증 | 인수별 오류 |
| 업무 거절 | 유즈케이스 | 업무 코드와 처리 가능 여부 |
| 예기치 않은 장애 | 외부 호출 또는 구현 | 추적 ID와 일반 메시지 |

Framework 6.1 이후 MVC의 내장 메서드 검증에서는 선언 형태에 따라 `HandlerMethodValidationException`이 발생할 수 있습니다.
`MethodArgumentNotValidException` 하나만 처리해 모든 입력 실패가 덮였다고 보지 않습니다.
클래스 레벨의 `@Validated`로 적용하는 AOP 검증과도 구분합니다.

## 응답 변환을 한곳에 둡니다

```java
@RestControllerAdvice
class ApiAdvice {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> invalid(MethodArgumentNotValidException ex) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "요청 필드를 확인해 주세요.");
        detail.setTitle("Invalid request");
        return ResponseEntity.badRequest().body(detail);
    }
}
```

표준 오류 본문을 보여 주는 최소 예제이며 모든 예외를 처리하는 완성형 Advice는 아닙니다.
프로젝트가 공통 응답 엔벨롭을 사용한다면 그 계약에 맞춰 변환합니다.
예외마다 새 파일과 핸들러를 만들지, 공통 업무 예외와 코드 계약으로 확장할지는 공통 설계에서 결정합니다.

## 예외를 숨기지 않습니다

모든 예외를 200으로 감싸면 호출자가 성공과 실패를 구분하기 어려워집니다.
내부 스택과 SQL, 토큰을 응답에 넣는 것도 피합니다.
운영 로그에는 원인과 추적 정보를 남기고, 공개 메시지는 사용자에게 필요한 내용으로 제한합니다.
필터나 보안 체인에서 발생한 실패는 MVC Advice 밖일 수 있으므로 별도 진입 실패 처리도 검증합니다.

테스트에서는 정상, 필드 오류, 변환 오류, 업무 거절과 예상하지 못한 예외를 각각 확인합니다.
상태 코드뿐 아니라 본문 코드, 메시지와 민감 정보 미노출을 함께 봅니다.

예외 종류는 [MVC Validation](https://docs.spring.io/spring-framework/reference/6.2/web/webmvc/mvc-controller/ann-validation.html), 표준 본문은 [Error Responses](https://docs.spring.io/spring-framework/reference/6.2/web/webmvc/mvc-ann-rest-exceptions.html)를 참고합니다.

## 자주 묻는 질문

### MVC와 WebFlux는 같이 쓰나요?

보통 한 애플리케이션의 주 스택을 정합니다. 블로킹 JDBC와 WebFlux를 섞을 때는 스레드 모델을 따로 설계합니다.

### Interceptor와 Filter 차이는 무엇인가요?

Filter는 서블릿 단, Interceptor는 Spring MVC 핸들러 단에서 동작합니다.

