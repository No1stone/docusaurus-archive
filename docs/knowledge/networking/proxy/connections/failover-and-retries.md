---
title: "업스트림 장애 감지와 요청 재시도"
description: "upstream 장애 감지(max_fails, fail_timeout)와 재시도, 백엔드 전환 동작을 정리합니다."
slug: "/knowledge/networking/proxy/connections/failover-and-retries"
sidebar_position: 4
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "max_fails"
  - "fail_timeout"
  - "failover"
  - "재시도"
  - "upstream"
---

# 업스트림 장애 감지와 요청 재시도

업스트림 한 대가 실패하면 다른 대상으로 넘길 수 있습니다.
이때 연결 실패와 앱이 요청을 처리한 뒤 응답만 잃은 상황을 구분해야 합니다.
같은 예약이나 결제가 두 번 처리되지 않도록 요청 재시도와 업무 멱등성을 함께 설계합니다.

## 수동으로 수집되는 실패 정보

```nginx
upstream app_pool {
    server backend:8080 max_fails=2 fail_timeout=10s;
    server backend2:8080 max_fails=2 fail_timeout=10s;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://app_pool;
        proxy_connect_timeout 2s;
        proxy_next_upstream error timeout;
        proxy_next_upstream_tries 2;
        proxy_next_upstream_timeout 5s;
    }
}
```

max_fails와 fail_timeout은 요청 처리 중 관찰한 실패를 이용하는 수동적 장애 판단 설정입니다.
fail_timeout은 실패를 세는 기간과 서버를 사용 불가로 보는 기간에 관여합니다.
독립적인 상태 확인 요청을 주기적으로 보내는 능동 헬스체크는 사용 제품과 모듈의 지원 범위를 확인합니다.

## 재시도 전에 결과가 확정됐는지 봅니다

| 상황 | 검토 |
|---|---|
| TCP 연결 전 거절됨 | 앱에 도달하지 않은 요청을 다른 대상으로 보낼 수 있습니다. |
| 앱이 DB에 저장했지만 응답이 끊김 | 같은 업무를 다시 보내면 중복될 수 있습니다. |
| 이미 클라이언트에 응답 일부를 보냄 | 다른 서버에서 온전한 응답으로 바꿔 이어 보내기 어렵습니다. |

Nginx에는 비멱등 메서드의 재시도를 제어하는 규칙이 있습니다.
`non_idempotent`를 추가할 때는 앱의 eventId, idempotency key와 저장 제약까지 확인합니다.
앱과 프록시가 모두 여러 번 재시도하면 장애 시 총 호출 수가 커질 수 있으므로 횟수와 대기 예산을 합산합니다.

실습에서는 backend 한 대를 중지한 뒤 조회 요청을 보내 정상 대상 선택과 error log를 확인합니다.
유료 작업처럼 외부 효과가 있는 요청은 별도의 테스트 데이터로 중복 방지까지 검증합니다.
규칙은 [proxy_next_upstream](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream)을 참고합니다.
