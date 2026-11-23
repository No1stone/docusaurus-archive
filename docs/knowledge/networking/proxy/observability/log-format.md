---
title: "log_format으로 접근 로그 구성하기"
description: "log_format으로 upstream 시간과 요청 ID 등을 넣어 분석하기 쉬운 접근 로그를 구성합니다."
slug: "/knowledge/networking/proxy/observability/log-format"
sidebar_position: 2
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "log_format"
  - "upstream_response_time"
  - "접근 로그"
  - "Nginx"
---

# log_format으로 접근 로그 구성하기

기본 접근 로그는 요청과 상태를 보는 데 편하지만 업스트림과 시간 분석을 더하려면 필드를 정해야 합니다.
JSON으로 기록하면 로그 수집기에서 필드를 나누기 쉽습니다.
각 값이 무엇을 의미하는지 정해 두면 대시보드와 장애 분석에서도 같은 기준을 쓸 수 있습니다.

## 요청과 업스트림을 함께 기록합니다

```nginx
# http 문맥
log_format app_json escape=json
    '{"time":"$time_iso8601",'
    '"request_id":"$request_id",'
    '"client":"$remote_addr",'
    '"method":"$request_method",'
    '"uri":"$uri",'
    '"status":$status,'
    '"request_time":$request_time,'
    '"upstream":"$upstream_addr",'
    '"upstream_status":"$upstream_status",'
    '"upstream_time":"$upstream_response_time"}';

access_log /var/log/nginx/access.log app_json;
```

escape=json은 문자열 안의 따옴표와 제어 문자 등을 JSON에 맞게 이스케이프합니다.
업스트림 관련 값은 대상이 없을 때 대시가 되거나 재시도로 여러 값이 될 수 있어 문자열로 기록했습니다.
수집기에서 숫자로 바꾸려면 이런 경우의 처리 정책도 정합니다.

## 필드의 수집 목적

| 필드 | 사용 |
|---|---|
| request_id | Nginx와 앱 로그를 연결합니다. |
| uri | 조회 경로별 오류와 시간을 묶습니다. |
| status | 사용자에게 전달한 HTTP 상태를 집계합니다. |
| upstream_status | 뒤쪽 서버의 처리 결과와 비교합니다. |
| request_time | 전체 요청 처리 시간을 관찰합니다. |

이 예제의 uri는 쿼리 문자열을 포함하지 않습니다.
필요하다면 허용한 파라미터만 따로 남깁니다.
사용자 입력이 경로 자체에 들어가는 서비스도 있으므로 경로에 개인정보가 들어가는지 확인합니다.
인증 토큰이 URL에 실리면 다른 계층에도 남을 수 있어 API 설계와 함께 점검합니다.

설정 후 응답 성공, 업스트림 실패와 정적 파일 요청을 각각 보내 로그가 유효한 JSON인지 확인합니다.
필드와 이스케이프는 [log 모듈](https://nginx.org/en/docs/http/ngx_http_log_module.html)을 참고합니다.
