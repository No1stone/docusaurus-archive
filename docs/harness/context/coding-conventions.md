# Coding Conventions

> **개요:** 공통 구현 규칙입니다.
> 템플릿 `ExampleItem` 테이블 세트와 enum 적용 세트에 이미 있는 규칙을 글로 풀어 둔 것입니다.
> Implementer는 이 문서와 템플릿을 그대로 따릅니다.
> 예제 소스에서 메서드나 필드를 생략하지 않습니다.

Shared implementation conventions for agent-assisted work. Every rule here is **already visible in code** under [`templates/backend/spring/`](/docs/harness/templates/backend/spring/README); this page states the rule so a worker does not have to infer it. When this page and the template disagree, report it — do not pick one.

Project-local rules always win over this page (see [precedence](/docs/harness/context/precedence)).

## Layering

계층은 접미사가 아니라 책임과 의존으로 구분합니다.
자세한 기준은 [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design), [데이터 접근 경계](/docs/knowledge/backend/service/service-design), [ADR-0010](/docs/decisions/adr-0010)을 봅니다.

```text
[api]  HTTP·gRPC 도메인 진입 ──→ {Domain}Facade ──→ DomainPort → Adapter → Spec
[api]  GraphQL·HTTP BFF 진입 ──→ {Feature}BffFacade ──→ DomainAPort, DomainBPort
                                         ↓                      ↓
                              DisplayNameResolver      (model에 두는 도메인 계약)
```

| Layer | Owns | Must not |
|-------|------|----------|
| 진입 (Controller / GraphQL Resolver / gRPC service) | 바인딩만. `CommonResponse` 등 프로토콜 응답 | Business rules, Repository, open transactions beyond Facade |
| `{Domain}Facade` | 한 도메인 Port CRUD·상태 유스케이스. 조회 직후 `DisplayNameResolver`. enum 시 `getCode()`를 String DTO에 되돌림 | Adapter·entity·Spec·Repository. 다른 도메인 Adapter |
| `{Feature}BffFacade` | 여러 DomainPort로 화면·시나리오만 조립 | Adapter·entity·Spec·Repository. 도메인 규칙을 BFF에 재구현. BFF 전용 Port 신설 |
| Port | 영속·외부 능력 계약. BFF·다른 모듈이 보는 도메인 경계 | HTTP·JPA 타입 |
| JPA Adapter | `Specs.of(Filter)`, `map` / `mapAll`, `BeanUtils.map` on update, `entity.delete()`. **CQRS 적용점**: optional Read / Command Provider | HTTP, multi-Port 비즈니스 흐름 |
| Provider | Adapter 아래 기술 접근 (`RedisProvider`, `VaultProvider`, …) | Port 이름에 제품명 |
| Repository | `JpaRepository` + empty custom + `JpaSpecificationExecutor` | Derived query, business logic |

Port names describe capability (`CachePort`, `EncryptionPort`, `TokenPort`, `LockPort`, …), not vendor.
See [adapter README](/docs/harness/templates/backend/spring/exampleitem/persistence/).

진입은 Facade / BffFacade만 호출합니다.
`{Domain}Facade`는 자기 도메인 Port만, `{Feature}BffFacade`는 DomainPort와 `DisplayNameResolver`만 봅니다.
Skipping a layer is a Reviewer `high` finding.
Legacy `*Service` that only wraps JPA → Adapter by role.

### Facade vs BffFacade (이름과 위치)

이름은 `Facade` / `BffFacade`면 충분합니다.
`UseCase`·`Orchestrator` 등 접미를 더 늘리지 않습니다.
호스트에 이미 다른 이름이 있으면 호스트를 따릅니다.

| | `{Domain}Facade` | `{Feature}BffFacade` |
|--|------------------|----------------------|
| 책임 | 도메인 속성 유스케이스 | 여러 DomainPort 조립(화면·시나리오) |
| 모노리포 위치 | **model** (`lib-model`, 도메인 패키지) | **api** |
| 모놀리식 위치 | 도메인 폴더 `facade/` (원셋) | 앱의 BFF·feature 패키지 |
| 의존 | 자기 Port + `DisplayNameResolver` | DomainPort들 + `DisplayNameResolver` |
| 누가 호출 | HTTP 도메인 Controller, **gRPC** | **GraphQL**, HTTP BFF |
| 원셋 | ExampleItem | 코드 없음. 이 표만 |

