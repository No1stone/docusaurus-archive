---
title: "SSE 프록시와 응답 버퍼링"
description: "SSE(Server-Sent Events)에서 proxy_buffering이 끊김을 만드는 이유와 끄는 설정을 정리합니다."
slug: "/knowledge/networking/proxy/streaming/sse-buffering"
sidebar_position: 2
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "SSE"
  - "Server-Sent Events"
  - "proxy_buffering"
  - "스트리밍"
  - "Nginx"
---

# SSE 프록시와 응답 버퍼링

SSE는 서버가 text/event-stream 응답을 열어두고 이벤트를 계속 보내는 방식입니다.
앱이 이벤트를 flush했는데 브라우저에서는 몇 개씩 모여 도착한다면 중간 프록시의 응답 버퍼링을 확인합니다.
시간을 두고 이벤트가 도착해야 하는 경로는 일반 JSON API와 다르게 설정할 수 있습니다.

```nginx
location /events/ {
    proxy_pass http://backend:8080;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 120s;
}
```

## 어떤 버퍼를 끄는가

proxy_buffering은 업스트림에서 읽은 응답을 Nginx가 버퍼링하는 동작을 제어합니다.
요청 본문을 처리하는 proxy_request_buffering은 별도 설정입니다.
SSE 응답에서는 업스트림이 `X-Accel-Buffering: no`로 응답 버퍼링을 제어하는 방법도 있으므로 앱과 프록시 중 어디에 정책을 둘지 정합니다.

```text
id: 101
event: notification
data: {"unreadCount":3}

```

이벤트는 빈 줄로 구분됩니다.
앱은 적절한 Content-Type을 반환하고 이벤트 경계에서 데이터를 내보내야 합니다.

## 실제 도착 시간을 비교합니다

```bash
curl -N -H 'Accept: text/event-stream' http://127.0.0.1:8088/events/notifications
```

동작하는 SSE 엔드포인트를 준비한 뒤 업스트림 직접 호출과 Nginx 경유 호출을 비교합니다.
`-N`은 curl 출력 버퍼링을 꺼서 도착한 데이터를 관찰하기 쉽게 합니다.
앱의 전송 버퍼, 압축, CDN과 ALB 등 다른 계층도 같은 경로에서 확인합니다.

연결의 생존 조건과 유실 복구는 [SSE 재연결](./sse-reconnect.md)에서 이어집니다.
응답 버퍼의 의미는 [proxy_buffering](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering), 이벤트 형식은 [MDN SSE 가이드](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)를 참고합니다.
