---
title: "Host, Forwarded 헤더와 실제 클라이언트 IP"
description: "X-Forwarded-For, X-Forwarded-Proto, real_ip로 클라이언트 IP와 스킴을 앱에 전달하는 설정을 다룹니다."
slug: "/knowledge/networking/proxy/routing/forwarded-headers-real-ip"
sidebar_position: 6
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "X-Forwarded-For"
  - "X-Forwarded-Proto"
  - "real_ip"
  - "클라이언트 IP"
  - "Nginx"
---

# Host, Forwarded 헤더와 실제 클라이언트 IP

리버스 프록시 뒤의 앱이 보는 연결 상대는 프록시입니다.
원래 클라이언트 주소와 HTTPS 여부를 전달하려면 헤더를 설정하고, 앱에서 그 값을 신뢰할 수 있는 경계를 정합니다.
접속 로그, 리다이렉트 URL과 보안 쿠키가 이 설정의 영향을 받을 수 있습니다.

## 단일 공개 프록시의 예

```nginx
location /api/ {
    proxy_pass http://backend:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

이 예제에서는 Nginx가 직접 받은 연결의 주소로 X-Forwarded-For를 덮어씁니다.
외부 사용자가 같은 이름의 헤더를 보냈을 때 이를 원래 주소로 그대로 신뢰하지 않기 위한 선택입니다.
Nginx가 ALB 뒤에 있다면 이 구성은 ALB 주소를 전달할 수 있으므로 체인을 따로 설계합니다.

| 값 | 확인할 내용 |
|---|---|
| `$remote_addr` | 현재 Nginx에서 해석한 클라이언트 주소입니다. realip 설정에 따라 바뀔 수 있습니다. |
| `$host` | 요청을 처리하는 호스트 값을 전달합니다. 수용할 도메인과 기본 서버 정책도 정합니다. |
| `$scheme` | Nginx에 들어온 연결의 프로토콜입니다. 앞단 TLS 종료 시 원래 프로토콜과 다를 수 있습니다. |

## 프록시 체인과 realip

realip 모듈을 사용할 경우 신뢰하는 프록시의 주소 범위만 set_real_ip_from에 지정합니다.
`0.0.0.0/0` 전체를 신뢰하면 사용자가 전달한 주소를 믿게 되는 경로가 생길 수 있습니다.
ALB나 다른 ingress가 있다면 해당 계층이 어떤 헤더를 덮어쓰거나 추가하는지 함께 확인합니다.

앱에서도 forwarded 헤더를 해석하는 설정과 직접 접근 가능한 네트워크 범위를 같이 정합니다.
사용자 ID와 권한은 인증된 정보에서 가져오고, IP 헤더는 목적에 맞는 접속 정보로 취급합니다.

## 위조 헤더를 보내 확인합니다

```bash
curl -sS -H 'Host: app.example.com' -H 'X-Forwarded-For: 203.0.113.7' http://127.0.0.1:8088/api/devices
```

Compose 실습 응답의 headers에서 외부 입력이 덮어써졌는지 확인합니다.
다중 프록시에서는 사용자에서 앱까지 각 구간의 주소와 헤더를 기록해 비교합니다.
원래 주소 해석은 [realip 모듈](https://nginx.org/en/docs/http/ngx_http_realip_module.html), 표준 헤더는 [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Forwarded)를 참고합니다.
