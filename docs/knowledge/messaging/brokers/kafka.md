---
format: md
id: k-kafka
title: "Kafka"
description: "Apache Kafka 브로커·토픽·컨슈머 그룹 개념과 로컬 멀티 브로커 구성 메모입니다."
tags:
  - Docker
  - Kafka
status: active
slug: /knowledge/k-kafka
---
# Kafka

## 개요

Kafka는 토픽에 레코드를 순서대로 쌓고, 컨슈머 그룹이 파티션을 나눠 읽는 분산 로그입니다.
프로듀서는 토픽·파티션에 쓰고, 컨슈머는 오프셋으로 위치를 기억합니다.
로컬에서는 Docker Compose로 브로커를 여러 개 띄워 파티션 복제·페일오버를 연습합니다.

CDC로 DB 변경을 토픽에 올릴 때는 [debezium](./debezium.md)과 함께 봅니다.

## 알아둘 개념

| 개념 | 역할 |
|---|---|
| Topic / Partition | 메시지 스트림과 병렬 단위 |
| Broker | 파티션을 저장·복제하는 서버 |
| Consumer Group | 같은 그룹 내 파티션 분배 |
| Offset | 파티션 안 읽기 위치 |

운영에서는 retention, replication factor, 키 기반 파티셔닝이 재처리·순서 보장에 영향을 줍니다.

<details>
<summary>참고 자료</summary>

- [Apache Kafka](https://kafka.apache.org/)
- [Docker Compose로 멀티브로커 Kafka 구성](https://devocean.sk.com/blog/techBoardDetail.do?ID=164016)
- [Confluent](https://www.confluent.io/ko-kr/)
</details>
