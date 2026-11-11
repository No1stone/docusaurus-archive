---
id: redis-template
title: "RedisTemplate — 연결 설정, 직렬화, Lua 실행"
description: "Spring Data RedisTemplate, StringRedisTemplate의 직렬화와 Lua 실행 주의점을 정리합니다."
slug: /knowledge/data/redis/spring/redis-template
sidebar_position: 2
tags: [Redis, Spring]
---
# RedisTemplate — 연결 설정, 직렬화, Lua 실행

> **개요:** Spring Data Redis의 템플릿으로 키, 값을 읽고 쓰며, 직렬화가 운영 사고를 만듭니다.

## StringRedisTemplate

boot-base `RedisCacheAdapter`는 `StringRedisTemplate`으로 get/set/hash/delete합니다.<br />
키, 값을 문자열로 다루므로 JSON 문자열을 직접 넣는 KV에 맞습니다.

## 직렬화

| 방식 | 권장 |
|---|---|
| JDK 직렬화 | 금지 (가독성, 호환, 보안) |
| JSON | `@Cacheable` 값, DTO에 권장 (`JsonCacheValueCodec`) |
| String | 토큰, 단순 KV |

## Lua

`StringRedisTemplate.execute(RedisScript, keys, args)` 형태로 스크립트를 실행합니다.<br />
원자성이 필요하면 [Lua](/docs/knowledge/data/redis/keys/lua-atomic)를 보고, 락은 Redisson에 맡깁니다.<br />

Ref: [boot-base lib-cache](https://github.com/No1stone/boot-base)
