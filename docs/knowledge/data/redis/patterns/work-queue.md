---
id: redis-work-queue
title: "Redis 작업 큐 — List와 Streams, Consumer Group"
description: "Redis List와 Streams로 작업을 소비, 확인, 실패 재처리하는 차이와 Spring Data Redis 예제를 정리합니다. Pub/Sub과 구분합니다."
slug: /knowledge/data/redis/patterns/work-queue
sidebar_position: 4
tags: [Redis]
---
# Redis 작업 큐 — List와 Streams, Consumer Group

메일 발송처럼 시간이 걸리는 일을 HTTP 요청 안에서 끝내지 않고, 워커가 큐에서 꺼내 처리하고 싶을 때가 있습니다.<br />
이 글은 Redis List와 Streams로 작업을 가져갈 때 키·소비 상태가 어떻게 바뀌는지 비교합니다.

[Pub/Sub](/docs/knowledge/k-pubsub)의 “지금 구독자에게 알림”과 분리합니다.<br />
아래 Spring Data Redis 예제는 **문서용**이며, 원셋 boot-base에 작업 큐 전용 Port는 없습니다.

## List 기반 단순 큐

```bash
LPUSH jobs '{"id":"1","type":"mail"}'
BRPOP jobs 10
```

수신은 쉽지만, 처리 중 크래시 시 메시지 유실, 재전달을 애플리케이션이 책임져야 합니다.<br />
신뢰성이 필요하면 처리 중 키, 상태 키를 따로 두거나 Streams로 올립니다.

### Spring Data Redis (List)

```java
StringRedisTemplate redis;

// 생산
redis.opsForList().leftPush("jobs", "{\"id\":\"1\",\"type\":\"mail\"}");

// 소비 (최대 10초 대기). 타임아웃이면 null
String job = redis.opsForList().rightPop("jobs", Duration.ofSeconds(10));
```

`rightPop(key, Duration)`은 요소가 생기거나 타임아웃까지 대기하고, 타임아웃이면 null을 반환합니다.<br />
반환하는 순간 리스트에서 제거됩니다.
[ListOperations](https://docs.spring.io/spring-data-redis/reference/api/java/org/springframework/data/redis/core/ListOperations.html)

처리 실패 후 재시도하려면 앱이 다시 push하거나 별도 실패 큐를 둡니다.

## Streams + Consumer Group

```bash
XADD stream:jobs * type mail payload '{…}'
XGROUP CREATE stream:jobs workers 0 MKSTREAM
XREADGROUP GROUP workers c1 COUNT 1 BLOCK 5000 STREAMS stream:jobs >
XACK stream:jobs workers 169999-0
```

| 단계 | 요지 |
|---|---|
| 수신 | 그룹 내 소비자에게 분배 |
| 확인 | `XACK`로 처리 완료 |
| 실패 | pending 조회 후 재할당, 재처리 설계 |

### Spring Data Redis (Streams)

그룹을 한 번 만들고, 리스너에서 처리 후 ACK합니다.

```java
StringRedisTemplate redis;
RedisConnectionFactory connectionFactory;

// 그룹 생성 (이미 있으면 BUSYGROUP 등 → 무시)
redis.opsForStream().createGroup(
    "stream:jobs", ReadOffset.from("0-0"), "workers");

StreamMessageListenerContainer<String, MapRecord<String, String, String>> container =
    StreamMessageListenerContainer.create(connectionFactory);

container.receive(
    Consumer.from("workers", "c1"),
    StreamOffset.create("stream:jobs", ReadOffset.lastConsumed()),
    message -> {
        // 업무 처리…
        redis.opsForStream().acknowledge("workers", message);
    });
container.start();
```

`receive`는 자동 ACK가 아닙니다.<br />
처리 전에 프로세스가 죽으면 메시지는 pending에 남고, 재할당 설계가 필요합니다.<br />
수신 즉시 ACK하려면 `receiveAutoAck`를 쓰되, 유실 가능성을 감수합니다.<br />

at-least-once에 가깝게 가져가려면 멱등 처리와 [중복 처리 방지](/docs/knowledge/data/redis/patterns/dedup)를 함께 둡니다.

## 비교 요약

| | List | Streams |
|---|---|---|
| 모델 | 큐 pop | 로그 + 컨슈머 그룹 |
| 확인 | 앱 책임 | `XACK` / `acknowledge` |
| 재처리 | 직접 구현 | pending/claim |
| Spring API | `opsForList()` | `opsForStream()`, `StreamMessageListenerContainer` |

## RabbitMQ와 나눌 때

메시지 종류별로 Exchange에 라우팅하거나, 브로커 쪽 소비자 ACK 정책을 쓰려면 Redis 큐가 아니라 Spring AMQP 쪽을 봅니다.

- Exchange, Binding, routing key → [Spring AMQP — Exchange 라우팅](/docs/knowledge/messaging/brokers/spring-amqp-exchange-routing)
- `AcknowledgeMode`, `basicAck` / `basicNack` → [Spring AMQP — 소비자 ACK](/docs/knowledge/messaging/brokers/spring-amqp-consumer-ack)

## 참고

- [Streams](https://redis.io/docs/latest/develop/data-types/streams/)
- [Spring Data Redis — Redis Streams](https://docs.spring.io/spring-data/redis/reference/redis/redis-streams.html)
