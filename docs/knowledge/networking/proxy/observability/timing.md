---
title: "요청 시간과 업스트림 응답 시간 분석"
description: "request_time과 upstream_response_time으로 지연 구간을 나누어 보는 방법을 정리합니다."
slug: "/knowledge/networking/proxy/observability/timing"
sidebar_position: 4
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "request_time"
  - "upstream_response_time"
  - "지연 분석"
  - "Nginx"
---

# 요청 시간과 업스트림 응답 시간 분석

사용자가 느리다고 느끼는 시간과 앱 처리 시간은 서로 다른 구간을 포함합니다.
Nginx 로그에서 전체 요청 시간과 업스트림 시간을 같이 보면 어느 구간을 더 조사할지 정할 수 있습니다.
한 요청에 재시도가 있었다면 여러 업스트림 결과를 함께 읽습니다.

| 변수 | 관찰 구간 |
|---|---|
| request_time | 첫 요청 바이트를 읽은 뒤 응답을 보내며 요청을 마칠 때까지의 시간입니다. |
| upstream_connect_time | 업스트림 연결 수립 시간입니다. TLS 연결이면 핸드셰이크도 포함합니다. |
| upstream_header_time | 업스트림 응답 헤더를 받기까지의 시간입니다. |
| upstream_response_time | 업스트림 응답을 받는 데 걸린 시간입니다. |

## 측정 필드를 추가합니다

```nginx
# http 문맥
log_format timing '$request_id $status total=$request_time '
    'upstream=$upstream_addr connect=$upstream_connect_time '
    'header=$upstream_header_time response=$upstream_response_time';
access_log /var/log/nginx/access.log timing;
```

이 예제는 로그 형식을 선택해 교체하는 조각입니다.
기존 형식과 함께 쓰려면 다른 파일에 기록하거나 필요한 필드를 기존 JSON에 추가합니다.

## 숫자를 읽는 사례

| 관찰 | 다음 확인 |
|---|---|
| connect 시간이 길어짐 | 네트워크, 연결 재사용, 업스트림 수용 상태를 봅니다. |
| header 시간이 길어짐 | 앱의 DB 대기와 외부 호출, 응답 시작 전 작업을 봅니다. |
| total만 크게 늘어남 | 클라이언트 업로드와 다운로드, 버퍼링 등 다른 구간을 봅니다. |
| upstream 값이 여러 개 | 재시도와 내부 리다이렉트 여부를 확인합니다. |

각 값에는 겹치는 시간이 있어 단순히 모두 더하거나 빼서 순수 앱 CPU 시간을 구하지 않습니다.
큰 파일 전송에서는 클라이언트 속도도 전체 요청 시간에 영향을 줍니다.
상태 코드와 응답 크기, 앱 trace를 같이 봐야 원인을 좁힐 수 있습니다.

동일한 응답을 빠른 클라이언트와 속도 제한 클라이언트로 받아 비교하면 차이를 관찰할 수 있습니다.
필드 설명과 활용 예시는 [Nginx 성능 로그 가이드](https://blog.nginx.org/blog/using-nginx-logging-for-application-performance-monitoring), [업스트림 변수](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#variables)를 참고합니다.
