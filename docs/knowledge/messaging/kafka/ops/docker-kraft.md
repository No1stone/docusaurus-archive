---
id: kafka-ops-docker-kraft
title: "Docker Compose와 KRaft"
description: "apache/kafka:3.8.0 KRaft 단일 노드로 기동하고 발행, 소비를 확인하는 로컬 절차입니다."
slug: /knowledge/messaging/kafka/ops/docker-kraft
sidebar_position: 1
tags: [Kafka, Docker, Messaging]
---
# Docker Compose와 KRaft

> **개요:** 이미지 `apache/kafka:3.8.0` (KRaft, ZooKeeper 없음) 기준의 단순 로컬 예입니다.
> 기동 → 토픽 생성 → 발행 → 소비 순으로 확인합니다.

## Compose (개념 예)

```yaml
services:
  kafka:
    image: apache/kafka:3.8.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

실제 env 키는 이미지 문서의 KRaft 예제를 그대로 맞춥니다.<br />
공식 이미지 안내: [Apache Kafka Docker](https://kafka.apache.org/documentation/#docker)

```bash
docker compose up -d
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --create --topic orders --partitions 2 --replication-factor 1
```

앱에서 produce 후 `kafka-console-consumer.sh --group notify`로 수신을 확인합니다.<br />

복제, retention, lag는 [복제, 보관, Lag](/docs/knowledge/messaging/kafka/ops/replication-retention-lag)을 봅니다.
