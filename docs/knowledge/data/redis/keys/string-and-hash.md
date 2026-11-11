---
id: redis-string-hash
title: "String과 Hash"
description: "Redis String과 Hash의 기본 명령, 캐시 블롭과 필드 단위 세션 저장 예를 정리합니다."
slug: /knowledge/data/redis/keys/string-and-hash
sidebar_position: 2
tags: [Redis]
---
# String과 Hash

> **개요:** String은 바이트열, 카운터에, Hash는 필드 단위 객체에 씁니다.

## String

```bash
SET cache:user:1 '{"id":1,"name":"a"}' EX 600
GET cache:user:1
INCR rate:user:1:2026-11-09
```

한 키에 JSON 전체를 넣는 캐시 블롭, 단순 카운터에 적합합니다.<br />
필드만 바꿀 때도 전체를 다시 직렬화해야 합니다.

## Hash

```bash
HSET session:abc userId 1 role USER
HGET session:abc role
HGETALL session:abc
HEXPIRE session:abc 1800 FIELDS 1 userId
```

세션처럼 필드만 갱신할 때 유리합니다.<br />
필드별 만료는 Redis 버전에 따라 지원 범위가 다릅니다.<br />
공식 문서로 확인합니다.

## 결과와 조건

| 선택 | 유리한 경우 |
|---|---|
| String | 불변에 가까운 캐시 값, 카운터 |
| Hash | 부분 갱신, 필드 조회 |

boot-base `CachePort`의 기본 KV는 String 경로(`get`/`set`)이고, `hashPut`도 제공합니다.<br />
Ref: [boot-base](https://github.com/No1stone/boot-base).
