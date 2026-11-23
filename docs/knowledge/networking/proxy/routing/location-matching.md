---
title: "location 매칭 우선순위"
description: "Nginx location 매칭 우선순위(정확, 최장 prefix, 정규식)와 실수하기 쉬운 충돌을 정리합니다."
slug: "/knowledge/networking/proxy/routing/location-matching"
sidebar_position: 2
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "location"
  - "정규식 location"
  - "prefix location"
  - "매칭 우선순위"
  - "Nginx"
---

# location 매칭 우선순위

location은 요청 경로를 분류합니다.
여러 조건이 겹칠 때 어떤 블록이 선택되는지 알면, API 요청이 정적 파일 설정으로 들어가거나 보호 경로가 다른 설정을 타는 문제를 줄일 수 있습니다.

## 자주 사용하는 네 가지 형식

| 형식 | 의미 |
|---|---|
| `location = /health` | 경로가 정확히 일치하면 선택합니다. |
| `location /api/` | 접두사가 일치하는 후보입니다. |
| `location ^~ /assets/` | 가장 긴 접두사로 선택되면 같은 단계의 정규식 검사를 건너뜁니다. |
| `location ~ \.json$` | 대소문자를 구분하는 정규식입니다. `~*`는 구분하지 않습니다. |

다음은 최상위 location들로 구성한 선택 실습입니다.
중첩 location은 추가 선택 단계가 있으므로 이 흐름을 확인한 다음 도입합니다.

```nginx
server {
    listen 80;

    location = /health { return 200 "health\n"; }
    location ^~ /assets/ { return 200 "assets\n"; }
    location /api/ { return 200 "api\n"; }
    location ~ \.json$ { return 200 "json\n"; }
    location / { return 200 "fallback\n"; }
}
```

| 요청 경로 | 결과 | 이유 |
|---|---|---|
| `/health` | health | 정확 일치가 선택됩니다. |
| `/assets/config.json` | assets | 가장 긴 접두사에 `^~`가 있습니다. |
| `/api/config.json` | json | 접두사 후보보다 정규식 매칭이 우선합니다. |
| `/api/devices` | api | 맞는 정규식이 없어 가장 긴 접두사를 사용합니다. |

## 실제로 매칭하는 대상

일반적인 location 매칭은 정규화된 URI 경로를 기준으로 합니다.
쿼리 문자열은 여기에 포함되지 않으므로 `?format=json`을 붙였다고 json 정규식 location에 들어가지는 않습니다.
경로 끝 슬래시와 내부 리다이렉트도 결과에 영향을 줄 수 있습니다.
설정 변경 후에는 정상 경로와 비슷한 경로를 같이 요청해 확인합니다.

```bash
curl -sS http://127.0.0.1:8088/api/config.json
curl -sS 'http://127.0.0.1:8088/api/devices?format=json'
```

규칙은 [location 공식 설명](https://nginx.org/en/docs/http/ngx_http_core_module.html#location)에 정리되어 있습니다.
