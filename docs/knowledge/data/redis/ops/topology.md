---
id: redis-ops-topology
title: "Standalone, 복제, Sentinel, Cluster"
description: "Redis Standalone, Primary/Replica, Sentinel, Cluster의 구성과 장애 시 동작을 표로 비교합니다."
slug: /knowledge/data/redis/ops/topology
sidebar_position: 1
tags: [Redis]
---
# Standalone, 복제, Sentinel, Cluster

> **개요:** 배치(토폴로지)와 지속성(RDB/AOF)을 나눕니다.
> 여기서는 노드 구성과 장애 시 동작을 비교합니다.

## 비교

| 모드 | 구성 | 장애 시 |
|---|---|---|
| **Standalone** | 노드 1 | 그 노드가 단일 장애점 |
| **Primary + Replica** | 비동기 복제 | 수동 또는 외부 조치로 승격. 복제 지연이 있을 수 있음 |
| **Sentinel** | Sentinel이 Primary를 감시 | 자동 장애 감지와 승격 |
| **Cluster** | 해시 슬롯으로 샤딩 | 슬롯 단위 이동. 여러 키는 같은 슬롯이어야 하는 제약이 있음 |

## Standalone (로컬)

Docker Compose로 단일 노드를 띄우는 예입니다.

```yaml
services:
  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf:ro
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]

volumes:
  redis-data:
```

```bash
docker compose up -d
docker compose exec redis redis-cli PING
# PONG
```

설정 파일과 데이터 디렉터리를 볼륨에 두면 컨테이너를 다시 만들어도 복구 경로를 잡을 수 있습니다.

## Primary와 Replica

Replica는 Primary의 쓰기 결과를 비동기로 받아 읽기 부하를 나눕니다.<br />
장애 전환을 애플리케이션이나 운영자가 직접 하면 Replica 승격 시점과 복제 지연을 함께 봅니다.<br />
자동 전환이 필요하면 Sentinel로 올립니다.

## Sentinel

Sentinel 프로세스가 Primary 생존을 감시하고, 합의 후 새 Primary를 고릅니다.<br />
클라이언트는 Sentinel에게 현재 Primary 주소를 물어 연결합니다.

## Cluster

키는 해시 슬롯(0–16383)에 매핑됩니다.<br />
`KEY1`과 `KEY2`의 슬롯이 다르면 일부 멀티키 명령과 트랜잭션이 실패합니다.<br />
같은 슬롯에 두려면 해시 태그 `{userId}:cart`, `{userId}:meta`처럼 `{…}` 구간을 맞춥니다.

## 참고

- [Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)
- [Cluster spec](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)
