---
format: md
id: k-client-server-struct
title: "client server struct"
description: "요청, 응답 기반 클라이언트-서버 구조와 분리의 이유"
tags:
  - HTTP
status: active
slug: /knowledge/k-client-server-struct
---
# client server struct

> **개요:** HTTP를 중심으로 한 클라이언트-서버의 요청, 응답 구조를 짧게 정리한 메모입니다.

## 구조

request / response 구조입니다.

1. 클라이언트는 요청을 보내고 응답을 기다립니다.
2. 서버가 요청에 대한 결과를 만들어 응답합니다.
3. 한 번의 요청-응답 흐름이 끝납니다.

양쪽이 독립적으로 진화하려면 클라이언트와 서버를 분리하는 것이 필요합니다.
