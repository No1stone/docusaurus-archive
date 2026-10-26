# Workflow: Bugfix

> **개요:** 버그 수정 워크플로입니다.
> 재현, 최소 수정, 회귀 테스트 순서입니다.
> 같은 버그가 반복되면 후보만 기록합니다.
> 문서 갱신은 사용자가 요청할 때 합니다.

Default role order for fixing a defect. Master selects (or authors) a bugfix orchestration under [`../orchestrations/`](/docs/harness/orchestrations/); this page is the order hint behind it.

Control plane: [`../orchestration.md`](/docs/harness/orchestration)

```text
범위와 통과 기준: 입력, 기대, 실제
    ↓
가능한 경우 재현 테스트
    ↓
최소 수정
    ↓
회귀와 요구사항 확인
    ↓
반복이면 후보만 기록. Curator는 사용자가 요청할 때만
```

별도 에이전트는 [`implement.md`](/docs/harness/workflows/implement)입니다.

## Steps

### 1. Reproduce before fixing

Master turns the report into a concrete statement: input, expected, actual, where it was observed. If the report cannot be made concrete, Master asks the developer rather than guessing. A bug that cannot be reproduced is not fixed; it is `BLOCKED`.

### 2. Keep context narrow

Load only the Knowledge and Template pages for the layer where the bug lives. Load Postmortems / History **only** if the symptom matches a known past issue. A bugfix is the wrong moment to re-read the architecture.

### 3. Reproduction test when possible

When a runner exists and the failure can be expressed as a test, write that failing test before the fix. Use the project's existing test style (see [`backend-unit-test`](/docs/harness/tools/backend-unit-test)). A missing runner is not an implementation defect.
자동 테스트가 불가능하면 승인된 작업 범위 안에서 수동 재현과 검증을 수행하고 방법 및 한계를 기록합니다.
이미 승인된 범위의 수동 검증을 위해 다시 승인을 요청하지 않습니다.
기대 동작이 불명확하거나 검증에 범위 밖 접근 또는 변경이 필요한 경우에만 확인을 요청합니다.

### 4. Implementer makes the minimal change

- Fix the cause, not the symptom, but only the cause in scope.
- No drive-by refactors, no renames, no "while I was here".
- If the fix requires changing a layer boundary or a template shape, stop: that is a refactor or an architecture question, not a bugfix.

### 5. Verify

The same agent checks these unless [`implement.md`](/docs/harness/workflows/implement) calls for a separate role.

- The change is minimal and does not leak a layer or add a convention.
- The reproduction test is green when one exists, and the surrounding suite shows no regression. Evidence is the command and the result. Counts are evidence, not the only quality bar.
- The fix matches the original report.

### 6. Decide whether it is a lesson

Master asks one question at the end: *has this class of bug happened before?*

| Situation | Action |
|-----------|--------|
| First occurrence, local cause | run log entry only |
| Second occurrence, or caused by an archive template / convention | record a candidate: what repeated, why it belongs in the archive, and the target page. Status stays waiting for the user. Do not run Curator |
| Caused by a project-local rule | report to the developer; the archive does not override local rules |

Curator updates a Postmortem, template, Knowledge page, or ADR only when the user asks.
The feedback path is `Postmortem → ADR → Knowledge / Pattern → Template`.

## Anti-patterns

- Fixing without a reproduction test when a runner exists and the failure can be expressed as a test
- Expanding into cleanup of the surrounding file
- Loading History "just in case"
- Marking `PASS` because the symptom disappeared without understanding why

Related: [`implement.md`](/docs/harness/workflows/implement), [`refactor.md`](/docs/harness/workflows/refactor), [Postmortems](/docs/postmortems/)
