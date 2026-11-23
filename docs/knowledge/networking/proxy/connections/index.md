---
title: "연결과 부하 분산"
description: "upstream 밸런싱, keepalive, 타임아웃, DNS와 컨테이너 주소, 장애 전환과 재시도를 다루는 입구입니다."
slug: "/knowledge/networking/proxy/connections"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "upstream"
  - "keepalive"
  - "timeout"
  - "failover"
  - "로드밸런싱"
  - "Nginx"
---

# 연결과 부하 분산

| 글 | 다루는 내용 |
|---|---|
| [upstream과 부하 분산 방식](./upstream-balancing.md) | 앱을 두 인스턴스로 늘리면 Nginx가 어느 인스턴스에 요청을 전달할지 정해야 합니다. |
| [keepalive와 연결 재사용](./keepalive.md) | 프록시에서는 클라이언트와 Nginx의 연결, Nginx와 앱의 연결이 각각 존재합니다. |
| [연결, 전송, 응답 타임아웃](./timeouts.md) | 사용자가 504를 봤을 때 기다리는 시간을 늘리기 전에 어느 연결이 멈췄는지 확인합니다. |
| [업스트림 장애 감지와 요청 재시도](./failover-and-retries.md) | 업스트림 한 대가 실패하면 다른 대상으로 넘길 수 있습니다. |
| [DNS와 컨테이너 주소 변경](./dns-and-container-addresses.md) | Compose에서 backend 컨테이너를 재생성하면 IP가 바뀔 수 있습니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### 컨테이너 IP가 바뀌면 upstream이 깨지나요?

고정 IP를 upstream에 넣으면 깨질 수 있습니다. resolver와 변수 기반 proxy_pass로 재해석을 엽니다.

### keepalive는 어디에 넣나요?

upstream 블록에 keepalive를 두고, 연결을 재사용할 헤더, 버전 설정을 맞춥니다.

