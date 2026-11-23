---
title: "WebSocket 프록시"
description: "Upgrade 헤더와 proxy 설정으로 WebSocket을 Nginx 뒤에서 안정적으로 전달하는 방법을 설명합니다."
slug: "/knowledge/networking/proxy/streaming/websocket"
sidebar_position: 1
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "WebSocket"
  - "Upgrade"
  - "Connection"
  - "proxy_set_header"
  - "Nginx"
---

# WebSocket 프록시

WebSocket은 HTTP로 연결을 시작한 뒤 업그레이드를 통해 양방향 통신을 이어갑니다.
일반 API를 프록시하던 설정에 업그레이드 헤더 전달을 추가하고, 연결이 살아 있어야 하는 시간과 재연결 시나리오를 함께 확인합니다.

## HTTP 업그레이드를 전달합니다

아래 map과 server는 http 문맥에 둡니다.
`/ws/`를 처리하는 WebSocket 서버가 backend에서 실행된다고 가정합니다.

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    location /ws/ {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 120s;
    }
}
```

Upgrade와 Connection은 홉 단위로 처리되므로 명시적으로 전달합니다.
정상 연결에서는 101 응답 이후 메시지를 송수신합니다.
HTTP용 응답기만 실행한 공통 Compose 실습에서는 WebSocket 연결이 성립하지 않으므로 실제 WebSocket 엔드포인트를 준비합니다.

## 연결 성공 이후도 확인합니다

| 단계 | 확인할 결과 |
|---|---|
| 핸드셰이크 | 요청이 올바른 경로에 도착하고 101을 받습니다. |
| 유휴 연결 | 서버 ping과 프록시 read timeout의 간격을 비교합니다. |
| 앱 재시작 | 클라이언트가 끊김을 감지하고 지연을 두어 다시 연결합니다. |
| 재구독 | 새 연결에서 필요한 사용자 채널을 다시 구독합니다. |

연결이 끊겨 있는 동안 보낸 업무 이벤트를 복원해야 한다면 이벤트 저장과 재조회가 필요합니다.
사용자 인증과 채널별 구독 권한도 앱에서 확인합니다.
연결 성공만으로 모든 채널 접근을 허용하지 않도록 설계합니다.

설정 후 브라우저 개발자 도구에서 WebSocket 핸드셰이크와 프레임을 확인합니다.
프록시 read timeout과 서버 ping 동작은 [공식 WebSocket 문서](https://nginx.org/en/docs/http/websocket.html)를 참고합니다.
