---
title: "연결, 전송, 응답 타임아웃"
description: "proxy_connect, send, read timeout 등 연결, 전송, 응답 타임아웃을 구간별로 맞추는 방법을 설명합니다."
slug: "/knowledge/networking/proxy/connections/timeouts"
sidebar_position: 3
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "proxy_read_timeout"
  - "proxy_connect_timeout"
  - "타임아웃"
  - "Nginx"
  - "upstream"
---

# 연결, 전송, 응답 타임아웃

사용자가 504를 봤을 때 기다리는 시간을 늘리기 전에 어느 연결이 멈췄는지 확인합니다.
Nginx에는 클라이언트와 업스트림 각각의 읽기와 쓰기 시간이 있고, 앱 내부에도 DB와 외부 API 타임아웃이 있습니다.
전체 경로에 시간 예산을 두면 먼저 끊겨야 하는 구간을 정할 수 있습니다.

| 설정 | 제한하는 대기 |
|---|---|
| proxy_connect_timeout | 업스트림 연결을 맺는 시간입니다. |
| proxy_send_timeout | 업스트림으로 요청을 쓰는 연속 쓰기 사이의 대기입니다. |
| proxy_read_timeout | 업스트림에서 응답을 읽는 연속 읽기 사이의 대기입니다. |
| client_body_timeout | 클라이언트 요청 본문을 읽는 연속 읽기 사이의 대기입니다. |

## 일반 API 경로의 예

다음 값은 실습을 위한 선택입니다.
서비스의 응답 목표와 외부 호출 시간을 측정한 뒤 조절합니다.

```nginx
location /api/ {
    proxy_pass http://backend:8080;
    proxy_connect_timeout 3s;
    proxy_send_timeout 10s;
    proxy_read_timeout 30s;
}
```

응답 읽기 타임아웃 30초는 데이터가 계속 오는 전체 스트림을 30초에 끊는 설정으로 해석하지 않습니다.
SSE 하트비트가 그보다 짧은 간격으로 도착하면 연결이 더 오래 유지될 수 있습니다.

## 앱의 취소와 프록시의 종료

브라우저나 Nginx가 연결을 닫아도 앱의 DB 쿼리가 즉시 중단된다고 가정하기 어렵습니다.
앱에서도 외부 호출과 DB 대기 시간, 작업 취소 정책을 정합니다.
실습에서 지연 응답을 만드는 업스트림을 두고 Nginx error log의 timed out 위치와 앱 완료 시점을 대조하면 차이가 보입니다.

| 경로 | 정책 예시 |
|---|---|
| 짧은 조회 API | 내부 호출이 먼저 실패하도록 시간 예산을 맞춥니다. |
| 긴 리포트 생성 | 비동기 작업 접수와 상태 조회로 전환할지 검토합니다. |
| SSE | 하트비트와 모든 중간 프록시의 유휴 시간을 함께 정합니다. |

설정의 정확한 시간 의미는 [프록시 타임아웃](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)과 [클라이언트 본문 타임아웃](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_timeout)을 참고합니다.
