# Workflow: Bugfix

> **개요:** 버그 수정 워크플로입니다.
> 재현, 최소 수정, 회귀 테스트 순서입니다.
> 같은 버그가 반복되면 Postmortem으로 올립니다.

Default role order for fixing a defect. Master selects (or authors) a bugfix orchestration under [`../orchestrations/`](../orchestrations/); this page is the order hint behind it.

Control plane: [`../orchestration.md`](../orchestration.md)

```text
Master: reproduce / clarify failure
    ↓  (unfamiliar repo → Scout)
Master: context resolution (narrow)
    ↓
Tester: failing reproduction test  ← first, before any fix
    ↓
Implementer: minimal fix
    ↓
Reviewer → Tester (red → green + regression) → QA
    ↓
Master: finalize; recurring? → Curator (Postmortem)
```

## Steps

### 1. Reproduce before fixing

Master turns the report into a concrete statement: input, expected, actual, where it was observed. If the report cannot be made concrete, Master asks the developer rather than guessing. A bug that cannot be reproduced is not fixed; it is `BLOCKED`.

### 2. Keep context narrow

Load only the Knowledge and Template pages for the layer where the bug lives. Load Postmortems / History **only** if the symptom matches a known past issue. A bugfix is the wrong moment to re-read the architecture.

### 3. Tester writes the reproduction test first

Before Implementer touches code, Tester adds a test that fails for the reported reason, using the project's existing test style (see [`backend-unit-test`](../tools/backend-unit-test.md)). This test is the definition of done. If the project has no runner, Tester returns `BLOCKED` and Master decides whether a manual reproduction is acceptable for this fix.

### 4. Implementer makes the minimal change

- Fix the cause, not the symptom, but only the cause in scope.
- No drive-by refactors, no renames, no "while I was here".
- If the fix requires changing a layer boundary or a template shape, stop: that is a refactor or an architecture question, not a bugfix.

### 5. Review, verify, accept

- **Reviewer** checks the change is minimal and does not introduce a layer leak or a new convention.
- **Tester** runs the reproduction test (now green) plus the surrounding suite for regression; evidence is command + counts.
- **QA** checks the fix matches the original report, not a reinterpretation of it.

### 6. Decide whether it is a lesson

Master asks one question at the end: *has this class of bug happened before?*

| Situation | Action |
|-----------|--------|
| First occurrence, local cause | run log entry only |
| Second occurrence, or caused by an archive template / convention | dispatch **Curator** to write a Postmortem and propose the fix upstream (template, Knowledge page, or ADR) |
| Caused by a project-local rule | report to the developer; the archive does not override local rules |

The feedback path is `Postmortem → ADR → Knowledge / Pattern → Template`, so a recurring bug ends as a changed template, not a note.

## Anti-patterns

- Fixing without a failing test when a runner exists
- Expanding into cleanup of the surrounding file
- Loading History "just in case"
- Marking `PASS` because the symptom disappeared without understanding why

Related: [`implement.md`](./implement.md), [`refactor.md`](./refactor.md), [Postmortems](/docs/postmortems/)
