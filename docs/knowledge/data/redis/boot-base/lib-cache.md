---
id: redis-boot-base-lib-cache
title: "lib-cache — CachePort와 JSON 직렬화, Spring Cache 연결"
description: "원셋 lib-cache의 CachePort와 RedisCacheAdapter가 키·TTL을 어떻게 다루고, @Cacheable과 직접 호출이 어떻게 갈리는지 설명합니다."
slug: /knowledge/data/redis/boot-base/lib-cache
sidebar_position: 1
tags: [Redis, Spring]
---
# lib-cache — CachePort와 JSON 직렬화, Spring Cache 연결

Gateway에 액세스 토큰을 몇 분만 들고 있거나, 도메인 메서드에 `@Cacheable`을 붙이고 싶을 때 Redis 명령을 곳곳에 흩뿌리지 않으려면 계약이 필요합니다.<br />
이 글은 원셋 `lib-cache`의 `CachePort`와 `RedisCacheAdapter`가 그 계약을 어떻게 구현하는지 설명합니다.

템플릿 경로: `docs/harness/templates/backend/spring/lib-cache/`<br />
외부 원본: [boot-base](https://github.com/No1stone/boot-base) (`lib-cache/`)

## 상황

호스트가 Redis에 문자열 값을 TTL과 함께 넣고, 나중에 존재 여부와 값을 읽고, 접두로 일괄 삭제해야 합니다.<br />
도메인 Facade는 Redis API를 직접 보지 않고 Port만 호출합니다.

## 구조와 동작

`CachePort`는 도메인 없는 캐시 능력 계약입니다.<br />
`RedisCacheAdapter`는 `StringRedisTemplate`(Lettuce)으로 구현합니다.<br />
TTL이 있는 `set`은 밀리초로 Redis에 넘깁니다.

| 경로 | 용도 | 흐름 |
|---|---|---|
| Port 직접 | 토큰 KV 등 | `cachePort.set` → Redis |
| Spring Cache | `@Cacheable` | `CachePortCacheManager` → `CachePort` → Redis |

JSON 직렬화는 Port 바깥의 `JsonCacheValueCodec` 또는 호출부가 맡습니다.<br />
JDK `Serializable` 바이너리 값은 쓰지 않습니다.

## 코드 예제

아래는 **원셋 템플릿에 있는 계약과 Adapter**입니다.<br />
상품 캐시 시나리오는 설명용이며, 토큰 키 규칙은 호스트에 둡니다.

```java
public interface CachePort {
    String get(String key);
    boolean exists(String key);
    void set(String key, String value);
    void set(String key, String value, Duration ttl);
    void hashPut(String key, String field, String value);
    void delete(String key);
    void deleteByPrefix(String prefix); // @CacheEvict(allEntries=true)
}
```

```java
// RedisCacheAdapter (템플릿)
public void set(String key, String value, Duration ttl) {
    redisTemplate.opsForValue().set(key, value, ttl.toMillis(), TimeUnit.MILLISECONDS);
}
```

**입력:** `cachePort.set("access:7", payload, Duration.ofMinutes(15))` 후 `exists` / `get`

**예상:** 15분 동안 키가 존재하고 값이 반환됩니다.<br />
만료 후에는 `get`이 null이고 `exists`가 false입니다.

## 결과

| 호출 | Redis에서 보이는 변화 |
|---|---|
| `set(key, v, 15m)` | 문자열 값 + TTL |
| `delete(key)` | 키 제거 |
| `deleteByPrefix("access:")` | 접두 일치 키 일괄 삭제 |

## 실패하거나 조건이 달라지는 경우

호스트에 `@Primary` `CachePortCacheManager`와 중복 `RedisCacheManager`가 함께 있으면 `@Cacheable` 경로가 어긋날 수 있습니다.<br />
토큰 저장은 `@Cacheable` 경로와 섞지 않습니다.
→ [세션과 토큰](/docs/knowledge/data/redis/patterns/session-and-token)

패턴 설명은 [캐시 Cache-Aside](/docs/knowledge/k-cashing)를 봅니다.
