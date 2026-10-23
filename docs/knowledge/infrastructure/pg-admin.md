---
format: md
id: k-pg-admin
title: "pg admin"
description: "docker-compose로 pgAdmin4를 띄우는 서비스 정의 메모"
tags:
  - Docker
status: active
slug: /knowledge/k-pg-admin
---
# pg admin

> **개요:** Docker Compose로 pgAdmin4 컨테이너를 올리는 서비스 정의 메모입니다.

## compose 서비스 예

원 노트에 있던 정의를 정리한 것입니다.
기본 이메일, 비밀번호는 예시이므로 운영에서는 바꿉니다.

```yaml
services:
  pgadmin:
    image: 'docker.io/dpage/pgadmin4:latest'
    restart: always
    container_name: pgadmin
    ports:
      - "6000:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: jangws1003@naver.com
      PGADMIN_DEFAULT_PASSWORD: 1234
    volumes:
      - ./pgadmin-data:/var/lib/pgadmin/
```

호스트의 6000 포트로 접속한 뒤, pgAdmin에서 PostgreSQL 서버를 등록하면 됩니다.
