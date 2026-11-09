---
id: controller-advice-and-messages
title: Controller Advice와 메시지
description: RestControllerAdvice로 예외를 HTTP·공통 응답으로 모으고, MessageSource·검증·상태 코드·필터·비동기와의 경계를 정리합니다. 하네스 필독이 아닙니다.
tags:
  - backend
  - api
  - exception
  - validation
status: active
slug: "/knowledge/backend/controller/controller-advice-and-messages"
---

# Controller Advice와 메시지

> **개요:** HTTP 경계에서 예외를 한곳으로 모아 상태 코드와 공통 응답 엔벨로프로 바꾸는 방법을 적습니다.
> Controller 설계 본편([Controller Design](/docs/knowledge/backend/controller/controller-design))이 “예외는 Advice”라고만 한 줄을 여기서 풀어 씁니다.
> **하네스 필수 읽기나 원셋 복사 경로에는 넣지 않습니다.**
> 필요할 때 Knowledge와 자산 맵(`index/backend.md`)에서만 찾아 읽으면 됩니다.

아래 스케치는 이미 돌아가 본 서비스의 `@RestControllerAdvice`, MessageSource 유틸, 검증·낙관적 락·원격 호출 실패 처리를 보고 익명화한 것입니다.
제품 패키지명과 회사명은 쓰지 않습니다.
호스트에 같은 역할의 클래스·응답 타입이 있으면 그 이름을 따르면 됩니다.

---

## 왜 이 글이 필요한가

Controller를 얇게 두는 규칙은 잘 지켜도, 예외 순간만 되면 엔드포인트마다 `try/catch`가 생기기 쉽습니다.
어떤 API는 문자열만 반환하고, 어떤 API는 상태 코드만 바꾸고, 어떤 API는 로그를 삼킵니다.
클라이언트가 파서를 여러 개 두게 되고, 운영은 “이 오류 코드가 어디 정의인지”를 코드 전체에서 찾게 됩니다.

한곳의 Advice와 messages 번들로 모으면, 성공 경로의 `CommonResponse`와 실패 경로의 모양이 같아집니다.
사람은 메시지 키를 고치고, 유스케이스는 업무 예외만 던지면 됩니다.

이 글은 그 모음의 **개념·경계·함정**을 적습니다.
라우팅과 DTO 바인딩 본편은 [Controller Design](/docs/knowledge/backend/controller/controller-design)에 둡니다.
알림을 outbox에 넣을지 말지는 [ADR-0012](/docs/decisions/adr-0012)입니다.
트레이스 헤더 설정은 [W3C 트레이스](/docs/patterns/architecture-patterns/trace-propagation-w3c)와 [ADR-0014](/docs/decisions/adr-0014)를 봅니다.

---

## 큰 그림

Facade(또는 유스케이스 진입)가 업무 예외를 던지면 Controller는 잡지 않습니다.
전역 `@RestControllerAdvice`가 예외 타입을 보고 HTTP status와 공통 엔벨로프를 만듭니다.
사람이 읽는 문장은 가능하면 **messages**에서 코드로 꺼냅니다.

```text
HTTP 요청
  → Controller (바인딩만)
  → Facade / 유스케이스
        │ throw 업무 예외 (Runtime)
        ▼
  @RestControllerAdvice
        │ MessageSource로 문구
        ▼
  HTTP status + CommonResponse(code, message, data)
```

성공일 때도 같은 엔벨로프를 씁니다.
실패일 때만 다른 JSON 루트를 쓰면 FE와 모바일·BFF가 갈라집니다.

---

## Advice가 맡는 일

Advice는 “예외를 JSON으로 바꾸는 어댑터”입니다.
도메인 규칙을 새로 만들지 않습니다.

| 책임 | 실제로 하는 일 |
|------|----------------|
| 타입별 handler | `@ExceptionHandler`로 업무·검증·보안·인프라 예외를 나눔 |
| HTTP status | `@ResponseStatus`로 고정하거나, 예외에 실린 status를 `HttpServletResponse`에 반영 |
| 엔벨로프 | 성공과 같은 `code` / `message` / `data` 골격 |
| 로그 수준 | 진짜 장애는 error, 예상 가능한 거절은 warn |
| 문구 | MessageSource(또는 얇은 유틸)로 키 → 문장, 인자 치환 |

