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
- Architecture cast → Transport 유니/브로드/멀티, 작업도커 → docker 설치 병합
- Architecture AI Development (TDD, SDD) 글
- 11-09 이후 Backend design, 알림 Knowledge SEO keywords와 Docs keywords JSON-LD
- MySQL 임시 테이블 사용법 (`design/temporary-tables`)
- 아키텍처 글감 컨티뉴 목록(목차, 예정 위치)

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

### 5. 제품·기능 개발 큐

아카이브 글 주제와 별개로, 제품 쪽에서 이어서 할 기능입니다.

| 항목 | 메모 |
|------|------|
| SSE (Server-Sent Events) | Knowledge: [SSE로 인앱 알림 배지 갱신](/docs/knowledge/backend/notification/sse-inapp-badge) 작성됨. 제품 연동과 같이 본다. |
| 알람 뱃지 기능 개발 | 미읽음, 알림 수 뱃지. [알림](/docs/knowledge/backend/notification/index) 설계 글 기준으로 제품 구현. |

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
| SSE, 알림함, 푸시 | [알림](/docs/knowledge/backend/notification/index) | 설계·알림함·SSE·푸시 글 작성됨. 제품 뱃지 개발과 같이 본다 |

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

## DB·쿼리 튜닝 — 큰 목차 (할 일)

Knowledge 허브: [DB 성능 튜닝](/docs/knowledge/data/db-performance-tuning) (`data` 아래, SQL / Ops와 같은 깊이).
표의 「들어갈 글」이 세부 작성 할 일입니다. 허브와 이 표를 같이 유지합니다.

| 큰 목차 | 무엇을 바꾸나 | 들어갈 글 |
|---|---|---|
| **병목 진단** | 어디서 시간이 걸리는지 확인 | 슬로우 쿼리, 실행 계획, 락 대기, 커넥션 풀 대기 |
| **쿼리와 인덱스 튜닝** | 같은 데이터를 읽고 쓰는 방법 | 복합 인덱스 순서, 검색 조건과 정렬, N+1과 일괄 조회, 다중 조인 벌크 갱신 |
| **조회 모델 설계** | 조회 시 조합할 데이터와 미리 저장할 데이터의 경계 | `UNION ALL`을 View로 묶은 경험, 역정규화 테이블로 조회를 단순화한 경험 |
| **데이터 배치와 분산** | 데이터가 쌓이고 조회되는 단위 | 월별 파티셔닝, `pmax`와 보관 정책, 팜프로 테이블 샤딩, DB 샤딩 |
| **쓰기와 동시성 튜닝** | 한 번에 처리할 작업량과 트랜잭션 범위 | 대량 갱신 분할, 락 범위, 배치 실패와 재처리 |

연계: 조회 모델 View 사례는 [Union All](/docs/knowledge/k-union-all), 이후 방향은 역정규화. 파티션은 [PARTITION](/docs/knowledge/k-partition) 등 기존 글과 이어서 채웁니다.

## 아키텍처 글감

Architecture에 둘 글의 **목차와 예정 위치**만 적습니다.<br />
본문 작성은 별도 패스입니다.<br />
패턴 자체(Saga, Outbox, Fan-out, CQRS)는 이미 [아키텍처 패턴](/docs/patterns/architecture-patterns)에 있으면 그 글을 연결합니다.

**첫 작성 후보:** 「모놀리스, 모듈러 모놀리스, MSA의 경계」<br />
**다음 후보:** 「모노리포에서 산출물과 버전을 따로 관리하기」

