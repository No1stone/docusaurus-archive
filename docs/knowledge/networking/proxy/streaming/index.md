---
title: "HTTP 스트리밍과 파일 전송"
description: "WebSocket, SSE 버퍼링과 재연결, 대용량 업로드와 다운로드를 Nginx 프록시에서 다루는 입구입니다."
slug: "/knowledge/networking/proxy/streaming"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "WebSocket"
  - "SSE"
  - "스트리밍"
  - "파일 업로드"
  - "proxy_buffering"
  - "Nginx"
---

# HTTP 스트리밍과 파일 전송

| 글 | 다루는 내용 |
|---|---|
| [WebSocket 프록시](./websocket.md) | WebSocket은 HTTP로 연결을 시작한 뒤 업그레이드를 통해 양방향 통신을 이어갑니다. |
| [SSE 프록시와 응답 버퍼링](./sse-buffering.md) | SSE는 서버가 text/event-stream 응답을 열어두고 이벤트를 계속 보내는 방식입니다. |
| [SSE 연결 유지, 하트비트와 재연결](./sse-reconnect.md) | SSE 연결은 배포와 네트워크 변화로 끊길 수 있습니다. |
| [파일 업로드와 다운로드](./file-transfers.md) | 파일 전송은 요청과 응답이 크고 클라이언트 속도가 일정하지 않습니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### SSE가 한꺼번에 몰려 오면?

proxy_buffering이 켜져 있으면 이벤트가 묶입니다. SSE 경로에서는 버퍼링을 끄는 경우가 많습니다.

### WebSocket은 어떤 헤더가 필요한가요?

Upgrade와 Connection을 넘기고, 읽기 타임아웃을 길게 잡는 설정이 필요합니다.

