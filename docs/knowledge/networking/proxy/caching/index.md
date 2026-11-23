---
title: "캐시와 응답 최적화"
description: "proxy_cache와 Cache-Control 정적 캐시로 응답을 줄이는 Nginx 캐시 입구입니다."
slug: "/knowledge/networking/proxy/caching"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "proxy_cache"
  - "Cache-Control"
  - "Nginx 캐시"
  - "정적 파일"
---

# 캐시와 응답 최적화

| 글 | 다루는 내용 |
|---|---|
| [정적 파일 캐시와 Cache-Control](./static-cache-control.md) | 프론트 배포에서 파일이 바뀌었는데 이전 화면이 남는다면 브라우저와 CDN의 캐시를 확인합니다. |
| [proxy_cache와 캐시](./proxy-cache.md) | 업스트림 응답을 Nginx에 저장하면 반복 조회에서 앱 호출을 줄일 수 있습니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### proxy_cache와 Cache-Control 차이는?

proxy_cache는 Nginx가 응답을 저장하고, Cache-Control은 브라우저와 CDN이 따를 힌트입니다.

### 캐시를 언제 쓰면 안 되나요?

사용자별, 민감 응답은 캐시 키와 bypass를 엄격히 하거나 캐시하지 않습니다.

