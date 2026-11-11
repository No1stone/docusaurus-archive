---
id: redis-distributed-lock
title: "분산 락 — 소유권, 대기 시간, lease와 watchdog"
description: "Redis 분산 락의 소유권, wait, lease, watchdog 개념과 boot-base LockPort 사용 기준을 정리합니다."
slug: /knowledge/data/redis/patterns/distributed-lock
sidebar_position: 8
tags: [Redis]
---
# 분산 락 — 소유권, 대기 시간, lease와 watchdog

> **개요:** 여러 인스턴스가 같은 임계 구간을 들어갈 때 한 번에 하나만 실행하게 합니다.

## 개념

| 용어 | 의미 |
|---|---|
| 소유권 | 락 값이 내 토큰일 때만 해제 (Lua 예: [lua-atomic](/docs/knowledge/data/redis/keys/lua-atomic)) |
| wait | 획득을 기다리는 최대 시간 |
| lease | 고정 보유 시간. 작업이 더 길면 중간에 풀릴 수 있음 |
| watchdog | 작업 중 만료를 자동 연장 (Redisson 기본에 가깝음) |

## boot-base

`LockPort.tryWithLock` — wait 내 미획득 시 콜백 미실행, `LockResult.missed()`.<br />
기본 watchdog, 고정 lease는 오버로드.<br />
DB는 콜백 안에서 **커밋까지** 끝낸 뒤 반환하고, finally에서 unlock합니다.<br />

상세 코드: [lib-distributed-lock](/docs/knowledge/data/redis/boot-base/lib-distributed-lock)  
Ref: [boot-base](https://github.com/No1stone/boot-base)
