---
format: md
id: k-content-mime-type
title: MIME 타입과 Content-Type
description: "미디어 타입, Content-Type과 Accept, SSE의 text/event-stream, Content-Disposition을 정리합니다."
tags:
  - HTTP
status: active
slug: /knowledge/k-content-mime-type
---

# MIME 타입과 HTTP Content-Type

`application/json`, `image/png`, `text/event-stream` 같은 값을 **MIME 타입** 또는 **미디어 타입**이라고 합니다.<br />
HTTP는 `Content-Type` 헤더에 이 값을 넣어 요청이나 응답 본문을 어떻게 해석할지 알려줍니다.<br />
JSON API에서는 본문을 JSON으로 읽고, SSE에서는 본문을 이벤트 스트림으로 계속 읽습니다.<br />
[RFC 9110의 Content-Type](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.3)

미디어 타입은 `타입/하위타입`으로 쓰고, 형식에 따라 `charset`이나 `boundary` 같은 파라미터를 붙입니다.<br />
등록된 타입은 IANA 목록에서 확인할 수 있습니다.<br />
[IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml)

## 웹에서 자주 쓰는 MIME 타입

| 데이터 | 미디어 타입 |
|---|---|
| HTML | `text/html` |
| CSS | `text/css` |
| JavaScript | `text/javascript` |
| 일반 텍스트 | `text/plain` |
| JSON | `application/json` |
| XML | `application/xml` |
| PNG, JPEG, SVG | `image/png`, `image/jpeg`, `image/svg+xml` |
| PDF, ZIP | `application/pdf`, `application/zip` |
| 형식을 특정하지 않는 바이너리 | `application/octet-stream` |
| 일반 폼 전송 | `application/x-www-form-urlencoded` |
| 파일과 입력값을 함께 전송 | `multipart/form-data` |
| 서버가 이벤트를 계속 보내는 SSE | `text/event-stream` |

## `Content-Type`과 `Accept`는 무엇을 말하나요?

요청의 `Content-Type`은 **지금 보낸 본문의 형식**이고, `Accept`는 **응답으로 받고 싶은 형식**입니다.<br />
응답의 `Content-Type`에는 서버가 실제로 보낸 본문 형식이 들어갑니다.<br />
[RFC 9110의 Content-Type](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.3), [RFC 9110의 Accept](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.1)

```http
POST /api/notifications HTTP/1.1
Host: example.com
Content-Type: application/json
Accept: application/json

{"title":"승인이 완료되었습니다"}
```

파일을 업로드할 때 `multipart/form-data`의 `boundary`는 본문에서 각 입력 항목을 구분하는 값입니다.<br />
브라우저의 `fetch()`에 `FormData`를 넘기면 브라우저가 본문과 그에 맞는 헤더를 함께 생성합니다.<br />
[RFC 7578의 multipart/form-data](https://www.rfc-editor.org/rfc/rfc7578.html#section-4.1)

## SSE는 `text/event-stream`으로 응답합니다

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

event: notification.changed
data: {}

```

이 응답을 받은 브라우저의 `EventSource`는 연결을 열어둔 채 이벤트를 읽습니다.<br />
이벤트 하나는 빈 줄로 끝납니다.<br />
알림 배지 예제에서는 `notification.changed`를 받으면 알림함 API를 다시 호출해 빨간 점을 갱신합니다.<br />
[WHATWG Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)

## 파일 형식과 다운로드 동작을 각각 지정합니다

PDF를 내려줄 때 `Content-Type`은 본문의 형식을 알려주고, `Content-Disposition`은 브라우저에 파일을 첨부로 처리하도록 요청합니다.

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="report.pdf"
```

화면에서 PDF를 열어 보여주는 응답에는 `inline`을 사용할 수 있습니다.<br />
파일을 다운로드시키는 경우에도 PDF라는 형식은 `application/pdf`로 표현할 수 있습니다.<br />
[RFC 6266의 Content-Disposition](https://www.rfc-editor.org/rfc/rfc6266.html#section-4.2)
