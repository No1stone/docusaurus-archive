# Workflow: Refactor

> **개요:** 리팩터 워크플로. 동작 보존을 증명하는 방법(기존 테스트 먼저 녹색 → 변경 → 동일 결과), 범위 확장 금지, Reviewer가 볼 것.

Default role order for changing structure without changing behavior. Master selects (or authors) a refactor orchestration under [`../orchestrations/`](../orchestrations/).

Control plane: [`../orchestration.md`](../orchestration.md)

```text
Master: intent & constraints (what changes, what must not)
    ↓  (unfamiliar repo → Scout)
Master: context resolution (Architecture / Patterns / Templates)
    ↓
Tester: baseline — existing suite green, counts recorded
    ↓
Implementer: behavior-preserving change
    ↓
Reviewer (structure, template fidelity) → Tester (same suite, same counts) → QA (scope & constraints)
    ↓
Master: finalize; new shape proven? → Curator
```

## What "behavior-preserving" means here

The observable contract stays identical: same inputs produce the same outputs, same exceptions, same persisted state. Performance may change; public shape may not, unless the orchestration explicitly lists an API change as part of the mission (then it is an implement task with a refactor inside, and QA checks both).

## Steps

### 1. Master fixes the target and the fence

Two lists before anyone starts:

- **Change**: e.g. "move query logic from Service into `ExampleItemSpecs`", "introduce Facade between Controller and Service"
- **Must not change**: endpoints, response shapes, DB schema, error codes, anything outside the named package

The fence is what QA checks against. Without it, every refactor grows.

### 2. Tester records the baseline

Run the existing suite **before** the change and record the exact command and counts. This is the proof the refactor will be measured against. If there is no suite covering the area, Tester says so; Master then decides whether to add characterization tests first (a separate Tester mission) or to accept manual verification with a clear label.

### 3. Implementer changes structure only

- Follow the target Template for the new shape; the refactor's job is usually to move code **toward** the template.
- One structural move per task when possible. Moving and renaming and reformatting in the same diff makes review impossible.
- No behavior fixes, even obvious ones. Note them for Master; they become bugfix tasks.

### 4. Review for shape, test for sameness

- **Reviewer** compares the result to the Template and the layering rules in [coding conventions](../context/coding-conventions.md): did the move land in the right layer, are boundaries now cleaner, did anything leak (Repository call in Facade, HTTP type in Service).
- **Tester** re-runs the baseline command. Same counts, same passes. A new failure is a behavior change — back to Implementer.
- **QA** checks the fence: nothing in the "must not change" list moved, and nothing outside scope was touched.

### 5. Promote if it proved a shape

If the refactor produced a cleaner shape than the current Template (not just a different one), Master dispatches **Curator** to propose updating the Template, with a History line explaining the change. A refactor is the most common source of template evolution.

## Anti-patterns

- Refactoring without a baseline run
- "Refactor" PRs that also fix bugs or add features
- Changing the public response shape and calling it internal
- Re-architecting beyond the named package because the rest "looked the same"

Related: [`implement.md`](./implement.md) · [`bugfix.md`](./bugfix.md) · [`review.md`](./review.md)