`DisplayNameResolver`는 DomainFacade와 같이 **model**(또는 모놀리식 도메인 `support/display`)에 둡니다.
`UserNameFacade`처럼 표시명 전용 Facade는 두지 않습니다.

도메인이 바깥에 내주는 계약의 기본은 **Port**입니다.
BffFacade는 DomainPort를 주입받아 쓰고, BFF 전용 Port를 새로 만들지 않습니다.
api의 도메인 Controller·gRPC는 model의 `{Domain}Facade`를 호출합니다.

### GraphQL / gRPC 진입

| 진입 (api) | 호출 | 비고 |
|------------|------|------|
| GraphQL | `{Feature}BffFacade` | 시나리오 조립 |
| gRPC | `{Domain}Facade` (model) | 도메인 proto ↔ 도메인 유스케이스 |
| HTTP 도메인 API | `{Domain}Facade` (model) | ExampleItem 원셋 Controller |
| HTTP BFF API | `{Feature}BffFacade` | GraphQL과 같은 층 |

나가는 gRPC는 `*ClientPort` / `*ClientAdapter`로 두고, Facade·BffFacade는 그 Port만 봅니다.
원셋에 GraphQL·gRPC 코드는 두지 않습니다.

### Repository layout (모놀리식 vs 모노리포)

계층은 같고 **모듈·폴더**만 갈라집니다.
복사 상세는 [ONESET.md](/docs/harness/templates/backend/spring/ONESET)입니다.

| | 모놀리식 | 모노리포 |
|--|----------|----------|
| api / 앱 | 진입(Controller 등) + 필요 시 `{Feature}BffFacade`. 원셋은 확인용 Controller를 도메인 트리에 둠 | 진입 + `{Feature}BffFacade` |
| model | (같은 앱 안 도메인 폴더) `{Domain}Facade`, `DisplayNameResolver`, dto, Port, Adapter, entity, repository, spec | 동일 구성을 `lib-model`에. 패키지 도메인만, 모듈 쪼개지 않음 |
| REST 연동 | 앱 `client/` 등 | 별도 lib(이름 예: `lib-rest`) |
| `@BizEnum` 생성물 | 소스에 두지 않음. `clean` 후 재생성 | 동일. 모듈 경계와 별개 |
### Audit

- `BaseEntity` → `AuditingEntityListener` + `BaseEntityListener`
- 등록만: `CreatedEntity`. 수정까지: `UpdatedEntity` (`updatedAt` / `updatedBy` / `version`)
- String PK 자동 생성·서비스 id는 `IdGeneratable` / `ServiceProviderble` + Listener

### Display names

- 클래스 이름은 `DisplayNameResolver`로 통일합니다. `UserNameFacade` / `FarmNameFacade`처럼 도메인 접두를 붙이지 않습니다.
- 위치는 DomainFacade와 같이 model(모놀리식은 도메인 `support/display`)입니다.
- DomainFacade·BffFacade가 조회 직후 `applyCreatedByDisplayNames` / `applyAuditorDisplayNames`를 호출합니다.
- Name 맵은 Port Name 조회(`findAllName` + `Filter.ids`, 또는 동등한 ids Name 조회)로 채웁니다. Item `findByIds`로 대체하지 않습니다.

## Naming

| Thing | Convention | Example |
|-------|------------|---------|
| Request DTO holder | `{Domain}Req` with inner static classes | `ExampleItemReq.Ids`, `Filter`, `Create`, `Update` |
| Response DTO holder | `{Domain}Res` with inner static classes | `Id`, then `Name`(표시 필드), then `Single`, then `Item` |
| Display name helper | `DisplayNameResolver` | `applyCreatedByDisplayNames`, `findNameMap` |
| Domain application entry | `{Domain}Facade` (model) | `ExampleItemFacade` |
| BFF application entry | `{Feature}BffFacade` (api) | `CheckoutBffFacade` (원셋 코드 없음) |
| Facade / Controller method | same plain name on both | `search`, `save`, `saveAll`, `findById`, `saveById`, `deleteById`, `findAll`, `findByIds`, `searchName`, `findAllName`, `deleteByIds` |
| Port / JPA Adapter method | the same list, unchanged when an enum is applied | `search`, `save`, `saveAll`, `findById`, `saveById`, `deleteById`, `findAll`, `findByIds`, `searchName`, `findAllName`, `deleteByIds` |
| Specification holder | `{Domain}Specs.of(Filter)` only | `ExampleItemSpecs.of` |
| Entity table | `{prefix}_{snake_name}` | `le_example_item` |
| Enum | `@BizEnum` + `CodeValue` + `code` / `value` | `EnHttpMethod`, shared `EnYn`, `EnStatus` |

