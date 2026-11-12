---
id: advice-exception-propagation
title: Advice — 예외 전파와 try/catch
description: 업무 예외 계층, Runtime 전제, Facade에서의 throw, Controller에서 catch를 두지 않는 이유를 정리합니다. 하네스 필독이 아닙니다.
tags:
  - backend
  - api
  - exception
status: active
slug: "/knowledge/backend/controller/advice-exception-propagation"
---

# 업무 예외가 HTTP 응답이 되기까지

이미 등록된 차량으로 방문 예약을 요청하면 어느 코드가 실패를 결정해야 할까요?
예약 상태와 차량을 확인하는 유즈케이스가 중복을 판단하고, 웹 경계는 그 판단을 호출부가 읽을 수 있는 오류 응답으로 바꿉니다.

중간에서 예외를 잡아 정상 값으로 돌려주면 호출부에는 어떤 일이 일어났는지 드러나지 않습니다.<br />
이 글에서는 예약 실패가 Adapter와 Facade를 거쳐 HTTP 응답이 되는 과정에서, 어디서 예외를 변환하고 어디서 전파할지 살펴봅니다.

## 예약 실패가 웹 경계까지 전달되는 과정

Facade(또는 유스케이스 진입)가 업무 예외를 던지면 Controller는 잡지 않습니다.<br />
전역 `@RestControllerAdvice`가 예외 타입을 보고 HTTP status와 공통 엔벨로프를 만듭니다.

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

Advice는 “예외를 JSON으로 바꾸는 어댑터”입니다.<br />
도메인 규칙을 새로 만들지 않습니다.

| 책임 | 실제로 하는 일 |
|------|----------------|
| 타입별 handler | `@ExceptionHandler`로 업무·검증·보안·인프라 예외를 나눔 |
| HTTP status | `@ResponseStatus`로 고정하거나, 예외에 실린 status를 반영 |
| 엔벨로프 | 성공과 같은 `code` / `message` / `data` 골격 |
| 로그 수준 | 진짜 장애는 error, 예상 가능한 거절은 warn |
| 문구 | MessageSource로 키 → 문장 |

Controller 안에 비즈니스 `catch`를 두면 그 순간부터 엔드포인트마다 정책이 달라집니다.<br />
리뷰에서 자주 보이는 패턴이 “이 메서드만 예외를 삼키고 200을 반환”입니다.<br />
트랜잭션은 롤백됐는데 클라이언트는 성공으로 읽는 사고가 그렇게 납니다.

Spring 문서에 따르면 `@Controller`에 선언한 로컬 `@ExceptionHandler`가 전역 Advice보다 먼저 적용됩니다.<br />
전역을 “마지막 안전망”으로 두려면 `@Order(Ordered.LOWEST_PRECEDENCE)`를 쓰는 팀도 있습니다.<br />
컨트롤러별 Advice를 허용할 때는 그 순서를 문서에 남깁니다.

---

## 예외를 층으로 나누는 이유

모든 실패를 `Exception` 하나로 받아 500을 주면, 클라이언트는 재시도할지 입력을 고칠지 모릅니다.<br />
운영 로그도 error로만 가득 찹니다.

기존 서비스에서는 대략 다음처럼 나눕니다.<br />
클래스 이름은 호스트에 맞게 바꿉니다.

| 층 | 로그 | 클라이언트에게 | 언제 |
|----|------|----------------|------|
| Error (`BizErrorException`) | error + 스택 | 업무 코드, 메시지, 필요 시 data | 실패로 취급, 보통 TX 롤백 |
| Warn (`BizWarnException`) | warn | 업무 코드, 메시지 | 잘못된 입력, 상태 거절처럼 예상 가능 |
| 미분류 | error | 운영에서는 고정 문구. 로컬, dev만 상세 | 마지막 안전망. 래핑된 업무 예외가 있으면 먼저 꺼냄 |

```java
// 유스케이스 개념 — ResponseTypeInterface 구현체만 넘깁니다.
if (item == null) {
    throw new BizWarnException(ResponseType.NOT_FOUND_RESOURCE);
}
if (conflict) {
    throw new BizErrorException(ResponseType.BAD_REQUEST);
}
```

원셋 support는 `BizException` → `BizErrorException` / `BizWarnException` 구조입니다.<br />
공통 코드는 `ResponseType`, 모듈 전용 코드는 모듈 이넘이 `ResponseTypeInterface`를 구현해 같은 생성자로 넘깁니다.

Spring Framework 5.3 이후 `@ExceptionHandler`는 래핑된 cause 체인 깊은 곳의 타입도 매칭할 수 있습니다.<br />
여러 handler가 맞으면 루트에 가까운 매칭이 선호되고, Advice 빈끼리의 우선순위도 영향을 줍니다.<br />
가능하면 시그니처에 **구체 타입 하나**를 두고, 멀티매칭 메서드를 쪼개는 편이 안전합니다.

---

## Runtime으로 두는 전제

업무 예외는 Runtime 계열이 다루기 쉽습니다.<br />
Checked를 Facade 시그니처에 올리면 호출부마다 선언이 번지고, Advice와도 결이 달라집니다.

트랜잭션 `rollbackFor`에 롤백해야 할 타입이 빠지지 않았는지만 확인하면 됩니다.<br />
일부 레거시가 `rollbackFor = Exception.class`를 쓰면, Checked까지 롤백 대상이 되므로 Advice 매핑과 함께 알아 둡니다.<br />
Warn을 Error와 같은 부모로 묶되, 롤백이 필요 없는 경고만 따로 두면 TX 설정이 단순해집니다.<br />
호스트가 고른 규칙이 중요합니다.