Controller 안에 비즈니스 `catch`를 두면 그 순간부터 엔드포인트마다 정책이 달라집니다.
리뷰에서 자주 보이는 패턴이 “이 메서드만 예외를 삼키고 200을 반환”입니다.
트랜잭션은 롤백됐는데 클라이언트는 성공으로 읽는 사고가 그렇게 납니다.

---

## messages: 문구를 코드에서 떼어 내기

### 왜 예외 생성자 문자열만으로 부족한가

처음에는 `throw new BizErrorException("주문을 찾을 수 없습니다")`가 편합니다.
곧이어 같은 문구가 세 곳에 생기고, 영문 API를 요구받으면 코드를 다시 열게 됩니다.
검증 메시지(`@NotNull`)는 또 다른 파일에 있습니다.

MessageSource에 키를 두면 Advice·검증·업무 코드가 **같은 번들**을 봅니다.
운영은 키만 보고 문구를 고칠 수 있습니다.

개념적인 부트 설정입니다.
basename과 인코딩은 호스트에 맞춥니다.

```yaml
spring:
  messages:
    basename: messages/messages
    encoding: UTF-8
    fallback-to-system-locale: false
```

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

### 유틸이 있으면 키가 안정된다

실무에서는 MessageSource를 직접 여기저기 주입하기보다, 얇은 유틸로 감싸는 경우가 많습니다.
응답 코드 인터페이스의 `getCode()`로 메시지를 찾거나, 예외 클래스 단순명으로 `exception.클래스명` 키를 찾는 식입니다.
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

MessageSource가 아직 기동 전이면 키를 그대로 노출하기보다, 초기화 실패를 드러내는 문장이 디버깅에 도움이 됩니다.
빈 문자열 fallback만 쓰면 “메시지가 비어 있는 성공”처럼 보일 수 있습니다.

### 작성 단위: 필드별 vs 코드식 (열림)

| 방식 | 잘 맞는 경우 | 조심할 점 |
|------|--------------|-----------|
| DTO·검증 레벨 키 (`NotNull.타입.필드`) | 폼·필드 안내가 많고 화면 카피와 맞출 때 | 키 폭발, 리팩터 시 클래스명 변경 |
| 이넘·응답 코드식 (`ORDER_NOT_FOUND`) | API 계약이 업무 코드 중심일 때 | 필드 단위 문장이 약해질 수 있음 |
| 혼합 | 공통 오류는 코드, 필드는 Bean Validation 키 | 팀 합의 없이 섞이면 찾기 어려움 |

이 아카이브는 한 가지를 강제하지 않습니다.
호스트가 고르면 됩니다.
다만 **한 API 표면 안에서는** 규칙을 섞어 쓰지 않는 편이 좋습니다.

### 로케일과 국제화

`messages_ko.properties`, `messages_en.properties`로 나눌 수 있습니다.
API를 단일 언어로만 쓸지, `Accept-Language`를 볼지는 제품 결정입니다.
`fallback-to-system-locale`을 끄지 않으면 서버 OS 로케일에 끌려가 키가 예상과 다르게 풀릴 수 있습니다.
기본 로케일을 문서에 한 줄로라도 적어 두는 것이 안전합니다.

---

## 예외를 층으로 나누는 이유

모든 실패를 `Exception` 하나로 받아 500을 주면, 클라이언트는 재시도할지 입력을 고칠지 모릅니다.
운영 로그도 error로만 가득 찹니다.

기존 서비스에서는 대략 다음처럼 나눕니다.
클래스 이름은 호스트에 맞게 바꿉니다.

| 층 | 로그 | 클라이언트에게 | 언제 |
|----|------|----------------|------|
| Error | error + 스택 | 업무 코드·메시지, 필요 시 data | 실패로 취급, 보통 TX 롤백 |
| Warn | warn | 업무 코드·메시지 | 잘못된 입력·상태 거절처럼 예상 가능 |
| Known | warn (코드 포함) | 업무 코드·메시지 | “알려진” 업무 결과로 남기고 싶을 때 |
| 미분류 | error | 운영에서는 고정 문구. 로컬·dev만 상세 | 마지막 안전망. 래핑된 업무 예외가 있으면 먼저 꺼냄 |

