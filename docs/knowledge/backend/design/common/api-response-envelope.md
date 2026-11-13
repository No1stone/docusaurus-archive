---
id: api-response-envelope
title: "API 응답 엔벨롭 설계"
description: "여러 API가 code, message, data를 같은 위치에서 읽도록 CommonResponse 엔벨롭의 역할과 적용 범위를 정리합니다."
keywords:
  - CommonResponse
  - 응답 엔벨롭
  - API envelope
  - code message data
tags:
  - backend
  - api
  - response
status: active
sidebar_position: 1
slug: "/knowledge/backend/common/api-response-envelope"
---

# API 응답 엔벨롭 설계

여러 API를 호출하는 화면에서는 성공 데이터와 오류를 같은 방식으로 읽을 수 있어야 합니다.<br />
API 응답 엔벨롭은 `code`, `message`, `data`처럼 여러 응답이 공유하는 필드를 정해두는 방식입니다.<br />
회원 상세와 예약 목록은 서로 다른 데이터를 반환하지만, 클라이언트는 같은 위치에서 그 데이터를 꺼낼 수 있습니다.

| 요소 | 역할 | 예시 |
|---|---|---|
| HTTP 상태 | HTTP 요청의 처리 결과를 나타냅니다. | `409 Conflict` |
| 응답 코드 | 클라이언트가 처리 결과나 업무상 실패 사유를 구분합니다. | `RESERVATION_OVERLAP` |
| 메시지 | 사용자나 운영자가 결과를 이해할 수 있도록 설명합니다. | 예약 시간이 겹칩니다. |
| 데이터 | API마다 달라지는 결과를 담습니다. | 예약 상세, 목록, 페이지 정보 |

`CommonResponse<T>` 같은 제네릭 타입을 쓰면 공통 필드를 유지하면서 `data`에 들어갈 타입을 API별로 지정할 수 있습니다.<br />
클라이언트에서 별도 동작이 필요한 오류는 응답 코드로 구분합니다.<br />
예를 들어 `409` 중에서도 예약 시간 중복일 때만 시간 선택 화면을 다시 열 수 있습니다.

공통 응답의 적용 범위는 본문 형식에 따라 정합니다.<br />
JSON API는 엔벨롭으로 묶을 수 있고, `204 No Content`는 본문 없이 응답합니다.<br />
파일 다운로드와 SSE는 각각 파일 바이트와 `text/event-stream`을 응답으로 사용합니다.

참고: [RFC 9110의 HTTP 응답 의미](https://www.rfc-editor.org/rfc/rfc9110.html), [Server-Sent Events 표준](https://html.spec.whatwg.org/multipage/server-sent-events.html)

boot-base에서의 HTTP 상태와 엔벨롭 매핑은 [Advice — HTTP 상태와 응답 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope)를, 실패 코드와 Biz 예외는 [공통 응답 코드와 업무 예외](/docs/knowledge/backend/common/common-response-and-biz-exception)를 봅니다.
