---
id: pattern-own-events-outbox
title: 자기 이벤트와 Outbox 중앙 전달
description: 이벤트 지옥 → 사가 중앙화 → 다시 이벤트 관리 지옥을 피하기 위해, 자기 이벤트만 발행하고 보상도 이벤트·소비 측에서 처리하는 현재 원칙.
tags:
  - patterns
  - Outbox
  - Saga
  - Messaging
status: active
slug: /patterns/architecture-patterns/own-events-outbox
---

# 자기 이벤트와 Outbox 중앙 전달

> **요즘 제일 중요한 메시지 원칙.**  
> 이벤트 지옥을 피하려고 중앙(event-saga)을 두되, **중앙이 모든 이벤트를 “관리”하지는 않는다.**  
> 각 서비스는 **자기 이벤트만** 내고, 보상도 **보상 이벤트를 발행**해 **필요한 소비 측**이 처리한다.

구현: [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/) · boot-base `event-saga`.

---

## 왜 이렇게 왔나

```text
1) 이벤트 지옥
   서비스마다·단계마다 이벤트를 마구 발행
   → 토픽·구독·이력·디버깅 폭발

2) 중앙화 (event-saga / 오케스트레이션 입구)
   “발행을 한곳으로” 모아 Outbox로 신뢰 전달
   → 전달·중복·유실 문제는 줄어듦

3) 그래도 중앙이 이벤트·사가 상태를 다 관리하면
   → 또 난리 (중앙 이벤트 관리 = 두번째 지옥)
```

그래서 **다음 합의**가 현재 기준이다.

| 한다 | 하지 않는다 |
|------|-------------|
| 발행 **경로**만 중앙 (Outbox + Kafka producer) | 사가 인스턴스·전 구간 이력·중간 STATUS 방송 |
| **자기 이벤트만** 발행 (성공 기준 COMPLETE) | 남의 업무 이력을 버스에 쌓기 |
| 실패 시 **자기 보상 이벤트** 발행 | 중앙이 보상 엔진으로 모든 서비스 상태 추적 |
| **보상 필요처(컨슈머)**가 “내 이벤트”면 보상 | Inbox로 전 이벤트 아카이브 |

---

## 한 줄 원칙

1. **이벤트 지옥**을 피하려고 발행을 모은다 (event-saga + Outbox).  
2. 모았다고 **이벤트 관리 시스템**을 만들면 다시 지옥이다.  
3. 그러므로 **자기 이벤트만** 낸다.  
4. **보상도 이벤트**다. 발행하고, **소모하는 쪽**이 자기 보상을 한다.

---

## 역할 분리

| | 역할 |
|--|------|
| **MSA 앱 + lib-message-saga** | Gradle에 넣으면 **발행(gRPC)** + **컨슘(Kafka)** API 제공 |
| **event-saga** | Accept(REST/gRPC) → `event_outbox` → Kafka **producer**만. 컨슘·사가 상태 테이블 없음 |
| **구독 서비스** | complete / compensate 등 **자기 계약**만 처리·보상 |

성공 기본: `COMPLETE` + `SUCCEEDED`.  
실패·보상: `FAIL` + `COMPENSATE*` → 컨슈머가 처리.

---

## 관련

- [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox) — 전달 신뢰성 (우리는 Outbox만, Inbox로 이력 관리 안 함)
- [Saga](/docs/patterns/architecture-patterns/saga) — 패턴 일반론. 본 문서가 **우리 운영 선택**의 이유
- [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/)
