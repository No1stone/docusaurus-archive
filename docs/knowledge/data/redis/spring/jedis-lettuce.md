---
id: redis-jedis-lettuce
title: "Jedis와 Lettuce — 연결 모델과 Spring Data Redis 연동"
description: "Jedis와 Lettuce 연결 모델 차이와 Spring Data Redis에서 Lettuce를 쓰는 기준을 정리합니다."
slug: /knowledge/data/redis/spring/jedis-lettuce
sidebar_position: 1
tags: [Redis, Spring]
---
# Jedis와 Lettuce — 연결 모델과 Spring Data Redis 연동

> **개요:** Java 클라이언트 선택과 Spring Boot 기본(Lettuce)을 정리합니다.

## 비교

| | Jedis | Lettuce |
|---|---|---|
| 모델 | 동기, 커넥션 풀 중심 | 비동기, 리액티브 가능, Netty |
| Spring Boot | 사용 가능 | **기본 클라이언트** |

boot-base 캐시, 게이트웨이는 **Lettuce** + `StringRedisTemplate` / `RedisConnectionFactory`입니다.

```java
@Bean
public RedisConnectionFactory redisConnectionFactory() {
    return new LettuceConnectionFactory(host, port);
}
```

## Reactive Redis 메모

옛 [R2dbc Redis](/docs/knowledge/k-r2dbc-redis) 노트는 Webflux, Reactive Redis 실험과 Lettuce 연결 예가 섞여 있습니다.<br />
R2DBC(DB)와 Redis 클라이언트를 혼동하지 않습니다.<br />
Reactive Redis가 필요하면 Lettuce 기반 Spring Data Redis Reactive를 공식 문서로 확인합니다.<br />

Ref: [boot-base](https://github.com/No1stone/boot-base)
