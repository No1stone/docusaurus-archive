---
id: controller-design
title: Controller Design
description: Controller layer responsibilities and boundaries
tags:
  - backend
  - api
status: active
slug: "/knowledge/backend/controller/controller-design"
---
# Controller Design

> **개요:** Controller를 어떻게 설계하는지(책임, 경계)입니다.
> Spring MVC 사용법 문서가 아닙니다.
> 짝이 되는 코드 모양은 템플릿 `ExampleItemController`입니다.

How the controller layer is designed: responsibilities and boundaries.

This document is an **engineering concept**, not a Spring MVC tutorial. Framework-specific usage belongs in technology notes when those exist. The concrete code shape is in the template: [`templates/backend/spring/controller/`](/docs/harness/templates/backend/spring/controller/).

## Intent

Define what belongs at the HTTP/API edge and what must stay out of it. The controller is a **thin adapter**: it turns an HTTP request into a call on the application (Facade) and turns the result back into an HTTP response. Nothing it does should be interesting to a unit test; the interesting work is one layer down.

The table entrance controller lives in `entrance.{domain}` with no `controller` subpackage.
It is `@Hidden`.
It is not the partner HTTP contract.
A different contract gets its own controller and path.

## Responsibilities

| Responsibility | How it looks |
|----------------|--------------|
| **Bind** the request | `@RequestBody`, `@ModelAttribute`, `@PathVariable`, `@RequestParam` onto `ExampleItemReq` inner classes and `Pageable` |
| **Delegate** | Exactly one Facade call per endpoint, same method name: `exampleItemFacade.save(create)` |
| **Shape the response** | Wrap the Facade result in `CommonResponse<T>` via `CommonResponseUtils.responseSuccess(...)`; void writes return `responseSuccess()` |
| **Own the route** | Class-level `@RequestMapping("/rest-out-logs")` and `@Hidden`; method paths match the template controller, including `/save-all`, `/find-all`, `/find-by-ids`, `/search-name`, `/find-all-name`, `/delete-by-ids` |

Each endpoint is therefore one line of real code. If it is longer, something has leaked in.

## Non-responsibilities

| Must not | Where it goes instead |
|----------|-----------------------|
| Rules of one data set: existence, its own state transition, persistence consistency | Service. See [Service 설계](/docs/knowledge/backend/service/service-design) |
| Policies that coordinate modules or a screen: call order, display composition, masking, what to do when another module fails | The Facade that owns that use case. See [Facade 설계](/docs/knowledge/backend/facade/facade-design) |
| A stack of Facade layers on every request | Not required. A table Facade can delegate to one Service. A screen composition calls the Facade that owns it |
| Transactions (`@Transactional`) | Inside one process, the use-case Facade decides the local transaction and Service joins it. After a remote split, that local transaction does not remain |
| Calling a Repository or touching an entity | Service only |
| Converting an enum string back onto the DTO | Facade, `of` / `ofNullable` then `getCode()` |
| Mapping DTO ↔ entity and entity → response DTO | Service (`ModelMapperUtil.map` / `mapAll`) |
| Translating exceptions to HTTP status | a global `@RestControllerAdvice`; controllers never `try/catch` business errors |
| Logging business events, auditing | Service / infrastructure concerns |

The controller does not know that enums, `BizErrorException`, or JPA exist.

## Boundaries, stated as rules

1. **Controller → Facade only.** Never Controller → Service, never Controller → Repository. Skipping the Facade is a `high` review finding even when the Facade method would be a one-liner. The Facade it calls is the one that owns the use case. The request does not pass through every Facade kind.
2. **Table entrance uses `Req` / `Res` directly.** Do not add a `Web*` DTO family for this set.
3. **Uniform envelope.** Every response is `CommonResponse<T>`. Clients parse `code` / `message` / `data` the same way for every endpoint, including errors produced by the advice.
4. **No state.** Controllers are stateless singletons with constructor injection.
5. **Copy the template controller in full.** Do not drop `saveAll`, `findAll`, `findByIds`, `searchName`, `findAllName`, or `deleteByIds`.

## Testing stance

Controllers are **not** the primary unit test target. Behavior lives in Facade and Service. Follow tests the project already has. A `@WebMvcTest` slice is appropriate when the project already uses them; otherwise the HTTP contract is checked by [`playwright-e2e`](/docs/harness/tools/playwright-e2e) or an API-level test when such practice exists in the project.

## Common drift to watch for

- `if (body.getStatus() == null) ...` inside a controller → business or validation logic leaking up
- A controller method that calls two Facade methods → a missing use case in the Facade
- `ResponseEntity<...>` on some endpoints and `CommonResponse` on others → envelope inconsistency
- `@Transactional` on a controller → boundary in the wrong layer
- A controller `catch (BizErrorException e)` → bypassing the global advice

## Related

- [Backend knowledge](/docs/knowledge/backend)
- [ADR-0001](/docs/decisions/adr-0001)
- Coding conventions (repo): `docs/harness/context/coding-conventions.md`
- Profile (repo): `docs/harness/profiles/spring-api.md`

## Templates

Knowledge answers *why / what / responsibility*. Templates show *concrete code shape*. Keep them linked, not duplicated: when this page and `ExampleItemController` disagree, one of them is wrong — report it rather than following either silently.
