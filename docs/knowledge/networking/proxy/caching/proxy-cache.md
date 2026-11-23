---
title: "proxy_cache와 캐시"
description: "proxy_cache로 응답을 캐시하는 키, 유효 시간, bypass, 퍼지 개념을 설정 예제로 봅니다."
slug: "/knowledge/networking/proxy/caching/proxy-cache"
sidebar_position: 2
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "proxy_cache"
  - "proxy_cache_path"
  - "캐시 키"
  - "Nginx 캐시"
  - "bypass"
---

# proxy_cache와 캐시

업스트림 응답을 Nginx에 저장하면 반복 조회에서 앱 호출을 줄일 수 있습니다.
공개 상품 목록처럼 여러 사용자가 같은 결과를 받는 응답부터 검토하면 캐시 범위를 이해하기 쉽습니다.
사용자별 정보는 캐시 키와 우회 조건을 잘못 잡으면 다른 사용자에게 전달될 수 있습니다.

## 공개 조회 API의 예

```nginx
# http 문맥
proxy_cache_path /var/cache/nginx/public levels=1:2
    keys_zone=public_cache:10m max_size=100m inactive=10m;

server {
    listen 80;
    location /public/ {
        proxy_pass http://backend:8080;
        proxy_cache public_cache;
        proxy_cache_key "$scheme|$host|$request_uri";
        proxy_cache_valid 200 30s;
        proxy_cache_bypass $http_authorization $http_cookie;
        proxy_no_cache $http_authorization $http_cookie;
        add_header X-Cache-Status $upstream_cache_status always;
    }
}
```

이 예제는 인증 헤더나 Cookie가 있는 요청을 우회하는 보수적인 시작 구성입니다.
원래부터 사용자와 무관한 공개 응답만 대상으로 삼습니다.
캐시 키에 호스트와 쿼리 문자열을 포함해 다른 요청이 같은 항목으로 합쳐지지 않게 합니다.

## 적중 여부와 유효 기간을 관찰합니다

같은 요청을 반복하면 X-Cache-Status에서 MISS와 HIT 등을 확인할 수 있습니다.
업스트림이 보내는 Cache-Control, Set-Cookie와 Vary도 캐시 가능 여부에 영향을 줍니다.
이를 강제로 무시하기 전에 왜 응답이 캐시되지 않는지 확인합니다.

| 상황 | 정책 선택 |
|---|---|
| 공개 목록이 30초 늦어도 됨 | 짧은 TTL을 적용하고 갱신 지연을 안내할 수 있습니다. |
| 사용자별 응답 | 인증과 Cookie, 변형 조건을 확인하고 캐시 범위를 제한합니다. |
| 캐시 만료에 동시 요청 집중 | proxy_cache_lock으로 갱신 호출을 모을지 검토합니다. |
| 업스트림 장애 시 이전 응답 제공 | 허용할 데이터와 최대 지연 조건을 정한 뒤 stale 정책을 검토합니다. |

캐시 파일을 보관할 디스크의 용량과 권한도 운영 항목입니다.
갱신 API나 긴급 무효화가 필요하면 사용하는 제품의 지원 범위와 삭제 절차를 확인합니다.
캐시를 켜기 전 정상 응답과 인증 응답, TTL 만료를 각각 비교합니다.
관련 설정은 [Nginx proxy cache](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache)를 참고합니다.
