---
format: md
id: k-debezium
title: "debezium"
description: "Debezium과 Kafka Connect로 MySQL 등 DB 변경을 CDC로 흘리는 메모입니다."
tags:
  - Docker
  - Kafka
status: active
slug: /knowledge/k-debezium
---
# debezium

## 개요

Debezium은 DB의 트랜잭션 로그를 읽어 행 변경을 이벤트로 만드는 CDC 커넥터입니다.
보통 Kafka Connect에 Source 커넥터로 올리고, 토픽에 JSON/Avro 변경 이벤트를 씁니다.
Sink 커넥터나 앱 컨슈머가 그 토픽을 구독해 다른 저장소·서비스에 반영합니다.

원 노트 기준으로 Source 연결까지 확인했습니다.
Sink·스키마 레지스트리·토픽 네이밍은 환경에 맞게 따로 맞춥니다.

## 구성 시 볼 것

1. DB에서 binlog(또는 동등한 WAL)와 복제 권한을 켭니다.
2. Kafka Connect에 Debezium MySQL(등) 커넥터를 등록합니다.
3. 토픽·변환(SMT)·Avro 사용 여부를 정합니다.
4. 다운스트림이 멱등·순서·스키마 진화를 어떻게 처리할지 정합니다.

아키텍처 패턴 쪽 CDC 메모는 Patterns의 CDC 글을 함께 봅니다.

<details>
<summary>참고 자료</summary>

- [Debezium — Avro configuration](https://debezium.io/documentation/reference/stable/configuration/avro.html)
- [Capturing MySQL database changes with Debezium](https://medium.com/@elifsinem.aktas/capturing-mysql-database-changes-with-debezium-7b4eb45d9356)
- [Kafka Connect Debezium MySQL source-sink pipeline](https://medium.com/@alexander.murylev/kafka-connect-debezium-mysql-source-sink-replication-pipeline-fb4d7e9df790)
</details>
