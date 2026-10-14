# Profile: spring-api

> **개요:** Spring HTTP API 작업용 Profile 스켈레톤.

Skeleton profile for Spring-style HTTP API work.

## Question

> What engineering assets does this *kind* of system usually need?

## Intended asset map (fill as docs/templates grow)

### Knowledge

- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [Facade Design](/docs/knowledge/backend/facade/facade-design) — 참고 문서, 공통 구현 기준 채택 대기
- [Service](/docs/knowledge/backend/service/service-design) — 참고 문서, 공통 구현 기준 채택 대기
- [테스트 기본 구조](/docs/knowledge/backend/testing/test-structure)

### Technology

- Spring MVC / Spring Data JPA — TODO when written

### Architecture

- API / layered — TODO when written

### Patterns

- Pagination, idempotency — TODO when written

### Templates

- Site: [/docs/harness/templates/backend/spring/](/docs/harness/templates/backend/spring/)
- Repo: `docs/harness/templates/backend/spring/` — ExampleItem table set (controller → facade → service → repository, dto, spec, entity) and [enum/](../templates/backend/spring/enum/) for applying `@BizEnum`

### Decisions

- [ADR-0001](/docs/decisions/adr-0001)

### Verification (default tool set)

| Tool | Default rung |
|------|--------------|
| [backend-unit-test](/docs/harness/tools/backend-unit-test) | unit (Service / Facade), slice if the project already has them |
| [playwright-e2e](/docs/harness/tools/playwright-e2e) | only when this API backs a UI flow listed in the orchestration |

Orchestrations for Spring situations start from this set and may narrow it.

## Notes

Profile ≠ Bundle. Profile is the usual combo; a Bundle is the concrete reading list for one task.
