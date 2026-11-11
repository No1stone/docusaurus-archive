---
id: redis-ops-persistence-memory
title: "RDB, AOF와 메모리 관리"
description: "RDB와 AOF 지속성, 재시작 후 남는 데이터, TTL 만료와 maxmemory eviction을 구분합니다."
slug: /knowledge/data/redis/ops/persistence-and-memory
sidebar_position: 2
tags: [Redis]
---
# RDB, AOF와 메모리 관리

> **개요:** 디스크에 남기는 방식과, 메모리 한도에서 키를 버리는 방식을 나눕니다.

## RDB와 AOF

| | RDB | AOF |
|---|---|---|
| 내용 | 시점 스냅샷 | 쓰기 명령 로그 |
| 복구 | 대체로 빠름 | 재실행이라 상대적으로 느릴 수 있음 |
| 유실 | 스냅샷 사이 | fsync 정책에 따라 초 단위 가능 |
| 용도 | 백업, 빠른 기동 | 더 강한 내구성 |

설정 예(개념):

```conf
# RDB
save 900 1
dir /data
dbfilename dump.rdb

# AOF
appendonly yes
appendfsync everysec
```

볼륨에 `/data`를 올리면 `dump.rdb`와 `appendonly.aof`가 컨테이너 재생성 후에도 남습니다.<br />
둘 다 쓰거나, 순수 캐시면 persistence를 끄는 선택도 있습니다.

## 재시작 뒤 무엇이 남나

| 설정 | 재시작 후 |
|---|---|
| RDB만 | 마지막 스냅샷 이후 쓰기는 없을 수 있음 |
| AOF | 로그 끝의 미완료 쓰기는 fsync 정책에 따름 |
| 없음 | 메모만 쓰므로 비어 있음 |

## 메모리: TTL 만료와 eviction

| | TTL 만료 | maxmemory eviction |
|---|---|---|
| 원인 | 키에 걸린 만료 시각 | 메모리 한도 초과 |
| 대상 | 만료된 키 | 정책(LRU 등)이 고른 키 |
| 의도 | 정상 수명 | 압력 시 희생 |

캐시 키에 TTL을 두는 것과 `maxmemory-policy`로 밀어내는 것을 혼동하지 않습니다.<br />
세션, 락처럼 “아직 유효해야 하는” 키는 eviction 정책과 메모리 여유를 함께 설계합니다.<br />

공식: [Persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
