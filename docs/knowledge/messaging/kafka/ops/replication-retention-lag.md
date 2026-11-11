---
id: kafka-ops-replication-lag
title: "복제, 보관과 압축 정책, Consumer Lag"
description: "Kafka replication factor, retention/compaction, Consumer Lag 모니터링 포인트를 정리합니다."
slug: /knowledge/messaging/kafka/ops/replication-retention-lag
sidebar_position: 2
tags: [Kafka, Messaging]
---
# 복제, 보관과 압축 정책, Consumer Lag

> **개요:** 가용성(복제), 보관(retention/compact), 소비 지연(lag)을 나눕니다.

| 주제 | 요지 |
|---|---|
| `replication.factor` / ISR | 브로커 장애 시 데이터 생존 |
| retention / compact | 시간, 크기 삭제 vs 키별 최신 유지 |
| Consumer Lag | 로그 끝과 그룹 commit offset 차이 |

lag가 커지면 파티션 수, 소비자 수, 처리 시간, retention을 함께 봅니다.