```java
// 유스케이스 개념
if (item == null) {
    throw new BizWarnException(ResponseType.NOT_FOUND_ITEM);
}
if (conflict) {
    throw new BizErrorException(ResponseType.CONFLICT_STATE);
}
```

원셋 support의 `BizErrorException`은 이 축의 최소 형태입니다.
Warn·Known을 호스트가 더 두면 Advice에 handler를 맞춰 추가하면 됩니다.

### Runtime으로 두는 전제

업무 예외는 Runtime 계열이 다루기 쉽습니다.
Checked를 Facade 시그니처에 올리면 호출부마다 선언이 번지고, Advice와도 결이 달라집니다.
트랜잭션 `rollbackFor`에 롤백해야 할 타입이 빠지지 않았는지만 확인하면 됩니다.
일부 레거시가 `rollbackFor = Exception.class`를 쓰면, Checked까지 롤백 대상이 되므로 Advice 매핑과 함께 알아 둡니다.

---

## 유스케이스에서 throw 할 때 놓치기 쉬운 것

“던지면 Advice가 한다”는 절반만 맞습니다.

**코드를 고를 책임**은 유스케이스에 있습니다.
Advice는 그 코드를 HTTP와 문장으로 바꿀 뿐입니다.
메시지 인자가 필요하면 예외 생성 시점에 넣거나, 응답 타입이 인자를 받게 합니다.

BFF가 여러 도메인을 부를 때 catch로 삼키거나, 전부 `UNKNOWN`으로 바꾸면 계약이 무너집니다.
화면용으로 바꿔야 하면 매핑 표를 명시하고, 그 외에는 도메인 예외를 그대로 올리는 편이 낫습니다.

트랜잭션 경계는 Facade에 있습니다.
이 예외에서 롤백되어야 하는데 read-only 트랜잭션만 열려 있거나, 반대로 롤백되면 안 되는 경고를 Error로 던지면 데이터가 어긋납니다.

---

## try, catch, finally를 어디에 둘까

Controller에서의 업무 catch는 거의 필요 없습니다.
[Controller Design](/docs/knowledge/backend/controller/controller-design)도 같은 말을 합니다.

Facade에서는 기본이 재던지기입니다.
여러 단계 중 앞 단계만 보상해야 할 때처럼, 범위가 분명할 때만 catch합니다.
catch 안에서 로그만 하고 정상 반환하면, 호출자는 성공으로 읽습니다.

`finally`와 try-with-resources는 **자원·MDC·ThreadLocal**을 닫을 때 씁니다.
응답 JSON을 finally에서 조립하지 않습니다.

```java
// 피하고 싶은 모양
try {
    facade.save(cmd);
} catch (Exception e) {
    log.error("failed", e);
    return CommonResponseUtils.responseSuccess();
}

// 원인을 남기고 업무 예외로 올리는 모양 (개념)
catch (DataAccessException e) {
    throw new BizErrorException(ResponseType.UNKNOWN, e);
}
```

래핑할 때는 반드시 cause를 붙입니다.
Advice가 “원인 체인에서 업무 예외 찾기”를 할 수 있게 하려는 것입니다.
실제로 최상위 handler에서 한두 단계 cause를 들여다보고 업무 Error로 위임하는 패턴이 있습니다.

---

## 검증: 선언은 Bean Validation, 실행은 Spring

현장에서 “스프링 밸리데이션이랑 자바 밸리데이션이랑 뭐가 다르냐”는 질문이 자주 나옵니다.
역할을 나누어 보면 덜 헷갈립니다.

**Jakarta Bean Validation**(구 `javax.validation`)은 `@NotNull`, `@Size`, 커스텀 `@Constraint`처럼 **제약 선언**의 표준입니다.
**Spring**은 `@Valid` / `@Validated`로 그 제약을 **실행**하고, 실패 시 `MethodArgumentNotValidException` 등으로 **MVC 예외**를 만듭니다.
Spring Boot 3 줄기는 `jakarta.validation` 패키지입니다.
구 프로젝트는 `javax.validation`입니다.
임포트와 의존이 갈리므로 호스트 버전을 따릅니다.

