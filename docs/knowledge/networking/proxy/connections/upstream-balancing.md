---
title: "upstream과 부하 분산 방식"
description: "upstream 블록과 round-robin, least_conn, hash 등 부하 분산 방식을 설정 예제로 봅니다."
slug: "/knowledge/networking/proxy/connections/upstream-balancing"
sidebar_position: 1
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "upstream"
  - "least_conn"
  - "hash"
  - "로드밸런싱"
  - "Nginx"
---

# upstream과 부하 분산 방식

앱을 두 인스턴스로 늘리면 Nginx가 어느 인스턴스에 요청을 전달할지 정해야 합니다.
upstream은 이 대상 목록과 분배 설정을 묶습니다.
먼저 공통 실습의 backend와 backend2를 사용해 응답의 backend 값이 바뀌는지 확인합니다.

```nginx
# http 문맥
upstream app_pool {
    server backend:8080;
    server backend2:8080;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://app_pool;
    }
}
```

## 어떤 기준으로 분배할 것인가

| 방식 | 고려할 상황 |
|---|---|
| 기본 라운드로빈 | 비슷한 인스턴스에 요청을 분산하는 출발점입니다. |
| weight | 처리 용량이 다른 서버의 상대 비중을 조절합니다. |
| least_conn | 연결 수가 적은 서버를 우선 선택합니다. 장기 연결이 섞인 경우 검토할 수 있습니다. |
| ip_hash 또는 hash | 같은 키를 같은 대상으로 보내야 하는 이유가 있는지 확인합니다. |

```nginx
upstream app_pool {
    least_conn;
    server backend:8080 weight=2;
    server backend2:8080;
}
```

한 요청이 오래 걸리는 이유는 연결 수 외에도 DB 대기와 외부 호출 등 다양합니다.
분배 방식만 바꿔서 성능 향상을 가정하기보다 대상별 응답 시간과 연결 수를 함께 봅니다.

## 세션과 장애의 관계

세션을 앱 메모리에만 보관하면 요청 대상이 달라질 때 로그인 상태가 사라질 수 있습니다.
고정 분배를 사용하더라도 해당 인스턴스 장애나 배포 시 세션이 어떻게 유지되는지는 별도 문제입니다.
앱을 무상태로 만들거나 공유 세션 저장소를 사용하는지 먼저 정합니다.

```bash
curl -sS http://127.0.0.1:8088/api/devices
```

위 요청을 여러 번 보내 backend 값과 접근 로그의 upstream 주소를 비교합니다.
단일 요청을 하나의 앱 안에서 병렬 처리하는 것은 앱의 실행 모델에 달려 있습니다.
분배 알고리즘과 옵션은 [upstream 모듈](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)을 참고합니다.
