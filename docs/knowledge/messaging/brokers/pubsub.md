---
format: md
id: k-pubsub
title: "PubSub"
description: "Redis Pub/Sub에서 Publisher와 Subscriber 역할을 적은 메모"
tags:
  - Redis
status: active
slug: /knowledge/k-pubsub
---
# PubSub

> **개요:** Redis Pub/Sub(퍼브서브)에 대한 짧은 메모입니다.

## 구성

- **Publisher (Pub):** 채널에 메시지를 발행합니다.
- **Subscriber:** 채널을 구독하고 메시지를 받습니다.

발행자와 구독자가 같은 Redis 채널을 기준으로 메시지를 주고받는 모델입니다.
상세 명령(`PUBLISH`, `SUBSCRIBE` 등)은 Redis 문서나 연동 코드를 따릅니다.
