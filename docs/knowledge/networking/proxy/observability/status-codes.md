---
title: "499, 502, 503, 504 원인 찾기"
description: "499, 502, 503, 504가 나는 전형적인 원인과 로그에서 원인을 좁히는 순서를 다룹니다."
slug: "/knowledge/networking/proxy/observability/status-codes"
sidebar_position: 5
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "499"
  - "502"
  - "503"
  - "504"
  - "Nginx 오류"
  - "프록시 상태코드"
---

# 499, 502, 503, 504 원인 찾기

프록시 오류를 분석할 때 HTTP 상태만으로 원인을 확정하기 어렵습니다.
같은 503도 앱이 반환했는지 Nginx 제한 정책에서 발생했는지에 따라 조치가 달라집니다.
사용자에게 전달한 status와 upstream_status, error log의 메시지를 함께 확인합니다.

| 상태 | 대표적으로 확인할 상황 |
|---|---|
| 499 | Nginx가 응답을 끝내기 전에 클라이언트 쪽 연결이 종료됐는지 봅니다. 앞단 프록시가 연결을 닫은 경우도 포함합니다. |
| 502 | 업스트림 연결 거절, reset, 유효하지 않은 응답 헤더 등 프록시 전달 실패를 확인합니다. |
| 503 | 앱의 과부하 응답인지, Nginx rate/connection 제한 등에서 생성한 응답인지 구분합니다. |
| 504 | 업스트림 연결 또는 응답 대기에서 제한 시간을 넘겼는지 확인합니다. |

## 499가 많아진 경우

클라이언트가 화면을 벗어나거나 앞단 로드밸런서가 먼저 타임아웃을 낼 수 있습니다.
요청 경로와 시간을 보고 특정 느린 API에 집중되는지 확인합니다.
브라우저가 취소한 뒤에도 앱과 DB 작업이 계속되는지 함께 관찰합니다.

## 502와 504를 재현합니다

```bash
docker compose stop backend
curl -i -H 'Host: app.example.com' http://127.0.0.1:8088/api/devices
docker compose logs --tail 30 nginx
docker compose start backend
```

컨테이너가 멈춘 뒤 네트워크가 어떻게 정리됐는지에 따라 연결 거절이나 연결 대기를 관찰할 수 있습니다.
502를 명확하게 재현하려면 실습용 location의 proxy_pass를 `http://127.0.0.1:1`로 바꿔 Nginx 컨테이너 안의 닫힌 포트로 요청합니다.
504는 별도로 응답을 지연시키는 업스트림과 짧은 read timeout을 준비해 재현합니다.
존재하지 않는 서버로 연결해 두고 무조건 504를 기대하면 즉시 거절되는 경로와 구분하기 어렵습니다.

## 복구 전에 남길 정보

요청 ID, 발생 시각과 시간대, 업스트림 주소, 재시도 횟수와 앱의 처리 결과를 남깁니다.
연결 타임아웃만 늘리면 과부하된 앱이 더 많은 대기 요청을 안게 될 수 있습니다.
비멱등 작업에서는 사용자가 실패를 봤어도 DB 반영 여부를 확인한 뒤 재시도합니다.

프록시에서 다루는 실패 유형은 [proxy_next_upstream](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream)을 참고합니다.
