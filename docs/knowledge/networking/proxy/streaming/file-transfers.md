---
title: "파일 업로드와 다운로드"
description: "대용량 업로드와 다운로드에서 client_max_body_size, buffering, 타임아웃을 맞추는 방법을 설명합니다."
slug: "/knowledge/networking/proxy/streaming/file-transfers"
sidebar_position: 4
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "client_max_body_size"
  - "파일 업로드"
  - "다운로드"
  - "proxy_request_buffering"
  - "Nginx"
---

# 파일 업로드와 다운로드

파일 전송은 요청과 응답이 크고 클라이언트 속도가 일정하지 않습니다.
업로드 제한만 늘리면 앱에 도달하기 전에 Nginx 임시 디스크가 차거나, 다운로드 중 앱 연결이 오래 점유될 수 있습니다.
허용 크기와 버퍼 위치, 동시 전송 수를 같이 봅니다.

## 업로드 경로의 예

```nginx
location /uploads/ {
    client_max_body_size 20m;
    client_body_timeout 30s;
    proxy_pass http://backend:8080;
    proxy_request_buffering on;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

이 예제는 최대 요청 본문을 20MB로 제한합니다.
multipart 요청에는 파일 외의 경계와 다른 필드도 들어가므로 파일 하나의 크기 제한과 정확히 같지는 않습니다.
Spring multipart 제한과 사용자에게 안내한 제한을 함께 맞춥니다.

## 요청 버퍼링과 디스크

proxy_request_buffering을 켜면 Nginx가 요청 본문을 읽은 뒤 업스트림으로 전달합니다.
큰 본문은 임시 파일을 사용할 수 있으므로 임시 디렉터리와 디스크 여유를 확인합니다.
버퍼링을 끄면 앱으로 전송하며 읽는 구성이 가능하지만 느린 클라이언트가 앱 연결을 오래 사용하고 재시도 조건도 달라집니다.

| 확인 대상 | 실습 |
|---|---|
| 크기 제한 | 허용 크기 바로 아래와 위의 파일을 전송합니다. |
| 느린 업로드 | 전송 속도를 제한해 어느 계층에서 끊기는지 봅니다. |
| 중도 취소 | 클라이언트를 취소하고 앱의 임시 파일 정리를 확인합니다. |
| 다운로드 | Content-Type과 Content-Disposition, 범위 요청 지원을 확인합니다. |

## 대용량 파일의 전달 경로

S3 presigned URL을 사용하면 앱은 업로드 권한과 완료 처리를 맡고 파일 본문은 S3로 직접 전달하는 구성을 선택할 수 있습니다.
Nginx를 통과시키는 경로와 직접 전송 경로는 크기, 접근 권한과 네트워크 비용을 기준으로 정합니다.
다운로드 시 사용자별 응답을 캐시한다면 다른 사용자에게 같은 파일이 전달되지 않도록 캐시 정책을 함께 확인합니다.

요청 크기는 [client_max_body_size](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size), 전송 버퍼는 [proxy_request_buffering](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering)를 참고합니다.
