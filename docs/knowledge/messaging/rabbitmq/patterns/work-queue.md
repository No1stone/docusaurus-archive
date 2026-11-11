---
id: rabbitmq-pattern-work-queue
title: "작업 큐 — 여러 워커에 작업 분배"
description: "한 큐에 워커를 여러 대 붙이면 메시지가 어떻게 나뉘고, Prefetch가 분배에 어떤 영향을 주는지 설명합니다."
slug: /knowledge/messaging/rabbitmq/patterns/work-queue
sidebar_position: 1
tags: [RabbitMQ, Messaging]
---
# 작업 큐 — 여러 워커에 작업 분배

알림 발송처럼 처리 시간이 긴 작업을 HTTP 요청 안에서 끝내지 않고, 워커를 두 대 이상 두고 싶을 때가 있습니다.<br />
한 큐에 competing consumers를 붙이면 한 메시지는 한 워커만 가져갑니다.
[Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-python)

아래 코드는 **문서용 예제**입니다.<br />
원셋 `lib-message-routing`의 Port 어댑터가 아닙니다.

## 상황

부하가 늘면 워커 프로세스만 늘리고, Prefetch로 느린 워커에 일이 몰리는 정도를 조절합니다.

## 구조와 동작

기본 분배는 round-robin에 가깝습니다.<br />
브로커는 미ACK 개수를 보지 않고 n번째 메시지를 n번째 소비자에게 줄 수 있습니다.<br />
홀수 메시지가 무겁고 짝수가 가벼우면 한쪽 워커만 바쁠 수 있습니다.<br />
[Work Queues — Fair dispatch](https://www.rabbitmq.com/tutorials/tutorial-two-python)

`basic.qos`로 Prefetch를 1에 가깝게 두면, ACK 전에는 다음 메시지를 주지 않아 여유 워커에게 넘깁니다.<br />
[Consumer Prefetch](https://www.rabbitmq.com/docs/consumer-prefetch)

집계도 같은 주문을 받아야 하면 **이 큐만으로 부족**합니다.<br />
관심사마다 큐를 두는 구성은 [RabbitMQ란?](/docs/knowledge/messaging/rabbitmq)을 봅니다.

## 명령과 코드 예제

문서용 예제입니다.<br />

**입력:** `notification.q`에 메시지 3건, 워커 2대, Prefetch 1

```java
channel.basicQos(1);
channel.basicConsume("notification.q", false, (consumerTag, delivery) -> {
    try {
        sendSms(delivery.getBody());
    } finally {
        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
    }
}, consumerTag -> { });
```

## 결과

| 조건 | 예상 |
|---|---|
| 워커 2, Prefetch 1, 작업 시간 비슷 | M1→W1, M2→W2, M3→먼저 끝난 쪽 |
| Prefetch 큼, 홀수 작업만 무거움 | 한 워커에 미ACK가 몰릴 수 있음 |
| 워커 ACK 전 종료 | 미ACK requeue → 다른 워커 재전달 |

## 실패하거나 조건이 달라지는 경우

**모든 워커가 바쁜 경우**  
큐가 쌓입니다.<br />
워커를 늘리거나 TTL/DLX를 검토합니다.<br />
[Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-python)

**자동 ACK**  
처리 전 ACK면 워커 장애 시 유실 위험이 커집니다.<br />
→ [Confirm, ACK, Prefetch](/docs/knowledge/messaging/brokers/spring-amqp-consumer-ack)

Redis List/Streams 작업 큐와 비교할 때는 [Redis 작업 큐](/docs/knowledge/data/redis/patterns/work-queue)를 봅니다.
