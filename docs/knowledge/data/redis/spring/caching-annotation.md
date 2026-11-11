---
format: md
id: k-caching-annotation
title: "Spring Cache — @Cacheable, @CachePut, @CacheEvict"
description: "Spring Cache 애너테이션과 CachePort 매니저로 Redis에 연결하는 흐름을 정리합니다."
sidebar_label: "Spring Cache"
sidebar_position: 3
tags: [Redis, Spring]
status: active
slug: /knowledge/k-caching-annotation
---
# Spring Cache — @Cacheable, @CachePut, @CacheEvict

> **개요:** 메서드 단위 캐시 선언과 Redis 백엔드 연결을 정리합니다.
> slug `/knowledge/k-caching-annotation`을 유지합니다.

## 애너테이션

| 애너테이션 | 역할 |
|---|---|
| `@EnableCaching` | 캐싱 기능 활성화 |
| `@Cacheable` | 없으면 실행 후 저장, 있으면 반환 |
| `@CachePut` | 항상 실행 후 캐시 갱신 |
| `@CacheEvict` | 삭제 (`allEntries`로 prefix 일괄) |
| `@Caching` | 여러 동작 조합 |

## boot-base 흐름

```text
@Cacheable / @CacheEvict
  → CachePortCacheManager / CachePortCache
  → CachePort (RedisCacheAdapter)
  → StringRedisTemplate (Lettuce)
```

값은 `JsonCacheValueCodec`(JSON)입니다.<br />
앱에 `RedisCacheManager`를 두지 않습니다.<br />
Gateway JWT는 `@Cacheable`이 아니라 CachePort 직접입니다.<br />

상세: [lib-cache](/docs/knowledge/data/redis/boot-base/lib-cache)  
패턴: [캐시 Cache-Aside](/docs/knowledge/k-cashing)  
Ref: [boot-base](https://github.com/No1stone/boot-base)
