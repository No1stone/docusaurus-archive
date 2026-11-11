---
id: rabbitmq-ops-docker
title: "Docker Compose와 Management UI"
description: "rabbitmq:3.13-management로 기동하고 발행, 소비, 결과를 확인하는 로컬 절차입니다."
slug: /knowledge/messaging/rabbitmq/ops/docker-compose
sidebar_position: 1
tags: [RabbitMQ, Docker, Messaging]
---
# Docker Compose와 Management UI

> **개요:** 이미지 `rabbitmq:3.13-management` 기준입니다.
> 기동 → 발행 → 소비 → UI 확인 순으로 따라 합니다.

## Compose

```yaml
services:
  rabbitmq:
    image: rabbitmq:3.13-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
```

```bash
docker compose up -d
# Management UI: http://localhost:15672 (guest/guest)
```

## 확인

1. UI에서 Exchange `orders`, Queue `notification.q`를 만들고 Binding합니다.<br />
2. 앱 또는 UI Publish로 `order.created`를 보냅니다.<br />
3. 소비자가 ACK하면 Ready/Unacked 수치가 줄어듭니다.<br />

클러스터, Quorum은 [내구성과 클러스터](/docs/knowledge/messaging/rabbitmq/ops/durability-quorum-cluster)를 봅니다.
