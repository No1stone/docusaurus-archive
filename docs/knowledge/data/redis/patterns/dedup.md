---
id: redis-dedup
title: "중복 처리 방지 — SET NX EX와 재처리 기준"
description: "이벤트 ID를 SET NX EX로 선점해 중복 처리를 막고, 실패 시 재시도를 허용하는 방법을 정리합니다."
slug: /knowledge/data/redis/patterns/dedup
sidebar_position: 7
tags: [Redis]
---
# 중복 처리 방지 — SET NX EX와 재처리 기준

> **개요:** 같은 이벤트, 메시지를 두 번 처리하지 않도록 키를 선점합니다.

## 상황

큐 at-least-once나 웹훅 재전송으로 동일 `eventId`가 다시 들어옵니다.

## 선점

```bash
SET processed:evt:abc 1 NX EX 86400
# OK → 처리 진행
# (nil) → 이미 처리 중이거나 완료 → 스킵
```

## 실패 후 재시도

선점만 하고 작업이 실패하면 키가 남아 재시도가 막힐 수 있습니다.

| 정책 | 요지 |
|---|---|
| 짧은 TTL | 실패해도 곧 재시도 가능 |
| 성공 시에만 긴 TTL | 처리 중은 짧은 키, 성공 후 `SET processed:…` |
| 실패 시 DEL | 선점 키 삭제 후 재시도 허용 |

멱등 API와 함께 쓰는 편이 안전합니다.<br />
작업 큐는 [work-queue](/docs/knowledge/data/redis/patterns/work-queue)를 봅니다.
