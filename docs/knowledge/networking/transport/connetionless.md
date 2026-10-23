---
format: md
id: k-connetionless
title: "connetionLess"
description: "HTTP 비연결성과 persistent connection, HTTP/2 메모"
tags:
  - HTTP
status: active
slug: /knowledge/k-connetionless
---
# connetionLess

> **개요:** HTTP의 비연결성(연결을 길게 유지하지 않는 특성)과, 이후 persistent connection, HTTP/2 최적화를 적어 둔 메모입니다.
> 원 제목 철자(connetionLess)는 그대로 둡니다.

## 비연결성

연결을 유지하지 않습니다.
수천 명이 서비스를 써도 서버가 동시에 처리하는 요청은 수십 개 이하로 작을 수 있습니다.
그래서 서버를 유지하는 자원을 최소화할 수 있습니다.

다만 요청마다 TCP/IP 연결을 새로 맺어야 합니다.
웹 페이지를 열면 HTML, CSS, JS 등 많은 자료를 받습니다.

## 이후 변화

현재는 persistent connection으로 연결을 재사용하는 경우가 많습니다.
HTTP/2에서는 이 부분이 더 최적화되었다는 메모입니다.