| 큰 목차 | 글 제목 | 예정 위치 | 연결할 기존 글 |
|---|---|---|---|
| 서비스 구성 | 모놀리스, 모듈러 모놀리스, MSA의 경계 (첫 작성 후보) | `docs/architecture/service-topology/` | — |
| 서비스 구성 | MSA로 분리하는 기준 | `docs/architecture/service-topology/` | — |
| 서비스 구성 | 단일 인스턴스와 다중 인스턴스 | `docs/architecture/service-topology/` | — |
| 애플리케이션 구조 | 계층형 아키텍처 | `docs/architecture/application-structure/` | [Controller](/docs/knowledge/backend/controller/index), [Facade](/docs/knowledge/backend/facade/index), [Service](/docs/knowledge/backend/service/index) |
| 애플리케이션 구조 | 경량 헥사고날 | `docs/architecture/application-structure/` | [진입과 이름](/docs/knowledge/backend/facade/facade-entry-and-naming), [ADR-0010](/docs/decisions/adr-0010) |
| 애플리케이션 구조 | 도메인 Facade와 BFF | `docs/architecture/application-structure/` | [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design), [ONESET](/docs/harness/templates/backend/spring/ONESET) |
| 애플리케이션 구조 | Port와 Adapter의 조회, 변경 경계 | `docs/architecture/application-structure/` | [Port와 Adapter 역할](/docs/knowledge/backend/service/service-port-adapter-role), [Provider와 CQRS](/docs/knowledge/backend/service/service-provider-and-cqrs), [CQRS](/docs/patterns/architecture-patterns/cqrs) |
| 저장소와 빌드 | 모노리포와 멀티리포 | `docs/architecture/repo-and-build/` | [coding-conventions 모노리포 표](/docs/harness/context/coding-conventions) |
| 저장소와 빌드 | Gradle 멀티 프로젝트와 Composite Build | `docs/architecture/repo-and-build/` | — |
| 저장소와 빌드 | 모노리포에서 산출물과 버전을 따로 관리하기 (다음 후보) | `docs/architecture/repo-and-build/` | — |
| 서비스 간 통신 | REST와 gRPC | `docs/architecture/service-communication/` | [RestAPI](/docs/knowledge/k-restapi-9f6eac), [CommonRestClient 설계](/docs/knowledge/backend/common/common-rest-client) |
| 서비스 간 통신 | 동기 호출과 이벤트 | `docs/architecture/service-communication/` | [Messaging](/docs/knowledge/messaging/), [Fan-out](/docs/patterns/architecture-patterns/fan-out) |
| 서비스 간 통신 | RabbitMQ와 Kafka를 쓰는 구조 | `docs/architecture/service-communication/` | [RabbitMQ](/docs/knowledge/messaging/rabbitmq/), [Kafka](/docs/knowledge/k-kafka), [lib-message-routing](/docs/harness/templates/backend/spring/lib-message-routing/), [lib-message-saga](/docs/harness/templates/backend/spring/lib-message-saga/) |
| 서비스 간 통신 | 웹훅과 재시도 경계 | `docs/architecture/service-communication/` | `docs/knowledge/messaging/delivery/webhook.md` (게시 보류), [RestClient와 Istio 재시도](/docs/patterns/architecture-patterns/restclient-vs-istio-retries) |
| 데이터와 정합성 | 공유 DB와 서비스별 DB | `docs/architecture/data-consistency/` | — |
| 데이터와 정합성 | 조회 모델 분리 | `docs/architecture/data-consistency/` | [CQRS](/docs/patterns/architecture-patterns/cqrs), [CDC](/docs/patterns/architecture-patterns/cdc) |
| 데이터와 정합성 | 여러 서비스에 걸친 변경과 실패 처리 흐름 | `docs/architecture/data-consistency/` | [Saga](/docs/patterns/architecture-patterns/saga), [Outbox와 Inbox](/docs/patterns/architecture-patterns/outbox-and-inbox), [오케스트레이션 Saga와 Outbox](/docs/patterns/architecture-patterns/own-events-outbox). 오케스트레이션과 코레오그래피는 **Patterns의 Saga 글에서 다룰 항목** |
| 배포와 운영 | Rolling 배포 | `docs/architecture/deploy-and-ops/` | — |
| 배포와 운영 | Blue-Green 배포 | `docs/architecture/deploy-and-ops/` | — |
| 배포와 운영 | Canary 배포 | `docs/architecture/deploy-and-ops/` | — |
| 배포와 운영 | Active-Passive와 Active-Active | `docs/architecture/deploy-and-ops/` | — |
| 배포와 운영 | 장애 격리와 관측 | `docs/architecture/deploy-and-ops/` | [트레이스 전파 (W3C)](/docs/patterns/architecture-patterns/trace-propagation-w3c) |
| AI Development | Template-Driven Development (작성됨) | `docs/architecture/ai-development/template-driven-development.md` | [Harness Templates](/docs/harness/templates/), [ONESET](/docs/harness/templates/backend/spring/ONESET) |
| AI Development | Specification-Driven Development (작성됨) | `docs/architecture/ai-development/specification-driven-development.md` | [SDD 워크플로](/docs/harness/workflows/sdd/), [SDD 템플릿](/docs/harness/templates/sdd/) |
| AI Development | SSOT와 ADR | `docs/architecture/ai-development/` | [Decisions](/docs/decisions/), 기존 「SDD + SSOT 블로그」 큐 |
| AI Development | 원셋과 검증 흐름 | `docs/architecture/ai-development/` | [Implement](/docs/harness/workflows/implement), [Acceptance](/docs/harness/workflows/acceptance) |

## 후속 (별도 패스)

- 개인 Git 실험 레포(`record2023` 등) 주제 목록화 — 플랜에 수집 중, 표는 아직 미반영
- 부트베이스 전수 리스트화 — 미완

## 검증

```bash
cd /Users/wonseok/Documents/workspace/docusaurus-archive
npm run build
```

## 하지 말 것

- 보류 draft를 임의로 `draft: false`로 바꾸기
- 부트베이스·팜프로·노션 원본 수정
- 검증 생략을 통과로 적기
