---
id: kafka-spring-kafka
title: "Spring for Apache Kafka — KafkaTemplate, @KafkaListener"
description: "Spring Kafka로 주문 이벤트 발행과 소비, 예외, 재수신까지 한 세트로 따라갑니다."
slug: /knowledge/messaging/kafka/spring/spring-kafka
sidebar_position: 1
tags: [Spring, Kafka, Messaging]
---
# Spring for Apache Kafka — KafkaTemplate, @KafkaListener

> **개요:** 발행(`KafkaTemplate`)과 소비(`@KafkaListener`)를 한 흐름으로 봅니다.
> 사가, Outbox 연동은 [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/)를 Ref로 둡니다.

## 정상 처리 (예제)

```java
// 발행
kafkaTemplate.send("orders", "order-42",
    Map.of("orderId", "42", "eventId", "evt-1"));

// 소비
@KafkaListener(topics = "orders", groupId = "notify")
public void onOrder(Map<String, String> body) {
    if (alreadyProcessed(body.get("eventId"))) {
        return;
    }
    sendNotification(body.get("orderId"));
    markProcessed(body.get("eventId"));
}
```

## 소비 중 예외

기본 설정에서는 리스너 예외 시 재시도, 에러 핸들러 정책에 따릅니다.<br />
처리 실패 후 같은 레코드를 다시 받으면 `eventId`로 멱등 처리합니다.

```java
@KafkaListener(topics = "orders", groupId = "notify")
public void onOrder(ConsumerRecord<String, String> record,
                    Acknowledgment ack) {
    try {
        process(record.value());
        ack.acknowledge(); // MANUAL ack 모드일 때
    } catch (Exception ex) {
        // 커밋하지 않음 → 재전달 또는 에러 핸들러
        throw ex;
    }
}
```

Offset Commit 시점은 [Consumer Group과 Offset](/docs/knowledge/messaging/kafka/basics/consumer-group-offset)을 봅니다.

## boot-base / 예제 구분

제품의 오케스트레이션, Outbox는 saga 라이브러리 경로입니다.<br />
위 스니펫은 Spring Kafka 직호출 **예제**입니다.
