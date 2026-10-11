# Coding Conventions

> **개요:** 공통 구현 규칙. 템플릿 `ExampleItem` 슬라이스에 이미 박혀 있는 규칙을 글로 풀어 둔 것. Implementer는 이 문서와 템플릿을 그대로 따른다.

Shared implementation conventions for agent-assisted work. Every rule here is **already visible in code** under [`templates/backend/spring/`](../templates/backend/spring/README.md); this page states the rule so a worker does not have to infer it. When this page and the template disagree, report it — do not pick one.

Project-local rules always win over this page (see [precedence](./precedence.md)).

## Layering

```text
Controller → Facade → Service → Repository
                ↑ support (CommonResponse, BizErrorException, EnStatus, PageQuery, MapperSupport)
```

| Layer | Owns | Must not |
|-------|------|----------|
| Controller | HTTP binding, `@Valid`, wrap response | Business rules, call Repository, open transactions |
| Facade | Use-case composition, **transaction boundary**, Web↔domain DTO conversion | Touch JPA entities directly, call Repository |
| Service | Domain operations on entities, mapping entity → `Res` | Know about HTTP or Web DTOs |
| Repository | `JpaRepository` + `JpaSpecificationExecutor`; derived queries only | Business logic, mapping |

Controller may call only Facade. Facade may call only Service. Skipping a layer is a Reviewer `high` finding.

## Naming

| Thing | Convention | Example |
|-------|------------|---------|
| Request DTO holder | `{Domain}Req` with **inner static classes** | `ExampleItemReq.Create`, `ExampleItemReq.WebListQuery` |
| Response DTO holder | `{Domain}Res` with inner static classes | `ExampleItemRes.Item`, `ExampleItemRes.Id` |
| BFF-facing DTO | `Web` prefix inside the holder | `WebCreate`, `WebUpdate`, `WebCreated` |
| Domain service input | no prefix | `Create`, `Update`, `Filter`, `Ids` |
| Facade / Controller method for a surface | `{verb}For{Surface}` | `searchForWeb`, `createForWeb`, `deactivateByIdsForWeb` |
| Service method | plain verb | `search`, `save`, `saveById`, `findById`, `deleteByIds` |
| Specification holder | `{Domain}Specs`, `final`, private ctor, static factories | `ExampleItemSpecs.forWebList(...)` |
| Entity table | `{prefix}_{snake_name}` | `ex_example_item` |
| Status enum | `En{Name}` with short code + `of(String)` | `EnStatus.ACTIVE("A")` |

One holder class per domain per direction. Do not scatter `CreateExampleItemRequest`-style top-level classes.

## DTO rules

- Plain POJOs with getters/setters; no Lombok assumed in the template (follow the host project if it uses Lombok).
- Validation annotations (`@NotBlank`, …) live on **Web** DTOs only. Domain `Create` / `Update` are trusted inputs.
- `Web*` DTOs own the conversion: `WebCreate.toCreate()`, `WebUpdate.toUpdate()`. Trim strings there.
- List queries extend `PageQuery` and expose `toPageable()`; default size 20, max 100, sort `id DESC`.
- `Res.Id` is the standard "what was written" response; `WebCreated` / `WebUpdated` extend it rather than duplicating fields.

## Transactions

- Class-level `@Transactional(readOnly = true)` on **both** Facade and Service.
- Write methods override with `@Transactional` at the method.
- The Facade is the outer boundary; Service transactions join it. Do not start a transaction in the Controller.

## Persistence

- Repository = `JpaRepository<E, Long>` + `JpaSpecificationExecutor<E>`; add derived queries (`findByIdIn`) only when a Specification does not fit.
- Dynamic filters go into `{Domain}Specs` as composable `Specification` factories. No string-built JPQL in Service.
- **Soft delete only.** Entities expose `delete()` that flips `EnStatus` to `DEACTIVATED`; nothing calls `repository.delete(...)`.
- Status filter convention: `all` means no filter; otherwise `EnStatus.of(code)`.

## Partial update

`saveById(id, Update)` treats **null as "leave unchanged"**. Check each field for null before setting, or use `MapperSupport.copyNonNull`. Never overwrite with null on update.

## Mapping

- Entity → `Res` via `MapperSupport.map` / `mapAll` (stand-in for the host's ModelMapper/BeanUtils). Prefer the host utility when one exists.
- `Res` → entity mapping does not exist; writes go through explicit setters in Service so the write path stays readable.

## Errors and responses

- Business failures throw `BizErrorException(ResponseType.X)`. No ad-hoc `RuntimeException("not found")`.
- `ResponseType` is the single enum of business outcomes; add a value rather than reusing `UNDEFINED`.
- Every Controller method returns `CommonResponse<T>` through `CommonResponseUtils.responseSuccess(...)`. Void writes return `responseSuccess()`.
- Exception → HTTP mapping belongs to a global handler (`@RestControllerAdvice`), not inside Controllers.

## Testing

- Unit tests per Service and Facade; JUnit 5 + Mockito, `@ExtendWith(MockitoExtension.class)`, `@InjectMocks` on the subject, `@Mock` on the next layer down.
- Mock at the **next layer only**: Facade tests mock Service, Service tests mock Repository.
- Use `given(...)` BDD style and `verify(...)` on writes. `@DisplayName` in the host's language.
- Test shape: [`templates/backend/spring/testing/`](../templates/backend/spring/testing/README.md).

## General

- Match the target project's existing style when contributing there; these conventions are the default, not an override.
- Prefer clarity over clever abstractions; a repeated three-line block beats a generic helper nobody can name.
- Keep harness rules separate from project-local rules.
- No credentials, real hostnames, or customer domain terms in anything promoted to the archive.
