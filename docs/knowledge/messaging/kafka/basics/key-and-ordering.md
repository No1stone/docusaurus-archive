---
id: kafka-basics-key-ordering
title: "메시지 키와 파티션 내 순서"
description: "같은 주문의 상태 변경 순서를 지키려면 어떤 키를 쓰고, 순서는 어디까지 보장되는지 설명합니다."
slug: /knowledge/messaging/kafka/basics/key-and-ordering
sidebar_position: 2
tags: [Kafka, Messaging]
---
# 메시지 키와 파티션 내 순서

주문 `order-42`에 대해 `created → paid → cancelled`가 이 순서로 처리되어야 할 때가 있습니다.<br />
알림 그룹에 소비자가 여러 대여도, 이 세 이벤트의 상대 순서는 깨지면 안 됩니다.

같은 키는 기본 파티셔너에서 같은 파티션으로 갑니다.<br />
Kafka는 **파티션 안**의 순서를 보장하고, Topic 전체의 전역 순서는 보장하지 않습니다.
[Introduction](https://kafka.apache.org/intro/)

## 상황

키를 `orderId`로 두고, 파티션 수가 고정된 Topic에 세 이벤트를 순서대로 발행합니다.

## 구조와 동작

레코드에 키를 두면(기본 해시 파티셔너) **파티션 수가 바뀌지 않는 한** 같은 키는 같은 파티션에 붙습니다.<br />
한 Consumer Group에서 각 파티션은 한 멤버만 읽으므로, 그 키의 이벤트는 한 소비자가 순서대로 받습니다.<br />
[Introduction — keys and partitions](https://kafka.apache.org/intro/), [KafkaConsumer](https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)

```text
key=order-42 → 항상 Partition N (파티션 수 고정 시)
Partition N: created → paid → cancelled
다른 키(order-99)는 다른(또는 같은) 파티션으로 갈 수 있음
→ order-42와 order-99 사이의 전역 순서는 없음
```

## 명령과 코드 예제

아래는 **문서용 예제**입니다.<br />
원셋 `lib-message-saga` 어댑터 코드가 아닙니다.

**입력**

- Topic `orders`, 파티션 3
- 키 `order-42`로 세 이벤트 발행

```java
ProducerRecord<String, String> created =
    new ProducerRecord<>("orders", "order-42", "{\"type\":\"created\"}");
ProducerRecord<String, String> paid =
    new ProducerRecord<>("orders", "order-42", "{\"type\":\"paid\"}");
ProducerRecord<String, String> cancelled =
    new ProducerRecord<>("orders", "order-42", "{\"type\":\"cancelled\"}");

producer.send(created);
producer.send(paid);
producer.send(cancelled);
```

콘솔로 파티션을 확인하려면:

```bash
kafka-console-consumer.sh --topic orders --property print.key=true \
  --property print.partition=true --from-beginning \
  --bootstrap-server localhost:9092
```

**예상 출력 (개념)**

```text
Partition:1  Key:order-42  Value:{"type":"created"}
Partition:1  Key:order-42  Value:{"type":"paid"}
Partition:1  Key:order-42  Value:{"type":"cancelled"}
```

키가 없는 레코드는 라운드로빈/스티키 배치로 파티션이 갈라질 수 있어, 상태 머신 순서에는 키를 둡니다.

## 결과

| 조건 | 순서 보장 |
|---|---|
| 같은 키, 파티션 수 고정, 단일 파티션 소비자 | 그 키의 이벤트는 파티션 기록 순서로 소비 |
| 다른 키 | 키 간 전역 순서 없음 |
| Topic 파티션 1개 | Topic 전체 순서에 가깝지만 병렬성 없음 |

## 실패하거나 조건이 달라지는 경우

**파티션 수를 늘린 경우**  
키→파티션 매핑이 바뀌어, **증설 이후 새 레코드**가 예전 파티션과 달라질 수 있습니다.<br />
키 단위 순서 연속성은 깨질 수 있습니다.<br />
[Basic operations — partition count](https://kafka.apache.org/44/operations/basic-kafka-operations/)

**한 파티션을 여러 스레드가 처리하는 경우**  
브로커/그룹 할당이 지켜도, 앱이 병렬로 처리하면 순서가 깨집니다.<br />
파티션당 단일 처리 경로를 유지합니다.<br />

**Producer 재시도와 `max.in.flight`**  
재시도 설정에 따라 파티션 안에서도 순서가 어긋날 수 있습니다.<br />
순서 민감하면 idempotent producer와 in-flight 제한을 함께 검토합니다.
[Producer configs](https://kafka.apache.org/44/configuration/producer-configs/)

→ [Kafka란?](/docs/knowledge/k-kafka), [Consumer Group과 Offset](/docs/knowledge/messaging/kafka/basics/consumer-group-offset)
