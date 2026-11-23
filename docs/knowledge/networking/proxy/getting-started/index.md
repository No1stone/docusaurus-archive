---
title: "Nginx 시작하기"
description: "Nginx 역할, master와 worker, nginx.conf 구조, Docker Compose 실습으로 시작하는 입구입니다."
slug: "/knowledge/networking/proxy/getting-started"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "Nginx"
  - "nginx.conf"
  - "master worker"
  - "Docker Compose"
  - "리버스 프록시"
---

# Nginx 시작하기

| 글 | 다루는 내용 |
|---|---|
| [Nginx란? 웹 서버와 리버스 프록시](./nginx-web-server-and-proxy.md) | Nginx는 파일을 HTTP로 제공하고, 앱 서버로 요청을 전달하고, 여러 업스트림으로 부하를 나누는 용도로 사용합니다. |
| [master와 worker, 이벤트 기반 처리](./master-worker-event-model.md) | Nginx를 실행하면 master와 worker 프로세스가 보입니다. |
| [nginx.conf와 include 설정 구조](./configuration-and-include.md) | 설정 조각을 어디에 붙여야 하는지 모르면 같은 지시문도 문맥 오류를 냅니다. |
| [Docker Compose로 Nginx 실행하기](./docker-compose-lab.md) | 이 시리즈에서는 요청 경로와 헤더를 그대로 돌려주는 백엔드 두 개를 사용합니다. |

## 자주 묻는 질문

### 이 시리즈 실습은 어디서 시작하나요?

Docker Compose로 Nginx 실행하기 글의 Compose 구성을 공통 기반으로 씁니다.

### nginx.conf를 여러 파일로 나눠도 되나요?

include로 나눕니다. 지시문이 어느 문맥(http, server, location)에 들어가야 하는지만 맞추면 됩니다.

