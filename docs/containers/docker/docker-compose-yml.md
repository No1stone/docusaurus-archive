---
format: md
id: k-docker-compose-yml
title: "docker-compose yml"
description: "docker-compose.yml에 넣을 서비스 항목(이름, 이미지, 포트, 네트워크) 메모"
tags:
  - Docker
status: active
slug: /knowledge/k-docker-compose-yml
---
# docker-compose yml

> **개요:** `docker-compose.yml`을 작성할 때 채우는 항목을 짧게 적어 둔 메모입니다.

## 파일 편집

```bash
vi docker-compose.yml
```

![docker-compose.yml 작성 화면](/img/docker-compose-yml/docker-compose-yml-1.png)

## 적어 둘 항목

- 컨테이너 이름 (`container_name`)
- 이미지 (`image`) 또는 빌드 (`build`)
- 포트: 외부 포트와 컨테이너(내부) 포트 매핑
- 경로(볼륨) 설정
- 네트워크 설정

서비스마다 이미지, 빌드, 포트, 볼륨, 네트워크를 맞춰 두면 Compose로 한꺼번에 올릴 수 있습니다.
