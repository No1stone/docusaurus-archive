---
id: advice-messages-and-i18n
title: Advice — messages와 i18n
description: "오류 코드를 MessageSource 키로 두고 사용자 문구를 분리합니다. 검증·업무 예외가 같은 메시지 체계를 쓰는지 연결합니다."
tags:
  - backend
  - api
  - i18n
  - messages
status: active
slug: "/knowledge/backend/controller/advice-messages-and-i18n"
---
# Spring MessageSource로 오류 코드와 사용자 문구를 연결하기

같은 예약 충돌이 관리자 화면과 외부 API에서 발생할 수 있습니다.<br />
두 곳이 동일한 오류를 처리하더라도, 한국어 문구와 영어 문구는 다를 수 있습니다.

오류 코드는 호출부가 분기하는 값으로 유지하고, 표시할 문구는 메시지 키와 로케일로 찾습니다.<br />
이렇게 나눠 두면 문구를 바꿀 때마다 클라이언트의 분기 조건을 바꿀 필요가 줄어듭니다.

## 업무 코드와 메시지 키의 역할

처음에는 `throw new BizErrorException("주문을 찾을 수 없습니다")`가 편합니다.<br />
같은 문장이 세 곳에 생기고, 영문 API를 요구받으면 코드를 다시 열게 됩니다.<br />
`@NotNull` 기본 메시지는 또 다른 파일(또는 영어 기본값)에 있습니다.

MessageSource에 키를 두면 Advice, 검증 handler, 업무 코드가 **같은 번들**을 봅니다.<br />
운영은 키만 보고 문구를 고칠 수 있고, 로케일 파일을 추가하면 같은 키로 다른 언어를 낼 수 있습니다.

Auth0 등 공개 글에서도 `@ControllerAdvice`에 `MessageSource`를 주입하고, 예외 코드와 `Locale`로 `getMessage` 하는 패턴이 반복됩니다.<br />
Spring 공식 문서의 `ErrorResponse` / `ProblemDetail` 경로도 type·title·detail을 MessageSource 코드로 풀도록 설계되어 있습니다.<br />
이 아카이브 기본 전제는 `CommonResponse` 엔벨로프이지만, **키로 문구를 푸는 축**은 같습니다.

---

## 부트 설정과 basename

개념적인 설정입니다.<br />
basename과 인코딩은 호스트에 맞춥니다.

```yaml
spring:
  messages:
    basename: messages/messages
    encoding: UTF-8
    fallback-to-system-locale: false
```

`fallback-to-system-locale`을 끄지 않으면 서버 OS 로케일에 끌려가, CI와 로컬·운영에서 키가 다르게 풀릴 수 있습니다.<br />
기본 로케일을 문서에 한 줄로라도 적어 두는 것이 안전합니다.

```properties
# messages/messages.properties (개념 예시)
error.unknown=요청을 처리하지 못했습니다.
error.invalid.parameter=입력값이 올바르지 않습니다.
error.object.locked=다른 변경과 충돌했습니다. 최신 내용을 다시 불러온 뒤 시도해 주세요.
exception.AuthenticationException=인증이 필요합니다.
warning.duplicate=이미 등록된 값입니다.
NotNull.exampleItemReq.create.url=URL은 필수입니다.
Size.exampleItemReq.filter.ids=조회할 아이디 개수가 너무 많습니다.
```

Bean Validation 어노테이션에 `{email.notempty}`처럼 중괄호 플레이스홀더를 쓰면, Validator가 MessageSource를 보도록 `LocalValidatorFactoryBean#setValidationMessageSource`를 연결하는 구성이 흔합니다.<br />
Boot가 기본 `messageSource` 빈을 쓰게 할 수도 있고, basename을 검증용으로 따로 둘 수도 있습니다.<br />
중요한 것은 **업무 키와 검증 키가 어느 파일에 있는지**를 팀이 한곳에 적어 두는 일입니다.

---

## 유틸이 있으면 키가 안정된다

실무에서는 MessageSource를 컨트롤러·서비스마다 주입하기보다, 얇은 유틸로 감싸는 경우가 많습니다.

