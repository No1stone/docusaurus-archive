---
id: knowledge-backend-notification-sse-inapp-badge
title: SSE로 인앱 알림 배지 갱신
description: "사용자별 SSE 연결, 재접속, 이중화와 알림 배지 갱신 흐름을 정리합니다."
slug: "/knowledge/backend/notification/sse-inapp-badge"
tags:
  - backend
  - notification
  - sse
status: active
---

# Spring MVC와 SSE로 인앱 알림 배지 갱신하기

웹 서비스를 쓰는 도중 새 알림이 생기면 상단 알림 벨에 빨간 점을 표시합니다.<br />
브라우저는 `EventSource`로 SSE 연결을 열고, Spring MVC 서버는 `SseEmitter`로 알림 상태가 바뀌었다는 신호를 보냅니다.<br />
화면은 알림함 API를 다시 호출해 배지를 갱신합니다.<br />
[WHATWG Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html), [Spring MVC 비동기 요청](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html)

## 어떤 변화가 누구에게 전달되는가

| 상황 | 백엔드 동작 | 프론트엔드 동작 |
|---|---|---|
| 최초 연결 | 인증된 사용자의 SSE 연결 등록 | `hasUnread` 조회 |
| 새 알림 생성 | 커밋 후 수신 사용자의 열린 연결에 `notification.changed` 전송 | `hasUnread` 재조회 |
| 한 건 또는 모두 읽음 | 커밋 후 같은 사용자의 열린 탭과 기기에 변경 신호 전송 | 각 화면에서 배지 갱신 |
| 연결이 끊겼다가 다시 열림 | 새 연결 등록 | 끊긴 동안의 변경을 `hasUnread` 조회로 반영 |

연결 목록은 `userId → {connectionId → SseEmitter}` 형태로 관리합니다.<br />
사용자가 탭을 세 개 열면 같은 `userId` 아래에 연결 세 개가 등록됩니다.<br />
연결이 종료되거나 오류가 나면 해당 `connectionId`만 제거합니다.<br />
사용자 ID는 인증 정보에서 가져옵니다.

```javascript
// 같은 출처의 쿠키 인증을 사용하는 웹 예제
const stream = new EventSource("/api/notifications/stream");

stream.onopen = refreshUnreadStatus;
stream.addEventListener("notification.changed", refreshUnreadStatus);

// 로그아웃하거나 화면의 구독을 정리할 때 호출합니다.
function disconnect() {
  stream.close();
}
```

`onopen`은 최초 연결과 재연결에 모두 사용합니다.<br />
이 예제에서 이벤트는 갱신 신호만 전달하고, 현재 읽음 상태는 DB에서 조회합니다.<br />
서버는 필요에 따라 주기적으로 SSE 주석을 보내 연결 종료를 감지할 수 있습니다.<br />
[EventSource 재연결 동작](https://html.spec.whatwg.org/multipage/server-sent-events.html#processing-model), [Spring MVC 연결 종료 감지](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-async.html#disconnects)

## 서버가 두 대일 때

서버 A에서 알림을 저장했는데 사용자의 SSE 연결이 서버 B에 있을 수 있습니다.<br />
브로커 없이 두 대를 운영하는 원셋에서는 **A가 자기 연결에 전송하고, B의 내부 HTTP 엔드포인트에도 수신 사용자 ID를 전달**합니다.<br />
B는 자기 서버에 등록된 연결에만 전송합니다.

롤링 배포로 A가 내려가면 브라우저가 다시 접속하고, 로드밸런서는 요청을 정상 서버에 보냅니다.<br />
화면은 연결이 열리면 `hasUnread`를 다시 조회합니다.<br />
내부 HTTP 전달이 실패했지만 브라우저 연결이 유지된 경우에도 화면 복귀 시 상태를 조회하면 배지를 맞출 수 있습니다.<br />
두 서버 중 하나가 내려갔을 때는 남은 서버가 전체 SSE 연결과 재접속 직후의 조회를 감당할 수 있는지 확인합니다.

## 원셋에서 확인할 시나리오

| 시나리오 | 통과 기준 |
|---|---|
| 같은 사용자가 탭 두 개를 열고 새 알림을 받음 | 두 탭 모두 배지 갱신 |
| 다른 서버에 붙은 탭에서 마지막 알림을 읽음 | 열린 탭 모두에서 빨간 점 해제 |
| 다른 사용자에게 알림을 생성함 | 해당 수신자의 연결에만 갱신 신호 전송 |
| 배포 중 연결이 끊긴 사이에 알림이 생성됨 | 재연결 후 DB 상태와 배지 일치 |
