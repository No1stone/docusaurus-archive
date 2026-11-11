---
id: kafka-basics-consumer-offset
title: "Consumer Group, Offset, Commit, Rebalance"
description: "Producer ACK와 Offset Commit이 어떻게 다르고, 커밋 시점에 따라 유실·중복이 어떻게 달라지는지 설명합니다."
slug: /knowledge/messaging/kafka/basics/consumer-group-offset
sidebar_position: 3
tags: [Kafka, Messaging]
---
# Consumer Group, Offset, Commit, Rebalance

> **이 글이 답하는 질문:** 브로커가 기록을 확인한 뒤에도 소비자가 죽으면 메시지는 다시 읽히는가, 커밋은 언제 해야 하는가?
>
> **개요:** 같은 그룹은 파티션을 나누고, 다른 그룹은 독립적으로 읽습니다.
> Producer ACK와 Offset Commit은 확인하는 단계가 다릅니다.
> [KafkaConsumer](https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)

## 상황

알림 워커가 `order.created`를 받아 SMS를 보내다가 프로세스가 죽었습니다.<br />
Producer는 이미 `acks`를 받았습니다.<br />
다시 누가 읽는지, 커밋을 어디에 두어야 하는지가 궁금합니다.

## 구조와 동작

| 단계 | 의미 |
|---|---|
| Producer `acks` | 브로커가 레코드를 **기록**했는지 |
| Offset Commit | 소비자가 여기까지 **커밋**했는지 (처리 전/후는 앱 설계) |

커밋 전에 죽으면 같은 그룹의 다른(또는 재기동) 멤버가 그 offset부터 다시 읽습니다.<br />
커밋 후에 죽으면 그 레코드는 그룹 기준으로 다시 오지 않습니다(처리 실패여도).<br />

`enable.auto.commit=true`면 폴링 주기에 커밋되어, 처리 전 커밋 시 유실이 날 수 있습니다.<br />
처리 후 수동 커밋이 더 안전하지만 at-least-once 중복은 남습니다.

## 명령과 코드 예제

문서용 예제입니다.

```java
@KafkaListener(topics = "orders", groupId = "notify")
public void onOrder(ConsumerRecord<String, String> record, Acknowledgment ack) {
    sendSms(record.value());
    ack.acknowledge(); // 처리 후 커밋
}
```

## 결과

| 시점 | 예상 |
|---|---|
| ACK(프로듀서)만 완료, 소비 전 장애 | 레코드는 Topic에 남음. 다른 소비자가 읽음 |
| 처리 중, offset 미커밋 장애 | 재시작 후 같은 offset 재처리 가능 |
| 처리 전 자동 커밋 후 장애 | 그룹은 앞으로 감. 유실 위험 |

## 실패하거나 조건이 달라지는 경우

**Rebalance**  
멤버가 늘거나 줄면 파티션 소유권이 다시 나뉩니다.<br />
리밸런스 중 잠시 소비가 멈출 수 있습니다.<br />

**커밋 offset이 로그에서 사라진 경우**  
`auto.offset.reset`이 시작점을 정합니다.<br />
[Consumer configs](https://kafka.apache.org/44/configuration/consumer-configs/)

그림은 [Kafka란?](/docs/knowledge/k-kafka)을 봅니다.<br />
재처리는 [보관과 재처리](/docs/knowledge/messaging/kafka/patterns/retention-reprocess)를 봅니다.
