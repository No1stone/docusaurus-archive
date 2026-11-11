---
id: spring-amqp-consumer-ack
title: "Publisher Confirm, Consumer ACK, Prefetch"
description: "발행 Confirm을 받은 뒤 소비자가 처리 중 종료되면 누가 어디서 다시 처리하는지 설명합니다. 공개 URL slug를 유지합니다."
slug: /knowledge/messaging/brokers/spring-amqp-consumer-ack
sidebar_label: "Confirm, ACK, Prefetch"
sidebar_position: 3
tags: [Spring, RabbitMQ, Messaging]
---
# Publisher Confirm, Consumer ACK, Prefetch

주문 서비스가 `order-42`를 발행하고 Confirm을 받은 뒤, 알림 워커가 SMS를 보내다가 프로세스가 죽으면 누가 어디서 다시 처리할까요.<br />
Confirm만으로 업무 완료를 단정하지 않습니다.

Publisher Confirm은 브로커가 발행을 수락했는지이고, Consumer ACK는 소비자가 그 delivery를 처리했는지입니다.<br />
두 장치는 서로 모릅니다.
[Confirms](https://www.rabbitmq.com/docs/confirms)

## 상황

발행 Confirm은 이미 OK입니다.<br />
알림 워커는 메시지를 받아 처리 중이고 아직 ACK하지 않았습니다.

답은 Confirm이 재처리를 **막지 않는다**는 것입니다.<br />
Confirm과 Consumer ACK는 직교합니다.

## 구조와 동작

| 단계 | 확인 대상 | 의미 |
|---|---|---|
| Publisher Confirm | 발행자 ↔ 브로커 | Exchange/큐 경로로 브로커가 메시지를 **수락**함 |
| Consumer ACK | 소비자 ↔ 브로커 | 그 delivery를 **처리(또는 거부)함**. 이후 브로커가 삭제 후보로 둠 |
| Prefetch | 소비자 채널 | 미ACK 상태로 미리 밀어 넣는 개수 |

수동 ACK를 쓰는 동안, ACK 전에 채널이나 연결이 닫히면 미ACK delivery는 **자동으로 다시 큐에 들어갑니다**.<br />
다른 소비자(또는 재시작된 같은 앱)가 받을 수 있고, `redelivered=true`가 붙습니다.<br />
네트워크 단절 감지는 시간이 걸릴 수 있습니다.<br />
[Confirms](https://www.rabbitmq.com/docs/confirms), [Reliability Guide](https://www.rabbitmq.com/docs/reliability)

```text
1. Producer publish → Confirm OK  (브로커 수락)
2. Broker가 notification.q에서 Worker-A에게 deliver
3. Worker-A가 처리 중 종료 (ACK 없음)
4. 브로커가 미ACK를 requeue
5. Worker-B(또는 재기동 A)가 같은 payload를 다시 받음 (redelivered)
```

발행 측 Confirm은 이미 끝난 상태이므로, 재처리는 **소비 쪽 큐와 ACK**가 담당합니다.

## 명령과 코드 예제

아래는 설명용 Spring AMQP 예제입니다.<br />
boot-base 어댑터 코드가 아니라 Confirm/ACK 경계를 보여 주기 위한 문서용 예제입니다.<br />

**입력**

- 큐 `notification.q`에 `{"orderId":"order-42"}` 1건
- 리스너 `ackMode = MANUAL`
- Prefetch 1

```java
@RabbitListener(queues = "notification.q", ackMode = "MANUAL")
public void onNotify(Message message, Channel channel) throws IOException {
    long tag = message.getMessageProperties().getDeliveryTag();
    boolean redelivered = message.getMessageProperties().isRedelivered();
    try {
        sendSms(message); // 여기서 프로세스 종료 시 ACK 없음 → requeue
        channel.basicAck(tag, false);
    } catch (Exception ex) {
        channel.basicNack(tag, false, true); // requeue
        throw ex;
    }
}
```

| ACK 모드 | 동작 |
|---|---|
| `AUTO` | 리스너가 예외 없이 끝나면 컨테이너가 ACK |
| `MANUAL` | `basicAck` / `basicNack`을 앱이 호출 |
| `NONE` | 앱 ACK 없음 (유실 위험) |

[Message Listener Container](https://docs.spring.io/spring-amqp/reference/amqp/containerAttributes.html)

## 결과

| 시점 | Confirm | 큐 | 소비자 |
|---|---|---|---|
| 발행 직후 | OK | 메시지 ready | 아직 없음 |
| Worker-A deliver, 처리 중 | (이미 OK) | unacked | Worker-A |
| Worker-A 종료 (ACK 전) | 변화 없음 | requeue → ready | 없음 |
| Worker-B 재전달 | 변화 없음 | unacked | Worker-B, `redelivered=true` |
| Worker-B `basicAck` | 변화 없음 | 삭제 후보 | 완료 |

**예상:** Confirm을 이미 받은 뒤에도, ACK 전 소비자 장애면 **같은 큐의 다른(또는 재기동) 소비자**가 다시 처리합니다.

## 실패하거나 조건이 달라지는 경우

**자동 ACK를 쓰는 경우**  
컨테이너가 delivery 직후(또는 리스너 성공 시) ACK하면, 처리 중 장애 시 재전달이 안 될 수 있습니다.<br />
유실 가능성과 중복 가능성의 트레이드오프입니다.<br />
[Reliability Guide](https://www.rabbitmq.com/docs/reliability)

**`basicNack(..., requeue=false)`**  
재큐잉하지 않으면 DLX/폐기 경로로 갑니다.<br />
→ [실패 처리와 DLX](/docs/knowledge/messaging/rabbitmq/patterns/failure-dlx)

**Prefetch가 큰 경우**  
한 워커가 미ACK를 많이 붙잡으면 부하가 기울고, 장애 시 한꺼번에 requeue됩니다.<br />
작업 시간이 들쭉날쭉하면 Prefetch를 낮춥니다.<br />

**멱등성**  
재전달은 at-least-once에 가깝습니다.<br />
SMS를 두 번 보내지 않으려면 주문 ID 기준 멱등 키가 필요합니다.<br />

→ [RabbitMQ란?](/docs/knowledge/messaging/rabbitmq), [Spring AMQP](/docs/knowledge/messaging/rabbitmq/spring/spring-amqp)
