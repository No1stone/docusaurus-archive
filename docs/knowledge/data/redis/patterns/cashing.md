---
format: md
id: k-cashing
title: "캐시 — Cache-Aside, 갱신과 무효화"
description: "같은 조회를 두 번 할 때 DB와 캐시를 언제 읽고, 값을 바꾼 뒤 무효화가 어떻게 먹히는지 설명합니다. 공개 URL slug는 k-cashing을 유지합니다."
sidebar_label: "캐시 Cache-Aside"
sidebar_position: 1
tags: [Redis]
status: active
slug: /knowledge/k-cashing
---
# 캐시 — Cache-Aside, 갱신과 무효화

상품 이름을 바꾼 직후에도 상세 API가 옛 JSON을 돌려주면, TTL만으로는 설명이 부족합니다.<br />
이 글은 Cache-Aside 읽기 다음에 **쓰기 후 무효화**가 키를 어떻게 바꾸는지 이어서 답합니다.

공개 URL(`/knowledge/k-cashing`)과 옛 제목 흔적(Cashing)은 slug로 유지합니다.
[cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)

입문 흐름은 [Redis란?](/docs/knowledge/data/redis)과 같습니다.

## 상황

`product:42`를 자주 읽고, 가끔 이름을 수정합니다.<br />
읽기는 캐시로 흡수하고, 수정 뒤에는 옛 JSON이 남지 않게 해야 합니다.

## 구조와 동작

읽기는 캐시를 먼저 보고, 없을 때만 DB를 채웁니다.<br />
쓰기에서는 DB를 반영한 뒤 캐시 키를 지우는 Evict가 원셋 기본에 가깝습니다.

| 전략 | 동작 |
|---|---|
| Evict | DB 반영 뒤 `DEL` → 다음 읽기가 새 값으로 채움 |
| Put | DB 반영 뒤 새 값으로 `SET` |
| TTL만 의존 | 만료까지 옛 값이 남을 수 있음 |

쓰기에서 캐시를 덮어쓰지 않고 지우는 이유는 동시 갱신 경쟁을 줄이기 쉽기 때문입니다.<br />
늦게 도착한 옛 값이 캐시에 남는 창을 다음 읽기에서 닫습니다.

## 명령과 코드 예제

bash는 **문서용 입력·예상 결과**입니다.<br />
원셋 호출은 `CachePort`입니다.

**입력:** TTL 300초, 이후 이름을 gadget으로 변경

```bash
GET cache:product:42
# (nil)
SET cache:product:42 '{"id":42,"name":"widget"}' EX 300
GET cache:product:42
# {"id":42,"name":"widget"}

DEL cache:product:42
# (integer) 1
GET cache:product:42
# (nil)
```

```java
// 원셋 CachePort — 템플릿 계약. 상품 도메인 코드는 호스트에 둠
cachePort.set("cache:product:42", widgetJson, Duration.ofSeconds(300));
// … DB에서 name을 gadget으로 갱신한 뒤
cachePort.delete("cache:product:42");
```

[lib-cache](/docs/knowledge/data/redis/boot-base/lib-cache) / [SET](https://redis.io/docs/latest/commands/set/)

## 결과

| 시점 | 캐시 | DB |
|---|---|---|
| 첫 읽기 | 미스 후 SET | 조회 |
| TTL 안 재읽기 | 히트 | 미호출 |
| Evict 후 읽기 | 미스 후 새 값 SET | 조회 |

## 실패하거나 조건이 달라지는 경우

쓰기 후 Evict를 빠뜨리면 TTL이 끝날 때까지 옛 이름이 보입니다.<br />
메모리가 한도에 닿으면 TTL이 남아도 eviction으로 키가 사라질 수 있습니다.
[Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

핫 키가 동시에 만료되면 DB로 요청이 몰릴 수 있습니다.<br />
→ [Redis란?](/docs/knowledge/data/redis), [분산 락](/docs/knowledge/data/redis/patterns/distributed-lock)

## Spring, boot-base

- 애너테이션: [Spring Cache](/docs/knowledge/k-caching-annotation)
- 구현: [lib-cache](/docs/knowledge/data/redis/boot-base/lib-cache) — `@Cacheable` → `CachePort` → Redis