응답 코드 인터페이스의 `getCode()`로 메시지를 찾거나, 예외 클래스 단순명으로 `exception.클래스명` 키를 찾는 식입니다.<br />
상위 타입으로 올라가며 키를 찾는 폴백을 두면, 모든 하위 예외에 프로퍼티를 복제하지 않아도 됩니다.

```java
// 개념: 응답 코드 → 메시지
String text = messageSource.getMessage(
    responseType.getCode(),
    args,
    LocaleContextHolder.getLocale());

// 개념: 예외 클래스명 → exception.SimpleName, 없으면 부모로
String key = "exception." + exceptionClass.getSimpleName();
```

MessageSource가 아직 기동 전이면 키를 그대로 노출하기보다, 초기화 실패를 드러내는 문장이 디버깅에 도움이 됩니다.<br />
빈 문자열 fallback만 쓰면 “메시지가 비어 있는 성공”처럼 보일 수 있습니다.

핸들러에서 `Locale`을 메서드 인자로 받을 수도 있고, `LocaleContextHolder`를 쓸 수도 있습니다.<br />
요청 스레드에서는 보통 같습니다.<br />
`@Async`로 떠난 스레드에서는 Locale·MDC가 비어 있을 수 있습니다.<br />
그 경계는 [인접 경계](/docs/knowledge/backend/controller/advice-adjacent-boundaries)에 둡니다.

---

## FieldError를 그대로 넘기기

검증 실패의 `FieldError` / `ObjectError`는 `MessageSourceResolvable`입니다.<br />
직접 코드 문자열만 꺼내기보다 `messageSource.getMessage(error, locale)`에 넘기면, Spring이 등록해 둔 **코드 후보 목록**을 순서대로 시도합니다.

`DefaultMessageCodesResolver`는 예를 들어 `rejectValue("age", "too.darn.old")`일 때 `too.darn.old`뿐 아니라 `too.darn.old.age`, `too.darn.old.age.int` 같은 키도 등록합니다.<br />
필드·타입까지 세분화한 문구를 두고 싶을 때 이 규칙을 알아 두면, properties에 무엇을 써야 하는지 감이 옵니다.

Advice 검증 handler에서 흔히 쓰는 흐름입니다.

1. `BindingResult`에서 필드 오류 목록을 읽는다
2. 각 `ObjectError`를 MessageSource로 푼다
3. 공통 업무 코드(`INVALID_PARAMETER` 등)와 함께 field·rejected value를 data에 싣는다

클라이언트가 필드 단위로 빨간 테두리를 그리려면 data 모양이 FE 계약과 같아야 합니다.<br />
문장만 배열로 주고 필드명을 빼면 화면이 다시 추측합니다.

---

## 작성 단위: 필드별 vs 코드식 (열림)

| 방식 | 잘 맞는 경우 | 조심할 점 |
|------|--------------|-----------|
| DTO·검증 레벨 키 (`NotNull.타입.필드`) | 폼·필드 안내가 많고 화면 카피와 맞출 때 | 키 폭발, 리팩터 시 클래스명 변경 |
| 이넘·응답 코드식 (`ORDER_NOT_FOUND`) | API 계약이 업무 코드 중심일 때 | 필드 단위 문장이 약해질 수 있음 |
| 혼합 | 공통 오류는 코드, 필드는 Bean Validation 키 | 팀 합의 없이 섞이면 찾기 어려움 |

이 아카이브는 한 가지를 강제하지 않습니다.<br />
호스트가 고르면 됩니다.<br />
다만 **한 API 표면 안에서는** 규칙을 섞어 쓰지 않는 편이 좋습니다.

필드 키를 고르면 리네이밍 때 properties도 같이 고쳐야 합니다.<br />
코드식을 고르면 OpenAPI·클라이언트 이넘과 맞추기 쉽지만, “어느 필드가 틀렸는지”는 data에 따로 실어야 합니다.

---

## 로케일과 국제화

`messages_ko.properties`, `messages_en.properties`로 나눌 수 있습니다.<br />
API를 단일 언어로만 쓸지, `Accept-Language`를 볼지는 제품 결정입니다.

