---
id: pattern-cdc
title: CDC (Change Data Capture)
description: DB 변경을 캡처해 다른 시스템에 전달하는 패턴. 동기화와 이벤트 연동 모두에 쓰이며 EDA에만 한정하지 않습니다.
tags:
  - patterns
  - CDC
  - Kafka
  - Debezium
status: active
slug: /patterns/architecture-patterns/cdc
---
# CDC (Change Data Capture)

> **개요:** CDC는 데이터베이스에 커밋된 변경(INSERT·UPDATE·DELETE)을 트랜잭션 로그 등에서 읽어, 다른 DB·검색·분석·메시지 토픽으로 전달하는 방식입니다.
> 이벤트 기반 아키텍처의 한 부품으로 쓸 수도 있고, 읽기 복제·동기화에만 쓸 수도 있습니다.

## 적용 상황

- 애플리케이션이 이중으로 쓰지 않고, DB 변경을 외부에 거의 실시간으로 반영하고 싶을 때
- Outbox 테이블을 폴링하는 대신, 커밋 로그 기반으로 발행하고 싶을 때
- OLTP DB의 변경을 분석 DB·검색 인덱스에 맞추고 싶을 때

EDA 전용 패턴이 아닙니다.
같은 파이프라인을 복제·동기화에 쓰면 메시징 토폴로지 없이도 성립합니다.

## 일반 흐름 (Debezium → Kafka → Sink)

```text
원본 DB (binlog / WAL 등)
  → Debezium Source Connector (Kafka Connect)
  → Kafka 토픽
  → JDBC Sink 등 Sink Connector
  → 대상 DB 또는 다른 소비자
```

Source가 “변경을 읽어 토픽에 넣고”, Sink가 “토픽을 읽어 대상에 쓰는” 역할입니다.
둘 중 하나만 성공해도 전체 연동이 끝난 것은 아닙니다.

## 설명용 구성 포인트

Connector 등록은 Kafka Connect REST로 하는 경우가 많습니다.
아래는 개념용 JSON 골격입니다.

```json
{
  "name": "mysql-source",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "database.hostname": "mysql",
    "database.user": "debezium",
    "topic.prefix": "dbserver1",
    "table.include.list": "app.orders"
  }
}
```

운영에서는 스키마 이력, 타임존, 스냅샷 모드, 권한(복제 계정)을 맞춰야 합니다.

## 아이컴시스 사례와의 연결

사례 본문의 경험·설정·이미지는 [서버 설정과 데이터 경로](../../postmortems/icomsys-msa-iam-portfolio/runtime-data-path.md)와 [설계 개요와 비용](../../postmortems/icomsys-msa-iam-portfolio/design-and-runtime.md)에 남겨 둡니다.

사례에서 확인되는 범위만 적습니다.

- 설계 메모에 Debezium으로 CDC → Kafka → SinkConnect → MySQL 저장을 **구현하려 한다**는 계획이 있습니다.
- 런타임 문서에 Debezium **연결 성공** 기록과 캡처가 있습니다.
- 통합 Docker Compose 구간에는 JDBC Sink 플러그인을 찾지 못하는 이슈가 남아 있습니다. 전체 연동 완료로 바꾸지 않습니다.

기술 메모: [debezium](../../knowledge/messaging/brokers/debezium.md)

## 실패 처리와 주의점

- Source만 되고 Sink가 실패하면 토픽에만 쌓이거나 대상이 뒤처집니다.
- at-least-once면 대상 쪽 멱등·유니크 설계가 필요합니다.
- 스키마 변경이 토픽 계약에 바로 영향을 줍니다.
- 네트워크 broadcast와 혼동하지 않습니다. CDC는 DB 변경 캡처입니다.

## 관련 글

- [Outbox와 Inbox](./outbox-and-inbox.md) — CDC로 Outbox를 비우는 방식도 있음
- [Fan-out](./fan-out.md) — 토픽 이후 전달 토폴로지
- [아이컴시스 런타임 데이터 경로](../../postmortems/icomsys-msa-iam-portfolio/runtime-data-path.md)

## 참고

- [Debezium Documentation](https://debezium.io/documentation/)
- [Kafka Connect JDBC Sink](https://docs.confluent.io/kafka-connectors/jdbc/current/sink-connector/index.html)
