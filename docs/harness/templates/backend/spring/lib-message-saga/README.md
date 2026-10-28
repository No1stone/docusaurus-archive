---
sidebar_position: 1
format: md
id: t-spring-lib-message-saga
title: "lib-message-saga (발행 REST/gRPC · 컨슘 Kafka)"
description: "전통 오케스트레이션 Saga. 앱은 REST/gRPC 발행·선택적 Kafka 컨슘. event-saga는 Outbox+지휘."
tags:
  - Spring
  - Kafka
  - gRPC
  - Outbox
  - Saga
status: active
---

# lib-message-saga

> **원칙:** [오케스트레이션 Saga와 Outbox](/docs/patterns/architecture-patterns/own-events-outbox)  
> Rabbit 실시간: [lib-message-routing](../lib-message-routing/)

MSA 앱용 **발행(REST 기본 / gRPC) + 컨슘(Kafka, 선택)** 라이브러리.

---

## 한 줄

```text
주문 시작 발행 → Saga 소비·다음 요청 → 서비스 결과 발행
→ Saga 소비·진행/보상 결정·발행 → 대상 서비스가 요청·보상 수행
```

- **event-saga** = **Saga 컨슈머** + Outbox 발행 (소비→결정→발행)
- **이 lib** = 참여자/주문이 쓰는 결과 발행·요청/보상 컨슘 API
- 발행 경로에 Kafka 의존 불필요 (REST/gRPC). 컨슘할 때만 Kafka
- 버스에 전 구간 이력 방송 안 함. 결과·다음/보상 지시만

---

## 역할

| 이 모듈 (앱) | event-saga |
|--------------|------------|
| REST(기본)·gRPC로 시작·**결과** 발행 | Accept → Outbox → Kafka |
| Kafka로 **요청·보상** 컨슘 (선택) | 결과 소비 → 다음/보상 발행 |
| `SagaPublishPolicy` | 동일 계약 |

---

## 앱에서 (권장: 브로커 없이 발행)

도메인/Facade는 **Kafka·Rabbit을 모름**. 로컬 `ApplicationEvent` → `@Async` `@EventListener` → REST(또는 gRPC)로 event-saga.

```text
Facade.publishEvent(OrderStartedEvent)
        ↓ @Async
Bridge → POST /sagas  (transport: rest)
        ↓
event-saga Outbox → Kafka (여기서만 브로커)
```

예제: `example/async/OrderStartedEvent` · `OrderStartedSagaBridge`  
(`@EnableAsync` 필요. Bridge를 `@Component`로 등록.)

### 발행만 (Kafka exclude 가능)

```gradle
implementation(project(':lib-message-saga')) {
    exclude group: 'org.springframework.kafka'
    exclude group: 'org.apache.kafka'
}
implementation 'org.springframework.boot:spring-boot-starter-web' // RestClient
```

```yaml
origemite.message.saga:
  publish:
    enabled: true
    transport: rest          # 기본. grpc 도 가능
    base-url: http://localhost:8095
    # transport: grpc 일 때
    # target: localhost:9095
    # connect-timeout: 5s   # 채널 연결
    # deadline: 3s          # 호출당 (REST read 대응)
  consume:
    enabled: false
```

### 컨슘 (Saga 요청·보상 받을 때만 Kafka)

```yaml
spring.kafka.bootstrap-servers: localhost:9092
origemite.message.saga.consume.enabled: true
```

`SagaEventHandler`로 자기 계약만 처리.