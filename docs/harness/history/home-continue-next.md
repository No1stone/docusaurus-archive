---
id: home-continue-next
title: 집 이어서 — 다음 작업
description: 사무실에서 중단한 아카이브 작업. 집에서 이어서 할 일만 적습니다.
unlisted: true
---
# 집 이어서 — 다음 작업

> **개요:** 이어서 할 일과 **쓸 글 주제**를 둡니다.
> 이 문서는 `unlisted`라 사이트 메뉴에 안 나옵니다. 저장소·하네스에서만 봅니다.

시작 시 [`CURRENT.md`](/docs/harness/CURRENT)와 이 글만 먼저 읽으면 됩니다.

## 참조 경로

| 이름 | 경로 |
|------|------|
| 부트베이스 | `/Users/wonseok/Documents/workspace/boot-base` |
| 팜프로 | `/Users/wonseok/Documents/workspace/hanwha/partner-gateway` |
| 아카이브 | `/Users/wonseok/Documents/workspace/docusaurus-archive` |

## 이미 끝난 것 (다시 하지 말 것)

- Notion → Knowledge 이전·분야 분류·의미 단위 하위 폴더
- Patterns GoF + architecture-patterns (Saga, Outbox/Inbox, 분산락, CQRS, CDC, Fan-out, Gateway)
- Postmortems (icomsys 포트폴리오 등) + 리다이렉트
- AdSense 자동 광고만 (수동 AdSlot 제거)
- 링크 글 재구성 1차 (대표 3: RestAPI / @Scheduled / JWT 포함, details 참고 자료)
- `npm run build` 통과 상태였음 (커밋 직전 재확인)

## 집에서 이어서 할 일

### 1. 게시 보류 draft — 작성자 재검토 (임의 공개·대량 보완 금지)

목록: [`notion-import-unclear-holds.md`](/docs/harness/history/notion-import-unclear-holds)

| 경로 |
|------|
| `docs/knowledge/backend/java/json-utils/javax-json-se-ee.md` |
| `docs/knowledge/backend/spring/legacy/reactive-web/reactive-streame-api.md` |
| `docs/knowledge/backend/spring/legacy/reactive-web/webflux.md` |
| `docs/knowledge/infrastructure/aws/network/vpc-creation-order.md` |
| `docs/knowledge/infrastructure/misc/workspace/self-hosted-messenger-candidates.md` |
| `docs/knowledge/messaging/brokers/mq-memo.md` |
| `docs/knowledge/messaging/delivery/webhook.md` |
| `docs/knowledge/infrastructure/networking/transport/dns-memo.md` |
| `docs/knowledge/infrastructure/networking/transport/udp-memo.md` |

### 2. 링크 글 품질 2차 (원하는 만큼)

1차에서 일괄 처리된 글 중 본문이 얇거나 원문 요약만인 것은, 대표 3건과 같은 기준으로 손보면 됩니다.

- 기준·구분: [`notion-import-link-rewrite-worklist.md`](/docs/harness/history/notion-import-link-rewrite-worklist)
- 코드 있으면 부트베이스·팜프로 중심으로 재구성
- 없으면 원문 핵심만 짧게 + details 참고 자료
- draft 보류 글은 건드리지 않음

우선 손보면 좋은 후보(예제 부재·얇은 본문 쪽):

- Messaging: Kafka, Pulsar, Dialogflow/Webex 일부
- Infrastructure: S3·EKS·VPC·Docker 설치류 중 링크 위주였던 글
- Tooling: Jenkins 외 CI/도구 글 중 개요만 있는 것

### 3. 원문 접근 불가 URL

수집 시점 HTTP 실패 URL은 링크만 유지한 상태입니다.
집에서 브라우저로 다시 열고, 되면 본문을 보강하면 됩니다.
대표는 worklist의 「원문 접근 불가」 절.

### 4. 선택

- harness 매핑/카탈로그와 실제 경로 불일치가 보이면 짧게 맞춤
- 이미지 깨짐·상대 경로만 보이면 해당 글만 수정
- 커밋은 논리 단위로 나누기 (이미 푸시된 것과 섞지 말 것)

## 글 쓸 주제 (2026-11, 하네스 잔여)

2026-11-09 일괄(index·Database 입구·PageQuery·ADR-0012~14·트레이스·RestClient vs Istio·`spring-messaging-saga`) **밖**에 남은 주제입니다.
구현 백로그가 아니라 **문서·글** 후보입니다.

| 주제 | 어디에 쓸지 (힌트) | 메모 |
|------|-------------------|------|
| Controller Advice + messages | **분리 완료:** [허브](/docs/knowledge/backend/controller/controller-advice-and-messages) + 하위 5글. 하네스 필독 아님 | 열린 결정·퇴고·템플릿 승격은 선택 |
| Facade·Service·Entity·Repository 블로그화 | **1차 작성·필독 아님 명시:** 원셋에 구현 있음. Knowledge는 깊이용 | 남은 큐: Service jpa-internals·outbound·testing, S2 전파·롤백, Entity lifecycle. 밀도 퇴고 |
| Spring Data JPA 공식 목차 → 쓸 글만 | [repository-design 표](/docs/knowledge/backend/repository/repository-design). **필수 남음:** Spec 보강, Query Methods. **쓸 것 남음:** QBE, Transactionality, Auditing. **Locking 작성됨** (`LockModeType`·`@Version`/`@Lock`). 이미 있음: Custom, Page/Slice | 필독 아님 |
| SDD + SSOT 기술 블로그 | `docs/blog` (또는 Knowledge 에세이) | Advice·층 블로그와 별개 큐. 하네스 필독 아님 |
| 배치·스케줄과 알림 재발송 | db-design partition-ops / 운영 한 절, 또는 알림 ADR 보완 | Quartz·파티션 배치 자리. 알림은 outbox 없음(ADR-0012) → 실패분 배치 재발송할지 |
| decisions index 옛 상대 링크 | `docs/decisions/index.md` | ADR-0001~0009 루트 상대 경로 깨짐. 0010 스타일로 경로만 맞춤 |
| event-saga 적용 근거 (구현 후) | `spring-messaging-saga` · own-events-outbox | 코드/호스트 구현이 생긴 뒤에야 적용 근거로 씀. 지금은 레시피만 |

### Controller Advice (완료 메모)

Knowledge 허브 + 하위 5글로 분리함.
자산 맵만 링크. 하네스 필독 승격 없음.
열린 결정·템플릿 승격은 위 표 메모 참고.

### SDD + SSOT 블로그 (큐)

Spec-Driven Development와 Single Source of Truth를 **한 편의 기술 블로그**(또는 Knowledge 에세이)로 쓸 후보입니다.
Advice 분리와 별개입니다.
하네스 Layout·ONESET 필독에는 넣지 않습니다.
쓸 때 [글쓰기 기준 — Knowledge 분량](/docs/harness/context/writing-conventions)과 웹 검색 보강을 따릅니다.

**의도적으로 안 적는 것 (글 주제 아님)**

- 권한·멀티테넌시 → 게이트웨이 제품 쪽
- pcs 인프로세스 outbox / 게이트웨이 `@Async` → 제품 로컬
- Flyway 승격 → ADR-0013으로 비기본 확정

운영: `main`에 미푸시 커밋이 있으면 push는 별도 요청 시.

## 검증

```bash
cd /Users/wonseok/Documents/workspace/docusaurus-archive
npm run build
```

## 하지 말 것

- 보류 draft를 임의로 `draft: false`로 바꾸기
- 부트베이스·팜프로·노션 원본 수정
- 검증 생략을 통과로 적기
