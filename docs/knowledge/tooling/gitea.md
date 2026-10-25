---
format: md
id: k-gitea
title: "gitea"
description: "gitea"
tags:
  - AWS
  - Docker
  - Git
  - HTTP
status: active
slug: /knowledge/k-gitea
---
# gitea

## 개요

gitea에 대한 메모입니다.

외부 db사용하려면 해당 도커파일이용
배포후 처음세팅할때 db적용시키면됨.
볼륨은 해당 위치에 저장됨.
aws db로 적용성공

![gitea-1.png](/img/gitea/gitea-1.png)
![gitea-2.png](/img/gitea/gitea-2.png)
![gitea-3.png](/img/gitea/gitea-3.png)

## 예제·코드

```docker
version: "3"

services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
    restart: always
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"
```

<details>
<summary>참고 자료</summary>

- [https://docs.gitea.io/en-us/install-with-docker/](https://docs.gitea.io/en-us/install-with-docker/)
</details>