---

## 유스케이스에서 throw 할 때 놓치기 쉬운 것

“던지면 Advice가 한다”는 절반만 맞습니다.

**코드를 고를 책임**은 유스케이스에 있습니다.<br />
Advice는 그 코드를 HTTP와 문장으로 바꿀 뿐입니다.<br />
메시지 인자가 필요하면 예외 생성 시점에 넣거나, 응답 타입이 인자를 받게 합니다.

BFF가 여러 도메인을 부를 때 catch로 삼키거나, 전부 `UNKNOWN`으로 바꾸면 계약이 무너집니다.<br />
화면용으로 바꿔야 하면 매핑 표를 명시하고, 그 외에는 도메인 예외를 그대로 올리는 편이 낫습니다.

트랜잭션 경계는 Facade에 있습니다.<br />
이 예외에서 롤백되어야 하는데 read-only 트랜잭션만 열려 있거나, 반대로 롤백되면 안 되는 경고를 Error로 던지면 데이터가 어긋납니다.

Facade 설계 본편은 [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)입니다.

---

## try, catch, finally를 어디에 둘까

Controller에서의 업무 catch는 거의 필요 없습니다.
[Controller Design](/docs/knowledge/backend/controller/controller-design)도 같은 말을 합니다.

Facade에서는 기본이 재던지기입니다.<br />
여러 단계 중 앞 단계만 보상해야 할 때처럼, 범위가 분명할 때만 catch합니다.<br />
catch 안에서 로그만 하고 정상 반환하면, 호출자는 성공으로 읽습니다.

`finally`와 try-with-resources는 **자원·MDC·ThreadLocal**을 닫을 때 씁니다.<br />
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

래핑할 때는 반드시 cause를 붙입니다.<br />
Advice가 “원인 체인에서 업무 예외 찾기”를 할 수 있게 하려는 것입니다.<br />
실제로 최상위 handler에서 한두 단계 cause를 들여다보고 업무 Error로 위임하는 패턴이 있습니다.

인프라 예외를 업무 코드로 바꿀 때도 같은 원칙입니다.<br />
`ObjectOptimisticLockingFailureException`을 전용 코드로 바꾸는 것은 Advice handler에서 해도 되고, 도메인 어댑터에서 바꿔 올려도 됩니다.<br />
한 API 표면에서는 한쪽으로 모읍니다.

---

## 최소 골격에서 전파만 보기

```java
@ExceptionHandler(BizErrorException.class)
public CommonResponse<?> handleBizError(BizErrorException e, HttpServletResponse response) {
    log.error(e.getMessage(), e);
    response.setStatus(resolveStatus(e));
    return toEnvelope(e);
}

@ExceptionHandler(Exception.class)
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public CommonResponse<?> handleAny(Exception e) {
    BizErrorException nested = findBizError(e);
    if (nested != null) {
        return handleBizError(nested, /* response */ null);
    }
    log.error(e.getMessage(), e);
    return unknownEnvelope(isDev() ? e.getMessage() : null);
}
```

`handleAny`에서 nested를 다시 `handleBizError`로 넘길 때 response status를 빠뜨리면 HTTP와 body code가 어긋납니다.<br />
위임 경로도 status를 같이 맞춥니다.

---

## 테스트로 전파를 보는 법

| 보고 싶은 것 | 예 |
|--------------|-----|
| 업무 예외 → code·status | `@WebMvcTest`에 예외를 던지는 스텁 컨트롤러 |
| catch로 삼킨 경로가 없는지 | Facade 단위 테스트에서 실패 시나리오가 예외로 끝나는지 |
| 미분류 → 운영 문구 | 로컬 프로필과 운영 프로필 차이 |

단위 테스트의 중심은 여전히 Facade와 Adapter입니다.<br />
Advice 스모크는 계약이 깨지지 않는지 보는 용도입니다.<br />
미실행 테스트를 통과로 적지 않습니다.

---

## 외부 API의 404를 그대로 던졌을 때 달라지는 결과

Partner Gateway에서 세대별 차량을 조회할 때 Mopl의 세대 없음 응답은 HT의 `parameter-003`에 대응합니다.<br />
Mopl HTTP 404를 그대로 바깥으로 던지면 HT 호출부가 기대하는 오류 코드가 사라질 수 있습니다.

실제 연동 흐름에서는 상대 시스템에서 온 상태와 코드를 먼저 보존한 뒤, 요청 문맥에 따라 HT 오류로 변환합니다.<br />
웹 경계에서는 그 오류로 HTTP 400과 결과 코드를 구성합니다.<br />
네트워크 타임아웃은 상대 서버의 404와 발생 원인이 다르므로 같은 입력으로 검증하지 않습니다.

테스트에 같은 차량 조회 요청을 넣고 외부 응답만 바꿔 봅니다.<br />
세대 없음일 때는 HT의 결과 코드까지, 외부 접속 실패일 때는 합의한 오류 응답과 실패 로그까지 확인합니다.

## 관련

- [Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages) (허브)
- [messages와 i18n](/docs/knowledge/backend/controller/advice-messages-and-i18n)
- [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope)
- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [Facade](/docs/knowledge/backend/facade/facade-design)

## 참고 자료

- [Spring MVC의 예외 처리 메서드](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html)
