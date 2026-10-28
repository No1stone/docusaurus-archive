---
id: pattern-own-events-outbox
title: 오케스트레이션 Saga와 Outbox
description: 전통 오케스트레이션 Saga(소비→결정→발행)에 Outbox 중앙 전달을 얹는다. 이벤트 지옥을 피하면서 진행·보상은 Saga가 지휘한다.
tags:
  - patterns
  - Outbox
  - Saga
  - Messaging
status: active
slug: /patterns/architecture-patterns/own-events-outbox
---

# 오케스트레이션 Saga와 Outbox

> **전통 오케스트레이션 Saga** + **Outbox 중앙 전달**.  
> Saga가 **결과를 소비**하고 **다음 업무·보상을 결정**한 뒤 **다시 발행**한다.  
> 발행 경로는 Outbox로 모아 이벤트 지옥·이중 쓰기를 줄인다.

구현: [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/) · boot-base `event-saga`.

---

## 흐름 (전통)

```text
주문 서버가 시작 이벤트 발행
        ↓
Saga가 받아 다음 업무 요청 발행
        ↓
각 서비스가 실행 후 결과 이벤트 발행
        ↓
Saga가 결과를 소비 → 진행 또는 보상 결정 → 발행
```

코레오그래피(각자 반응만)가 아니라, **Saga가 지휘자**다.

---

## 왜 Outbox를 같이 쓰나

```text
1) 이벤트 지옥 — 서비스마다 단계를 마구 방송하면 폭발
2) 발행을 event-saga(Outbox)로 모아 신뢰 전달
3) 그래도 “전 구간 이력을 버스에 쌓는 관리”는 하지 않음
   → Saga는 필요한 결과만 소비하고, 다음/보상 지시만 발행
```

| 한다 | 하지 않는다 |
|------|-------------|
| **오케스트레이션** — Saga 소비 → 결정 → 발행 | 코레오그래피로만 흘리기 |
| 참여자 **결과 이벤트** 발행 (자기 결과) | 중간 STATUS를 전 서비스에 방송 |
| 발행은 **Outbox** (REST/gRPC Accept → Kafka) | Inbox로 전 이벤트 아카이브 |
| 보상 = Saga가 **보상 지시 발행** → 대상 서비스가 수행 | 이력 추적용 이벤트 폭증 |

---

## 역할 분리

| | 역할 |
|--|------|
| **주문 등 시작 서비스** | 시작 이벤트 발행 (lib → event-saga Outbox) |
| **event-saga** | **Kafka 컨슈머(Saga)** + Outbox 전달. 결과 소비 → 다음/보상 발행 |
| **참여자 서비스 + lib** | 업무 실행 · **결과 발행** · Saga가 보낸 **요청/보상 소비** |
| **lib-message-saga** | 앱용 REST(기본)/gRPC 발행 + 선택 Kafka 컨슘. 도메인은 ApplicationEvent→@Async 브리지 권장 |

성공 경로: 시작 → (요청→결과)×N → 완료.  
실패 시: Saga가 보상 지시 발행 → 해당 서비스가 보상 수행.

---

## 관련

- [Saga](/docs/patterns/architecture-patterns/saga) — 패턴 일반론
- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox) — 전달 신뢰성 (우리는 Outbox 중심)
- [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/)
