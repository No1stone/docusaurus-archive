---
id: redis-list-set-zset
title: "List, Set, Sorted Set"
description: "Redis List, Set, Sorted Set 명령과 큐, 멤버십, 랭킹에 쓰는 기준을 정리합니다."
slug: /knowledge/data/redis/keys/list-set-sorted-set
sidebar_position: 3
tags: [Redis]
---
# List, Set, Sorted Set

> **개요:** 순서가 있는 목록, 중복 없는 집합, 점수로 정렬된 집합을 나눕니다.

## List

```bash
LPUSH queue:jobs '{"id":"j1"}'
BRPOP queue:jobs 5
```

양끝 push/pop에 유리해 단순 작업 큐에 씁니다.<br />
신뢰성 있는 소비, 재처리는 Streams를 함께 검토합니다.<br />
→ [Redis 작업 큐](/docs/knowledge/data/redis/patterns/work-queue)

## Set

```bash
SADD tags:post:1 redis cache
SISMEMBER tags:post:1 redis
```

멤버십, 태그, 유니크 집합에 씁니다.

## Sorted Set

```bash
ZADD ranking:weekly 120 user:1
ZINCRBY ranking:weekly 10 user:1
ZREVRANK ranking:weekly user:1
ZRANGE ranking:weekly 0 9 REV WITHSCORES
```

점수로 순위를 매깁니다.<br />
`ZREVRANK`는 **0부터** 시작합니다.<br />
상세는 [실시간 랭킹](/docs/knowledge/data/redis/patterns/ranking)을 봅니다.

## 참고

- [Redis data types](https://redis.io/docs/latest/develop/data-types/)
