---
title: "Docker Compose로 Nginx 실행하기"
description: "이 시리즈 공통 Docker Compose 실습으로 Nginx와 echo 백엔드를 띄우고 요청 경로를 확인합니다."
slug: "/knowledge/networking/proxy/getting-started/docker-compose-lab"
sidebar_position: 4
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "Docker Compose"
  - "Nginx 실습"
  - "proxy_pass"
  - "echo backend"
  - "리버스 프록시"
---

# Docker Compose로 Nginx 실행하기

이 시리즈에서는 요청 경로와 헤더를 그대로 돌려주는 백엔드 두 개를 사용합니다.
Nginx가 목적지를 선택하고, 백엔드 응답에서 실제 전달 결과를 확인하는 환경입니다.
공개 포트는 로컬 호스트에만 바인딩합니다.

## 실습 파일 준비

같은 디렉터리에 다음 세 파일을 만듭니다.
예제의 이미지 태그는 실습 출발점이며, 재현이 필요한 환경에서는 사용한 이미지 다이제스트를 기록합니다.

```yaml title="compose.yaml"
services:
  nginx:
    image: nginx:stable-alpine
    ports:
      - "127.0.0.1:8088:80"
    volumes:
      - ./default.conf:/etc/nginx/conf.d/default.conf:ro
  backend:
    image: python:3.12-alpine
    command: ["python", "-u", "/app/server.py"]
    volumes:
      - ./server.py:/app/server.py:ro
  backend2:
    image: python:3.12-alpine
    command: ["python", "-u", "/app/server.py"]
    volumes:
      - ./server.py:/app/server.py:ro
```

```python title="server.py"
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        body = json.dumps({
            "backend": os.environ.get("HOSTNAME"),
            "path": self.path,
            "headers": dict(self.headers),
        }).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
```

```nginx title="default.conf"
server {
    listen 80;
    server_name app.example.com;

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        return 404;
    }
}
```

Python 응답기는 경로와 헤더를 관찰하는 실습용입니다.
서비스 인증, 영속 저장, WebSocket이나 SSE는 구현되어 있지 않습니다.
각 기능 글에서는 필요한 추가 설정과 확인 대상을 따로 설명합니다.

## 요청과 설정 적용

```bash
docker compose up -d
docker compose exec nginx nginx -t
curl -sS -H 'Host: app.example.com' 'http://127.0.0.1:8088/api/devices?farm=1'
docker compose logs --tail 20 backend
```

응답의 `path`는 `/api/devices?farm=1`이며 `Host` 헤더도 확인할 수 있습니다.
`default.conf`를 수정했다면 문법 검사 후 reload합니다.

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

파일 자체를 bind mount한 상태에서 편집기가 파일을 교체해 저장하면 컨테이너가 이전 파일을 참조할 수 있습니다.
이때 `nginx -T`로 실제 내용을 확인하고 필요하면 컨테이너를 재생성합니다.

## 정리

```bash
docker compose down
```

이후 글의 `http` 문맥 예제는 실습의 `default.conf`에 둘 수 있습니다.
전체 nginx.conf나 TLS 인증서가 필요한 예제에는 별도의 준비 조건을 적었습니다.
공식 이미지의 파일 배치는 [Docker 이미지 문서](https://hub.docker.com/_/nginx)를 참고합니다.
