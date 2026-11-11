---
id: kafka-basics-components
title: "Producer, Broker, Topic, Partition, Consumer"
description: "Kafka에서 발행, 브로커, 토픽, 파티션, 소비가 이어지는 기본 흐름을 정리합니다."
slug: /knowledge/messaging/kafka/basics/producer-broker-topic-partition
sidebar_position: 1
tags: [Kafka, Messaging]
---
# Producer, Broker, Topic, Partition, Consumer

> **개요:** 프로듀서는 Topic(파티션)에 쓰고, 소비자는 파티션을 읽어 offset을 전진합니다.

| 구성요소 | 역할 |
|---|---|
| Producer | Topic에 produce |
| Broker | 파티션 저장, 복제 |
| Topic / Partition | 로그와 병렬 단위 |
| Consumer | 파티션을 읽어 처리 |

입문 흐름은 [Kafka란?](/docs/knowledge/k-kafka)을 봅니다.
