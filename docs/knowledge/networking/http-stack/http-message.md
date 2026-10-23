---
format: md
id: k-http-message
title: "http message"
description: "HTTP 요청, 응답 메시지 구조 예시 메모"
tags:
  - HTTP
status: active
slug: /knowledge/k-http-message
---
# http message

> **개요:** HTTP 요청과 응답 메시지의 형태를 예시로 적어 둔 메모입니다.

## request

```http
GET /test1?search=a1=1&b1=2
Host: google.com
```

원 노트에는 `searcg`로 적혀 있었고, 쿼리 구분자도 다소 느슨합니다.
의도만 보면 경로, 쿼리와 Host 헤더를 가진 GET 요청입니다.

## response

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 3423
```

상태 줄과 헤더(콘텐츠 타입, 길이) 다음에 본문이 옵니다.
