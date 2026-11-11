---
id: redis-counter-rate-limit
title: "카운터와 요청 제한 — INCR, TTL, Lua"
description: "사용자별 INCR 카운터와 TTL, Lua로 요청 제한을 거는 예를 정리합니다."
slug: /knowledge/data/redis/patterns/counter-rate-limit
sidebar_position: 6
tags: [Redis]
---
# 카운터와 요청 제한 — INCR, TTL, Lua

> **개요:** 짧은 창에서 요청 횟수를 세어 한도를 넘기면 거절합니다.
> 이벤트 ID 선점(중복 처리 방지)과는 다른 글입니다.

## 상황

사용자 또는 API 키마다 분당 N회만 허용해야 합니다.<br />
여러 앱 인스턴스가 같은 한도를 공유하려면 카운터를 Redis에 둡니다.

## 예: 사용자별 분당 제한

```bash
INCR ratelimit:user:9:202611091430
EXPIRE ratelimit:user:9:202611091430 60
GET ratelimit:user:9:202611091430
```

`INCR`과 `EXPIRE`를 나누면 첫 요청 직후 프로세스가 죽어 TTL이 안 걸릴 수 있습니다.<br />
창을 원자적으로 열려면 Lua로 묶습니다.

```lua
-- KEYS[1]=counter key, ARGV[1]=ttl seconds
local n = redis.call('INCR', KEYS[1])
if n == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return n
```

→ [Lua](/docs/knowledge/data/redis/keys/lua-atomic)

## 결과

카운터가 한도 이하면 통과, 초과면 429 등으로 거절합니다.<br />
시계는 서버와 Redis 기준으로 맞춥니다.

## 적용할 때

키에 사용자와 시간 창 단위를 넣고, 분산 환경에서는 모든 인스턴스가 같은 Redis를 보게 합니다.<br />
중복 이벤트 선점은 [중복 처리 방지](/docs/knowledge/data/redis/patterns/dedup)를 봅니다.
