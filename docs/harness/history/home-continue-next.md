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
| Controller Advice + messages | **초안 작성됨:** [controller-advice-and-messages](/docs/knowledge/backend/controller/controller-advice-and-messages). `index/backend` 인덱싱. 하네스 필독 아님 | 열린 결정(모노리포 messages 소유, 200+body, i18n 기본 등)은 글 안 “열림”. 퇴고·템플릿 승격은 선택 |
| 배치·스케줄과 알림 재발송 | db-design partition-ops / 운영 한 절, 또는 알림 ADR 보완 | Quartz·파티션 배치 자리. 알림은 outbox 없음(ADR-0012) → 실패분 배치 재발송할지 |
| decisions index 옛 상대 링크 | `docs/decisions/index.md` | ADR-0001~0009 루트 상대 경로 깨짐. 0010 스타일로 경로만 맞춤 |
| event-saga 적용 근거 (구현 후) | `spring-messaging-saga` · own-events-outbox | 코드/호스트 구현이 생긴 뒤에야 적용 근거로 씀. 지금은 레시피만 |

### Controller Advice 글에 넣을 것 (팜프로 개념, 제품명 없이)

**배치:** Knowledge에 둔다. 자산 맵(`index/backend.md` 등)에 링크만 건다.
하네스 Layout·ONESET·coding-conventions·오케스트레이션 기본 assembly에는 **넣지 않아서** 에이전트가 필수로 읽지 않게 한다.
Controller 설계 Knowledge를 통째로 키우지 말고, Advice·messages 축은 **별도 Knowledge 페이지**(또는 짧은 묶음)로 뺀다.

`@RestControllerAdvice` + messages 설정으로 예외→응답을 모은다는 축만 쓴다.
스케치 근거는 FarmPro `CommonExceptionAdvice` · `MessageUtils` / MessageSource 쪽이다.

쓸 내용 후보:

