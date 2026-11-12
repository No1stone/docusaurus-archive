---
format: md
id: k-http-message
title: "HTTP 메시지"
description: "HTTP 요청과 응답 메시지 구성, 상태 코드, Network 탭으로 확인하는 방법을 정리합니다."
tags:
  - HTTP
status: active
slug: /knowledge/k-http-message
---

# HTTP 요청과 응답 메시지 읽기

브라우저가 알림함을 열면 서버에 **어떤 자원을 어떻게 요청하는지** 전달합니다.<br />
서버는 **처리 결과와 데이터 형식**을 응답에 담습니다.<br />
HTTP/1.1 예제로 보면 요청과 응답의 구성이 한눈에 드러납니다.<br />
[RFC 9112의 메시지 형식](https://www.rfc-editor.org/rfc/rfc9112.html#section-2.1)

## 요청 메시지

```http
GET /notifications?status=unread HTTP/1.1
Host: example.com
Accept: application/json

```

| 구성 | 예시 | 읽는 방법 |
|---|---|---|
| 요청 줄 | `GET /notifications?status=unread HTTP/1.1` | 메서드, 요청 대상, HTTP 버전 |
| 헤더 | `Host`, `Accept` | 대상 호스트와 클라이언트가 받고 싶은 형식 |
| 빈 줄 | 헤더 마지막 줄 다음 | 헤더 영역의 끝 |
| 본문 | 이 예제에는 없음 | JSON 입력이나 파일 업로드처럼 요청에 담아 보낼 데이터 |

경로와 쿼리는 요청 줄에 들어갑니다.<br />
JSON을 보내는 `POST`라면 빈 줄 뒤에 JSON 본문을 두고 요청 헤더에 `Content-Type: application/json`을 붙입니다.<br />
`Accept`는 응답으로 받고 싶은 형식을 표현합니다.<br />
[RFC 9110의 Content-Type과 Accept](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.3), [Accept 헤더](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.1)

## 응답 메시지

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 18

{"hasUnread":true}
```

첫 줄의 `200`은 HTTP 요청이 성공했다는 상태 코드입니다.<br />
알림 배지를 표시할지는 본문의 `hasUnread`를 읽어서 결정합니다.<br />
미확인 알림이 없다면 같은 `200` 응답으로 `{"hasUnread":false}`를 반환할 수 있습니다.<br />
`Content-Length`는 이 예제에서 본문이 18바이트라는 뜻입니다.<br />
[RFC 9110의 상태 코드](https://www.rfc-editor.org/rfc/rfc9110.html#section-15), [Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.6)

## 브라우저에서 메시지 확인하기

개발자 도구의 **Network** 탭에서 요청 하나를 선택하면 메서드, 상태 코드, 요청, 응답 헤더, 본문을 확인할 수 있습니다.<br />
알림 배지가 갱신되지 않는다면 `unread-status` 요청이 나갔는지 보고, 그다음 응답의 상태 코드와 `hasUnread`를 확인하면 문제를 좁힐 수 있습니다.

위 예제는 HTTP/1.1에서 메시지가 보이는 형태입니다.<br />
HTTP/2와 HTTP/3에서는 프레임으로 전송하지만, 개발자 도구에서는 메서드와 상태 코드, 헤더처럼 익숙한 단위로 확인할 수 있습니다.<br />
[HTTP/2 프레임](https://www.rfc-editor.org/rfc/rfc9113.html#section-4), [HTTP/3 프레임](https://www.rfc-editor.org/rfc/rfc9114.html#section-7)
