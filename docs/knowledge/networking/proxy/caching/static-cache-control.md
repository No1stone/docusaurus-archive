---
title: "정적 파일 캐시와 Cache-Control"
description: "정적 자산에 Cache-Control과 expires를 붙여 CDN과 브라우저 캐시를 맞추는 방법을 설명합니다."
slug: "/knowledge/networking/proxy/caching/static-cache-control"
sidebar_position: 1
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "Cache-Control"
  - "expires"
  - "정적 캐시"
  - "CDN"
  - "Nginx"
---

# 정적 파일 캐시와 Cache-Control

프론트 배포에서 파일이 바뀌었는데 이전 화면이 남는다면 브라우저와 CDN의 캐시를 확인합니다.
파일 이름에 콘텐츠 해시가 붙는 자산과, 배포마다 참조 파일이 바뀌는 index.html은 수명이 다릅니다.
빌드 도구의 출력 이름을 확인하고 캐시 정책을 나눕니다.

## 해시 자산과 진입 문서

```nginx
server {
    listen 80;
    root /srv/web;

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
    location /assets/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

위 예제는 assets 아래 파일명이 내용 변경에 따라 바뀐다는 가정입니다.
고정 파일명에 1년 캐시를 적용하면 교체한 파일이 사용자에게 늦게 반영될 수 있습니다.
index.html의 no-cache는 저장 후 재사용하기 전에 재검증하도록 하는 정책입니다.
저장 자체를 피해야 하는 응답에는 목적에 맞게 no-store를 검토합니다.

## 배포 순서와 이전 자산

새 index.html을 먼저 공개했는데 참조하는 JS 파일이 아직 없다면 화면 로딩이 실패합니다.
새 자산을 준비한 뒤 진입 문서를 전환하고, 이전 문서를 열어 둔 브라우저가 참조할 자산도 적절한 기간 유지합니다.
롤백 시 index.html과 자산 버전이 맞는지 확인합니다.

| 점검 | 확인 방법 |
|---|---|
| 새 진입 문서 | 응답의 Cache-Control과 ETag를 확인합니다. |
| 해시 자산 | 긴 캐시 정책과 올바른 MIME을 확인합니다. |
| 없는 자산 | HTML 대신 404가 오는지 확인합니다. |

```bash
curl -I http://127.0.0.1:8088/index.html
curl -I http://127.0.0.1:8088/assets/app.hash.js
```

배포 앞에 CDN이 있다면 오리진 헤더와 CDN의 캐시 정책을 함께 확인합니다.
보안 헤더처럼 공통 add_header를 상위 문맥에 두었다면 하위 문맥에 헤더를 추가할 때 상속 결과도 점검합니다.
설정은 [headers 모듈](https://nginx.org/en/docs/http/ngx_http_headers_module.html), 정책 의미는 [MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)을 참고합니다.