- **messages 설정** — `MessageSource` / messages 프로퍼티(또는 동등)로 코드·검증 메시지를 중앙화. Advice는 예외 타입·코드로 메시지를 고른다
- **메시지 작성 단위 (열림·선택)** — DTO·검증 **레벨(필드/클래스)별로** messages를 둘 수도 있고, **이넘·응답 코드식**으로 묶어 둘 수도 있다. 글에서 두 방식을 표로만 대비하고, 호스트가 고르게 둔다
- **Advice가 하는 일** — 예외 → HTTP status + `CommonResponse`(또는 호스트 공통 응답). Controller에 `try/catch` 비즈니스 매핑을 두지 않음 ([controller-design](/docs/knowledge/backend/design/controller/controller-design)과 맞춤)
- **예외 계층** — 업무 Error / Warn / Known(또는 동등) 구분. 로그 레벨(error vs warn)과 클라이언트에 노출할 문구를 나눔. 로컬·dev에서만 상세 메시지
- **Runtime vs Checked** — 업무 예외는 사실상 Runtime 계열로 전파하는 전제. Checked를 Advice 경로에 억지로 끼우지 않음. TX `rollbackFor`와 맞는지 한 줄
- **검증** — `MethodArgumentNotValidException` 등 → 필드·코드 → messages로 풀어 `INVALID_PARAMETER`류
- **검증 스택 차이·사용성·튜닝** — Spring Validation / Jakarta(또는 구 javax) Bean Validation 역할 구분, `@Valid`·그룹·커스텀 제약, 메시지 키·번들 튜닝, 목록·중첩 DTO에서의 동작. Advice 글에 표 하나로 묶거나 짧은 별절. “셋이 같다”로 쓰지 말 것
- **보안·인프라 예외** — 인증·인가·404·업로드 한도 등 타입별 handler (상태 코드 표)
- **예외·HTTP 종류와 상태 코드** — Spring/서블릿 HTTP 예외, 업무 예외, 검증 예외 등 **종류별** 대응. 상태 코드를 Advice·커스텀으로 고정하는 경우. **2xx / 3xx / 4xx / 5xx**가 API에서 무엇을 뜻하는지(성공·리다이렉트·클라이언트 잘못·서버/미처리)와, 우리 공통 응답이 body로 업무 코드를 실을 때 HTTP status와 어떻게 맞출지. “전부 200 + body code” 같은 호스트 관례가 있으면 명시
- **원인 탐색** — 래핑된 예외에서 업무 예외를 찾아 재매핑하는 패턴이 있으면 짧게
- **모놀리식 vs 모노리포 (의사결정 필요)** — 공통코드·공통 메시지·예외 전파는 모놀리식에서는 한 앱 안에 두면 된다. **모노리포(api / model 분리 등)** 에서는 메시지 번들·공통 예외·Advice를 **어느 모듈이 소유**하고 어떻게 공유·버전할지 결정이 필요하다. 글 또는 짧은 ADR 후보로 열어 둔다 (지금은 확정하지 않음)
- **유스케이스에서 예외를 던질 때** — Facade·유스케이스가 업무 예외를 throw 하는 것만으로 끝나지 않는다. 메시지 코드·인자·Error/Warn 구분을 **어디서 채울지**, TX 롤백과 Advice 매핑이 맞는지, BFF가 여러 도메인 호출을 묶을 때 예외를 삼키거나 바꾸지 않는지. “simply throw”만 적으면 구멍이다
- **try / catch / finally** — Controller·Facade에서 언제 try-catch 하는지(거의 Advice에 맡김), catch에서 삼키거나 래핑만 하는 경우의 해악, `finally`로 닫을 자원·MDC·스레드 로컬. try-with-resources와 역할 구분. Advice 경로와 겹치지 않게 짧게
- **i18n / Locale** — messages·검증 문구를 로케일별로 국제화할지, API는 단일 로케일만인지. Accept-Language·기본 로케일·모노리포에서 번들 위치
- **낙관적 락** — 원셋·호스트에 이미 쓰는 `ObjectOptimisticLockingFailureException`(또는 동등) → Advice에서 재시도 유도 vs 재조회 안내, HTTP·업무 코드. “적용되어 있으니 글에도 있어야 함”
- **Filter / Interceptor vs Advice** — 인증·인가 실패가 Security 필터·인터셉터에서 끝나는지, 예외가 Advice까지 오는지. 필터에서 직접 쓰는 응답과 Advice 공통 엔벨로프가 어긋나지 않게
- **비동기 · ThreadLocal · `@Async` 예외** — 스레드가 바뀌면 MDC·ThreadLocal·Advice에 안 잡히는 경우. AsyncUncaughtExceptionHandler(또는 동등)와 MVC Advice 전제를 구분. 비동기에서 삼킨 예외
- **Feign / RestClient와 인터셉터** — 클라이언트에 인터셉터·객체가 겹쌓이면 커스텀·예외 매핑이 어려웠던 경험. **나가는 호출 로그 중앙화**(outbound-rest 한 줄 로그 등)와 맞물림. 다운스트림 4xx/5xx → 우리 예외·메시지. [RestClient vs Istio](/docs/patterns/architecture-patterns/restclient-vs-istio-retries)·트레이스와 연결
- **상관 ID** — 에러 응답·로그에 traceId/spanId를 실어 FE·지원이 맞출 수 있게. [W3C 트레이스](/docs/patterns/architecture-patterns/trace-propagation-w3c) · ADR-0014와 **반드시 한 줄 연결**
- **응답 엔벨로프** — `CommonResponse`(또는 호스트 공통) vs RFC 7807 Problem Details. **장단점** 표. “전부 200 + body code” 관례와의 관계
- **테스트** — Advice·검증 메시지·상태 코드 스모크를 슬라이스/`@WebMvcTest`·원셋 시나리오에서 어떻게 볼지. 미실행은 통과로 적지 않음
- **하지 말 것** — Advice에 도메인 유스케이스·DB 로직. 메시징/사가 실패와 알림 best-effort를 여기 섞지 않음 (ADR-0012)

원셋·support에 Advice **코드 템플릿**을 올릴지는 글 쓸 때 결정. 올려도 복사는 선택, 필독은 아님.
글이 커지면 Knowledge 안에서 **Advice 본편 + 검증/엔벨로프**로만 나눈다. 하네스 필독으로 승격하지 않는다.

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
