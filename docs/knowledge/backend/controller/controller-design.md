---
id: controller-design
title: Controller Design
description: Controller layer responsibilities and boundaries
tags:
  - backend
  - api
status: active
---
# Controller Design

> **개요:** Controller를 어떻게 설계하는지(책임, 경계)입니다.
> Spring MVC 사용법 문서가 아닙니다.
> 짝이 되는 코드 모양은 템플릿 `ExampleItemWebController`입니다.

How the controller layer is designed: responsibilities and boundaries.

This document is an **engineering concept**, not a Spring MVC tutorial. Framework-specific usage belongs in technology notes when those exist. The concrete code shape is in the template: [`templates/backend/spring/controller/`](/docs/harness/templates/backend/spring/controller/).

## Intent

Define what belongs at the HTTP/API edge and what must stay out of it. The controller is a **thin adapter**: it turns an HTTP request into a call on the application (Facade) and turns the result back into an HTTP response. Nothing it does should be interesting to a unit test; the interesting work is one layer down.

The controller is also the **surface boundary**. A `Web` controller serves the web BFF; a different surface (admin, mobile, partner API) gets its own controller and its own `Web*`/`Admin*` DTOs, even when they call the same Facade.

## Responsibilities

| Responsibility | How it looks |
|----------------|--------------|
| **Bind** the request | `@RequestBody`, `@ModelAttribute`, `@PathVariable`, `@RequestParam` onto a surface DTO (`ExampleItemReq.WebCreate`, `WebListQuery`) |
| **Validate at the boundary** | `@Valid` on every body and query object; constraint annotations live on the `Web*` DTO, not on domain inputs |
| **Delegate** | Exactly one Facade call per endpoint, named for the surface: `exampleItemFacade.createForWeb(body)` |
| **Shape the response** | Wrap the Facade result in `CommonResponse<T>` via `CommonResponseUtils.responseSuccess(...)`; void writes return `responseSuccess()` |
| **Own the route** | Class-level `@RequestMapping("/web/example-items")`; method-level verb mappings; resource-style paths (`/{id}`, `/delete-by-ids`) |

Each endpoint is therefore one line of real code. If it is longer, something has leaked in.

## Non-responsibilities

| Must not | Where it goes instead |
|----------|-----------------------|
| Business rules, branching on domain state | Service |
| Composing several domain operations into one use case | Facade |
| Transactions (`@Transactional`) | Facade (boundary) and Service (joins) |
| Calling a Repository or touching an entity | Service only |
| Converting `Web*` DTO → domain `Create`/`Update` | the `Web*` DTO itself (`toCreate()`, `toUpdate()`), invoked by the Facade |
| Mapping entity → response DTO | Service (`MapperSupport`) |
| Translating exceptions to HTTP status | a global `@RestControllerAdvice`; controllers never `try/catch` business errors |
| Logging business events, auditing | Service / infrastructure concerns |

The controller does not know that `EnStatus`, `BizErrorException`, or JPA exist.

## Boundaries, stated as rules

1. **Controller → Facade only.** Never Controller → Service, never Controller → Repository. Skipping the Facade is a `high` review finding even when the Facade method would be a one-liner — the Facade is where the transaction and the surface conversion live.
2. **One surface, one controller, one DTO family.** `/web/...` endpoints bind `Web*` types. Reusing a domain `Create` as a request body couples the HTTP contract to the service signature.
3. **Validation is a boundary concern.** Domain `Create`/`Update` are trusted; everything untrusted is caught by `@Valid` before the Facade is called.
4. **Uniform envelope.** Every response is `CommonResponse<T>`. Clients parse `code` / `message` / `data` the same way for every endpoint, including errors produced by the advice.
5. **No state.** Controllers are stateless singletons with constructor injection.

## Testing stance

Controllers are **not** the primary unit test target. Behavior lives in Facade and Service and is tested there (see [testing template](/docs/harness/templates/backend/spring/testing/)). A `@WebMvcTest` slice is appropriate when the project already uses them and the mission is about binding or validation; otherwise the HTTP contract is checked by [`playwright-e2e`](/docs/harness/tools/playwright-e2e) or an API-level test when such practice exists in the project.

## Common drift to watch for

- `if (body.getStatus() == null) ...` inside a controller → business or validation logic leaking up
- A controller method that calls two Facade methods → a missing use case in the Facade
- `ResponseEntity<...>` on some endpoints and `CommonResponse` on others → envelope inconsistency
- `@Transactional` on a controller → boundary in the wrong layer
- A controller `catch (BizErrorException e)` → bypassing the global advice

## Related

- [Backend knowledge](../)
- [Architecture](../../../architecture/)
- [ADR-0001](../../../decisions/ADR-0001-markdown-git-as-engineering-source-of-truth.md)
- Coding conventions (repo): `docs/harness/context/coding-conventions.md`
- Profile (repo): `docs/harness/profiles/spring-api.md`

## Templates

Knowledge answers *why / what / responsibility*. Templates show *concrete code shape*. Keep them linked, not duplicated: when this page and `ExampleItemWebController` disagree, one of them is wrong — report it rather than following either silently.
