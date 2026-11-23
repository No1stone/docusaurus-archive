---
title: "요청 ID로 Nginx와 앱 로그 연결하기"
description: "요청 ID를 Nginx와 앱 로그에 공통으로 남겨 분산 추적을 쉽게 만드는 방법을 설명합니다."
slug: "/knowledge/networking/proxy/observability/request-id"
sidebar_position: 3
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "request id"
  - "$request_id"
  - "분산 추적"
  - "로그 상관관계"
  - "Nginx"
---

# 요청 ID로 Nginx와 앱 로그 연결하기

Nginx와 앱 로그를 시각만으로 연결하면 동시 요청이 많을수록 찾기 어렵습니다.
진입점에서 요청 ID를 만들고 앱에 전달하면 동일한 호출의 흔적을 묶을 수 있습니다.
앱은 받은 ID를 로그 문맥에 넣고, 필요하면 응답에도 같은 ID를 제공합니다.

## 진입점에서 ID를 생성합니다

```nginx
location /api/ {
    proxy_pass http://backend:8080;
    proxy_set_header X-Request-ID $request_id;
    add_header X-Request-ID $request_id always;
}
```

외부 입력을 그대로 쓰는 대신 Nginx가 만든 ID로 덮어쓰는 예제입니다.
앱은 신뢰한 진입점에서 받은 값을 사용합니다.
앱도 X-Request-ID를 응답한다면 두 계층에서 중복 헤더가 나오지 않게 최종 응답 책임을 정합니다.

## Spring 로그와 연결합니다

서블릿 필터에서는 요청 시작에 ID를 MDC에 넣고 요청이 끝날 때 정리할 수 있습니다.
비동기 실행으로 넘어가면 MDC가 전달되는 범위도 확인합니다.
Reactor 기반 앱은 해당 실행 모델에 맞춰 문맥을 전파해야 합니다.

```text
Nginx  request_id=abc123 status=504 upstream=app-1
App    request_id=abc123 external_call_started
App    request_id=abc123 external_call_timeout
```

| 값 | 구분 |
|---|---|
| 요청 ID | 단일 진입 요청을 추적하는 데 사용합니다. |
| trace ID | 분산 트레이싱 시스템에서 여러 호출과 span을 묶습니다. |
| event ID | 재처리와 멱등성 등 업무 이벤트의 식별에 사용합니다. |

세 값의 수명이 같다고 가정하지 않고 필요한 관계를 로그에 남깁니다.
같은 이벤트를 재전송하면 event ID는 유지해도 새 HTTP 요청 ID가 생길 수 있습니다.
OpenTelemetry를 사용한다면 traceparent 전파와 신뢰 정책도 별도로 맞춥니다.

## 확인 방법

Compose 실습 응답의 headers에서 X-Request-ID를 보고 access log의 값과 비교합니다.
클라이언트가 다른 값을 보내도 설정한 진입점 ID가 앱에 전달되는지 검사합니다.
요청 ID는 접근 권한을 입증하는 값으로 사용하지 않습니다.
Nginx의 request_id 변수는 [HTTP core 변수](https://nginx.org/en/docs/http/ngx_http_core_module.html#variables)를 참고합니다.
