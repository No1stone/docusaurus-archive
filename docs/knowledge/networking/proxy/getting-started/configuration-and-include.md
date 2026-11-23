---
title: "nginx.conf와 include 설정 구조"
description: "nginx.conf와 include로 설정을 나누는 구조, 지시문 문맥 오류를 피하는 방법을 정리합니다."
slug: "/knowledge/networking/proxy/getting-started/configuration-and-include"
sidebar_position: 3
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "nginx.conf"
  - "include"
  - "설정 구조"
  - "Nginx"
  - "context"
---

# nginx.conf와 include 설정 구조

설정 조각을 어디에 붙여야 하는지 모르면 같은 지시문도 문맥 오류를 냅니다.
`server`와 `upstream`은 HTTP 구성에서 `http` 아래에, 요청 경로를 고르는 `location`은 `server` 아래에 놓습니다.
`stream`은 nginx.conf의 최상위에 별도 블록으로 둡니다.

```text
nginx.conf
├── events
├── http
│   ├── log_format, map, upstream
│   ├── server
│   │   └── location
│   └── include /etc/nginx/conf.d/*.conf
└── stream
    └── server
```

## include는 파일 내용을 그 자리에 읽습니다

공식 Docker 이미지의 기본 구성에서는 `conf.d/*.conf`가 HTTP 문맥에서 읽힙니다.
이 경로에 최상위 `events`나 `stream`을 넣으면 문맥이 맞지 않습니다.
환경별로 생성된 파일까지 보려면 실제 설정을 출력합니다.

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -T
```

`-t`는 문법과 참조 파일 등을 검사하고, `-T`는 읽은 설정을 함께 출력합니다.
출력에 인증 관련 값이나 내부 경로가 포함될 수 있으므로 공유할 때 내용을 확인합니다.

## 환경변수와 설정 생성

공식 이미지의 `/etc/nginx/templates/*.template`은 시작 스크립트에서 환경변수를 치환해 설정 파일로 만들 수 있습니다.
일반 `.conf`의 `${BACKEND_HOST}`가 자동으로 바뀌는지와는 구분해 설정 파일 생성 경로를 확인합니다.
아래는 템플릿 파일의 일부입니다.

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://${BACKEND_HOST}:${BACKEND_PORT};
    }
}
```

| 점검 | 확인 방법 |
|---|---|
| 템플릿이 처리됐는가 | 생성된 conf 파일과 `nginx -T`를 확인합니다. |
| 환경변수 변경이 적용됐는가 | 시작 시 생성하는 구성이라면 컨테이너 재생성 후 출력과 비교합니다. |
| 앱에 연결 가능한가 | `nginx -t` 다음 실제 HTTP 요청을 보냅니다. |

문법 검사를 통과해도 업스트림이 요청을 처리할 수 있는지는 실제 연결로 확인합니다.
템플릿 생성은 [공식 Docker 이미지 안내](https://hub.docker.com/_/nginx)를, 문맥 구조는 [Nginx 시작 가이드](https://nginx.org/en/docs/beginners_guide.html)를 참고합니다.
