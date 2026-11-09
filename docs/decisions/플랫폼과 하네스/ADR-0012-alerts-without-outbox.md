---
id: adr-0012
title: 알림은 outbox 없이 두고, 재처리가 필요한 전달만 outbox를 쓴다
description: 메일·문자·카톡 등 놓쳐도 되는 알림은 best-effort로 두고, 파트너 웹훅·확정 통지 등 재처리·감사가 필요한 전달에만 outbox를 쓴다
tags:
  - adr
  - messaging
  - outbox
  - harness
status: accepted
slug: "/decisions/adr-0012"
---
# 알림은 outbox 없이 두고, 재처리가 필요한 전달만 outbox를 쓴다

업무 트랜잭션 이후 비동기 전달을 모두 outbox로 깔면 관리 포인트가 커지고, 알림 유실을 업무 정합 실패처럼 다루게 된다.
SLA가 “놓쳐도 됨 / 대부분 되면 됨”인 알림과, 반드시 전달·재시도·감사가 필요한 전달을 같은 경로로 두면 경계가 흐려진다.

## 결정

| 구분 | outbox | 처리 |
|------|--------|------|
| 알림 (메일, 문자, 카톡 등), 놓쳐도 됨 / 대부분 되면 됨 | 없음 | 업무 TX 커밋 후 AFTER_COMMIT 또는 best-effort (`@Async` 1회 등). 실패는 로그·수동 재발송으로 감당 |
| TX와 함께 보장·재시도·감사가 요구사항인 전달 (파트너 웹훅, 정산·확정 통지, Saga 버스 발행 등) | 있음 | [오케스트레이션 Saga와 Outbox](/docs/patterns/architecture-patterns/own-events-outbox) 축 |

알림을 outbox 기본값으로 두지 않는다.
개별 채널(카톡·SMS 벤더) 구현 세부는 구현 시점에 연다.
DB·outbox 인프라가 없는 서비스의 워커 대체는 프로젝트 합의이며, 이 ADR이 게이트웨이 구조를 강제하지 않는다.

## 결과

- [coding-conventions Messaging](/docs/harness/context/coding-conventions)
- [spring-messaging-saga 오케스트레이션](/docs/harness/orchestrations/spring-messaging-saga)
- 알림 실패를 CRUD 원셋 성공 실패와 섞어 보지 않는다
