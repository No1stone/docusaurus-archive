---
title: "listen, server_name, location"
description: "listen, server_name, location으로 가상 호스트와 경로를 나누는 Nginx 기본 라우팅을 설명합니다."
slug: "/knowledge/networking/proxy/routing/listen-server-name-location"
sidebar_position: 1
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "listen"
  - "server_name"
  - "location"
  - "가상 호스트"
  - "Nginx 라우팅"
---

# listen, server_name, location

한 Nginx에서 여러 사이트를 제공하려면 포트, 호스트와 경로가 어떤 순서로 사용되는지 이해해야 합니다.
요청은 먼저 주소와 포트에 해당하는 서버 후보로 들어오고, 호스트 이름으로 server를 고른 뒤 location에서 경로를 처리합니다.

## 하나의 요청을 세 단계로 읽습니다

`http://app.example.com:8088/api/devices`를 Compose 실습으로 보낸다고 가정합니다.
호스트의 8088 포트가 컨테이너의 80 포트에 연결되므로 Nginx의 listen은 80입니다.
`Host`가 app.example.com이면 해당 server에서 `/api/devices`를 처리할 location을 찾습니다.

```nginx
server {
    listen 80 default_server;
    server_name _;
    return 404;
}

server {
    listen 80;
    server_name app.example.com;

    location /api/ {
        proxy_pass http://backend:8080;
    }
}
```

`default_server`는 해당 listen 주소와 포트의 기본 서버를 지정합니다.
`server_name _`는 이름을 읽기 쉽게 표시하는 관례이며, 모든 호스트를 매칭하는 특별한 와일드카드로 해석되지는 않습니다.
일치하는 이름이 없는 요청이 기본 서버로 들어가는 동작은 listen의 기본 서버 선택에 의해 결정됩니다.

| 요청 | 이 예제의 결과 |
|---|---|
| Host가 app.example.com이고 경로가 /api/devices | backend로 전달합니다. |
| Host가 unknown.example.com | 기본 서버가 404를 반환합니다. |
| IP 주소로 요청하고 별도 Host를 지정하지 않음 | 이름이 일치하지 않으면 기본 서버로 갑니다. |

## DNS와 server_name의 역할

DNS는 사용자를 Nginx에 도착하게 합니다.
`server_name`은 도착한 HTTP 요청을 분류합니다.
설정에 도메인을 적었다고 DNS 레코드가 생기는 것은 아니므로 둘을 각각 확인합니다.

```bash
curl -i -H 'Host: app.example.com' http://127.0.0.1:8088/api/devices
curl -i -H 'Host: unknown.example.com' http://127.0.0.1:8088/api/devices
```

TLS를 사용하면 인증서 선택과 SNI도 먼저 관여합니다.
우선 HTTP에서 Host에 따른 동작을 확인하고 HTTPS에서 같은 도메인 구성을 검증합니다.
선택 과정은 [Nginx 요청 처리 설명](https://nginx.org/en/docs/http/request_processing.html)을 참고합니다.
