---
title: "root, alias, try_files와 SPA 배포"
description: "정적 파일과 SPA fallback(try_files)을 리버스 프록시와 함께 구성하는 방법을 설명합니다."
slug: "/knowledge/networking/proxy/routing/static-files-and-spa"
sidebar_position: 5
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "try_files"
  - "SPA"
  - "정적 파일"
  - "fallback"
  - "Nginx"
---

# root, alias, try_files와 SPA 배포

React나 Vue 빌드 결과를 제공할 때는 요청 경로와 디스크 경로의 관계가 중요합니다.
새로고침한 화면 경로는 index.html로 연결하고, 실제로 누락된 자산은 404로 반환하도록 분리할 수 있습니다.

## root와 alias의 경로 계산

| 설정 예 | 요청 | 조회할 파일 |
|---|---|---|
| `location /images/ { root /srv; }` | `/images/a.png` | `/srv/images/a.png` |
| `location /images/ { alias /data/pictures/; }` | `/images/a.png` | `/data/pictures/a.png` |

root는 요청 URI를 지정 디렉터리에 이어 붙입니다.
alias는 매칭한 location 경로를 지정한 디렉터리로 바꿉니다.
권한과 디렉터리 끝 슬래시도 같이 확인합니다.

## SPA 진입과 정적 자산을 분리합니다

아래는 Vite 방식의 `/assets/` 경로를 가정한 예제입니다.
실제 빌드 결과의 자산 경로에 맞춰 수정합니다.

```nginx
server {
    listen 80;
    root /srv/web;

    location /api/ {
        proxy_pass http://backend:8080;
    }
    location /assets/ {
        try_files $uri =404;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

`/settings/profile`에 파일이 없으면 index.html을 반환하고 브라우저 라우터가 화면을 고릅니다.
반면 `/assets/missing.js`는 404를 반환합니다.
모든 경로를 index.html로 보내면 누락된 JavaScript 요청에도 HTML이 돌아와 MIME 오류가 생길 수 있습니다.
API 404가 SPA 화면으로 바뀌지 않도록 `/api/`도 별도로 처리합니다.

## 파일을 바꿨는데 예전 화면이 뜨는 경우

실제 파일 배치, Nginx가 읽는 root, 브라우저와 CDN의 캐시를 순서대로 확인합니다.
콘텐츠 해시가 붙은 자산과 배포마다 바뀌는 index.html은 서로 다른 캐시 정책을 적용할 수 있습니다.
이 정책은 [정적 파일 캐시](../caching/static-cache-control.md)에서 이어서 다룹니다.

```bash
curl -i http://127.0.0.1:8088/settings/profile
curl -i http://127.0.0.1:8088/assets/missing.js
```

경로 계산은 [root](https://nginx.org/en/docs/http/ngx_http_core_module.html#root), [alias](https://nginx.org/en/docs/http/ngx_http_core_module.html#alias), 파일 선택은 [try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)를 참고합니다.
