---
id: pattern-knowledge-supplement-refs
title: 패턴·Knowledge 보완 참조 기록
description: 참조 저장소 커밋과 코드 경로. 원본 저장소는 수정하지 않음.
unlisted: true
---
# 패턴·Knowledge 보완 참조 기록

> **개요:** 패턴·Knowledge 보완 시 읽기 전용으로 확인한 저장소와 경로입니다.

## 참조 저장소

| 저장소 | 커밋 | Java | Spring Boot |
|--------|------|------|-------------|
| `/Users/wonseok/Documents/workspace/boot-base` | `5e70210` | 17 | 3.5.5 (Spring Cloud BOM 2025.0.0) |
| `/Users/wonseok/Documents/workspace/hanwha/partner-gateway` | `4450193` | 25 | 3.5.16 |

버전을 섞어 하나의 실행 예제처럼 쓰지 않았습니다.
Outbox·Inbox 설명의 적용 범위는 partner-gateway, Gateway 권한 라우팅의 코드 확인은 boot-base입니다.
`boot-base/event-saga`는 미구현이므로 Saga 적용 근거로 사용하지 않았습니다.
Redisson 분산 락 코드는 두 저장소에서 확인되지 않아 설명용 예제로만 적었습니다.

## 확인한 코드 경로

### partner-gateway (Outbox·Inbox에 가까운 수신·전달)

- `db/init/01_init.sql` — `mopl_webhook_event`, `event_id` 유니크, `forward_status`
- `.../webhook/facade/MoplWebhookReceiveFacade.java`
- `.../webhook/facade/WebhookCallbackFacade.java`
- `.../infrastructure/schedule/WebhookCallbackScheduler.java`
- `.../moplwebhookevent/service/MoplWebhookEventService.java`
- `.../moplwebhookevent/enums/EnForwardStatus.java`

### boot-base (Gateway 인증·라우팅)

- `gateway/.../filter/ConfigFilter.java`
- `gateway/.../filter/JwtAuthenticationFilter.java`
- `gateway/.../filter/JwtTokenAuthenticationProvider.java`
- `gateway/.../conf/dto/AuthServerAllowPath.java`
- `api-auth/.../provider/VaultJwtTokenProvider.java`
