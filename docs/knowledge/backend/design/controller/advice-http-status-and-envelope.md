---
id: advice-http-status-and-envelope
title: Advice — HTTP 상태와 응답 엔벨로프
description: 2xx~5xx 의미, 커스텀 status, CommonResponse와 RFC 9457 Problem Details 비교, 낙관적 락·보안 예외 매핑을 정리합니다. 하네스 필독이 아닙니다.
tags:
  - backend
  - api
  - http
status: active
slug: "/knowledge/backend/controller/advice-http-status-and-envelope"
---

# HTTP 상태 코드와 오류 응답 본문을 함께 설계하기

방문 예약을 등록하다가 이미 존재하는 예약과 충돌했다고 가정합니다.<br />
호출부는 HTTP 상태로 실패의 종류를 먼저 판단하고, 응답 본문의 업무 코드로 어떤 안내를 띄울지 결정할 수 있습니다.

이 아카이브에서는 공통 응답을 쓰는 경로에서도 상태 코드와 본문을 함께 확인합니다.<br />
같은 충돌을 기존 엔벨로프와 Problem Details에서 어떻게 표현할지 비교합니다.

## 실패 유형을 HTTP 상태로 표현하기

| 대역 | 일반적인 뜻 | JSON API에서 |
|------|-------------|--------------|
| 2xx | 성공 | 처리 완료. 엔벨로프도 성공 코드 |
| 3xx | 다른 위치로 | REST JSON에서는 드묾. 쓰면 OpenAPI에 명시 |
| 4xx | 요청 쪽을 고치면 됨 | 검증, 인증, 권한, 없는 자원, 잘못된 조합 |
| 5xx | 서버·의존·미처리 | 버그, 타임아웃 누적, 디스크·업로드 한도 등 |

클라이언트가 “재시도해도 되는가 / 입력을 고칠 것인가 / 로그인할 것인가”를 가르는 첫 신호가 status입니다.<br />
body의 업무 코드만 보고 판단하게 만들면, 게이트웨이·알람·CDN 로그가 HTTP 실패율을 못 읽습니다.

---

## 커스텀 status와 “전부 200”

Advice는 예외마다 status를 다르게 줄 수 있습니다.<br />
예외에 HTTP status 필드를 두고 handler가 `response.setStatus(...)` 하는 방식도 흔합니다.<br />
`@ResponseStatus`로 고정하는 방식은 읽기 쉽지만, 같은 예외 타입이 상황에 따라 404와 409를 오가야 하면 필드 방식이 유연합니다.

반대로 **HTTP는 항상 200**이고 body의 `code`만 나누는 팀도 있습니다.<br />
파서는 단순해지고, 게이트웨이·알람이 HTTP 실패율만 보면 장애가 안 보입니다.<br />
어느 쪽이건 FE·모니터링·클라이언트 재시도 정책과 맞춰 문서에 한 줄 적습니다.

이 아카이브 원셋은 `CommonResponse` 엔벨로프를 전제로 할 뿐, status 정책을 세계 표준처럼 단정하지 않습니다.<br />
다만 “열림”으로 남겨 둔 결정이므로, 호스트 README에 선택을 박아 두는 것이 좋습니다.

안티패턴으로 자주 꼽히는 것은 **항상 200 + body의 `success: false`** 입니다.<br />
공개 API 가이드에서도 status를 무시하고 body 플래그만 쓰는 설계를 비추천합니다.<br />
이미 그 관례인 레거시를 하루아침에 바꾸기 어렵다면, 새 API 세대부터 status를 살리는 편이 마이그레이션 비용이 덜합니다.

---

## handler를 나누어 두는 예

업무 Error / Warn / Known, 검증, 타입 불일치, 인증·인가, 없는 리소스, 업로드 한도, 낙관적 락, 원격 재시도 소진, 그 밖의 Exception.<br />
각각 로그 수준과 status·코드가 달라서, 하나의 catch-all만 두면 운영이 눈을 가리게 됩니다.

인증·인가 문구는 예외 클래스명 키(`exception.AuthenticationException`)로 messages에 두기도 합니다.<br />
존재하지 않는 사용자와 틀린 비밀번호를 같은 문구로 가리는 보안 관례와 맞출지는 보안 쪽 결정입니다.

