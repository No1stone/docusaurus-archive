---
format: md
id: k-r2dbc-redis
title: "Reactive Redis 메모 (Lettuce)"
description: "옛 R2dbc Redis 노트를 Lettuce, Reactive Redis 연결 메모로 정리합니다. R2DBC(DB)와 Redis 클라이언트를 구분합니다."
sidebar_label: "Reactive Redis 메모"
sidebar_position: 5
tags: [Redis, Spring]
status: active
slug: /knowledge/k-r2dbc-redis
---
# Reactive Redis 메모 (Lettuce)

> **개요:** 제목에 R2DBC가 있으나, 본 메모의 실체는 **Redis 클라이언트(Lettuce)** 연동 실험입니다.
> SQL R2DBC와 혼동하지 않습니다. slug `/knowledge/k-r2dbc-redis`는 유지합니다.

## 정리

- Spring Boot 기본 Redis 클라이언트는 **Lettuce**입니다.
- 게이트웨이, 캐시는 `LettuceConnectionFactory` + `StringRedisTemplate` / `CachePort` 경로를 씁니다.
- Access 토큰 존재는 `CachePort.exists` / `hasKey("access:" + …)` 형태입니다.<br />

자세한 비교와 권장 경로는 [Jedis와 Lettuce](/docs/knowledge/data/redis/spring/jedis-lettuce), [lib-cache](/docs/knowledge/data/redis/boot-base/lib-cache)를 봅니다.<br />

Ref: [boot-base](https://github.com/No1stone/boot-base)