단일 언어 API라도 basename과 UTF-8, fallback 끄기는 가치가 있습니다.<br />
나중에 로케일 파일을 추가할 때 코드 경로를 바꾸지 않아도 됩니다.

다국어를 켤 때는 다음을 문서에 남깁니다.

- 기본 Locale (예: `ko` 고정 vs 요청 헤더)
- 없는 키일 때 동작 (예외 vs 키 문자열 vs 기본 문구)
- 검증 메시지와 업무 메시지가 같은 basename인지

존재하지 않는 사용자와 틀린 비밀번호를 같은 문구로 가리는 보안 관례는 i18n과 별개로, **어느 키를 쓸지**의 문제입니다.<br />
인증 문구를 `exception.AuthenticationException` 한 키로 묶는 팀이 많습니다.

---

## 모놀리식과 모노리포에서의 소유 (열림)

한 배포 단위 모놀리식에서는 messages와 Advice와 예외 타입이 같은 앱에 있어도 큰 마찰이 없습니다.

api / model을 나눈 모노리포에서는 질문이 생깁니다.

- model이 업무 예외를 throw 하는데 MessageSource는 api에만 있어도 되는가
- 메시지 번들은 공유 모듈인가, api 소유인가
- 키를 바꾸면 여러 실행 파일이 동시에 배포돼야 하는가

여기서 한 가지를 아카이브 정답으로 고정하지는 않습니다.<br />
팀이 고른 소유를 README나 짧은 ADR에 남겨 두면, 나중에 “관례인 줄 알았는데 모듈마다 달랐다”를 줄일 수 있습니다.<br />
실무에서 흔한 타협은 **키와 예외 타입은 공유 모듈**, **MessageSource 빈과 Advice는 api(웹) 모듈**에 두는 것입니다.<br />
model은 코드만 알고 문장을 모릅니다.

---

## 함정 모음

- 키를 예외 메시지에 넣고 Advice에서 그대로 클라이언트에 노출하면, 키가 빠진 환경에서 내부 식별자가 밖으로 나갑니다.
  운영 프로필에서는 고정 문구, 로컬·dev만 상세를 쓰는 편이 낫습니다.
- `getMessage(code, null, code, locale)`처럼 기본값을 코드로 두면, 빠진 키가 “성공한 것처럼” 코드 문자열만 내려갑니다.
  모니터링에 키 미해결을 남길지 정합니다.
- 같은 의미의 문구를 `error.*`와 `exception.*`에 중복해 두면 한쪽만 고치게 됩니다.
  폴백 규칙을 문서화합니다.
- 검증용 MessageSource와 업무용 MessageSource를 나눈 뒤 basename만 맞추고 Validator 연결을 빼먹으면, 어노테이션 `message`가 기본 영어로 남습니다.

---

## 오류 코드 하나를 한국어와 영어로 내려보기

예약 충돌을 표시하는 API의 업무 코드가 `reservation_conflict`라고 가정합니다.<br />
클라이언트는 이 값으로 화면을 분기하고, 메시지 번들은 선택된 언어로 안내를 제공합니다.

```properties title="messages.properties"
reservation.conflict=이미 예약된 차량입니다.
```

```properties title="messages_en.properties"
reservation.conflict=This vehicle already has a reservation.
```

기본 번들은 언어별 파일을 고를 때 출발점이 됩니다.<br />
API 테스트에서는 같은 요청으로 `Accept-Language: ko`와 `Accept-Language: en`을 보낸 뒤 HTTP 상태와 업무 코드는 같은지, 메시지만 달라지는지 확인합니다.<br />
지원하지 않는 언어를 받았을 때 어떤 문구를 보여줄지도 테스트에 포함하면 환경의 시스템 로케일에 의존하는지 찾기 쉽습니다.

## 관련

- [Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages) (허브)
- [예외 전파와 try/catch](/docs/knowledge/backend/controller/advice-exception-propagation)
- [검증](/docs/knowledge/backend/controller/advice-validation)
- [support (CommonResponse, BizErrorException)](/docs/harness/templates/backend/spring/support/)

## 참고 자료

- [Spring Boot 국제화와 메시지 번들 설정](https://docs.spring.io/spring-boot/reference/features/internationalization.html)
