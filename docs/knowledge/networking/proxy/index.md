---
id: networking-proxy
title: "Proxy / Nginx"
sidebar_label: "Proxy / Nginx"
description: "포워드, 리버스 프록시부터 Nginx 경로 전달, Stream, 캐시, 로그, 장애 분석까지 9개 묶음으로 읽는 프록시와 Nginx 가이드입니다."
slug: /knowledge/networking/proxy
sidebar_position: 0
tags:
  - nginx
  - HTTP
status: active
keywords:
  - "Nginx"
  - "리버스 프록시"
  - "reverse proxy"
  - "proxy_pass"
  - "upstream"
  - "Stream"
  - "WebSocket"
  - "SSE"
  - "proxy_cache"
  - "프록시"
---

# Proxy / Nginx

공개 주소로 들어온 요청이 내부 앱에 도착하고, 응답이 사용자에게 돌아가는 흐름을 살펴봅니다.
포워드 프록시와 리버스 프록시에서 시작해 경로 변환, 연결 관리, 스트리밍과 장애 분석으로 이어집니다.

설정 예제는 [Docker Compose 실습](./getting-started/docker-compose-lab.md)을 공통 기반으로 사용합니다.
Stream 묶음에는 직접 구성한 [infra-dev](https://github.com/No1stone/infra-dev)의 RabbitMQ와 DB 연결 사례를 연결했습니다.

| 순서 | 묶음 | 글 수 |
|---|---|---|
| 01 | [프록시 이해하기](./basics/index.md) | 3 |
| 02 | [Nginx 시작하기](./getting-started/index.md) | 4 |
| 03 | [요청과 경로 전달](./routing/index.md) | 6 |
| 04 | [연결과 부하 분산](./connections/index.md) | 5 |
| 05 | [HTTP 스트리밍과 파일 전송](./streaming/index.md) | 4 |
| 06 | [TCP와 UDP 프록시](./stream/index.md) | 4 |
| 07 | [HTTPS와 접근 제어](./security/index.md) | 4 |
| 08 | [캐시와 응답 최적화](./caching/index.md) | 2 |
| 09 | [로그와 장애 분석](./observability/index.md) | 6 |

## 자주 묻는 질문

### rewrite와 upstream 예전 메모는 어디에 있나요?

[기존 Nginx 메모](./legacy/index.md)에 모았습니다.
공개 URL(`/docs/knowledge/k-rewrite`, `/docs/knowledge/k-upstream` 등)은 그대로입니다.

### Docker Compose로 바로 실습하려면?

[Docker Compose로 Nginx 실행하기](./getting-started/docker-compose-lab.md)부터 시작하면 됩니다.

### WebSocket이나 SSE는 어느 묶음인가요?

[HTTP 스트리밍과 파일 전송](./streaming/index.md)에서 WebSocket, SSE, 파일 전송을 다룹니다.
