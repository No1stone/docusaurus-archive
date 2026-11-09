---
id: advice-validation
title: Advice — 검증 (Bean Validation과 Spring)
description: Jakarta Bean Validation과 Spring 실행 경로, MethodArgumentNotValidException과 HandlerMethodValidationException, 메시지 키 튜닝을 정리합니다. 하네스 필독이 아닙니다.
tags:
  - backend
  - api
  - validation
status: active
slug: "/knowledge/backend/controller/advice-validation"
---

# Spring MVC 입력 검증, 실패한 필드는 어떻게 응답에 담길까

예약 등록에서 차량번호를 비우면 본문 DTO 검증에서 실패합니다.<br />
반면 목록 조회에서 페이지 크기에 제한을 걸면, Controller 메서드의 인자 검증에서 실패할 수 있습니다.

두 경우 모두 입력 오류지만 MVC에서 발생시키는 예외가 다를 수 있습니다.<br />
Advice에서는 어떤 예외가 발생했는지 확인하고, 호출부가 입력을 수정할 수 있도록 필드와 오류 정보를 공통 응답으로 조립합니다.

## 제약조건과 Spring MVC 검증의 역할

현장에서 자주 나오는 질문입니다.<br />
역할을 나누면 덜 헷갈립니다.

**Jakarta Bean Validation**(구 `javax.validation`)은 `@NotNull`, `@Size`, 커스텀 `@Constraint`처럼 **제약 선언**의 표준 API입니다.<br />
구현체로는 Hibernate Validator가 흔합니다.

**Spring**은 `@Valid` / `@Validated`로 그 제약을 **실행**하고, 실패 시 MVC 예외를 만듭니다.<br />
또한 오래전부터 `org.springframework.validation.Validator` 인터페이스와 `Errors` / `BindingResult`를 제공합니다.<br />
`LocalValidatorFactoryBean`은 Jakarta Validator와 Spring Validator **양쪽**에 맞춰 주는 어댑터입니다.<br />
서비스에 `jakarta.validation.Validator`를 주입해 수동 검증할 수도 있고, Spring `Validator`로 `Errors`에 쌓을 수도 있습니다.

Spring Boot 3 줄기는 `jakarta.validation` 패키지입니다.<br />
구 프로젝트는 `javax.validation`입니다.<br />
임포트와 의존이 갈리므로 호스트 버전을 따릅니다.

정리하면 “셋이 같다”가 아닙니다.

| 이름 | 역할 |
|------|------|
| Bean Validation 어노테이션 | 제약 선언 |
| Hibernate Validator 등 | 제약 실행 엔진 |
| Spring MVC `@Valid` | 웹 인자 바인딩 직후 실행·예외 승격 |
| Spring `Validator` | `Errors`에 오류를 쌓는 프로그래밍 모델 (폼·커스텀) |

---

## MVC에서 실패가 나는 두 갈래

Spring Framework 문서(Validation)는 대략 다음을 구분합니다.

1. **객체 단위 검증**  
   `@RequestBody` / `@ModelAttribute` / `@RequestPart`에 `@Valid`(또는 `@Validated`)를 달고, 바로 뒤에 `Errors`/`BindingResult`가 없으면 `MethodArgumentNotValidException`이 납니다.<br />
   단일 커맨드 객체에 대한 오랜 경로입니다.

2. **메서드 검증**  
   `@Min`, `@NotBlank` 같은 **제약 어노테이션을 컨트롤러 파라미터에 직접** 달면 메서드 검증이 켜지고, `HandlerMethodValidationException`이 납니다.<br />
   Spring 6.1 전후부터 문서에 강조된 경로입니다.<br />
   `@Valid`만 있는 `@RequestBody`는 여전히 1번일 수 있습니다.<br />
   GitHub 이슈에서도 “둘 다 처리하라”가 공식 답에 가깝습니다.

Advice에서는 두 예외를 **거의 같은 코드**로 다루는 편이 좋습니다.<br />
차이는 “오류가 한 BindingResult인가, 파라미터별 결과 목록인가”입니다.<br />
필드·메시지·거절 값을 뽑아 엔벨로프 data에 싣는 방식은 맞출 수 있습니다.

`@Valid`는 그 자체로 제약이 아니라 **중첩 제약을 타게 하는** 표시입니다.<br />
자식 DTO·리스트 요소에 `@Valid`를 빼먹으면 부모만 통과하고 자식 제약이 침묵합니다.<br />
반대로 `@NotNull`을 `@Valid` 파라미터에 추가하면 메서드 검증 쪽으로 기울 수 있습니다.<br />
null 여부는 `@RequestBody(required = …)`로도 조절합니다.

---

## 그룹과 생성·수정

생성과 수정에 다른 제약이 필요하면 Bean Validation **그룹**을 씁니다.<br />
`@Validated(Create.class)`처럼 컨트롤러(또는 타입)에 그룹을 명시합니다.<br />
그룹 없이 모든 제약을 한 클래스에 몰아넣으면, 부분 수정 API에서 불필요한 400이 납니다.

