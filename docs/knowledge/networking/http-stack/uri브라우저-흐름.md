---
format: md
id: k-uri브라우저-흐름
title: "브라우저 주소창에서 서버 응답까지"
description: "주소창 입력부터 DNS, 연결, HTTP 요청, HTML 파싱과 Network 탭으로 흐름을 따라가는 방법을 정리합니다."
tags:
  - HTTP
status: active
slug: /knowledge/k-uri브라우저-흐름
---

# 브라우저 주소창에서 서버 응답까지

주소창에 `https://example.com/notifications`를 입력하면 브라우저는 URL을 해석하고, 필요한 연결을 준비한 뒤 HTTP 요청을 보냅니다.<br />
HTML이 도착하면 내용을 읽고 화면을 그리기 시작합니다.<br />
이 과정에서 CSS, JavaScript, 이미지, API 데이터도 필요에 따라 가져옵니다.

```text
주소창 입력 → URL 해석 → DNS, 연결 확인 → HTTP 요청
          → CDN, 프록시, 애플리케이션 중 해당 서버에서 응답
          → 브라우저가 응답을 읽고 화면을 구성
```

## 서버에 연결하는 과정

1. **URL을 해석합니다.** `https`는 스킴, `example.com`은 호스트, `/notifications`는 요청 경로입니다. HTTPS 주소에 포트가 생략되면 기본 포트는 `443`입니다.
2. **호스트 이름을 해석합니다.** 새 연결에 주소가 필요하면 DNS 결과를 확인합니다. 이미 조회한 주소가 캐시에 있거나 기존 연결을 재사용할 수 있으면 이 단계가 짧아질 수 있습니다.
3. **연결을 준비합니다.** HTTPS에서 HTTP/1.1이나 HTTP/2를 사용하면 일반적으로 TCP 연결 위에서 TLS를 사용합니다. HTTP/3는 QUIC을 사용하며 TLS가 연결 설정에 통합됩니다.
4. **HTTP 요청을 보냅니다.** 브라우저는 `/notifications`를 요청합니다. CDN 캐시가 응답할 수도 있고, 리버스 프록시를 거쳐 애플리케이션까지 전달될 수도 있습니다.

[WHATWG URL Standard](https://url.spec.whatwg.org/), [HTTPS URI](https://www.rfc-editor.org/rfc/rfc9110.html#section-4.2.2), [HTTP/3 연결 설정](https://www.rfc-editor.org/rfc/rfc9114.html#section-3.2)

## HTML 응답에서 화면까지

브라우저는 응답 상태와 헤더를 확인합니다.<br />
예를 들어 `200`과 `Content-Type: text/html`을 받으면 HTML을 파싱하고, 문서가 참조하는 CSS와 JavaScript 등을 가져옵니다.<br />
HTML을 읽는 동안 필요한 리소스를 요청할 수 있어서, 모든 다운로드가 끝나는 시점과 화면이 처음 표시되는 시점은 다를 수 있습니다.

알림 화면을 예로 들면 HTML과 JavaScript로 화면을 구성한 뒤, `GET /notifications/unread-status`를 호출해 빨간 점의 초기 상태를 표시할 수 있습니다.<br />
화면이 SSE를 구독한다면 이후에는 `text/event-stream` 응답에서 변경 신호를 받아 상태를 다시 읽습니다.<br />
[HTML 파싱 표준](https://html.spec.whatwg.org/multipage/parsing.html), [Server-Sent Events 표준](https://html.spec.whatwg.org/multipage/server-sent-events.html)

## 개발자 도구에서 흐름 따라가기

| 궁금한 점 | Network 탭에서 볼 곳 |
|---|---|
| 주소가 바뀌었는가 | 문서 요청의 상태 코드와 `Location` 헤더 |
| 어느 단계에서 시간이 걸렸는가 | 요청의 Timing에서 DNS, 연결, TLS, 응답 대기 구간 |
| 어떤 요청이 화면 데이터를 채우는가 | Fetch/XHR 요청과 응답 본문 |
| 알림 스트림이 열려 있는가 | `text/event-stream` 응답과 수신 이벤트 |

캐시와 연결 재사용 여부에 따라 Timing에 표시되는 항목은 달라질 수 있습니다.<br />
같은 페이지를 처음 열었을 때와 새로고침했을 때의 요청을 나란히 보면 그 차이를 확인할 수 있습니다.

Firefox가 이 흐름을 내부에서 어떻게 처리하는지 더 깊게 보고 싶다면 Mozilla의 **Firefox Source Docs**에서 네트워크 구현 문서를 찾아볼 수 있습니다.<br />
[Firefox Source Docs](https://firefox-source-docs.mozilla.org/), [Firefox 네트워크 문서](https://firefox-source-docs.mozilla.org/networking/index.html)
