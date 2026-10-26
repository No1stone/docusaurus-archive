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
Controller → 공개 애플리케이션 진입점(기본 Facade) → Port → JPA Adapter → Repository
                                                         ↓
                                              (CQRS 적용점) Read / Command Provider로 분리 가능
                                                         ↓
                                                    Spec.of(Filter)
support: CommonResponse, BizErrorException, ModelMapperUtil, BeanUtils, PredicateBuilder
enum apply: templates/backend/spring/enum
```

| Layer | Owns | Must not |
|-------|------|----------|
| Controller | HTTP binding, wrap `CommonResponse`, `@Hidden` on the table entrance | Business rules, call Repository, open transactions |
| Application (often Facade) | Use case flow, call Port. On enum apply, set `getCode()` back onto the String DTO | Touch JPA entities, call Repository, call Specs, depend on Adapter types, choose read vs write datastore |
| Port | Persistence or external capability contract | Know HTTP or JPA types |
| JPA Adapter | `Specs.of(Filter)`, `map` / `mapAll`, `BeanUtils.map` on update, `entity.delete()`. **CQRS 적용점**: optional Read / Command Provider over Repository | Know about HTTP, own multi-Port business flows |
| Provider | Tech access behind any Adapter: JPA read/command repo, `RedisProvider`, `VaultProvider`, etc. Swap Provider without changing Port | Business orchestration; appear in Port type names |
| Repository | `JpaRepository` + empty custom repository + `JpaSpecificationExecutor` | Derived query methods, business logic, mapping |

Port names describe capability (`CachePort`, `EncryptionPort`, `TokenPort`, `OAuthPort`, `MessagingPort`), not vendor (`RedisPort`, `VaultPort`, `KeycloakPort`, `KafkaPort`).
Adapter implements Port and selects Provider (`RedisProvider`, `VaultProvider`, `KeycloakProvider`, custom JWT Provider, `KafkaProvider`, `RabbitMqProvider`, STOMP / WebSocket Provider, etc.).
See [adapter README](/docs/harness/templates/backend/spring/exampleitem/persistence/).

Controller may call only a published application entry (usually Facade).
Application may call only Port of its domain.
Skipping a layer is a Reviewer `high` finding.
Legacy `*Service` classes that only wrap JPA are Adapters by role.

## Naming

| Thing | Convention | Example |
|-------|------------|---------|
| Request DTO holder | `{Domain}Req` with inner static classes | `ExampleItemReq.Ids`, `Filter`, `Create`, `Update` |
| Response DTO holder | `{Domain}Res` with inner static classes | `Id`, then `Name`, then `Single`, then `Item` |
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