사용하면서 자주 튜닝하는 지점은 다음과 같습니다.

- 중첩 DTO·리스트 요소에 `@Valid`를 빼먹어 자식 제약이 침묵하는 경우
- 생성과 수정에 다른 제약이 필요한데 그룹을 안 나누는 경우
- 기본 메시지가 영어로 나가 messages 키를 안 맞춘 경우
- 목록 size 상한은 [PageQuery](/docs/harness/templates/backend/spring/support/)로 막고, 필드 제약은 Bean Validation으로 막는 이중 안전장치

Advice의 검증 handler는 마지막 필드 오류(또는 전체 목록)를 골라 messages로 풀고, `INVALID_PARAMETER` 같은 공통 코드와 함께 field·rejected value를 data에 실을 수 있습니다.
클라이언트가 필드 단위로 빨간 테두리를 그리려면 data 모양이 FE 계약과 같아야 합니다.

---

## HTTP 상태와 예외 종류

### 대역을 API 말로

| 대역 | 일반적인 뜻 | JSON API에서 |
|------|-------------|--------------|
| 2xx | 성공 | 처리 완료. 엔벨로프도 성공 코드 |
| 3xx | 다른 위치로 | REST JSON에서는 드묾. 쓰면 OpenAPI에 명시 |
| 4xx | 요청 쪽을 고치면 됨 | 검증, 인증, 권한, 없는 자원, 잘못된 조합 |
| 5xx | 서버·의존·미처리 | 버그, 타임아웃 누적, 디스크·업로드 한도 등 |

### 커스텀 status와 “전부 200”

Advice는 예외마다 status를 다르게 줄 수 있습니다.
예외에 HTTP status 필드를 두고 handler가 `response.setStatus(...)` 하는 방식도 흔합니다.

반대로 **HTTP는 항상 200**이고 body의 `code`만 나누는 팀도 있습니다.
파서는 단순해지고, 게이트웨이·알람이 HTTP 실패율만 보면 장애가 안 보입니다.
어느 쪽이건 FE·모니터링·클라이언트 재시도 정책과 맞춰 문서에 한 줄 적습니다.
이 아카이브 원셋은 `CommonResponse` 엔벨로프를 전제로 할 뿐, status 정책을 세계 표준처럼 단정하지 않습니다.

### handler를 나누어 두는 예

업무 Error / Warn / Known, 검증, 타입 불일치, 인증·인가, 없는 리소스, 업로드 한도, 낙관적 락, 원격 재시도 소진, 그 밖의 Exception.
각각 로그 수준과 status·코드가 달라서, 하나의 catch-all만 두면 운영이 눈을 가리게 됩니다.

인증·인가 문구는 예외 클래스명 키(`exception.AuthenticationException`)로 messages에 두기도 합니다.
존재하지 않는 사용자와 틀린 비밀번호를 같은 문구로 가리는 보안 관례와 맞출지는 보안 쪽 결정입니다.

---

## 낙관적 락

버전 컬럼이 있는 엔티티를 두 화면이 동시에 저장하면 `ObjectOptimisticLockingFailureException`이 납니다.
Advice에서 전용 코드와 “다시 불러온 뒤 수정하라”는 메시지를 주면, FE는 폼을 리로드할지 선택할 수 있습니다.
HTTP를 409로 줄지, 호스트가 5xx로 줄지는 계약 문제입니다.
중요한 것은 **성공 엔벨로프와 다른 코드로 구별**되는 것입니다.
낙관적 락을 도메인에 이미 쓰고 있다면 handler 없는 500 미분류로 떨어지게 두지 않습니다.

---

## Filter, Interceptor, Advice가 겹칠 때

로그인 실패는 Spring Security 필터에서 끝나 Advice에 오지 않을 수 있습니다.
필터가 직접 JSON을 쓰면, 그 모양이 `CommonResponse`와 다른지 먼저 봅니다.
Interceptor에서 예외를 던지는 설정이라면 Advice 도달 여부를 한 번 확인합니다.

