---
id: advice-adjacent-boundaries
title: Advice — 인접 경계 (Filter, 비동기, 아웃바운드)
description: Security 필터·Interceptor와 Advice의 응답 모양, @Async와 MDC, RestClient·Feign 예외 매핑, 상관 ID를 정리합니다. 하네스 필독이 아닙니다.
tags:
  - backend
  - api
  - async
  - observability
status: active
slug: "/knowledge/backend/controller/advice-adjacent-boundaries"
---

# Controller Advice 밖에서 발생한 실패는 어디서 처리할까

예약 API가 401을 반환했는데 Advice 로그가 남지 않았다고 가정합니다.<br />
인증 필터가 요청을 먼저 막았다면 MVC Controller까지 도착하지 않았을 수 있습니다.

반대로 Controller가 처리한 요청이라도, 응답을 보낸 뒤 별도 스레드에서 외부 API 호출이 실패하면 기록 위치가 달라집니다.<br />
오류가 발생한 경계를 찾으면 어느 코드에서 상태와 로그를 확인할지 결정할 수 있습니다.

## 실패가 발생한 요청 경계

로그인 실패는 Spring Security 필터에서 끝나 Advice에 오지 않을 수 있습니다.<br />
필터가 직접 JSON을 쓰면, 그 모양이 `CommonResponse`와 다른지 먼저 봅니다.

Interceptor에서 예외를 던지는 설정이라면 Advice 도달 여부를 한 번 확인합니다.<br />
서블릿 필터 체인 바깥에서 쓴 응답은 DispatcherServlet의 `@ExceptionHandler` 경로를 타지 않습니다.

권한·테넌트 규칙 자체는 이 글의 범위가 아닙니다.<br />
다만 “실패 응답 모양”이 API 전체와 어긋나면 FE가 분기 지옥에 빠집니다.<br />
필터 응답과 Advice 응답의 키 이름(`code`, `message`, `data`)을 맞춰 두는 것이 최소 위생입니다.

실무에서 도움이 됐던 점검은 다음과 같습니다.

1. 인증 실패·인가 실패·만료 토큰 각각이 어떤 컴포넌트에서 끝나는지 표로 적는다
2. 그 컴포넌트가 쓰는 JSON 샘플을 Advice 샘플 옆에 붙여 본다
3. 키가 다르면 AuthenticationEntryPoint / AccessDeniedHandler에서 공통 엔벨로프 빌더를 쓰도록 맞춘다

보안 메시지를 messages 키로 통일할지는 [messages와 i18n](/docs/knowledge/backend/controller/advice-messages-and-i18n)과 같은 결정입니다.

---

## 비동기 스레드에서는 Advice가 안 보인다

요청을 처리하던 스레드에서 난 예외는 DispatcherServlet이 Advice로 보냅니다.<br />
`@Async`로 떠난 작업에서 난 예외는 **그 요청의 Advice 경로에 들어오지 않습니다.**

여기에는 두 가지가 같이 옵니다.

1. `AsyncUncaughtExceptionHandler`(또는 호스트 동등)로 로그와 메트릭을 남길 것
2. MDC에 넣었던 traceId·사용자 정보가 스레드 로컬이라 새 스레드에 자동으로 안 붙는 것

### void `@Async`와 기본 핸들러

