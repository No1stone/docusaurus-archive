---
format: md
id: t-spring-lib-cache
title: "lib-cache (CachePort 공유 모듈)"
description: "@Cacheable → CachePort(Redis)용 공유 라이브러리 골격. 도메인 코드 없음."
tags:
  - Spring
  - Redis
  - Cache
status: active
---

# lib-cache (CachePort 공유 모듈)

도메인 원셋·ExampleItem과 무관한 **공유 라이브러리** 골격입니다.
호스트에 같은 역할이 없으면 이 폴더를 모듈(또는 공통 패키지)로 한 번 둡니다.

도메인에 `@Cacheable`을 붙일 때는 [cache/](../cache/) 변형(facade·TTL config)을 봅니다.

```text
lib-cache/     ← 호스트 1회 (이 폴더)
cache/         ← 도메인마다 (facade + TTL)
```

## 역할

| 파일 | 역할 |
|------|------|
| `CachePort` | Redis KV 계약 (String 값) |
| `redis/RedisCacheAdapter` | `StringRedisTemplate` 구현 |
| `spring/CacheValueCodec` · `JsonCacheValueCodec` | 객체 ↔ JSON 경계 |
| `spring/CachePortCache` · `CachePortCacheManager` | Spring Cache → CachePort |
| `spring/CachePortCacheConfiguration` | `@EnableCaching`, default TTL, `@Primary` CacheManager |
| `spring/CachePortTtlCustomizer` | 도메인이 이름별 TTL을 추가하는 SPI |

Lock/Redisson은 여기에 넣지 않습니다.

## 의존 (Gradle 예)

```gradle
dependencies {
    api 'org.springframework.boot:spring-boot-starter-data-redis'
    api 'org.springframework.boot:spring-boot-starter-json' // RedisSerializer.json()
}
```

앱에 `StringRedisTemplate`과 Redis 연결이 있어야 합니다.
`RedisCacheManager`는 두지 않습니다. 호스트 체크리스트는 [cache README](../cache/README.md)를 봅니다.

## 복사할 때

1. 패키지를 호스트에 맞게 바꿉니다. (`com.example.template.cache` → 예: `….lib.cache`)
2. 모노리포면 공유 모듈 이름 예: `lib-cache`. api/gateway가 의존합니다.
3. 모놀리식이면 앱 공통 패키지에 두고 컴포넌트 스캔에 포함합니다.

## 파일

- [`CachePort.java`](./CachePort.java)
- [`redis/RedisCacheAdapter.java`](./redis/RedisCacheAdapter.java)
- [`spring/CacheValueCodec.java`](./spring/CacheValueCodec.java)
- [`spring/JsonCacheValueCodec.java`](./spring/JsonCacheValueCodec.java)
- [`spring/CachePortTtlCustomizer.java`](./spring/CachePortTtlCustomizer.java)
- [`spring/CachePortCache.java`](./spring/CachePortCache.java)
- [`spring/CachePortCacheManager.java`](./spring/CachePortCacheManager.java)
- [`spring/CachePortCacheConfiguration.java`](./spring/CachePortCacheConfiguration.java)
