---
format: md
id: k-docker-배포-로그
title: "docker 배포 로그"
description: "docker-compose로 서비스 배포하고 logs로 확인하는 메모"
tags:
  - Docker
status: active
slug: /knowledge/k-docker-배포-로그
---
# docker 배포 로그

> **개요:** `docker-compose.yml`이 있는 디렉터리에서 서비스를 올리고 로그를 보는 메모입니다.

![compose 파일 위치 화면](../../img/docker-배포-로그/docker-배포-로그-1.png)

docker-compose 파일이 있는 곳에서 실행해야 합니다.

## 배포

![배포 실행 화면](../../img/docker-배포-로그/docker-배포-로그-2.png)

```bash
docker-compose up --build -d chatbot
```

## 로그 확인

![로그 확인 화면](../../img/docker-배포-로그/docker-배포-로그-3.png)

```bash
docker-compose logs --tail 10 chatbot
docker-compose logs --tail=100 -f chatbot
```

`-f`는 로그를 따라가며 봅니다.
서비스 이름 `chatbot`은 compose의 서비스명에 맞게 바꿉니다.
