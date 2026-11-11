---
id: rabbitmq-spring-amqp
title: "Spring AMQP — RabbitTemplate, @RabbitListener"
description: "Spring AMQP로 주문 이벤트 발행과 소비, 예외, 재수신까지 한 세트로 따라갑니다."
slug: /knowledge/messaging/rabbitmq/spring/spring-amqp
sidebar_position: 1
tags: [Spring, RabbitMQ, Messaging]
---
# Spring AMQP — RabbitTemplate, @RabbitListener

> **개요:** 발행(`RabbitTemplate`)과 소비(`@RabbitListener`)를 한 흐름으로 봅니다.
> boot-base 실시간 경로는 [lib-message-routing](/docs/harness/templates/backend/spring/lib-message-routing/)을 Ref로 둡니다.

## 정상 처리 (예제)

```java
// 발행
rabbitTemplate.convertAndSend("orders", "order.created",
    Map.of("orderId", "42", "eventId", "evt-1"));

// 소비
@RabbitListener(queues = "notification.q")
public void onOrderCreated(Map<String, String> body) {
    String eventId = body.get("eventId");
    if (alreadyProcessed(eventId)) {
        return; // 멱등
    }
    sendNotification(body.get("orderId"));
    markProcessed(eventId);
}
```

`AUTO` ACK면 메서드가 예외 없이 끝나야 브로커가 처리 완료로 봅니다.

## 소비 중 예외

```java
@RabbitListener(queues = "notification.q", ackMode = "MANUAL")
public void onOrderCreated(Message message, Channel channel) throws Exception {
    long tag = message.getMessageProperties().getDeliveryTag();
    try {
        process(message);
        channel.basicAck(tag, false);
    } catch (Exception ex) {
        channel.basicNack(tag, false, true);
        throw ex;
    }
}
```

재수신된 메시지는 `eventId`로 중복을 걸러야 안전합니다.<br />
→ [Confirm, ACK, Prefetch](/docs/knowledge/messaging/brokers/spring-amqp-consumer-ack), [실패 처리](/docs/knowledge/messaging/rabbitmq/patterns/failure-dlx)

## boot-base

실제 Port 기반 발행, 구독은 `MessagePublishPort` / `MessageSubscribePort`입니다.<br />
위 코드는 Spring AMQP 직호출 **예제**이고, 제품 코드는 라이브러리 README를 따릅니다.
