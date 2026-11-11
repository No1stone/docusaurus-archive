---
id: data-redis
title: "Redis란?"
description: "같은 상품 조회를 두 번 할 때 DB와 캐시를 언제 읽고, TTL 만료와 eviction이 어떻게 다른지 설명합니다."
sidebar_label: "Redis란?"
sidebar_position: 0
slug: /knowledge/data/redis
tags:
  - Redis
status: active
---
# Redis란?

같은 상품 상세를 짧은 시간에 두 번 조회하면, 첫 요청만 DB를 타고 두 번째는 메모리에서 끝내고 싶을 때가 있습니다.<br />
이 글은 Cache-Aside에서 `GET`이 비었을 때와 TTL이 지났을 때 키가 어떻게 바뀌는지 한 흐름으로 답합니다.

Redis는 키와 값을 메모리에 두고, 값의 자료구조마다 명령을 제공합니다.<br />
원셋의 캐시 계약은 `CachePort`이고, Redis 구현은 `RedisCacheAdapter`입니다.
[cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)

## 상황

관리 화면에서 `product:42` 상세를 자주 엽니다.<br />
첫 요청은 DB가 필요하고, 직후 같은 요청은 캐시에서 끝내고 싶습니다.<br />
일정 시간이 지나면 다시 DB를 보게 해야 합니다.

## 구조와 동작

1. `GET`으로 캐시 키를 읽습니다.
2. 값이 있으면 그대로 씁니다.
3. 없으면 DB에서 읽고, Redis에 TTL과 함께 넣은 뒤 반환합니다.
4. 갱신 시에는 보통 DB를 먼저 쓰고 캐시 키를 지워, 다음 읽기가 새 값을 채우게 합니다.

`SET key value EX seconds`는 초 단위 TTL을 함께 겁니다.<br />
성공한 `SET`은 기존 TTL을 버리고 새 만료를 둡니다(`KEEPTTL`이 아닌 한).
[SET](https://redis.io/docs/latest/commands/set/)

TTL 만료와 `maxmemory` eviction은 다릅니다.<br />
만료는 키에 걸린 시각이 지난 정상 수명이고, eviction은 메모리 한도 초과 시 정책에 따라 키를 희생하는 동작입니다.
[Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

## 명령 예제

아래 bash는 **문서용 입력과 예상 결과**입니다.<br />
원셋에서는 `CachePort.get` / `set(key, value, ttl)`로 같은 흐름을 호출합니다.

**입력:** DB에 `{"id":42,"name":"widget"}`가 있고, 캐시 TTL은 300초입니다.

```bash
GET cache:product:42
# (nil)

SET cache:product:42 '{"id":42,"name":"widget"}' EX 300
# OK

GET cache:product:42
# {"id":42,"name":"widget"}

TTL cache:product:42
# (integer) 298
```

원셋 Adapter 호출 형식은 다음과 같습니다.<br />
템플릿 코드이며, 상품 도메인 자체가 원셋에 들어 있는 것은 아닙니다.

```java
String key = "cache:product:42";
String cached = cachePort.get(key);
if (cached == null) {
    String json = loadFromDb(42); // 호스트 조회
    cachePort.set(key, json, Duration.ofSeconds(300));
    return json;
}
return cached;
```

[lib-cache](/docs/knowledge/data/redis/boot-base/lib-cache) / 템플릿 `docs/harness/templates/backend/spring/lib-cache/`

## 결과

| 시점 | `GET cache:product:42` | DB |
|---|---|---|
| 첫 요청 | `(nil)` 후 SET | 조회함 |
| TTL 안 재요청 | JSON 반환 | 호출 안 함 |
| TTL 만료 후 | `(nil)` | 다시 조회 |

300초가 지나면 키가 사라져 다시 `(nil)`이 됩니다.<br />
그다음 요청이 DB를 다시 읽고 `SET … EX 300`을 반복합니다.

## 실패하거나 조건이 달라지는 경우

쓰기 후 캐시를 안 지으면 TTL이 끝날 때까지 옛 값이 남을 수 있습니다.<br />
무효화(`DEL` / `CachePort.delete`)와 TTL을 함께 설계합니다.

메모리가 한도에 닿으면 TTL이 남아 있어도 eviction 정책이 키를 버릴 수 있습니다.<br />
순수 캐시와 “절대 잃으면 안 되는” 키를 한 인스턴스에 섞지 않는 편이 안전합니다.

핫 키가 동시에 만료되면 여러 요청이 DB로 몰릴 수 있습니다.<br />
락이나 조기 갱신은 [분산 락](/docs/knowledge/data/redis/patterns/distributed-lock)과 [캐시 Cache-Aside](/docs/knowledge/k-cashing)에서 이어갑니다.

## 이 폴더에서 다음에 볼 글

| 구분 | 글 |
|---|---|
| 키 | [키 설계와 TTL](/docs/knowledge/data/redis/keys/key-design-and-ttl), [String과 Hash](/docs/knowledge/data/redis/keys/string-and-hash) |
| 패턴 | [캐시 Cache-Aside](/docs/knowledge/k-cashing), [실시간 랭킹](/docs/knowledge/data/redis/patterns/ranking) |
| Spring / boot-base | [Spring Cache](/docs/knowledge/k-caching-annotation), [lib-cache](/docs/knowledge/data/redis/boot-base/lib-cache) |
| 운영 | [RDB, AOF와 메모리](/docs/knowledge/data/redis/ops/persistence-and-memory) |
