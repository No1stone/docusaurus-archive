---
format: md
id: k-http-basic
title: "http basic"
description: "HTTP의 클라이언트-서버, 비연결성, 메시지 구조를 짚는 기초 개념 메모입니다."
tags:
  - HTTP
status: active
slug: /knowledge/k-http-basic
---
# http basic

## 개요

HTTP의 클라이언트-서버, 비연결성, 메시지 구조를 짚는 기초 개념 메모입니다.

> 원문에는 외부 URL이 없고, Http is All, client server, connectionLess, http message라는 키워드만 있었습니다.
HTTP는 클라이언트가 요청을 보내고 서버가 응답하는 애플리케이션 계층 프로토콜입니다.
웹 브라우저와 API 클라이언트 모두 같은 메시지 모델을 씁니다.
요청을 시작하는 쪽(클라이언트)과 자원을 제공하는 쪽(서버)이 역할을 나눕니다.
서버는 요청을 기다리다가 메서드, 경로, 헤더, 본문을 해석해 상태 코드와 본문으로 응답합니다.
고전적인 설명에서 HTTP는 요청-응답 한 쌍이 끝나면 연결을 유지하지 않는 비연결형으로 자주 소개됩니다.
실제 전송은 TCP 위에서 이루어지며, HTTP/1.1 keep-alive나 HTTP/2 다중화로 연결을 재사용하는 경우가 많습니다.
개념 학습 단계에서는 요청 단위로 상태가 없다는 점과, 세션, 쿠키로 상태를 올리는 층을 구분하면 됩니다.
메시지는 시작줄, 헤더, 빈 줄, 선택적 본문으로 구성됩니다.
요청 시작줄에는 메서드와 대상, 버전이 들어가고, 응답 시작줄에는 상태 코드가 들어갑니다.
같은 아카이브의 [http is all](./http-is-all.md), [http message](./http-message.md)에 이어지는 메모가 있으면 함께 보면 됩니다.
- 원문에 외부 URL은 없었습니다.

<details>
<summary>참고 자료</summary>

- [HTTP 개요](https://developer.mozilla.org/ko/docs/Web/HTTP/Overview) — HTTP는 HTML 문서와 같은 리소스들을 가져올 수 있도록 해주는 프로토콜입니다. HTTP는 웹에서 이루어지는 모든 데이터 교환의 기초이며, 클라이언트-서버 프로토콜이기도 합니다. 클라이언트-서버 프로토콜이란 (보통 웹브라우저인) 수신자 측에 의해 요청이 초기화되는 프로토콜을 의미합니다. 하나의 완전한 문서는 텍스트,
</details>