타입 불일치(`MethodArgumentTypeMismatchException`)는 보통 400입니다.<br />
본문 파싱 실패(`HttpMessageNotReadableException`)도 400 쪽이지만, “클라이언트가 JSON을 망가뜨림”과 “서버 스키마 변경”을 로그로 구분할 수 있게 메시지를 남깁니다.

---

## 낙관적 락

버전 컬럼이 있는 엔티티를 두 화면이 동시에 저장하면 `ObjectOptimisticLockingFailureException`이 납니다.<br />
Advice에서 전용 코드와 “다시 불러온 뒤 수정하라”는 메시지를 주면, FE는 폼을 리로드할지 선택할 수 있습니다.

HTTP를 409로 줄지, 호스트가 5xx로 줄지는 계약 문제입니다.<br />
중요한 것은 **성공 엔벨로프와 다른 코드로 구별**되는 것입니다.<br />
낙관적 락을 도메인에 이미 쓰고 있다면 handler 없는 500 미분류로 떨어지게 두지 않습니다.

```java
@ExceptionHandler(ObjectOptimisticLockingFailureException.class)
@ResponseStatus(HttpStatus.CONFLICT)
public CommonResponse<?> handleOptimistic(ObjectOptimisticLockingFailureException e) {
    log.warn(e.getMessage());
    return lockedEnvelope(messageSource, locale());
}
```

---

## 엔벨로프를 고른다는 것

원셋과 Controller Design은 `CommonResponse` 같은 **고정 키 엔벨로프**를 전제로 합니다.<br />
성공·실패 모두 같은 루트 키(`code`, `message`, `data`)를 쓰면 FE·모바일·BFF 파서가 하나여도 됩니다.<br />
실패일 때만 다른 JSON 루트를 쓰면 클라이언트가 갈라집니다.

### RFC 9457 Problem Details

RFC 9457(Problem Details for HTTP APIs)은 예전 RFC 7807을 대체하는 표준입니다.<br />
필드 구조는 호환에 가깝고, Spring Framework 6 / Boot 3의 `ProblemDetail`이 이를 지원합니다.

표준 멤버는 `type`, `title`, `status`, `detail`, `instance`입니다.<br />
Content-Type은 흔히 `application/problem+json`입니다.<br />
그 외 필드는 확장(extension)으로, 검증 오류 목록 `errors`를 넣는 식입니다.<br />
클라이언트가 모르는 확장은 무시할 수 있어야 합니다.

Boot에서 기본 MVC 예외를 Problem Details로 내려면 예를 들어 다음이 있습니다.

```yaml
spring:
  mvc:
    problemdetails:
      enabled: true
```

또는 `ResponseEntityExceptionHandler`를 확장한 `@RestControllerAdvice`를 두는 방법입니다.<br />
공식 문서는 `ErrorResponse`의 type/title/detail 메시지 코드를 MessageSource로 풀도록 안내합니다.

### 비교 표

| | 공통 엔벨로프 (`CommonResponse`) | Problem Details (RFC 9457) |
|--|----------------------------------|----------------------------|
| 파싱 | 모든 API 동일 키 | 표준 클라이언트·문서 도구와 친숙 |
| 업무 코드 | `code`로 확장하기 쉬움 | 확장 필드를 팀 규약으로 또 정해야 함 |
| Content-Type | 보통 `application/json` | `application/problem+json` (오류) |
| 기존 FE | 이미 맞춰 둔 팀이 많음 | 마이그레이션 비용 |
| 관측 | HTTP status 정책과 세트로 설계 | status와 title 정합이 중요 |
| 성공 응답 | 같은 엔벨로프로 통일하기 쉬움 | 오류만 표준화하고 성공은 bare/엔벨로프 선택 |

공개 가이드 중에는 “성공은 bare body여도, **오류는 Problem Details로 통일**하라”는 조언이 있습니다.<br />
이미 `CommonResponse`로 성공·실패를 맞춘 팀에게는 이중 포맷이 됩니다.<br />
둘을 섞어 어떤 API만 Problem Details로 가면 클라이언트가 분기합니다.<br />
바꿀 때는 API 세대나 게이트웨이에서 한 면만 바꾸는지 계획하는 편이 낫습니다.

