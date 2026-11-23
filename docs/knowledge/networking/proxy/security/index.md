---
title: "HTTPS와 접근 제어"
description: "TLS 종료, IP와 Basic Auth, rate limit, ALB 뒤 프록시 체인에서 HTTPS 오류를 다루는 입구입니다."
slug: "/knowledge/networking/proxy/security"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "TLS"
  - "HTTPS"
  - "rate limit"
  - "Basic Auth"
  - "ALB"
  - "Nginx 보안"
---

# HTTPS와 접근 제어

| 글 | 다루는 내용 |
|---|---|
| [TLS 종료와 HTTPS 리다이렉트](./tls-termination.md) | HTTPS를 구성할 때 인증서를 어디서 제공하고 어느 연결까지 암호화할지 먼저 정합니다. |
| [ALB 뒤의 Nginx와 다중 프록시](./alb-and-proxy-chain.md) | ALB가 HTTPS를 받고 Nginx에 HTTP로 전달하면 Nginx는 자신의 구간을 HTTP로 관찰합니다. |
| [IP 접근 제한과 Basic 인증](./ip-and-basic-auth.md) | 내부 관리 화면이나 임시 운영 페이지는 접근 가능한 사용자와 네트워크 범위를 정해 공개합니다. |
| [요청 속도 제한과 연결 수 제한](./rate-and-connection-limits.md) | 로그인이나 검색 API에 요청이 몰릴 때 앱 앞에서 호출 빈도를 조절할 수 있습니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### ALB 뒤에서 HTTPS 리다이렉트 루프가 나면?

X-Forwarded-Proto를 보고 스킴을 판별하도록 Nginx와 앱을 맞춥니다.

### 관리 경로만 막고 싶으면?

allow/deny나 Basic Auth를 해당 location에만 걸면 됩니다.

