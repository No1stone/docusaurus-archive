---
id: kafka-pattern-multi-group
title: "이벤트 발행과 여러 그룹에서 독립 소비"
description: "한 Topic을 알림 그룹과 집계 그룹이 독립적으로 읽을 때 offset과 병렬이 어떻게 갈라지는지 설명합니다."
slug: /knowledge/messaging/kafka/patterns/multi-group-consume
sidebar_position: 1
tags: [Kafka, Messaging]
---
# 이벤트 발행과 여러 그룹에서 독립 소비

`order.created` 한 건으로 알림과 집계를 모두 돌리고, 집계가 밀려도 알림은 계속 나가야 할 때가 있습니다.<br />
발행은 Topic에 한 번, 논리적 구독자마다 Consumer Group을 둡니다.

그룹이 다르면 같은 레코드를 각자 받습니다.
[Introduction](https://kafka.apache.org/24/getting-started/introduction/)

## 상황

알림 그룹과 집계 그룹의 `group.id`를 나눕니다.<br />
한 그룹의 lag가 다른 그룹을 막지 않아야 합니다.

## 구조와 동작

| 구분 | 동작 |
|---|---|
| 같은 `group.id` | 파티션을 멤버가 나눠 읽음. 레코드는 그룹당 한 번 |
| 다른 `group.id` | 각 그룹이 전체(할당된) 파티션을 독립 offset으로 읽음 |

```text
orders Topic
  ├─ group notify    (알림, 자체 offset)
  └─ group analytics (집계, 자체 offset)
```

한 그룹의 lag가 다른 그룹을 막지 않습니다.<br />
같은 그룹 안 병렬은 파티션 수까지입니다.<br />
[KafkaConsumer](https://kafka.apache.org/43/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)

## 명령과 코드 예제

문서용 예제입니다.<br />

**입력:** Topic `orders`에 레코드 1건, 그룹 두 개

```bash
# 터미널 A
kafka-console-consumer.sh --bootstrap-server localhost:9092 \
  --topic orders --group notify --from-beginning

# 터미널 B
kafka-console-consumer.sh --bootstrap-server localhost:9092 \
  --topic orders --group analytics --from-beginning
```

**예상:** 두 터미널 모두 같은 payload를 출력합니다.<br />
`--group notify`만 두 프로세스로 켜면 파티션을 나눠 가져가고, 같은 레코드를 둘 다 받지는 않습니다.

## 결과

| 구성 | 예상 |
|---|---|
| `notify` + `analytics` | 각자 수신, offset 독립 |
| `notify`만 두 인스턴스 | 파티션 분배, 중복 수신 없음(그룹 기준) |

## 실패하거나 조건이 달라지는 경우

**알림과 집계에 같은 `group.id`**  
한쪽만 처리하고 다른 쪽은 못 받습니다.<br />

**파티션 1개인데 워커만 늘린 경우**  
같은 그룹의 여분 소비자는 유휴입니다.<br />
병렬을 키우려면 파티션을 늘립니다(키 매핑 변화 주의).<br />
→ [키와 순서](/docs/knowledge/messaging/kafka/basics/key-and-ordering)

→ [Kafka란?](/docs/knowledge/k-kafka), [보관과 재처리](/docs/knowledge/messaging/kafka/patterns/retention-reprocess)