커스텀 `@Constraint`는 교차 필드(비밀번호 확인, 기간 시작·끝)에 잘 맞습니다.<br />
메시지 키를 `{order.period.invalid}`처럼 두고 MessageSource에 연결합니다.<br />
검증 로직 안에 리포지토리 조회를 넣는 것은 가능하지만, 유스케이스 규칙과 겹치면 책임이 흐려집니다.<br />
“형식이 맞는가”와 “업무상 존재하는가”를 나누는 편이 테스트하기 쉽습니다.

목록 size 상한은 [PageQuery](/docs/harness/templates/backend/spring/support/)로 막고, 필드 제약은 Bean Validation으로 막는 **이중 안전장치**가 원셋에 가깝습니다.<br />
한쪽만 믿으면 다른 입구(배치, 내부 호출)에서 구멍이 납니다.

---

## Advice에서 검증 응답 만들기

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public CommonResponse<?> handleValid(MethodArgumentNotValidException e, Locale locale) {
    log.warn(e.getMessage());
    BindingResult bindingResult = e.getBindingResult();
    List<FieldViolation> violations = new ArrayList<>();
    for (FieldError error : bindingResult.getFieldErrors()) {
        String resolved = messageSource.getMessage(error, locale);
        violations.add(new FieldViolation(error.getField(), resolved, error.getRejectedValue()));
    }
    return CommonResponse.of(ResponseType.INVALID_PARAMETER, violations);
}
```

`FieldError`는 `MessageSourceResolvable`이므로 코드 문자열을 손으로 고르지 않아도 됩니다.
[messages와 i18n](/docs/knowledge/backend/controller/advice-messages-and-i18n)에 코드 후보 목록(`DefaultMessageCodesResolver`)을 적어 두었습니다.

공개 글 중에는 필드명·거절 값을 문장에 끼워 넣는 예도 있습니다.<br />
보안상 비밀번호 같은 rejected value는 data에 실을지 한 번 더 생각합니다.<br />
로그에는 남기되 응답에는 마스킹하는 팀이 있습니다.

`HandlerMethodValidationException`도 파라미터별 결과를 순회해 같은 `FieldViolation` 목록으로 정규화하면, FE는 예외 타입을 몰라도 됩니다.

---

## Spring Validator를 언제 더 쓰나

Bean Validation만으로 부족한 **요청 조합 규칙**(서로 다른 쿼리 파라미터의 XOR, 조건부 필수)은 Spring `Validator`나 `@InitBinder`에 붙이는 커스텀 Validator가 잘 맞습니다.<br />
전역으로 WebMvc 설정에 등록할 수도 있고, 컨트롤러 로컬 `@InitBinder`로만 쓸 수도 있습니다.

서비스 계층에서 `validator.validateObject(obj).failOnError(...)`처럼 쓰는 경로(Framework 6.1+)도 있습니다.<br />
웹 밖 입구(메시징 리스너, 배치)에서 같은 DTO를 검증할 때 의미가 있습니다.<br />
다만 실패를 Advice로 보내려면 결국 예외로 승격해야 합니다.<br />
리스너·배치는 MVC Advice 밖입니다.

메서드 검증을 서비스 빈에 쓰려면 `@Validated`와 `MethodValidationPostProcessor`가 필요합니다.<br />
기본은 `ConstraintViolationException`이고, `adaptConstraintViolations`를 켜면 Spring 쪽 `MethodValidationException`으로 맞출 수 있습니다.<br />
웹 Advice와 키·엔벨로프를 공유하려면 후자가 다루기 쉽습니다.

---

## 함정 모음

- 중첩 `@Valid` 누락 → 자식 제약이 조용히 통과
- 그룹 미사용 → 수정 API가 생성 제약에 막힘
- Validator에 MessageSource 미연결 → 영어 기본 메시지
- `BindingResult`를 메서드 시그니처에 두면 예외 대신 컨트롤러가 호출됨 → 컨트롤러가 직접 분기하게 되어 Advice 경로와 갈라짐
- 파라미터 제약만 추가하고 `HandlerMethodValidationException` handler를 안 둠 → 500 미분류로 떨어짐
- PageQuery 상한과 `@Size` 상한이 다름 → 클라이언트 혼란

---

## 테스트

| 보고 싶은 것 | 예 |
|--------------|-----|
| 잘못된 body → 400 + 필드 메시지 | `@WebMvcTest`에 한 건 |
| 중첩 DTO 실패 | 자식 필드만 깨뜨린 JSON |
| 메서드 파라미터 제약 | `@Min` 등으로 `HandlerMethodValidationException` 경로 |
| 메시지 키 | Locale을 고정한 슬라이스에서 한국어 문구 단언 |

미실행 테스트를 통과로 적지 않습니다.

---

## 관련

- [Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages) (허브)
- [messages와 i18n](/docs/knowledge/backend/controller/advice-messages-and-i18n)
- [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope)
- [PageQuery / support](/docs/harness/templates/backend/spring/support/)

## 참고 자료

- [Spring MVC 입력과 메서드 검증](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)