One holder class per domain per direction. Do not scatter `CreateExampleItemRequest`-style top-level classes.

## DTO rules

- The template uses Lombok `@Data`. Match the host project when it differs.
- Req inner classes are only `Ids`, `Filter`, `Create`, `Update`.
- Res inner classes are only `Id`, `Name extends Id`, `Single extends Name`, `Item extends Single`.
- `Name` holds the display field used by `DisplayNameResolver` / `searchName` (ExampleItem은 `url`).
- `Filter` has `id`, then `ids`, then the column filters, then `startAt` and `endAt`.
- Enum columns stay `String` on every DTO. Do not store `enum.name()`.
- Paging is Spring `Pageable` on the controller. Do not add a `PageQuery` type.

## Transactions

- Class-level `@Transactional(readOnly = true, transactionManager = "transactionManager")` on both Facade and JPA Adapter.
- Write methods override with `@Transactional` at the method.
- Adapter transactions join the Facade. Do not start a transaction in the Controller.

## Persistence

- Repository = `JpaRepository` + an empty custom repository + `JpaSpecificationExecutor`. No derived query methods. Single get is `findById`.
- `findByIds` and `deleteByIds` fill `Filter.ids` and call `Specs.of`. If `ids` is null or empty, return without querying.
- One spec factory: `of(Filter)`. `equal` per column, `in` on `id` for `ids`, `goe` / `loe` on `CreatedEntity.createdAt` for `startAt` / `endAt`.
- `delete()` is empty until a status column exists. Do not call `repository.delete`.
- A column with a database `DEFAULT` has no field initializer and no `@Builder.Default`. `@DynamicInsert` omits the null column so the database default is stored.
- Enum equality in a spec passes the enum from `ofNullable`, not the raw string. See the enum template.

## Partial update

`saveById` loads the entity and calls `BeanUtils.map(update, entity)`.
Null and blank strings are not updates.
Never overwrite with null on update.

## Mapping

- `ModelMapperUtil.map` and `mapAll` convert DTO ↔ entity and entity → `Res`.
- On enum apply, `BizEnumProcessor` emits `_Enum` with `@Converter(autoApply = true)`. JPA loads that class. Its static block registers two converters on `ModelMapperUtil.modelMapper`: enum to `getCode()`, and `String` to `of(code)`.
- Do not add `static { new _Enum(); }` on the enum.
- Do not add a conversion method on the JPA Adapter. The full processor is in the enum template.
- Prefer the host `ModelMapperUtil` when the project already has one.

## Errors and responses

- Business failures throw `BizErrorException(ResponseType.X)`. No ad-hoc `RuntimeException("not found")`.
- `ResponseType` is the single enum of business outcomes; add a value rather than reusing `UNDEFINED`.
- Every Controller method returns `CommonResponse<T>` through `CommonResponseUtils.responseSuccess(...)`. Void writes return `responseSuccess()`.
- Exception → HTTP mapping belongs to a global handler (`@RestControllerAdvice`), not inside Controllers.

## Testing

- Follow tests the target repo already has.
- The Spring template does not include a test slice.
- When the repo uses Mockito, mock the next layer only: Facade tests mock Port, JPA Adapter tests mock Repository.

## Prose

문서를 작성하거나 수정할 때는 [글쓰기 기준](/docs/harness/context/writing-conventions)을 확인합니다.
코드 구현 규칙은 이 문서의 나머지 절입니다.

## General

- Match the target project's existing style when contributing there; these conventions are the default, not an override.
- Prefer clarity over clever abstractions; a repeated three-line block beats a generic helper nobody can name.
- Keep harness rules separate from project-local rules.
- No credentials, real hostnames, or customer domain terms in anything promoted to the archive.
