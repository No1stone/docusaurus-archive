# Spring ExampleItem 원셋

> **개요:** 테이블 한 세트의 구현, 단위·시나리오 테스트, API E2E입니다.
> 복사·치환·실행 순서는 [`ONESET.md`](./ONESET)입니다.

## 맵

| 구분 | Path | 설명 |
|------|------|------|
| 도메인 원셋 | [exampleitem/](./exampleitem/) | Controller·Facade·dto·persistence·display |
| Support | [support/](./support/) | 공통 타입 (`BizEnum`, Entity 감사 등) |
| Testing / E2E | [testing/](./testing/), [e2e/](./e2e/) | 단위·시나리오·API 컬렉션 |
| **공유 라이브러리** | [lib-cache/](./lib-cache/) | CachePort(Lettuce). 도메인 없음 |
| | [lib-distributed-lock/](./lib-distributed-lock/) | LockPort(Redisson). 도메인 없음 |
| | [lib-message-routing/](./lib-message-routing/) | Rabbit 실시간·명령 |
| | [lib-message-saga/](./lib-message-saga/) | 오케스트레이션 Saga · REST/gRPC 발행 + 컨슘 (event-saga) |
| **적용 변형** | [enum/](./enum/) | `@BizEnum` (ExampleItem 전체 예) |
| | [cache/](./cache/) | `@Cacheable` → CachePort (Facade·TTL) |
| | [lock/](./lock/) | `lib-distributed-lock` + JWT sync **구현체** 예. ExampleItem 락 원셋 없음 |
| | [outbound-rest/](./outbound-rest/) | 타임아웃·로그 + ExampleItem Client (복사 예제, 라이브러리 아님) |

```text
공유 라이브러리 (호스트 1회)     도메인/기능 변형 (필요할 때)
─────────────────────────     ──────────────────────────
lib-cache          ───예──→   cache/   (Member·ExampleItem)
lib-distributed-lock ─예──→   lock/    (JWT sync 발췌만)
lib-message-routing           Rabbit · 실시간·명령
lib-message-saga              Kafka · 자기 이벤트 (REST/gRPC 발행 + 컨슘) · event-saga
support + BizEnumProcessor →  enum/
                              outbound-rest/  (복사 예제 · 공유 lib 아님)
```

## 도메인 원셋

```text
Controller → ExampleItemFacade → ExampleItemPort → ExampleItemAdapter → Repository
                ↓                     persistence/
         DisplayNameResolver (조회 후 Name 표시명)
tests: FacadeTest, AdapterTest, ScenarioTest
```

Inbound Port는 두지 않습니다. Outbound(영속·HTTP client)만 Port·Adapter입니다.
모노리포: model에 DomainFacade·dto·persistence, api에 진입·BffFacade.
안내는 [ONESET.md](./ONESET)입니다.

## 공유 라이브러리

도메인·ExampleItem과 무관합니다. 호스트에 동일 스택이 없으면 **한 번** 둡니다.

- [lib-cache/](./lib-cache/) — `@Cacheable` / CachePort / JSON. Redis는 **Lettuce**.
- [lib-distributed-lock/](./lib-distributed-lock/) — `LockPort` / `LockResult` / watchdog. Redis 락은 **Redisson**.
- [lib-message-routing/](./lib-message-routing/) — Rabbit 실시간·명령.
- [lib-message-saga/](./lib-message-saga/) — 전통 오케스트레이션: 앱은 REST/gRPC 발행 + Kafka 컨슘, event-saga는 Outbox+지휘. [own-events-outbox](/docs/patterns/architecture-patterns/own-events-outbox).

캐시와 락, 라우팅(Rabbit)과 자기 이벤트(Kafka) 모듈을 서로 섞지 않습니다.

## 적용 변형

기본 원셋에는 이넘·캐시·락·outbound 클라이언트 코드를 넣지 않습니다. 필요할 때만 얹습니다.

| 변형 | 전제 | 내용 |
|------|------|------|
| [enum/](./enum/) | support + 프로세서 | 컬럼 `@BizEnum` 전체 예 |
| [cache/](./cache/) | [lib-cache/](./lib-cache/) | Facade `@Cacheable`·TTL. Name IN은 미캐시 |
| [lock/](./lock/) | [lib-distributed-lock/](./lib-distributed-lock/) | 라이브러리 전제 + JWT sync 구현체(`LockPort` 주입). ExampleItem 락 원셋 **없음** |
| [outbound-rest/](./outbound-rest/) | (없음 · 복사 예제) | 타임아웃·로그 + 원셋 `/example-items` Client. 인증 헤더 없음 |

키·무효화·호스트 체크리스트는 [coding-conventions](/docs/harness/context/coding-conventions)를 봅니다.
