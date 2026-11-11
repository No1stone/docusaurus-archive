---
format: md
id: k-kafka
title: "Kafka란?"
description: "알림과 집계가 같은 이벤트를 각자 읽고, 집계만 다시 읽으려면 어떻게 구성하는지 설명합니다."
sidebar_label: "Kafka란?"
sidebar_position: 0
tags:
  - Docker
  - Kafka
  - Messaging
status: active
slug: /knowledge/k-kafka
---
# Kafka란?

주문 이벤트를 한 번만 기록하고, 알림과 집계가 각자 읽고, 집계 버그가 나면 집계만 과거부터 다시 읽고 싶을 때가 있습니다.<br />
이 글은 Consumer Group을 나누는 이유와 보관 기간이 재처리 상한이 되는 지점을 한 흐름으로 답합니다.

Kafka는 Topic에 이벤트를 순서 로그로 기록합니다.<br />
소비 후에도 레코드는 바로 지워지지 않고, 보관 설정 동안 다시 읽을 수 있습니다.
[Introduction](https://kafka.apache.org/intro/)

원셋의 사가·이벤트 오케스트레이션은 `lib-message-saga`(Kafka 쪽)입니다.<br />
아래 콘솔 예제는 **문서용**이며, Rabbit 실시간 라우팅(`lib-message-routing`)과 모듈을 섞지 않습니다.
[lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/)

## 상황

주문 `order-42`가 접수되면 알림을 보내고 집계에도 반영해야 합니다.<br />
집계 로직에 버그가 나면 알림은 그대로 두고 집계만 되감고 싶습니다.

## 구조와 동작

| 구성요소 | 역할 |
|---|---|
| Topic | 이벤트 카테고리 |
| Partition | 순서 로그, 병렬 단위 |
| Offset | 파티션 안 위치 |
| Consumer Group | 같은 `group.id`. 파티션을 나눠 읽음 |

같은 그룹 안에서는 각 파티션이 한 멤버에게만 할당됩니다.<br />
다른 그룹은 같은 Topic을 각자 offset으로 읽습니다.
[KafkaConsumer](https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)

```text
[그림 A] 같은 그룹이 파티션을 나눠 읽는 경우
  Topic orders (P0, P1)
  Group notify: notify-c1←P0, notify-c2←P1

[그림 B] 다른 그룹이 독립적으로 읽는 경우
  Topic orders
       / \
  Group notify   Group analytics
```

## 명령과 코드 예제

아래는 **문서용 콘솔 예제**입니다.

**입력:** Topic `orders`, 그룹 `notify`와 `analytics`

```bash
kafka-console-consumer.sh --topic orders --group notify \
  --from-beginning --bootstrap-server localhost:9092

kafka-console-consumer.sh --topic orders --group analytics \
  --from-beginning --bootstrap-server localhost:9092
```

집계만 되감기(그룹이 비활성일 때):

```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group analytics --topic orders --reset-offsets --to-earliest --execute
```

[Basic Kafka Operations](https://kafka.apache.org/44/operations/basic-kafka-operations/)

## 결과

| 구성 | 예상 |
|---|---|
| `notify` + `analytics` | 같은 이벤트를 두 그룹이 각각 수신 |
| `analytics`만 `--to-earliest` | 알림 offset은 그대로, 집계만 재읽기 |

Producer `acks`는 브로커 기록 확인이고, Offset Commit은 “여기까지 읽음”입니다.<br />
처리 포함 여부는 앱 설계입니다.
→ [Consumer Group, Offset](/docs/knowledge/messaging/kafka/basics/consumer-group-offset)

## 실패하거나 조건이 달라지는 경우

같은 `group.id`에 알림과 집계를 넣으면 파티션을 나눠 가져가 한쪽이 못 받습니다.<br />
`retention.ms` 밖으로 밀린 레코드는 되감을 수 없습니다.
[Introduction — retention](https://kafka.apache.org/intro/)

`auto.offset.reset=latest`인데 커밋이 없으면 과거 이벤트를 건너뜁니다.
[Consumer configs](https://kafka.apache.org/44/configuration/consumer-configs/)

## 이 폴더에서 다음에 볼 글

| 구분 | 글 |
|---|---|
| 구조 | [구성요소](/docs/knowledge/messaging/kafka/basics/producer-broker-topic-partition), [키와 순서](/docs/knowledge/messaging/kafka/basics/key-and-ordering), [Offset](/docs/knowledge/messaging/kafka/basics/consumer-group-offset) |
| 패턴 | [여러 그룹](/docs/knowledge/messaging/kafka/patterns/multi-group-consume), [보관과 재처리](/docs/knowledge/messaging/kafka/patterns/retention-reprocess) |
| Spring | [Spring Kafka](/docs/knowledge/messaging/kafka/spring/spring-kafka) |

같은 상황을 RabbitMQ로 보면 [RabbitMQ란?](/docs/knowledge/messaging/rabbitmq)을 봅니다.
