# ExampleItem 원셋

> **개요:** 검증된 구현, 단위·시나리오 테스트, Controller API E2E를 한 세트로 둡니다.
> 새 작업에서는 재사용·복사 후 이번 도메인 차이만 채웁니다.
> 대상 저장소 규칙이 이 안내보다 우선합니다.
> 실행 원칙(토큰 최소 경로)은 [`implementer.md`](/docs/harness/agents/implementer)입니다.

## 목표

검증된 구현·단위/통합(시나리오)·내 서버 Controller API E2E를 함께 가져오고, 도메인 차이만 채웁니다.

공통 원셋 E2E는 내 서버 Controller API입니다.
외부 스펙 더미와 RestClient 연동 검증은 원셋에 넣지 않습니다.

## 저장소 유형과 폴더

계층은 같습니다.
갈라지는 것은 **Facade 종류**와 **모노리포에서 모듈 위치**입니다.

```text
[api]  도메인 HTTP·gRPC 진입  → 도메인 진입(model, 기본 Facade) → Port → Adapter → Spec
[api]  GraphQL·HTTP BFF 진입 → BFF 진입(api) → 도메인 진입(들) → …
```

애플리케이션 이름은 **기본 Facade**입니다.
예시는 닫힌 허용 목록이 아니며, 책임이 분명할 때만 Manager, Checker, Handler, Processor, Resolver 등을 씁니다.
원셋 예는 `ExampleItemFacade`입니다.
BFF 조립은 이름이 드러나게 두는 것이 좋고, 기본 예는 `{Feature}BffFacade`입니다.

| | 도메인 애플리케이션 진입 | BFF 애플리케이션 진입 |
|--|-------------------------|----------------------|
| 책임 | 도메인 속성 유스케이스 | 여러 도메인 진입을 묶어 화면·시나리오 조립 |
| 이름 | 기본 Facade | 기본 예 `BffFacade` |
| 모노리포 | **model** | **api** |
| 모놀리식 | 도메인 `facade/` 등 | 앱 BFF·feature 패키지 |
| 호출 | gRPC, HTTP 도메인 | GraphQL, HTTP BFF |
| 의존 | 자기 Port + `DisplayNameResolver` | **도메인 진입만** (Port 없음) |

영속 계약은 **Port**, BFF·다른 앱이 부르는 공개 표면은 **도메인 진입**입니다.
BFF는 DomainPort를 직접 호출하지 않고, BFF 전용 Port도 만들지 않습니다.

```text
저장소 유형
├─ 모놀리식  → 아래 exampleitem/ 한 트리 (원셋 확인용 Controller 포함)
│              + @BizEnum 생성물은 소스에 두지 않고 clean 후 재생성
└─ 모노리포  → api: 진입(Controller·GraphQL·gRPC) + {Feature}BffFacade
               model(lib-model): 도메인 진입(Facade 등), DisplayNameResolver,
                                 dto / Port / Adapter / entity / repository / spec
               (모델은 패키지 도메인만, 모듈로 쪼개지 않음)
               REST 연동은 별도 lib(이름 예: lib-rest) 가능
```

모놀리식은 이 원셋 트리를 그대로 복사합니다.
모노리포는 `facade/`·`support/display/`·`dto/`·`persistence/`를 model로, `controller/`는 api 진입으로 옮깁니다.
`BffFacade`·GraphQL·gRPC 코드 골격은 원셋에 없습니다.
규칙은 [coding-conventions](/docs/harness/context/coding-conventions)와 위 표를 따릅니다.

## 도메인 폴더 구조 (모놀리식·원셋)

실무 도메인 패키지와 같습니다. **ExampleItem** 이 예제 도메인 id 입니다.

```text
exampleitem/
  controller/      # 원셋 확인용 진입 (모노리포: api)
  facade/          # {Domain}Facade (모노리포: model)
  dto/             # 모노리포: model
  persistence/     # 모노리포: model
    ExampleItemPort.java
    ExampleItemAdapter.java
    entity/
    repository/
    spec/
  support/display/ # DisplayNameResolver (모노리포: model)
```

