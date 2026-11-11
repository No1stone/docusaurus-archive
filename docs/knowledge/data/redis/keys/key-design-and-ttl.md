---
id: redis-key-design-ttl
title: "키 설계와 TTL"
description: "Redis 키 이름 규칙과 TTL로 만료를 거는 방법, 캐시, 락, 토큰 키를 나누는 기준을 정리합니다."
slug: /knowledge/data/redis/keys/key-design-and-ttl
sidebar_position: 1
tags: [Redis]
---
# 키 설계와 TTL

> **개요:** Redis는 스키마가 없으므로 키 이름과 만료가 사실상 설계입니다.
> 이 아카이브, boot-base에서는 캐시, 수동 KV, 락의 키 규칙을 나눕니다.

## 상황

같은 Redis에 캐시 DTO, 액세스 토큰, 분산 락이 섞이면 키 충돌과 만료 실수가 납니다.<br />
이름을 영역별로 고정하고, TTL을 “언제 사라져도 되는가”에 맞춥니다.

## 키 규칙 (이 아카이브)

| 용도 | 형태 | 예 |
|---|---|---|
| Spring `@Cacheable` | `{CACHE_NAME}::{id}` | `member::42` |
| 수동 KV (토큰 등) | `{영역}:{용도}:…` (`::` 비사용) | `access:…` |
| 분산 락 | `lock:{영역}:{리소스}` | `lock:auth-sig:sync` |

공유 Redis일 때만 환경, 앱 전역 접두를 검토합니다.<br />
기본은 생략합니다.<br />
하네스 [coding-conventions](/docs/harness/context/coding-conventions) Redis 키 절과 같습니다.

## TTL

```bash
SET product:42 '{"name":"…"}' EX 300
TTL product:42
EXPIRE product:42 60
```

- `EX` / `PX`: 설정 시 만료 초, 밀리초
- `EXPIRE`: 이미 있는 키에 만료 부여
- TTL이 없으면 키가 남아 eviction, 수동 삭제에 의존합니다

## 적용할 때

캐시는 짧고 잃어도 되는 TTL, 세션, 토큰은 정책에 맞는 슬라이딩/고정 만료, 락 키는 클라이언트가 lease, watchdog으로 관리하는 경우가 많습니다.<br />
키 스캔(`KEYS`)은 운영에서 피하고, prefix 삭제는 신중히 설계합니다.