권한·테넌트 규칙 자체는 이 글의 범위가 아닙니다.
다만 “실패 응답 모양”이 API 전체와 어긋나면 FE가 분기 지옥에 빠집니다.
필터 응답과 Advice 응답의 키 이름을 맞춰 두는 것이 최소 위생입니다.

---

## 비동기 스레드에서는 Advice가 안 보인다

요청을 처리하던 스레드에서 난 예외는 DispatcherServlet이 Advice로 보냅니다.
`@Async`로 떠난 작업에서 난 예외는 **그 요청의 Advice 경로에 들어오지 않습니다.**

여기에는 두 가지가 같이 옵니다.

1. `AsyncUncaughtExceptionHandler`(또는 호스트 동등)로 로그와 메트릭을 남길 것
2. MDC에 넣었던 traceId·사용자 정보가 스레드 로컬이라 새 스레드에 자동으로 안 붙는 것

비동기에서 예외를 삼키면 알림 best-effort와 비슷하게 “실패가 관측되지 않습니다.”
알림 전달 정책은 [ADR-0012](/docs/decisions/adr-0012)를 보고, 이 절은 **관측 구멍**만 지적합니다.

이 글의 기본 전제는 동기 Spring MVC입니다.
WebFlux의 `@ControllerAdvice`는 다른 실행 모델입니다.

---

## 나가는 RestClient·Feign과 로그 중앙화

클라이언트에 로깅 인터셉터, 재시도, 에러 디코더, 헤더 주입이 겹쌓이면 “어디에 커스텀을 넣어야 하는지”가 흐려집니다.
예외 타입도 라이브러리마다 달라 Advice에 바로 매핑하기 어렵습니다.

실무에서 도움이 됐던 방향은 다음입니다.

- 타임아웃과 **한 줄 outbound 로그**는 한 커스터마이저로 모은다 ([outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/))
- 재시도·타임아웃을 Istio와 겹쓰지 않는다 ([RestClient와 Istio](/docs/patterns/architecture-patterns/restclient-vs-istio-retries))
- 다운스트림 4xx/5xx는 가능하면 **우리 업무 예외로 바꿔 다시 throw** 하여 Advice가 최종 JSON을 만들게 한다

```java
// 개념
catch (HttpClientErrorException.NotFound e) {
    throw new BizWarnException(ResponseType.NOT_FOUND_REMOTE);
}
catch (ResourceAccessException e) {
    throw new BizErrorException(ResponseType.MICRO_SERVICE_CONNECTION_FAILED, e);
}
```

Feign의 `RetryableException`처럼 “재시도하다 실패한 연결”을 전용 코드로 두는 것도 같은 맥락입니다.

---

## 상관 ID를 오류에도 남기기

실패 로그에 traceId가 없으면 FE 스크린샷과 서버 로그를 못 잇습니다.
전파 설정은 [W3C 트레이스](/docs/patterns/architecture-patterns/trace-propagation-w3c)를 따릅니다.
로그 패턴에 MDC `traceId`를 넣는 것만으로도 운영이 편해집니다.
응답 body나 헤더에 traceId를 실을지는 보안·계약상 호스트가 정합니다.
Advice는 메시지를 만들 때 굳이 traceId를 문구에 넣지 않아도 되고, 로그와 지원 절차가 같은 ID를 보면 됩니다.

---

## 엔벨로프를 고른다는 것

원셋과 Controller Design은 `CommonResponse` 같은 **고정 키 엔벨로프**를 전제로 합니다.
RFC 7807 Problem Details는 `type`, `title`, `status`, `detail` 중심의 표준입니다.

| | 공통 엔벨로프 | Problem Details |
|--|---------------|-----------------|
| 파싱 | 모든 API 동일 키 | 표준 클라이언트·문서 도구와 친숙 |
| 업무 코드 | `code`로 확장하기 쉬움 | 확장 필드를 팀 규약으로 또 정해야 함 |
| 기존 FE | 이미 맞춰 둔 팀이 많음 | 마이그레이션 비용 |
| 관측 | HTTP status 정책과 세트로 설계 | status와 title 정합이 중요 |

