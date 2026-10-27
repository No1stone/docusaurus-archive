---
format: md
id: t-spring-cache
title: "캐시 적용 ExampleItem 변형"
description: "@Cacheable이 CachePort(Redis)로 가도록 적용할 때의 원셋 변형"
tags:
  - Spring
  - Redis
  - Cache
status: active
---

# 캐시 적용 ExampleItem 변형

이넘 적용([enum/](../enum/))과 같습니다. **기본 원셋에는 캐시 코드를 넣지 않고**, 필요할 때 이 변형을 얹습니다.

전제: 호스트에 [lib-cache/](../lib-cache/) (`CachePort` + CacheManager)가 있어야 합니다.
없으면 도메인 변형보다 **먼저** 둡니다. lib-cache는 도메인·ExampleItem과 무관한 공유 모듈입니다.

```text
lib-cache/   # 호스트 1회 (공유 라이브러리)
cache/
  facade/    # 도메인마다
  config/    # 도메인마다 (TTL)
```

> **개요:** `@Cacheable` → `CachePortCacheManager` → `CachePort` → Redis.
> 공유 모듈은 default TTL만, 캐시 이름·추가 TTL은 도메인(model). BFF에는 두지 않습니다.

## 흐름

```text
@Cacheable / @CacheEvict  (도메인 Facade, model)
        ↓
CachePortCacheManager     (lib-cache, Spring CacheManager)
        ↓
CachePort → Redis 어댑터  (lib-cache)
```

miss이면 메서드 본문(Port 조회)이 실행되고, 결과가 캐시에 들어갑니다.
aside를 Facade에 손으로 짜지 않습니다.

값 직렬화는 `CacheValueCodec` 경계입니다. 기본은 JSON(`JsonCacheValueCodec`)입니다.
Java 직렬화/`Serializable`은 쓰지 않습니다.

## 위치 (모노리포)

| 무엇 | 어디 |
|------|------|
| `@Cacheable`, `CACHE_NAME`, TTL customizer | **model** (도메인) |
| `CachePort`, `CachePortCacheManager`, default TTL | **lib-cache** (또는 동등한 공유 캐시 모듈) |
| BFF Facade / Controller | **api** — 도메인 진입만 호출, 캐시 설정 없음 |

Gateway처럼 JWT 키로 Redis를 **직접 KV 조회**하는 경우는 이 변형이 아닙니다.
그때는 `CachePort`만 쓰고 Spring `@Cacheable` / CacheManager를 붙이지 않습니다.

## 복사할 때

1. [lib-cache/](../lib-cache/)가 호스트에 없으면 먼저 복사합니다. 있으면 재사용합니다.
2. 아래 **호스트 Redis 체크리스트**를 확인합니다.
3. [facade/ExampleItemFacade.java](./facade/ExampleItemFacade.java)의 `@Cacheable` / `@CacheEvict` / `CACHE_NAME`을 도메인 Facade에 맞춥니다.
4. [config/ExampleItemCacheTtlConfig.java](./config/ExampleItemCacheTtlConfig.java)를 **model**에 두고, 필요한 캐시 이름만 TTL을 넣습니다.
5. 예전에 앱에 있던 `RedisCacheManager` 빈은 제거합니다.

## 호스트 Redis 체크리스트

- [ ] `StringRedisTemplate` + `CachePort` 어댑터
- [ ] `@Primary` `CachePortCacheManager` (lib-cache 등)
- [ ] `RedisTemplate` 값을 쓰면 JSON (`RedisSerializer.json()` 등). JDK 직렬화 금지
- [ ] 앱에 `RedisCacheManager` / 중복 CacheManager 없음

## Redis 키

| 경로 | 형식 | 예 |
|------|------|-----|
| `@Cacheable` | `{CACHE_NAME}::{id}` | `member::42` |
| 수동 KV | `{영역}:{용도}:…` | `access:…`, `auth-sig:key:…` |

수동 KV에는 `::`를 쓰지 않아 `@Cacheable` prefix 삭제와 안 겹치게 합니다.
`CACHE_NAME`은 도메인 단위 짧은 이름입니다.

## 무효화

- 단건 변경·삭제 → `@CacheEvict(key = "#id")` (또는 `#result.id`)
- 일괄·키를 특정하기 어려움 → `allEntries = true` (`{CACHE_NAME}::` prefix 삭제)
- Name IN·목록 검색 결과는 캐시하지 않음 (단건 `findById`와 별개)

## 캐시 값

JSON 왕복이 쉬운 응답 DTO(`Res.Item` 등)를 권장합니다.
Entity·프록시·요청 객체는 캐시 값으로 두지 않는 것을 권장합니다. (`Serializable` 불필요)

## default TTL과 도메인 TTL

lib-cache(또는 공유 모듈)는 **default TTL만** 강제합니다. (예: 1분)
도메인에서 더 길게 쓰려면 `CachePortTtlCustomizer` 빈을 model에 둡니다.

Name 맵 규칙은 [DisplayNameResolver](../exampleitem/support/display/)와 [coding-conventions](/docs/harness/context/coding-conventions)를 따릅니다.

## 파일

- 공유 모듈: [lib-cache/](../lib-cache/)
- [`facade/ExampleItemFacade.java`](./facade/ExampleItemFacade.java)
- [`config/ExampleItemCacheTtlConfig.java`](./config/ExampleItemCacheTtlConfig.java)