이 아카이브는 원셋 기준으로 **공통 엔벨로프를 기본**으로 두고, Problem Details는 비교·마이그레이션 후보로만 적습니다.

---

## 상관 ID를 오류에도 남기기

실패 로그에 traceId가 없으면 FE 스크린샷과 서버 로그를 못 잇습니다.<br />
전파 설정은 [W3C 트레이스](/docs/patterns/architecture-patterns/trace-propagation-w3c)와 [ADR-0014](/docs/decisions/adr-0014)를 따릅니다.

로그 패턴에 MDC `traceId`를 넣는 것만으로도 운영이 편해집니다.<br />
응답 body나 헤더에 traceId를 실을지는 보안·계약상 호스트가 정합니다.<br />
Advice는 메시지를 만들 때 굳이 traceId를 문구에 넣지 않아도 되고, 로그와 지원 절차가 같은 ID를 보면 됩니다.

Problem Details의 `instance`에 요청 경로나 로그 조회용 UUID URN을 넣는 관례도 있습니다.<br />
공통 엔벨로프라면 data나 헤더에 동등한 값을 둘 수 있습니다.

---

## 최소 골격에서 status와 엔벨로프

```java
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class CommonExceptionAdvice {

    private final MessageSource messageSource;

    @ExceptionHandler(BizErrorException.class)
    public CommonResponse<?> handleBizError(BizErrorException e, HttpServletResponse response) {
        log.error(e.getMessage(), e);
        response.setStatus(resolveStatus(e));
        return toEnvelope(e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<?> handleValid(MethodArgumentNotValidException e, Locale locale) {
        log.warn(e.getMessage());
        return validationEnvelope(e, locale, messageSource);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponse<?> handleAny(Exception e) {
        log.error(e.getMessage(), e);
        return unknownEnvelope(isDev() ? e.getMessage() : null);
    }
}
```

원셋 `support`에 이 클래스를 올릴지는 선택입니다.<br />
올려도 필독·필수 복사는 아닙니다.

---

## 테스트

| 보고 싶은 것 | 예 |
|--------------|-----|
| 업무 예외 → code와 HTTP status 정합 | `@WebMvcTest` + MockMvc status 단언 |
| 검증 → 400 | 잘못된 body |
| 낙관적 락 → 409(또는 호스트 선택)와 전용 code | 슬라이스 또는 API 시나리오 |
| 미분류 → 운영에서 내부 메시지 비노출 | 프로필별 단언 |

미실행 테스트를 통과로 적지 않습니다.

---

## 관련

- [Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages) (허브)
- [예외 전파](/docs/knowledge/backend/controller/advice-exception-propagation)
- [검증](/docs/knowledge/backend/controller/advice-validation)
- [트레이스 전파 (W3C)](/docs/patterns/architecture-patterns/trace-propagation-w3c)
- [ADR-0014](/docs/decisions/adr-0014)
- [support](/docs/harness/templates/backend/spring/support/)

## Partner Gateway에서 실제로 확인한 오류 두 가지

세대별 차량 조회 API에서 입력값이 잘못된 경우와, Mopl이 요청을 받은 뒤 세대를 찾지 못한 경우를 나눠 볼 수 있습니다.

| 사례 | 외부 호출 | 확인하는 HT 응답 |
|---|---|---|
| `listCount=201` | 최대 크기를 넘긴 입력으로 Mopl 호출을 생략 | HTTP 400, `parameter-002` |
| 조회할 세대가 없음 | Mopl이 세대 없음 오류를 반환 | HTTP 400, `parameter-003` |

둘 다 HT가 받는 HTTP 상태는 400입니다.<br />
본문의 결과 코드가 다르므로 호출부는 목록 크기를 줄여야 하는지, 세대 정보를 확인해야 하는지 구분할 수 있습니다.

이 매핑은 Partner Gateway의 HT 연동 계약에 맞춘 사례입니다.<br />
다른 API에서 HTTP 404를 그대로 전달하는 것이 계약이라면 그 규격에 맞춰 처리합니다.

## 참고 자료

- [HTTP API 오류 응답 형식, RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html)
