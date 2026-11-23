---
title: "DNS와 컨테이너 주소 변경"
description: "컨테이너 IP가 바뀔 때 upstream DNS 재해석과 resolver, variable proxy_pass를 다룹니다."
slug: "/knowledge/networking/proxy/connections/dns-and-container-addresses"
sidebar_position: 5
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "resolver"
  - "DNS"
  - "컨테이너 IP"
  - "variable proxy_pass"
  - "Nginx"
---

# DNS와 컨테이너 주소 변경

Compose에서 backend 컨테이너를 재생성하면 IP가 바뀔 수 있습니다.
서비스 이름이 같아도 Nginx가 그 주소를 언제 다시 해석하는지에 따라 이전 주소로 연결하는 문제가 생깁니다.
업스트림 이름과 DNS 갱신 방식을 같이 관리합니다.

## 먼저 실제 네트워크를 확인합니다

같은 Compose 네트워크에서는 서비스 이름을 사용합니다.
Docker의 사용자 정의 네트워크에서 제공하는 내장 DNS는 일반적으로 `127.0.0.11` 주소를 사용합니다.
이 주소는 Docker 컨테이너 안에서의 설정이며, 호스트 설치나 Kubernetes에서는 해당 환경의 DNS를 지정해야 합니다.

```nginx
# http 문맥. OSS Nginx 1.27.3 이상을 가정합니다.
resolver 127.0.0.11 valid=10s ipv6=off;

upstream app_pool {
    zone app_pool 64k;
    server backend:8080 resolve;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://app_pool;
    }
}
```

server의 resolve 지원 여부는 Nginx 버전을 확인합니다.
이 구성은 공유 zone과 resolver를 이용해 이름의 주소 변경을 반영합니다.
오래된 버전에서 같은 지시문을 넣으면 설정 검사부터 실패할 수 있습니다.

## 시작 시점과 운영 중 변경

| 현상 | 확인 |
|---|---|
| 시작할 때 host not found | 서비스 이름, 공유 네트워크, 시작 시 DNS 등록을 확인합니다. |
| 앱 재생성 뒤 일부 요청이 실패 | 실제 목적지 IP와 DNS 결과를 비교합니다. |
| DNS 응답은 바뀌었는데 계속 실패 | upstream이 재해석하는 설정인지와 갱신 시간을 확인합니다. |

변수를 사용한 proxy_pass와 resolver 조합도 가능하지만 URI 전달 규칙이 달라질 수 있습니다.
동적 DNS를 붙인 뒤에도 [경로 전달 예제](../routing/proxy-pass-uri.md)를 다시 확인합니다.

```bash
docker compose exec nginx nginx -v
docker compose exec nginx nginx -T
```

실습에서는 앱을 재생성한 뒤 연속 요청의 성공 여부와 실제 주소 변화를 관찰합니다.
정확한 버전 조건은 [upstream server의 resolve](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server), DNS 동작은 [Docker 네트워크 문서](https://docs.docker.com/engine/network/)를 참고합니다.
