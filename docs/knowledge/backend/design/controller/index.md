---
id: knowledge-backend-controller
title: Controller
description: "예약 요청이 Controller에서 바인딩되고 Advice가 검증·예외를 응답으로 바꾸는 글을, 증상별로 고를 수 있게 안내합니다."
keywords:
  - Controller
  - RestControllerAdvice
  - DTO 바인딩
  - Spring MVC
slug: "/knowledge/backend/controller/index"
---
# Controller

예약 등록 API를 열었을 때 URL과 DTO 바인딩은 Controller에서 읽고, 차량번호가 비었거나 예약 규칙에 걸리면 Advice가 공통 응답으로 바꿉니다.<br />
이 목록은 글을 늘리지 않고, 어떤 문제에서 어느 글을 보면 되는지 안내합니다.

**하네스 필독이 아닙니다.** 구현은 [Spring 원셋](/docs/harness/templates/backend/spring/ONESET)에 있습니다.

| 지금 겪는 문제 | 읽을 글 |
|---|---|
| 어느 URL이 어느 Facade를 부르는지 안 보임 | [Controller Design](/docs/knowledge/backend/controller/controller-design) |
| 검증·예외·메시지 글을 어디부터 볼지 모름 | [Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages) |
| 차량번호 DTO와 페이지 size 인자 실패가 다른 예외로 보임 | [검증](/docs/knowledge/backend/controller/advice-validation) |
| 같은 업무 오류인데 HTTP 상태·본문 code가 들쭉날쭉함 | [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope) |
| 메시지 키와 로케일이 응답에 안 실림 | [messages와 i18n](/docs/knowledge/backend/controller/advice-messages-and-i18n) |
| Controller마다 try/catch를 반복하고 있음 | [예외 전파와 try/catch](/docs/knowledge/backend/controller/advice-exception-propagation) |
| Filter·Interceptor와 Advice 경계를 나눠야 함 | [인접 경계](/docs/knowledge/backend/controller/advice-adjacent-boundaries) |

원셋 Controller: `docs/harness/templates/backend/spring/exampleitem/controller/`
