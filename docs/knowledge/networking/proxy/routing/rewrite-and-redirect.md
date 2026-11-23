---
title: "rewrite, return과 리다이렉트"
description: "rewrite와 return으로 경로를 바꾸거나 넘기는 방법, 프록시 앞에서의 주의점을 정리합니다."
slug: "/knowledge/networking/proxy/routing/rewrite-and-redirect"
sidebar_position: 4
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "rewrite"
  - "return"
  - "redirect"
  - "경로 변환"
  - "Nginx"
---

# rewrite, return과 리다이렉트

외부 주소를 바꾸는 리다이렉트와 내부 전달 경로를 바꾸는 rewrite는 요청 흐름이 다릅니다.
로그인 주소나 API 접두사를 옮길 때 브라우저가 새 주소로 다시 요청해야 하는지 먼저 결정합니다.

## 브라우저가 다시 요청하는 리다이렉트

```nginx
location = /old-help {
    return 302 /help;
}
```

사용자는 302와 Location 헤더를 받고 `/help`로 다시 요청합니다.
주소창도 변경될 수 있습니다.
영구 이전을 의미하는 301이나 308을 선택하면 클라이언트의 캐시와 메서드 처리도 함께 고려해야 합니다.
처음 설정을 확인할 때는 브라우저 캐시의 영향을 줄이기 위해 curl로 헤더를 봅니다.

```bash
curl -i http://127.0.0.1:8088/old-help
curl -i -L http://127.0.0.1:8088/old-help
```

## 내부 URI를 바꾸는 rewrite

```nginx
location /legacy/ {
    rewrite ^/legacy/(.*)$ /api/$1 break;
    proxy_pass http://backend:8080;
}
```

`/legacy/devices`를 받은 Nginx가 내부 URI를 `/api/devices`로 바꿔 앱에 전달합니다.
`break`는 현재 location의 rewrite 처리를 끝내고 이어서 처리합니다.
`last`는 바뀐 URI를 기준으로 location 선택을 다시 진행하므로 다른 설정이 적용될 수 있습니다.

| 목적 | 먼저 검토할 설정 |
|---|---|
| 고정된 새 주소로 안내 | return으로 상태와 Location을 반환합니다. |
| 단순한 프록시 접두사 제거 | proxy_pass의 URI 치환을 사용합니다. |
| 패턴에 따라 내부 경로 변경 | rewrite의 캡처와 이후 location 선택을 확인합니다. |

여러 rewrite를 연속 적용하면 순환이나 예상치 못한 쿼리 문자열이 생길 수 있습니다.
원본 요청, 바뀐 URI와 앱이 받은 경로를 한 사례씩 기록합니다.
외부 리다이렉트에서는 임의의 사용자 입력이 목적지 호스트가 되지 않도록 목적지 정책도 정합니다.

상태 반환과 rewrite 플래그는 [rewrite 모듈](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html)에 설명되어 있습니다.
