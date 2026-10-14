# Workflow: Refactor

> **개요:** 리팩터 워크플로입니다.
> 기존 검증 범위를 보존하고 동작이 유지되는지 확인합니다.
> 테스트 건수를 품질의 단독 기준으로 쓰지 않습니다.

Default role order for changing structure without changing behavior. Master selects (or authors) a refactor orchestration under [`../orchestrations/`](../orchestrations/).

Control plane: [`../orchestration.md`](../orchestration.md)

```text
바꿀 것과 바꾸면 안 되는 것
    ↓
기존 스위트가 있으면 통과를 기록
    ↓
동작은 유지하고 구조만 변경
    ↓
기존 검증 범위와 동작 유지 확인
    ↓
반복되는 모양이면 후보만 기록. Curator는 사용자가 요청할 때만
```

별도 에이전트는 [`implement.md`](./implement.md)입니다.

## What "behavior-preserving" means here

The observable contract stays identical: same inputs produce the same outputs, same exceptions, same persisted state. Performance may change; public shape may not, unless the orchestration explicitly lists an API change as part of the mission (then it is an implement task with a refactor inside, and QA checks both).

## Steps

### 1. Master fixes the target and the fence

Two lists before anyone starts:

- **Change**: e.g. "move query logic from Service into `RestOutLogSpecs`", "introduce Facade between Controller and Service"
- **Must not change**: endpoints, response shapes, DB schema, error codes, anything outside the named package

The fence is what QA checks against. Without it, every refactor grows.

### 2. Record the baseline

Run the existing suite **before** the change and record the command and that it passed. This shows which verification existed. If there is no suite covering the area, say so. Do not change structure until characterization tests are accepted or manual verification is explicitly labeled.

### 3. Implementer changes structure only

- Follow the target Template for the new shape; the refactor's job is usually to move code **toward** the template.
- One structural move per task when possible. Moving and renaming and reformatting in the same diff makes review impossible.
- No behavior fixes, even obvious ones. Note them for Master; they become bugfix tasks.

### 4. Check shape and behavior

The same agent checks these unless [`implement.md`](./implement.md) calls for a separate role.

- Compare the result to the Template and the layering rules in [coding conventions](../context/coding-conventions.md): right layer, no boundary leak.
- Re-run the baseline command. Existing checks still pass. A new failure is a behavior change.
- Added tests are allowed when they cover a gap. Deleting or replacing a test needs a recorded reason.
- Test counts are run evidence, not the only quality bar.
- Nothing in the "must not change" list moved, and nothing outside scope was touched.

### 5. Record a candidate, do not promote

If the refactor shows a shape worth reusing, report a short candidate. Curator and template updates run only when the user asks.

## Anti-patterns

- Refactoring without a baseline run
- "Refactor" PRs that also fix bugs or add features
- Changing the public response shape and calling it internal
- Re-architecting beyond the named package because the rest "looked the same"

Related: [`implement.md`](./implement.md), [`bugfix.md`](./bugfix.md), [`review.md`](./review.md)
