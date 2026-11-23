---
title: "TCP와 UDP 프록시"
description: "Nginx stream으로 TCP와 UDP 프록시, TLS 패스스루와 SNI, http와 stream 경계를 다루는 입구입니다."
slug: "/knowledge/networking/proxy/stream"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "Nginx stream"
  - "TCP 프록시"
  - "UDP"
  - "SNI"
  - "TLS passthrough"
---

# TCP와 UDP 프록시

| 글 | 다루는 내용 |
|---|---|
| [Stream 모듈과 HTTP 프록시의 차이](./stream-and-http.md) | 브라우저의 RabbitMQ 관리 콘솔과 앱의 AMQP 연결은 같은 서버를 사용해도 전달 방식이 다릅니다. |
| [TCP 프록시와 부하 분산](./tcp-balancing.md) | MySQL과 RabbitMQ처럼 TCP 세션을 사용하는 서비스 앞에 Nginx를 둘 수 있습니다. |
| [UDP 프록시와 응답 처리](./udp.md) | UDP는 TCP처럼 연결을 수립하고 바이트 스트림을 주고받는 방식과 다릅니다. |
| [TLS 패스스루와 SNI 라우팅](./tls-passthrough-sni.md) | 앱이 인증서를 관리하고 TLS를 직접 종료해야 한다면 Nginx는 TCP 연결을 그대로 중계할 수 있습니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### http와 stream은 언제 나누나요?

HTTP 헤더를 보고 라우팅하면 http, TCP/UDP 바이트만 넘기면 stream입니다.

### TLS를 Nginx에서 안 풀고 넘기려면?

stream에서 TLS passthrough와 SNI(ssl_preread)로 대상 서버를 고릅니다.

