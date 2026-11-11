---
id: kafka-pattern-retention
title: "보관 기간과 이벤트 재처리"
description: "retention.ms 안에서 집계 그룹만 offset을 되감아 다시 읽는 방법과 compact와의 차이를 설명합니다."
slug: /knowledge/messaging/kafka/patterns/retention-reprocess
sidebar_position: 2
tags: [Kafka, Messaging]
---
# 보관 기간과 이벤트 재처리

집계 버그로 지난 이틀치 `orders`를 다시 집계해야 하는데, 알림은 이미 보낸 메일을 다시 보내면 안 됩니다.<br />
무엇을 되감고, 보관이 끝나면 어떻게 되는지가 이 글의 질문입니다.

Kafka는 소비 직후 레코드를 지우지 않습니다.<br />
`cleanup.policy=delete`일 때 `retention.ms`(기본 7일) 등으로 오래된 세그먼트를 버립니다.
[Topic configs — retention.ms](https://kafka.apache.org/43/generated/topic_config.html)

## 상황

집계 그룹만 offset을 되감고, 알림 그룹 offset은 그대로 둡니다.

## 구조와 동작

| 수단 | 요지 |
|---|---|
| Topic `retention.ms` / 크기 | 로그에 남는 시간·용량 한도 |
| 기존 그룹 offset 재설정 | 그 그룹만 과거(또는 특정 시점)부터 재읽기 |
| 새 Consumer Group | 커밋이 없으면 `auto.offset.reset`에 따라 earliest/latest 등 |

압축(`cleanup.policy=compact`)은 키별 **최신 값**을 남기는 용도입니다.<br />
모든 이벤트 히스토리 재처리와 목적이 다릅니다.<br />
[Log compaction](https://docs.confluent.io/kafka/design/log_compaction.html)

그룹 offset 메타데이터 보관(`offsets.retention.minutes`)과 Topic 로그 보관은 별개입니다.

## 명령과 코드 예제

문서용 예제입니다.<br />
**소비자를 모두 멈춘 뒤** reset합니다.<br />
[Basic Kafka Operations](https://kafka.apache.org/44/operations/basic-kafka-operations/)

**입력:** 그룹 `analytics`만 되감기, `notify`는 그대로

```bash
# dry-run
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group analytics --topic orders --reset-offsets --to-earliest --dry-run

# 적용
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group analytics --topic orders --reset-offsets --to-earliest --execute
```

특정 시각부터:

```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group analytics --topic orders \
  --reset-offsets --to-datetime 2026-11-07T00:00:00.000 --execute
```

## 결과

| 조처 | 예상 |
|---|---|
| `analytics`만 `--to-earliest` | 집계만 보관된 처음부터 재읽기. 알림 offset 불변 |
| retention 밖 시각으로 되감기 | 없는 offset은 가용 범위로 보정될 수 있음 |

## 실패하거나 조건이 달라지는 경우

**활성 소비자가 있는 채로 reset**  
지원되지 않거나 실패합니다.<br />
인스턴스를 멈춥니다.<br />

**보관이 이미 지난 경우**  
레코드가 없어 재처리할 데이터가 없습니다.<br />
재처리 창 ≤ Topic retention으로 설계합니다.<br />

**compact 토픽에서 전체 히스토리를 기대하는 경우**  
중간 상태 이벤트는 사라질 수 있습니다.<br />
이벤트 소싱 재처리는 `delete` 보관이 맞는 경우가 많습니다.<br />

→ [Kafka란?](/docs/knowledge/k-kafka), [여러 그룹 독립 소비](/docs/knowledge/messaging/kafka/patterns/multi-group-consume)
