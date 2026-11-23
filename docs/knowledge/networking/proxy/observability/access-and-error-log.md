---
title: "access.log와 error.log"
description: "access.log와 error.log로 요청 도달 여부와 프록시 오류를 먼저 가르는 방법을 정리합니다."
slug: "/knowledge/networking/proxy/observability/access-and-error-log"
sidebar_position: 1
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "access.log"
  - "error.log"
  - "Nginx 로그"
  - "프록시 오류"
---

# access.log와 error.log

사용자가 오류를 신고했을 때 먼저 요청이 Nginx까지 왔는지 확인합니다.
access.log는 처리한 요청과 결과를 남기고, error.log는 Nginx가 관찰한 연결 실패나 설정, 실행 중 문제를 기록합니다.
access.log에는 성공과 실패 요청이 함께 들어갈 수 있습니다.

## 두 로그를 같은 시각으로 맞춥니다

```nginx
# server 문맥의 예
access_log /var/log/nginx/access.log combined;
error_log /var/log/nginx/error.log warn;
```

로그 위치와 출력 대상은 배포 이미지와 설정에 따라 달라집니다.
공식 Docker 이미지는 기본적으로 표준 출력과 표준 오류로 로그를 연결하는 구성을 사용하므로 docker compose logs에서 확인할 수 있습니다.
호스트 설치에서는 실제 nginx -T 출력과 로그 파일을 함께 확인합니다.

```bash
docker compose logs --since 10m --tail 100 nginx
sudo tail -n 100 /var/log/nginx/error.log
```

## 요청 하나를 추적하는 순서

| 순서 | 확인 |
|---|---|
| 1 | 사용자 요청 시각, 호스트와 경로를 확보합니다. |
| 2 | access log에서 해당 요청과 반환 상태를 찾습니다. |
| 3 | 같은 시각의 error log에서 upstream 오류를 확인합니다. |
| 4 | 앱 로그에 요청이 도착했는지와 처리 결과를 비교합니다. |

error log에 아무것도 없는데 400이나 404가 반환될 수 있습니다.
앱이 정상적으로 오류 응답을 보냈다면 Nginx 입장에서는 응답 전달이 끝난 상황이기 때문입니다.
반대로 로그를 남기도록 설정한 server에 요청이 도달하지 않았다면 DNS와 앞단 로드밸런서부터 확인합니다.

요청 ID를 추가하면 같은 초에 여러 요청이 몰려도 대응 관계를 찾기 쉽습니다.
로그에는 토큰과 요청 본문이 불필요하게 남지 않도록 수집 범위를 정합니다.
출력 설정은 [access_log](https://nginx.org/en/docs/http/ngx_http_log_module.html#access_log), 심각도는 [error_log](https://nginx.org/en/docs/ngx_core_module.html#error_log)를 참고합니다.
