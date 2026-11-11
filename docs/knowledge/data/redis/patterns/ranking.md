---
id: redis-ranking
title: "실시간 랭킹 — Sorted Set으로 점수와 순위 관리"
description: "ZINCRBY로 점수를 올린 뒤 ZREVRANK와 ZRANGE로 내 순위와 상위 10명이 어떻게 바뀌는지 설명합니다."
slug: /knowledge/data/redis/patterns/ranking
sidebar_position: 5
tags: [Redis]
---
# 실시간 랭킹 — Sorted Set으로 점수와 순위 관리

주간 점수판에서 한 사용자가 점수를 얻을 때마다 “내 순위”와 “상위 10명”을 다시 계산하고 싶지 않습니다.<br />
이 글은 Sorted Set에 `ZINCRBY`를 친 뒤 `ZREVRANK`와 `ZRANGE … REV` 결과가 어떻게 바뀌는지 입력과 결과로 답합니다.

Sorted Set은 멤버와 점수를 함께 두고 자동으로 정렬합니다.
[Redis sorted sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/)

아래 명령은 **문서용 예제**입니다.<br />
원셋 boot-base에 리더보드 전용 Port는 없고, 필요하면 `StringRedisTemplate` 또는 전용 Adapter로 같은 명령을 감쌉니다.

## 상황

주간 점수판 `ranking:weekly`에서 `user:1`이 점수를 얻고, 화면에 내 순위와 상위 10명을 보여 줍니다.

## 구조와 동작

| 명령 | 역할 |
|---|---|
| `ZADD` | 멤버와 점수 등록 |
| `ZINCRBY` | 기존 점수에 가산 |
| `ZREVRANK` | 고점수 기준 0부터 시작하는 순위 |
| `ZRANGE key 0 9 REV WITHSCORES` | 상위 10명과 점수 |

같은 점수면 Redis는 멤버 문자열의 사전식 순서로 자리를 정합니다.<br />
`ZREVRANK`는 동점자에게도 서로 다른 0-based 인덱스를 줍니다.<br />
화면에 공동 순위(1,1,3)가 필요하면 점수 구간의 인원을 애플리케이션에서 묶어 표시합니다.
[ZRANGE](https://redis.io/docs/latest/commands/zrange/), [ZREVRANK](https://redis.io/docs/latest/commands/zrevrank/)

## 명령 예제

**입력:** 빈 `ranking:weekly`

```bash
ZADD ranking:weekly 120 user:1
ZADD ranking:weekly 200 user:2
ZADD ranking:weekly 150 user:3

ZINCRBY ranking:weekly 15 user:1
# "135"

ZREVRANK ranking:weekly user:1
# (integer) 2

ZRANGE ranking:weekly 0 9 REV WITHSCORES
# user:2 200 / user:3 150 / user:1 135
```

화면에 1등으로 보이려면 `ZREVRANK + 1`을 합니다.<br />
기간별 키에는 TTL을 함께 둡니다.

```bash
ZADD ranking:2026-W45 100 user:2
EXPIRE ranking:2026-W45 1209600
```

## 결과

| 조회 | 예상 |
|---|---|
| `user:1` 점수 | 135 |
| `ZREVRANK user:1` | 2 (화면 3등) |
| 상위 1명 | `user:2` / 200 |

`user:1`에 `ZINCRBY 100`을 더하면 235가 되어 `ZREVRANK`는 0이 되고, 상위 목록의 첫 자리가 `user:1`로 바뀝니다.

## 실패하거나 조건이 달라지는 경우

동점 UI가 필요하면 Redis 내부 순서만으로는 부족합니다.<br />
주간 키를 바꾸지 않으면 지난주 점수가 섞입니다.<br />
Cluster에서 Sorted Set을 쪼개 두면 전역 순위는 한 키(또는 집계 계층)가 필요합니다.
→ [토폴로지](/docs/knowledge/data/redis/ops/topology)
