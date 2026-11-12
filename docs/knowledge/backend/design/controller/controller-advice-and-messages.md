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

방문 예약 요청은 입력값이 잘못돼 실패할 수도 있고, 이미 예약된 차량이라 업무 규칙에 걸릴 수도 있습니다.<br />
HTTP 호출부는 어느 단계에서 실패했든 상태 코드와 응답 필드를 같은 방식으로 읽을 수 있어야 합니다.

이 시리즈는 검증 예외를 분류하고, 업무 오류를 HTTP 응답으로 바꾸고, 사용자에게 보여줄 메시지를 선택하는 흐름을 다룹니다.

## 하위 글

| 글 | 다루는 것 |
|----|-----------|
| [messages와 i18n](/docs/knowledge/backend/controller/advice-messages-and-i18n) | MessageSource, 키 작성 단위, Locale, 모노리포 소유(열림) |
| [예외 전파와 try/catch](/docs/knowledge/backend/controller/advice-exception-propagation) | BizError/BizWarn, ResponseTypeInterface, Facade throw, catch 위치 |
| [검증](/docs/knowledge/backend/controller/advice-validation) | Bean Validation vs Spring, 두 갈래 MVC 예외, 그룹·함정 |
| [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope) | 2xx~5xx, 전부 200, CommonResponse vs RFC 9457, 낙관적 락 |
| [인접 경계](/docs/knowledge/backend/controller/advice-adjacent-boundaries) | Filter/Security, `@Async`·MDC, RestClient/Feign, 상관 ID |

열린 결정(모노리포 messages 소유, HTTP 항상 200 vs status 분리, i18n 기본)은 해당 하위 글에 “열림”으로 남깁니다.<br />
원셋 `support`에 `CommonExceptionAdvice`와 Biz, `ResponseTypeInterface` 골격이 있습니다.
필독은 아니며 호스트에 동등 타입이 있으면 호스트를 씁니다.

---

## 증상으로 읽을 글 고르기

요청 본문이 읽히기도 전에 실패한다면 [입력 검증](/docs/knowledge/backend/controller/advice-validation)부터 봅니다.<br />
입력은 맞지만 예약 상태 때문에 거절됐다면 [업무 예외 전파](/docs/knowledge/backend/controller/advice-exception-propagation)에서 누가 실패를 판단하는지 확인합니다.

HTTP 상태와 업무 코드가 따로 움직이는 연동이라면 [오류 응답 설계](/docs/knowledge/backend/controller/advice-http-status-and-envelope)가 출발점입니다.<br />
응답은 이미 성공인데 알림이 도착하지 않았다면 [Advice 밖의 실패](/docs/knowledge/backend/controller/advice-adjacent-boundaries)에서 비동기 기록과 상관 ID를 확인합니다.

## 관련

- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [support (CommonResponse, BizError/Warn, ResponseTypeInterface, PageQuery)](/docs/harness/templates/backend/spring/support/)
- [outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/)
- 자산 맵: 저장소 루트 `index/backend.md`
