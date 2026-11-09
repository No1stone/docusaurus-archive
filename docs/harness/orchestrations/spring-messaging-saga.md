# Orchestration: `spring-messaging-saga`

> **개요:** 유스케이스에 신뢰 전달(Outbox)·오케스트레이션 Saga·자기 이벤트 버스가 필요할 때의 레시피입니다.
> 순수 CRUD 원셋이나 알림 best-effort에는 쓰지 않습니다.
> 기본은 단일 에이전트입니다.

| Field | Value |
|-------|--------|
| ID | `spring-messaging-saga` |
| Status | active |
| Profile hint | `docs/harness/profiles/spring-api.md` |

## 적용 조건

**적용합니다.**

- 업무 TX와 함께 **반드시 전달·재시도·감사**가 필요한 발행 (파트너 웹훅, 확정 통지, Saga 버스 등)
- 전통 오케스트레이션 Saga (소비 → 결정 → 다음/보상 발행)를 유스케이스에 붙일 때
- `lib-message-saga` / Outbox 경로를 처음 도입하거나 경계를 맞출 때

**적용하지 않습니다.**

- 내부 테이블 CRUD 원셋만 → [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)
- 메일·문자·카톡 등 **놓쳐도 되는 알림** → [ADR-0012](/docs/decisions/adr-0012) (outbox 없음, AFTER_COMMIT / best-effort)
- Rabbit 실시간·명령 라우팅만 → [`lib-message-routing`](/docs/harness/templates/backend/spring/lib-message-routing/) (사가와 섞지 않음)
- 외부 OpenAPI·RestClient 계약만 → [`spring-external-contract`](/docs/harness/orchestrations/spring-external-contract)

## 입력과 미확정

**필요합니다.**

- 어떤 이벤트가 “재처리 필수”인지 / 알림인지
- 발행 수송 (REST/gRPC → event-saga)과 토픽·보상 범위

**미확정이면 확인합니다.**

- event-saga 호스트 구현 여부 (문서상 미구현이면 적용 근거로만 쓰지 않음)
- 인프로세스 outbox vs Kafka 지휘를 이 프로젝트에서 어디까지 쓰는지

## 읽을 문서와 템플릿

| Path | 언제 |
|------|------|
| [own-events-outbox](/docs/patterns/architecture-patterns/own-events-outbox) | Saga + Outbox 원칙 |
| [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/) | 앱 발행·컨슘 템플릿 |
| [lib-message-routing](/docs/harness/templates/backend/spring/lib-message-routing/) | 사가와 **무관**한 Rabbit — 섞지 말 것 확인 |
| [ADR-0012](/docs/decisions/adr-0012) | 알림 vs outbox 경계 |
| [coding-conventions Messaging](/docs/harness/context/coding-conventions) | 모듈 분리 |
| [outbox-and-inbox](/docs/patterns/architecture-patterns/outbox-and-inbox) | 전달 신뢰성 일반론 |

## 작업 순서와 산출물

1. 유스케이스에서 **outbox 필수**인지 알림 best-effort인지 나눕니다. → 경계 표
2. 원칙·lib README를 읽고 발행 경로(ApplicationEvent → 브리지 → REST/gRPC → Outbox)를 맞춥니다. → 설계 메모
3. 라우팅(Rabbit) 모듈과 파일을 섞지 않습니다. → 의존 확인
4. 최소 구현·테스트 (호스트 패턴 재사용). → 코드
5. 실패·재시도가 outbox 스케줄 쪽인지 확인합니다. → 보고

비동기·사가 사용 시점은 **이 레시피를 고른 유스케이스**입니다.
CRUD 원셋 복사 기본 경로에 비동기를 넣지 않습니다.

## Success criteria

- [ ] 알림과 신뢰 전달 경로가 문서상 분리됨
- [ ] Rabbit 라우팅과 saga 모듈이 섞이지 않음
- [ ] 통과 기준·미실행 검증이 보고에 구분됨