반환 타입이 `void`인 `@Async`에서 예외가 나면 Spring은 `AsyncUncaughtExceptionHandler`를 호출합니다.<br />
기본 `SimpleAsyncUncaughtExceptionHandler`는 로그만 남깁니다.<br />
로그 레벨·설정이 어긋나면 사실상 삼킨 것과 같습니다.<br />
알림·메트릭·재시도 훅이 필요하면 `AsyncConfigurer#getAsyncUncaughtExceptionHandler`로 교체합니다.

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) ->
            log.error("async failed: {}.{}", method.getDeclaringClass().getSimpleName(), method.getName(), ex);
    }
}
```

`CompletableFuture` / `Future`를 반환하면 예외가 future에 담깁니다.<br />
호출부가 `join`/`get` 하지 않으면 역시 관측이 늦습니다.<br />
Fire-and-forget이면 Uncaught handler 쪽이 맞습니다.

비동기에서 예외를 삼키면 알림 best-effort와 비슷하게 “실패가 관측되지 않습니다.”
알림 전달 정책은 [ADR-0012](/docs/decisions/adr-0012)를 보고, 이 절은 **관측 구멍**만 지적합니다.<br />
게이트웨이 제품의 `@Async`·pcs 인프로세스 outbox는 제품 로컬이며 이 Knowledge의 필독 대상이 아닙니다.

### MDC와 TaskDecorator

MDC는 ThreadLocal입니다.<br />
웹 스레드에 넣은 `traceId`는 풀 스레드에 자동으로 복사되지 않습니다.<br />
풀에 이전 작업의 MDC가 남아 있으면 **잘못된 ID가 붙는** 사고도 납니다.

Spring 4.3부터 `TaskDecorator`로 제출 시점의 맵을 복사하고, 실행 후 정리하는 패턴이 널리 쓰입니다.

```java
public class MdcTaskDecorator implements TaskDecorator {

    @Override
    public Runnable decorate(Runnable task) {
        Map<String, String> submitted = MDC.getCopyOfContextMap();
        return () -> {
            Map<String, String> previous = MDC.getCopyOfContextMap();
            try {
                if (submitted != null) {
                    MDC.setContextMap(submitted);
                } else {
                    MDC.clear();
                }
                task.run();
            } finally {
                if (previous != null) {
                    MDC.setContextMap(previous);
                } else {
                    MDC.clear();
                }
            }
        };
    }
}
```

`ThreadPoolTaskExecutor#setTaskDecorator`에 등록합니다.<br />
`finally`에서 clear/restore를 빼면 스레드 재사용 시 오염이 남습니다.

Micrometer context-propagation과 Boot의 `spring.task.execution.propagate-context`를 쓰면, MDC뿐 아니라 트레이스·보안 컨텍스트까지 묶어서 전파하는 방향으로 갈 수 있습니다.<br />
버전과 의존이 맞는지 호스트에서 확인합니다.<br />
원리(제출 스레드 스냅샷 → 워커 복원 → 종료 시 원복)는 TaskDecorator와 같습니다.

`AsyncUncaughtExceptionHandler`는 **워커 스레드**에서 돕니다.<br />
MDC를 전파해 두었다면 그 핸들러 로그에도 같은 traceId가 찍힙니다.<br />
전파를 안 했으면 “Advice가 아니라서”만이 아니라 “로그를 못 잇는” 문제가 겹칩니다.

트랜잭션도 스레드에 묶입니다.<br />
`@Async` 안에서 새 트랜잭션이 필요하면 `@Transactional` 전파와 프록시 경계를 따로 설계합니다.<br />
이 글은 예외·MDC에 초점을 둡니다.

---

## 나가는 RestClient·Feign과 로그 중앙화

클라이언트에 로깅 인터셉터, 재시도, 에러 디코더, 헤더 주입이 겹쌓이면 “어디에 커스텀을 넣어야 하는지”가 흐려집니다.<br />
예외 타입도 라이브러리마다 달라 Advice에 바로 매핑하기 어렵습니다.

실무에서 도움이 됐던 방향은 다음입니다.

- 타임아웃과 **한 줄 outbound 로그**는 한 커스터마이저로 모은다 ([outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/))
- 재시도·타임아웃을 Istio와 겹쓰지 않는다 ([RestClient와 Istio](/docs/patterns/architecture-patterns/restclient-vs-istio-retries))
- 다운스트림 4xx/5xx는 가능하면 **우리 업무 예외로 바꿔 다시 throw** 하여 Advice가 최종 JSON을 만들게 한다

```java
// 개념 — 공통 코드 또는 모듈 이넘(ResponseTypeInterface)
catch (HttpClientErrorException.NotFound e) {
    throw new BizWarnException(ResponseType.NOT_FOUND_RESOURCE);
}
catch (ResourceAccessException e) {
    throw new BizErrorException(ResponseType.MICRO_SERVICE_CONNECTION_FAILED, e);
}
```

