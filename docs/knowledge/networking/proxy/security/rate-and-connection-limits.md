---
title: "요청 속도 제한과 연결 수 제한"
description: "limit_req, limit_conn으로 요청 속도와 연결 수를 제한하는 방법과 키 선택을 정리합니다."
slug: "/knowledge/networking/proxy/security/rate-and-connection-limits"
sidebar_position: 4
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "limit_req"
  - "limit_conn"
  - "rate limit"
  - "연결 제한"
  - "Nginx"
---

# 요청 속도 제한과 연결 수 제한

로그인이나 검색 API에 요청이 몰릴 때 앱 앞에서 호출 빈도를 조절할 수 있습니다.
장기 연결이 많아지는 SSE나 WebSocket은 요청 빈도 외에 동시 연결 규모도 봅니다.
정책을 적용하기 전에 무엇을 키로 묶을지 결정합니다.

## 요청 빈도 제한

```nginx
# http 문맥
limit_req_zone $binary_remote_addr zone=per_ip:10m rate=5r/s;
limit_conn_zone $binary_remote_addr zone=connections:10m;

server {
    listen 80;
    location /api/ {
        limit_req zone=per_ip burst=10 nodelay;
        limit_req_status 429;
        limit_conn connections 20;
        limit_conn_status 429;
        proxy_pass http://backend:8080;
    }
}
```

rate는 키별 요청 처리 속도 기준이고 burst는 짧게 몰린 요청을 허용하는 범위입니다.
nodelay는 허용한 초과 요청을 속도에 맞춰 지연시키는 대신 바로 처리하도록 합니다.
limit_conn이 세는 대상은 실제 연결과 프로토콜 동작에 영향을 받으며 HTTP/2 요청의 계산 규칙도 확인합니다.

## 키 선택이 사용자 경험을 바꿉니다

| 키 | 고려할 점 |
|---|---|
| 클라이언트 IP | 회사나 통신사 NAT 뒤의 여러 사용자가 같은 한도를 공유할 수 있습니다. |
| 신뢰할 수 있는 사용자 식별자 | 검증된 인증 정보에서 정해야 합니다. 외부 입력 헤더만으로 정하면 우회할 수 있습니다. |
| API 경로와 IP 조합 | 중요한 경로를 별도 정책으로 분리할 수 있습니다. |

게이트웨이를 여러 대 띄우면 기본 공유 메모리 zone은 각 Nginx 인스턴스 내부의 worker 사이에서 공유됩니다.
전체 클러스터의 단일 한도가 필요한 경우 정책을 집행할 위치와 저장 방식을 별도로 정합니다.

## 적용 전후를 비교합니다

처음에는 dry run 지원 여부를 확인해 초과 요청이 얼마나 발생하는지 관찰할 수 있습니다.
허용한 정상 트래픽과 짧은 burst, NAT 사용자와 장기 연결을 각각 재현합니다.
429가 늘 때는 요청자에게 재시도 간격을 어떻게 안내할지도 정합니다.

요청 속도는 [limit_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html), 연결 수는 [limit_conn](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)을 참고합니다.
