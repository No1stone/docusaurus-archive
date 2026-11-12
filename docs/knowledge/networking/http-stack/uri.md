---
format: md
id: k-uri
title: "URI, URL, URN과 URL 구조"
description: "URI, URL, URN 차이와 스킴, 호스트, 경로, 쿼리, 프래그먼트, URLSearchParams를 정리합니다."
tags:
  - HTTP
status: active
slug: /knowledge/k-uri
---

# URI, URL, URN의 차이와 URL 구조

브라우저 주소창에 입력하는 `https://example.com/notifications/123`은 URL입니다.<br />
주소의 각 부분은 서로 다른 역할을 합니다.<br />
브라우저는 호스트를 보고 어디에 연결할지 판단하고, 서버는 경로와 쿼리를 읽어 어떤 요청을 처리할지 결정합니다.

## URI, URL, URN

| 용어 | 의미 | 예시 |
|---|---|---|
| URI | 자원을 식별하는 문자열을 가리키는 넓은 개념 | 아래 URL과 URN 모두 해당 |
| URL | 자원에 접근하는 방법을 담은 식별자 | `https://example.com/notifications/123` |
| URN | `urn:` 스킴으로 자원에 이름을 붙이는 식별자 | `urn:isbn:9780132350884` |

웹 API를 설계할 때는 주로 URL을 다룹니다.<br />
예를 들어 도서 검색 API의 URL은 어디로 요청을 보낼지 알려주고, ISBN을 표현한 URN은 어떤 책인지 식별합니다.<br />
브라우저와 JavaScript에서 URL이 어떻게 파싱되는지는 WHATWG URL Standard를 참고할 수 있습니다.<br />
[RFC 3986의 URI 용어](https://www.rfc-editor.org/rfc/rfc3986.html#section-1.1.3), [WHATWG URL Standard](https://url.spec.whatwg.org/)

## URL을 구성하는 부분

```text
https://example.com:8443/notifications?status=unread#latest
```

| 부분 | 값 | 역할 |
|---|---|---|
| 스킴 | `https` | HTTPS 주소로 처리 |
| 호스트 | `example.com` | 연결할 대상의 이름 |
| 포트 | `8443` | 연결할 포트 |
| 경로 | `/notifications` | 서버에 요청할 자원의 경로 |
| 쿼리 | `status=unread` | 이 API에서 미확인 알림만 조회하는 조건 |
| 프래그먼트 | `latest` | 응답을 받은 뒤 브라우저나 프론트 라우터가 해석할 위치 또는 상태 |

이 주소를 브라우저에서 열면 서버에는 `/notifications?status=unread`가 요청됩니다.<br />
`#latest`는 HTTP 요청 대상에서 빠지고 브라우저에 남습니다.<br />
페이지 안에 `id="latest"`가 있다면 해당 위치로 이동하는 데 사용할 수 있습니다.<br />
[RFC 3986의 프래그먼트](https://www.rfc-editor.org/rfc/rfc3986.html#section-3.5), [RFC 9112의 HTTP/1.1 요청 대상](https://www.rfc-editor.org/rfc/rfc9112.html#section-3.2)

## 검색값이 들어가는 URL 만들기

검색어에 공백이나 `&`가 들어가면, 문자열을 직접 이어 붙였을 때 쿼리 구조가 달라질 수 있습니다.<br />
`URL`과 `URLSearchParams`를 사용하면 값을 넣는 시점에 필요한 인코딩을 적용할 수 있습니다.

```javascript
const url = new URL("/notifications", "https://example.com");
url.searchParams.set("keyword", "승인 & 결제");
url.searchParams.set("status", "unread");

console.log(url.href);
```

이 예제의 `/notifications`는 상대 참조이므로 기준 주소와 함께 해석합니다.<br />
브라우저에서 받은 URL을 분해하거나 쿼리 값을 추가할 때도 같은 API를 사용할 수 있습니다.<br />
[WHATWG URL 및 URLSearchParams](https://url.spec.whatwg.org/#api)