둘을 섞어 어떤 API만 Problem Details로 가면 클라이언트가 분기합니다.
바꿀 때는 API 세대나 게이트웨이에서 한 면만 바꾸는지 계획하는 편이 낫습니다.

---

## 모놀리식과 모노리포 (열림)

한 배포 단위 모놀리식에서는 messages와 Advice와 예외 타입이 같은 앱에 있어도 큰 마찰이 없습니다.

api / model을 나눈 모노리포에서는 질문이 생깁니다.

- model이 업무 예외를 throw 하는데 MessageSource는 api에만 있어도 되는가
- 메시지 번들은 공유 모듈인가, api 소유인가
- 키를 바꾸면 여러 실행 파일이 동시에 배포돼야 하는가

여기서 한 가지를 아카이브 정답으로 고정하지는 않습니다.
팀이 고른 소유를 README나 짧은 ADR에 남겨 두면, 나중에 “관례인 줄 알았는데 모듈마다 달랐다”를 줄일 수 있습니다.

---

## 최소 골격 예시

가정은 Spring MVC, 공통 엔벨로프, Runtime 업무 예외, MessageSource입니다.
보안 전체와 WebFlux는 생략합니다.

```java
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class CommonExceptionAdvice {

    private final MessageSource messageSource;

    @ExceptionHandler(BizErrorException.class)
    public CommonResponse<?> handleBizError(BizErrorException e, HttpServletResponse response) {
        log.error(e.getMessage(), e);
        response.setStatus(resolveStatus(e)); // 호스트 정책
        return toEnvelope(e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<?> handleValid(MethodArgumentNotValidException e, Locale locale) {
        log.warn(e.getMessage());
        return validationEnvelope(e, locale, messageSource);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public CommonResponse<?> handleOptimistic(ObjectOptimisticLockingFailureException e) {
        log.warn(e.getMessage());
        return lockedEnvelope(messageSource, locale());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponse<?> handleAny(Exception e) {
        BizErrorException nested = findBizError(e); // 원인 체인 탐색
        if (nested != null) {
            return handleBizError(nested, /* response */ null);
        }
        log.error(e.getMessage(), e);
        return unknownEnvelope(isDev() ? e.getMessage() : null);
    }
}
```

원셋 `support`에 이 클래스를 올릴지는 선택입니다.
올려도 필독·필수 복사는 아닙니다.

---

## 테스트로 무엇을 보면 되나

Advice는 Facade처럼 비즈니스 분기가 많지 않습니다.
그래도 계약이 깨지면 FE 전체가 흔들리므로 **스모크**는 가치가 있습니다.

| 보고 싶은 것 | 예 |
|--------------|-----|
| 업무 예외 → code·status | `@WebMvcTest`에 예외를 던지는 스텁 컨트롤러 |
| 검증 실패 → 필드 메시지 | 잘못된 body 한 건 |
| 낙관적 락 → 전용 code | MVC 슬라이스 또는 API 시나리오 한 줄 |
| 미분류 → 운영 문구 | 로컬 프로필과 운영 프로필 차이 |

단위 테스트의 중심은 여전히 Facade와 Adapter입니다.
미실행 테스트를 통과로 적지 않습니다.

---

## 마치며

예외 처리는 “에러 나면 500”이 아니라, **누가 문구를 소유하고 누가 HTTP로 바꾸는지**를 정하는 일에 가깝습니다.
유스케이스는 업무 의미로 throw 하고, Advice는 경계 어댑터로 남기면 Controller는 얇게 유지됩니다.
messages와 엔벨로프와 status 정책만 팀 안에서 같으면, 그 다음은 키를 늘리는 일만 남습니다.

---

## 관련

- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [support (CommonResponse, BizErrorException, PageQuery)](/docs/harness/templates/backend/spring/support/)
- [outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/)
- [트레이스 전파 (W3C)](/docs/patterns/architecture-patterns/trace-propagation-w3c)
- [RestClient와 Istio 재시도](/docs/patterns/architecture-patterns/restclient-vs-istio-retries)
- [ADR-0012 알림과 outbox](/docs/decisions/adr-0012)
- 자산 맵: 저장소 루트 `index/backend.md`