- **Inbound Port 없음** — 진입 → `{Domain}Facade` 또는 `{Feature}BffFacade`
- **Outbound만 Port·Adapter** — `persistence/` (영속), 통신은 `client/` (`*ClientPort` / `*ClientAdapter`)
- **표시명** — 도메인 진입이 `DisplayNameResolver`로 Name 조회 결과를 붙임. BFF는 그 결과를 조합합니다.
  Name 맵은 `findAllName` + `Filter.ids`(IN)만 사용합니다. Item `findByIds`는 쓰지 않습니다.

## 그대로 복사 / 프로젝트별로 채움

### 그대로 가져와 유지

- Controller → Facade → Port → Adapter → Repository 계층과 메서드 골격
- FacadeTest, AdapterTest, ScenarioTest 배치
- E2E 요청 순서: 등록 → 조회 → 수정 → 변경 조회 → 삭제 → 대표 입력 오류 → 없는 id
- `runId`로 실행마다 고유 데이터

### 프로젝트별로 채움

| 항목 | 예제 | 작업 시 |
|------|------|---------|
| 클래스·패키지·테이블 | `ExampleItem`, `le_example_item` | 도메인 규칙 |
| 공개 경로 | `/example-items` | `@RequestMapping` |
| Req/Res 필드 | `httpMethod`, `url`, … | 실제 컬럼·필터 |

## 복사할 파일

### 구현 (필수)

| 원본 | 대상 자리 (예) |
|------|----------------|
| `exampleitem/controller/ExampleItemController.java` | `entrance.{domain}/` |
| `exampleitem/facade/ExampleItemFacade.java` | `{domain}.facade` |
| `exampleitem/dto/*` | `{domain}.dto` |
| `exampleitem/persistence/ExampleItemPort.java` | `{domain}.persistence` |
| `exampleitem/persistence/ExampleItemAdapter.java` | `{domain}.persistence` |
| `exampleitem/persistence/entity/ExampleItem.java` | `{domain}.persistence.entity` |
| `exampleitem/persistence/repository/ExampleItemRepository.java` | `{domain}.persistence.repository` |
| `exampleitem/persistence/spec/ExampleItemSpecs.java` | `{domain}.persistence.spec` |
| `exampleitem/support/display/DisplayNameResolver.java` | 앱 `support.display` (호스트 Port로 Name 맵 교체) |

### 테스트 (필수)

| 원본 | 대상 자리 |
|------|-----------|
| `testing/ExampleItemFacadeTest.java` | 파사드와 같은 패키지 |
| `testing/ExampleItemAdapterTest.java` | persistence 패키지 |
| `testing/ExampleItemScenarioTest.java` | `scenario/{domain}/` |

### Controller API E2E (필수)

| 원본 | 대상 자리 |
|------|-----------|
| `e2e/ExampleItem.api.collection.json` | 프로젝트 컬렉션 폴더 |
| `e2e/ExampleItem.api.environment.json` | 프로젝트 환경 폴더 |

### 조건부

| 원본 | 조건 |
|------|------|
| `enum/` 적용 예 | 컬럼에 `@BizEnum`을 쓸 때 (같은 폴더 구조) |
| `lib-cache/` | `@Cacheable` → CachePort용 공유 모듈이 호스트에 없을 때 1회 (도메인 없음) |
| `cache/` facade·config | 도메인 조회 캐시를 적용할 때 (`lib-cache` 전제) |
| `support/` | 프로젝트에 동일 타입이 없을 때 |

## 실행 순서

```text
1. 구현·테스트·E2E 복사 후 이름·필드·경로·계약 치환
2. ./gradlew test
3. 앱 기동 후 Controller API 컬렉션 실행
4. 실패 시 원인 확인 후 관련 부분만 수정
```

## 오케스트레이션

- 원셋 전체: [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)
- Controller API E2E만: [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)
