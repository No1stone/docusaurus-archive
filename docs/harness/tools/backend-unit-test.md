# Tool: Backend unit / slice tests

> **개요:** 백엔드 코드가 명세대로 동작하는지를 테스트 코드로 증명합니다.
> 비용이 가장 낮고 가장 먼저 도는 검증입니다.

## Proves

- A Service / Facade / Controller does what the mission said, for the cases the test covers
- A change did not break previously passing behavior (regression)

Does **not** prove: the HTTP contract against a real client, performance, UI.

## Use when

- Any backend change under a selected orchestration (default rung for Spring work)
- Implementer produced or changed Service / Facade / Repository / Controller code

## Do not use when

- The project has no test runner wired (→ `BLOCKED`, see below)
- The mission is docs-only

## Inputs

| Need | Source |
|------|--------|
| Test patterns to follow | target repo's existing tests first; then [`templates/backend/spring/testing/`](../templates/backend/spring/testing/README.md) |
| Runner | project's own (`./gradlew test`, `./mvnw test`, …) — never introduce a new one |
| Mocking boundary | as the repo already does (e.g. Mockito at Service boundary) |

## Scope ladder (pick what exists)

```text
Unit            Service / Facade with mocks
  → Slice       @WebMvcTest, @DataJpaTest
  → Integration @SpringBootTest (only if the project already runs these)
```

Master or the orchestration may pin a rung ("unit only").

## Evidence format

Under `## Artifacts`:

```text
command: ./gradlew test --tests "com.example.ExampleItemServiceTest"
result:  12 tests, 12 passed, 0 failed, 0 skipped
files:   src/test/java/.../ExampleItemServiceTest.java (added)
```

Counts and the exact command are required. A log excerpt is optional.

## BLOCKED conditions

- No runner / build fails before tests start
- Tests need a DB, secret, or external service that is not available
- Repo has no test convention and the orchestration did not point to a template

Return `BLOCKED` with the reason. Do not mark `PASS` on "compiles".

## Current vs extension

| Item | Status |
|------|--------|
| JUnit 5 + Mockito unit tests | current (see template) |
| Spring slice tests | use if the project already has them |
| Testcontainers, k6 | recommended extension — only when listed in the orchestration |