Feign의 `RetryableException`처럼 “재시도하다 실패한 연결”을 전용 코드로 두는 것도 같은 맥락입니다.<br />
에러 디코더에서 문자열만 던지면 messages, 엔벨로프와 어긋납니다.<br />
가능하면 `ResponseTypeInterface`를 싣는 업무 예외로 바꿉니다.

아웃바운드 호출이 `@Async` 안이라면, 위에서 말한 Uncaught handler와 MDC 전파가 다시 필요합니다.<br />
동기 Facade 안에서 RestClient를 호출하면 Advice 경로로 자연스럽게 올라옵니다.

---

## 상관 ID

실패 로그에 traceId가 없으면 FE 스크린샷과 서버 로그를 못 잇습니다.<br />
전파 설정은 [W3C 트레이스](/docs/patterns/architecture-patterns/trace-propagation-w3c)와 [ADR-0014](/docs/decisions/adr-0014)를 따릅니다.

필터에서 MDC에 넣고, Advice·서비스 로그가 같은 키를 쓰며, 아웃바운드 클라이언트가 헤더로 넘기면 한 줄기가 됩니다.<br />
비동기 전파를 빼먹으면 줄기만 웹 구간에서 끊깁니다.

응답 body나 헤더에 traceId를 실을지는 보안·계약상 호스트가 정합니다.
[HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope)에도 같은 한 줄을 두었습니다.

---

## 테스트로 경계를 보는 법

| 보고 싶은 것 | 예 |
|--------------|-----|
| Security 실패 JSON 키 | MockMvc + security 테스트 슬라이스 |
| `@Async` 예외가 핸들러에 도달 | 테스트용 Uncaught handler 스파이 또는 로그 단언 |
| MDC 전파 | 워커에서 MDC.get("traceId") 단언 |
| 다운스트림 404 → 우리 Warn 코드 | Facade 단위 테스트에서 클라이언트 스텁 |

미실행 테스트를 통과로 적지 않습니다.

---

## 하지 말 것

- Advice에 도메인 유스케이스·DB 로직을 넣기
- 메시징/사가 실패와 알림 best-effort를 Advice 이야기에 섞기 ([ADR-0012](/docs/decisions/adr-0012))
- 필터와 Advice의 JSON을 “나중에 맞추자”로 남겨 FE만 분기하게 두기
- `@Async` 예외를 기본 로거에만 맡기고 알림·메트릭 없이 끝내기

---

## 웹훅 수신과 전달 실패를 같은 요청으로 기록하기

Partner Gateway의 입출차 웹훅은 수신 결과와 HT 알림 전달 결과를 따로 다룹니다.<br />
가령 Mopl은 HTTP 200을 받았지만 HT에 연결할 때 타임아웃이 발생할 수 있습니다.<br />
이미 돌아간 수신 응답을 바꿀 수 없으므로, 전달 실패는 비동기 작업 쪽에 기록합니다.

| 관측한 결과 | 확인할 코드 |
|---|---|
| 인증에 실패해 Controller에 도달하지 않음 | 인증 필터와 인증 실패 응답 |
| 웹훅 수신은 성공했으나 HT 전달이 실패 | 알림 작업의 예외 처리와 실패 로그 |
| 상대가 어떤 요청을 받았는지 확인 필요 | 외부 호출 기록과 테스트 대역의 수신 요청 |

수신 로그와 전달 로그를 `eventId`로 연결하면 같은 이벤트를 따라갈 수 있습니다.<br />
웹훅 전달 테스트에서는 수신 응답과 별도로, HT 호출이 실패해도 한 번으로 끝나는지 확인합니다.

## 관련

- [Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages) (허브)
- [예외 전파](/docs/knowledge/backend/controller/advice-exception-propagation)
- [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope)
- [outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/)
- [RestClient와 Istio 재시도](/docs/patterns/architecture-patterns/restclient-vs-istio-retries)
- [트레이스 전파 (W3C)](/docs/patterns/architecture-patterns/trace-propagation-w3c)
- [ADR-0012](/docs/decisions/adr-0012)
- [ADR-0014](/docs/decisions/adr-0014)

## 참고 자료

- [Spring MVC의 Filter 안내](https://docs.spring.io/spring-framework/reference/web/webmvc/filters.html)
