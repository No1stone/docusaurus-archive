---
id: messaging-rabbitmq
title: "RabbitMQ란?"
description: "알림 워커가 한 큐를 나누고, 집계는 별도 큐로 같은 주문을 받는 RabbitMQ 구성을 설명합니다."
sidebar_label: "RabbitMQ란?"
sidebar_position: 0
slug: /knowledge/messaging/rabbitmq
tags: [RabbitMQ, Messaging]
status: active
---
# RabbitMQ란?

주문이 접수되면 알림을 보내고 집계에도 반영해야 합니다.<br />
알림은 워커를 두 대로 나누고 싶고, 집계는 알림과 무관하게 **같은 주문 이벤트 사본**을 받아야 합니다.

한 큐에 알림 워커와 집계 워커를 같이 붙이면 안 됩니다.<br />
큐는 메시지를 소비자에게 한 번만 넘기므로, 알림이 가져간 주문을 집계가 받지 못할 수 있습니다.
[Consumers](https://www.rabbitmq.com/docs/consumers) / [AMQP 모델](https://www.rabbitmq.com/tutorials/amqp-concepts)

원셋의 실시간·명령 라우팅은 `lib-message-routing`(Rabbit topic exchange)입니다.<br />
이 글의 fanout·작업 큐 예제는 **토폴로지를 설명하기 위한 문서용 코드**이며, Saga/Kafka 모듈(`lib-message-saga`)과는 섞지 않습니다.
[lib-message-routing](/docs/harness/templates/backend/spring/lib-message-routing/)

## 상황

주문 `order-42`가 접수됩니다.<br />
알림은 처리 시간이 길어 워커 두 대가 필요하고, 집계는 같은 이벤트를 독립적으로 받아야 합니다.

## 구조와 동작

| 구성요소 | 역할 |
|---|---|
| Producer | Exchange에 publish |
| Exchange | Binding 규칙으로 0개 이상 큐에 라우팅 |
| Queue | 소비 대기열 |
| Consumer | 큐에서 메시지를 받아 처리 |

관심사마다 큐를 나눕니다.<br />
알림용 `notification.q`, 집계용 `analytics.q`를 같은 Exchange에 Binding하면 발행 한 번으로 두 큐에 사본이 들어갑니다.
[Exchanges](https://www.rabbitmq.com/docs/exchanges) / [Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-python)

한 관심사 안에서는 워커가 경쟁합니다.<br />
`notification.q`에 워커 두 대를 붙이면 한 메시지는 한 워커만 받습니다.
[Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-python)

```text
[그림 A] 한 큐, 여러 워커 (작업 분배)
  메시지 M1, M2, M3 → notification.q
                         /          \
                   워커1(M1,M3)   워커2(M2)

[그림 B] 두 큐, 같은 이벤트 사본 (관심사 분리)
  Producer → Exchange orders
                |            |
         notification.q   analytics.q
           /        \           |
      워커1      워커2       집계 워커
```

## 명령과 코드 예제

아래는 **문서용 AMQP 흐름**입니다.<br />
원셋 Port 어댑터 코드가 아닙니다.

**입력:** Exchange `orders`(fanout), 큐 `notification.q`·`analytics.q`, 본문 `{"orderId":"42","event":"order.created"}`

```java
channel.exchangeDeclare("orders", "fanout", true);
channel.queueDeclare("notification.q", true, false, false, null);
channel.queueDeclare("analytics.q", true, false, false, null);
channel.queueBind("notification.q", "orders", "");
channel.queueBind("analytics.q", "orders", "");

channel.basicPublish("orders", "", null,
    "{\"orderId\":\"42\",\"event\":\"order.created\"}".getBytes());
```

Spring에서는 `RabbitTemplate.convertAndSend("orders", "", payload)`와 큐별 `@RabbitListener`로 같은 구조를 만듭니다.
→ [Spring AMQP](/docs/knowledge/messaging/rabbitmq/spring/spring-amqp)

## 결과

| 관찰 | 예상 |
|---|---|
| 알림 워커 | `order-42`를 둘 중 한 워커만 처리 |
| `analytics.q` | 같은 `order-42` 사본 1건 |
| 집계 워커 | 알림과 독립적으로 처리 |

주문을 세 번 연달아 발행하면 알림 워커는 round-robin으로 나눠 받고, 집계 큐에는 세 건이 모두 쌓입니다.

## 실패하거나 조건이 달라지는 경우

한 큐에 알림과 집계를 같이 붙이면 메시지마다 한쪽만 받습니다.<br />
소비자가 ACK 전에 종료하면 미ACK는 다시 큐로 돌아가 재전달될 수 있습니다.<br />
Publisher Confirm과 Consumer ACK는 서로 모릅니다.
→ [Confirm, ACK, Prefetch](/docs/knowledge/messaging/brokers/spring-amqp-consumer-ack)

Prefetch가 크면 바쁜 워커가 미ACK를 많이 붙잡습니다.
[Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-python)

## 이 폴더에서 다음에 볼 글

| 구분 | 글 |
|---|---|
| 구조 | [구성요소](/docs/knowledge/messaging/rabbitmq/basics/producer-exchange-queue-consumer), [Exchange와 Binding](/docs/knowledge/messaging/brokers/spring-amqp-exchange-routing) |
| 패턴 | [작업 큐](/docs/knowledge/messaging/rabbitmq/patterns/work-queue), [라우팅과 Fan-out](/docs/knowledge/messaging/rabbitmq/patterns/routing-and-fanout), [실패 처리](/docs/knowledge/messaging/rabbitmq/patterns/failure-dlx) |
| Spring | [Spring AMQP](/docs/knowledge/messaging/rabbitmq/spring/spring-amqp) |
| 운영 | [Docker Compose](/docs/knowledge/messaging/rabbitmq/ops/docker-compose) |

같은 상황을 Kafka로 보면 [Kafka란?](/docs/knowledge/k-kafka)을 봅니다.
