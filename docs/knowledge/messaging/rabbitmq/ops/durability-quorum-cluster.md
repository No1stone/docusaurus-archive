---
id: rabbitmq-ops-durability
title: "큐 내구성, Quorum Queue, 클러스터"
description: "RabbitMQ durable 큐, Quorum Queue, 클러스터의 운영 포인트를 짧게 정리합니다."
slug: /knowledge/messaging/rabbitmq/ops/durability-quorum-cluster
sidebar_position: 2
tags: [RabbitMQ, Messaging]
---
# 큐 내구성, Quorum Queue, 클러스터

> **개요:** 브로커 재시작 후에도 남겨야 하는지, 노드 장애에 대비하는지를 나눕니다.

| 주제 | 요지 |
|---|---|
| durable queue / persistent message | 재시작 후 생존 여부에 영향 |
| Quorum Queue | Raft 기반 복제 큐. 고전 mirrored queue 대안으로 권장되는 경우가 많음 |
| 클러스터 | 여러 노드. 클라이언트는 로드밸런서, 다중 호스트로 접속 |

로컬 단일 노드는 [Docker Compose](/docs/knowledge/messaging/rabbitmq/ops/docker-compose)로 충분합니다.<br />
공식: [Quorum Queues](https://www.rabbitmq.com/docs/quorum-queues)
