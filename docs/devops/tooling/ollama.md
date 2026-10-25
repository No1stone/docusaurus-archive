---
format: md
id: k-ollama
title: "ollama"
description: "ollama"
tags:
  - Docker
  - HTTP
status: active
slug: /knowledge/k-ollama
---
# ollama

## 개요

ollama에 대한 메모입니다.

올라마 모델 검색후
올라마 들어가서 모델설치
web ui 들어가서 테스트
딥식이는먼가불안하니 안씀..

![ollama-image.png](/img/ollama/ollama-image.png)
![ollama-image.png](/img/ollama/ollama-image.png)

## 예제·코드

```docker
services:
  openWebUI:
    image: ghcr.io/open-webui/open-webui:main
    restart: always
    ports:
      - "3000:8080"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - ./open-webui-local:/app/backend/data
 
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ./ollama-local:/root/.ollama
 
```

<details>
<summary>참고 자료</summary>

- [Ollama](https://ollama.com/search) — Search for models on Ollama.
</details>
