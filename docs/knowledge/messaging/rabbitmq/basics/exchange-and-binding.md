---
id: spring-amqp-exchange-routing
title: "Exchange와 Binding — Direct, Topic, Fanout"
description: "RabbitMQ Exchange 타입과 Binding, routing key로 큐에 메시지를 보내는 흐름을 정리합니다. 공개 URL slug를 유지합니다."
slug: /knowledge/messaging/brokers/spring-amqp-exchange-routing
sidebar_label: "Exchange와 Binding"
sidebar_position: 2
tags: [Spring, RabbitMQ, Messaging]
---
# Exchange와 Binding — Direct, Topic, Fanout

> **개요:** 프로듀서는 Exchange에 발행하고, Binding과 routing key가 어느 큐로 갈지를 정합니다.
> slug `/knowledge/messaging/brokers/spring-amqp-exchange-routing`을 유지합니다.

## 상황

주문 `order.created`를 알림 큐와 집계 큐에 각각 전달하거나, 메일만 특정 큐로 보내고 싶을 때 씁니다.

## Exchange 타입

| 타입 | 라우팅 |
|---|---|
| Direct | routing key가 Binding과 **정확히** 일치 |
| Topic | `orders.*`, `parking.#` 같은 패턴 |
| Fanout | routing key 무시, 바인딩된 모든 큐로 복사 |

```java
@Bean
TopicExchange orders() {
    return new TopicExchange("orders");
}

@Bean
Queue notificationQ() {
    return new Queue("notification.q");
}

@Bean
Queue analyticsQ() {
    return new Queue("analytics.q");
}

@Bean
Binding toNotify(Queue notificationQ, TopicExchange orders) {
    return BindingBuilder.bind(notificationQ).to(orders).with("order.created");
}

@Bean
Binding toAnalytics(Queue analyticsQ, TopicExchange orders) {
    return BindingBuilder.bind(analyticsQ).to(orders).with("order.created");
}
```

```java
rabbitTemplate.convertAndSend("orders", "order.created", payload);
```

## 결과

같은 발행이 Binding된 두 큐에 들어갑니다.<br />
워커를 여러 대 두는 것과, 큐를 여러 개 두는 것의 차이는 [RabbitMQ란?](/docs/knowledge/messaging/rabbitmq) 그림을 봅니다.

## 적용할 때

boot-base 실시간 라우팅은 topic Exchange `app.topic`과 `{영역}.{리소스}.{…}` 키를 씁니다.<br />
→ [lib-message-routing](/docs/harness/templates/backend/spring/lib-message-routing/)

패턴 글: [라우팅과 Fan-out](/docs/knowledge/messaging/rabbitmq/patterns/routing-and-fanout)
Spring 발행, 소비 세트: [Spring AMQP](/docs/knowledge/messaging/rabbitmq/spring/spring-amqp)

## 참고

- [AMQP Abstractions](https://docs.spring.io/spring-amqp/reference/amqp/abstractions.html)
