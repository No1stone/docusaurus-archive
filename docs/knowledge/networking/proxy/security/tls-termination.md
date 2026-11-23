---
title: "TLS 종료와 HTTPS 리다이렉트"
description: "Nginx에서 TLS를 종료하고 백엔드로 HTTP를 넘기는 인증서와 프로토콜 설정을 다룹니다."
slug: "/knowledge/networking/proxy/security/tls-termination"
sidebar_position: 1
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "TLS 종료"
  - "ssl_certificate"
  - "HTTPS"
  - "Nginx"
  - "인증서"
---

# TLS 종료와 HTTPS 리다이렉트

HTTPS를 구성할 때 인증서를 어디서 제공하고 어느 연결까지 암호화할지 먼저 정합니다.
Nginx에서 TLS를 종료하면 클라이언트의 HTTPS 요청을 복호화한 뒤 앱으로 새 연결을 만듭니다.
앱으로 가는 구간이 HTTP인지 HTTPS인지도 별도로 선택합니다.

```mermaid
flowchart LR
    U[브라우저] -->|HTTPS| N[Nginx 인증서]
    N -->|내부 HTTP 또는 HTTPS| A[앱]
```

## 인증서와 리다이렉트 설정

다음은 인증서가 준비된 환경의 HTTP 문맥 예제입니다.
도메인, 인증서 파일과 업스트림을 실제 값으로 바꿉니다.
공개 인증서 발급과 갱신은 사용하는 ACME 클라이언트 또는 인증서 관리 시스템의 절차를 따릅니다.

```nginx
server {
    listen 80;
    server_name app.example.com;
    return 308 https://app.example.com$request_uri;
}

server {
    listen 443 ssl;
    server_name app.example.com;
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

고정한 도메인으로 리다이렉트하는 예제이므로 여러 도메인을 운영한다면 각각 수용할 호스트를 정합니다.
TLS 프로토콜 지원은 Nginx와 연결된 OpenSSL 빌드를 확인합니다.

## 업스트림도 HTTPS인 경우

```nginx
location /api/ {
    proxy_pass https://api.internal.example.com;
    proxy_ssl_server_name on;
    proxy_ssl_verify on;
    proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
}
```

컨테이너 이미지의 CA 경로를 확인하고 내부 CA를 쓴다면 해당 신뢰 체인을 준비합니다.
암호화된 업스트림 연결에서도 목적지 인증서 검증과 이름 확인이 함께 필요합니다.

| 확인 | 명령 또는 관찰 |
|---|---|
| 인증서와 호스트 일치 | curl 또는 openssl로 SAN과 체인을 확인합니다. |
| HTTP 리다이렉트 | 상태와 Location을 확인합니다. |
| 갱신 적용 | 파일 교체 후 문법 검사와 reload, 새 연결의 인증서를 확인합니다. |

HSTS는 브라우저에 HTTPS 사용을 기억시키므로 서브도메인과 운영 범위를 확인한 뒤 적용합니다.
인증서 설정은 [HTTP SSL 모듈](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)을 참고합니다.
