---
title: "proxy_pass와 마지막 슬래시"
description: "proxy_pass URI 유무에 따라 upstream 경로가 어떻게 바뀌는지, trailing slash 함정을 예제로 봅니다."
slug: "/knowledge/networking/proxy/routing/proxy-pass-uri"
sidebar_position: 3
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "proxy_pass"
  - "trailing slash"
  - "URI 전달"
  - "upstream 경로"
  - "Nginx"
---

# proxy_pass와 마지막 슬래시

리버스 프록시를 붙인 뒤 앱에서 404가 나면 전달 경로부터 확인합니다.
특히 proxy_pass의 주소 뒤에 URI가 있는지에 따라 앱이 받는 경로가 달라집니다.
`/api/devices`를 받는 컨트롤러와 `/devices`를 받는 컨트롤러는 필요한 설정이 다릅니다.

## 같은 요청을 세 가지 설정으로 전달하기

일반 접두사 `location /api/`에서 rewrite와 변수를 사용하지 않는 예제입니다.
입력 요청은 `/api/devices?farm=1`입니다.

| proxy_pass | 백엔드 경로 |
|---|---|
| `http://backend:8080` | `/api/devices?farm=1` |
| `http://backend:8080/` | `/devices?farm=1` |
| `http://backend:8080/internal/` | `/internal/devices?farm=1` |

```nginx
location /api/ {
    proxy_pass http://backend:8080/;
}
```

위 설정에서 `/api/`에 해당하는 부분을 `/`로 치환합니다.
그래서 끝 슬래시를 단순한 표기 차이로 취급하면 컨트롤러 경로가 바뀝니다.

## 원래 경로를 유지하는 경우

Gateway와 앱이 같은 `/api/` 접두사를 공유한다면 URI 없이 목적지를 지정할 수 있습니다.

```nginx
location /api/ {
    proxy_pass http://backend:8080;
}
```

[Compose 실습](../getting-started/docker-compose-lab.md)의 백엔드는 응답의 path에 전달받은 URI를 표시합니다.
설정을 하나씩 바꾼 다음 reload하고 같은 요청을 보내 결과를 비교합니다.

```bash
curl -sS -H 'Host: app.example.com' 'http://127.0.0.1:8088/api/devices?farm=1'
```

## 변수와 rewrite를 더하기 전에

정규식 location에서는 치환할 접두사를 결정하기 어려워 URI 없는 proxy_pass를 사용해야 하는 경우가 있습니다.
`$request_uri` 같은 변수를 proxy_pass에 넣는 구성도 일반 접두사 치환과 규칙이 달라집니다.
따라서 먼저 단순 접두사와 목적지 URI만으로 요구사항을 표현할 수 있는지 확인합니다.
구체적인 예외는 [proxy_pass 공식 문서](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)를 참고합니다.
