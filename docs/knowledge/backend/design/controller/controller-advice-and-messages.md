---
id: controller-advice-and-messages
title: Controller Advice와 메시지
description: RestControllerAdvice로 예외를 HTTP·공통 응답으로 모으는 Knowledge 허브입니다. 세부 주제는 하위 글로 나눕니다. 하네스 필독이 아닙니다.
tags:
  - backend
  - api
  - exception
  - validation
status: active
slug: "/knowledge/backend/controller/controller-advice-and-messages"
---

# Controller Advice와 메시지

> **개요:** HTTP 경계에서 예외를 한곳으로 모아 상태 코드와 공통 응답 엔벨로프로 바꾸는 **입구**입니다.
> Controller 설계 본편([Controller Design](/docs/knowledge/backend/controller/controller-design))이 “예외는 Advice”라고만 한 줄을 여기서 풀어 읽기 시작합니다.
> **하네스 필수 읽기나 원셋 복사 경로에는 넣지 않습니다.**
> 필요할 때 Knowledge와 자산 맵(`index/backend.md`)에서만 찾아 읽으면 됩니다.

세부 주제는 아래 글로 나눕니다.
분량과 웹 검색 보강 기준은 [글쓰기 기준 — 문서 층과 분량](/docs/harness/context/writing-conventions)을 따릅니다.

---

## 왜 모으는가

Controller를 얇게 두어도, 예외 순간만 되면 엔드포인트마다 `try/catch`가 생기기 쉽습니다.
클라이언트가 파서를 여러 개 두게 되고, 운영은 오류 코드 정의를 코드 전체에서 찾게 됩니다.

한곳의 Advice와 messages 번들로 모으면, 성공 경로의 `CommonResponse`와 실패 경로의 모양이 같아집니다.
사람은 메시지 키를 고치고, 유스케이스는 업무 예외만 던지면 됩니다.

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

알림을 outbox에 넣을지 말지는 [ADR-0012](/docs/decisions/adr-0012)입니다.
트레이스 헤더는 [W3C 트레이스](/docs/patterns/architecture-patterns/trace-propagation-w3c)와 [ADR-0014](/docs/decisions/adr-0014)를 봅니다.

---

## 하위 글

| 글 | 다루는 것 |
|----|-----------|
| [messages와 i18n](/docs/knowledge/backend/controller/advice-messages-and-i18n) | MessageSource, 키 작성 단위, Locale, 모노리포 소유(열림) |
| [예외 전파와 try/catch](/docs/knowledge/backend/controller/advice-exception-propagation) | Error/Warn 계층, Runtime, Facade throw, catch 위치 |
| [검증](/docs/knowledge/backend/controller/advice-validation) | Bean Validation vs Spring, 두 갈래 MVC 예외, 그룹·함정 |
| [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope) | 2xx~5xx, 전부 200, CommonResponse vs RFC 9457, 낙관적 락 |
| [인접 경계](/docs/knowledge/backend/controller/advice-adjacent-boundaries) | Filter/Security, `@Async`·MDC, RestClient/Feign, 상관 ID |

열린 결정(모노리포 messages 소유, HTTP 항상 200 vs status 분리, i18n 기본)은 해당 하위 글에 “열림”으로 남깁니다.
원셋 `support`에 Advice 코드 템플릿을 올릴지는 선택이며, 올려도 필독·필수 복사는 아닙니다.

---

## 관련

- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [support (CommonResponse, BizErrorException, PageQuery)](/docs/harness/templates/backend/spring/support/)
- [outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/)
- 자산 맵: 저장소 루트 `index/backend.md`
