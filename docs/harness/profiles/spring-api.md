# Profile: spring-api

> **개요:** Spring HTTP API 작업용 Profile 스켈레톤.

Skeleton profile for Spring-style HTTP API work.

## Question

> What engineering assets does this *kind* of system usually need?

## Intended asset map (fill as docs/templates grow)

### Knowledge

- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [데이터 접근 경계 (Port와 Adapter)](/docs/knowledge/backend/service/service-design)
- [ADR-0010](/docs/decisions/adr-0010)
- [테스트 기본 구조](/docs/knowledge/backend/testing/test-structure)

### Technology

- Spring MVC / Spring Data JPA — TODO when written

### Architecture

- API / layered — TODO when written

### Patterns

- Pagination, idempotency — TODO when written

### Templates

- Site: [/docs/harness/templates/backend/spring/](/docs/harness/templates/backend/spring/)
- Repo: `docs/harness/templates/backend/spring/` — ExampleItem 원셋 (구현 + [testing/](../templates/backend/spring/testing/) + [e2e/](../templates/backend/spring/e2e/)). 복사 안내는 [ONESET.md](/docs/harness/templates/backend/spring/ONESET). enum은 조건부.

### Decisions

- [ADR-0001](/docs/decisions/adr-0001)
- [ADR-0004](/docs/decisions/adr-0004)

### Verification (default tool set)

| Tool | Default rung |
|------|--------------|
| [backend-unit-test](/docs/harness/tools/backend-unit-test) | unit (Facade / Port mock, Adapter / Repository mock), slice if the project already has them |
| [playwright-e2e](/docs/harness/tools/playwright-e2e) | only when this API backs a UI flow listed in the orchestration |

Orchestrations for Spring situations start from this set and may narrow it.

## Notes

Profile ≠ Bundle. Profile is the usual combo; a Bundle is the concrete reading list for one task.
