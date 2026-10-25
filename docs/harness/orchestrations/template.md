# Orchestration: `SITUATION_ID`

> **개요:** 상황 레시피 작성 양식입니다.
> Worker는 Knowledge assembly에 적힌 경로만 읽습니다.
> 이 양식은 반복되는 상황용입니다.
> 모든 요청에 새 파일을 만들지 않습니다.
> 기본 흐름은 `docs/harness/workflows/implement.md`입니다.

> Situation recipe. Master selects this file when the situation matches.  
> Workers load **only** Knowledge assembly paths below.

## Situation

| Field | Value |
|-------|--------|
| ID | `SITUATION_ID` |
| When to use | (one paragraph: triggers / scope) |
| When not to use | (boundary) |
| Profile hint | e.g. `docs/harness/profiles/spring-api.md` |
| Status | draft \| active \| deprecated |

## Success criteria

- [ ] …

## Constraints

- current vs extension …
- no secrets in outputs …

---

## Agent assembly

별도 에이전트는 `docs/harness/workflows/implement.md`를 넘지 않습니다.
역할 열은 책임입니다. 별도 실행 열에 기본 흐름의 한 에이전트가 하면 `no`입니다.

| Order | Role | Model pool | Freedom | Mission template | 별도 에이전트 |
|-------|------|------------|---------|------------------|----------------|
| 0 | Master | role default (Opus-class pool) | role default (high) | 범위와 통과 기준 | 기본 흐름에서는 구현 담당과 나눌 때만 |
| 0a | Scout | role default (cheap exploration pool) | role default (medium, read-only) | repo map for … | 낯선 저장소 또는 정보 부족일 때만 |
| 1 | Implementer | role default (cheap coding pool) | role default (low) | 확정된 기준과 프로젝트 규칙. 적용 템플릿, 없으면 저장소 패턴, 없으면 승인 범위의 최소 구현. 새 계층, 공개 계약, 의존성, 아키텍처는 Master 결정 후 | 구현을 맡을 때 |
| 2 | Reviewer | role default (cheap checklist pool) | role default (medium) | 복잡한 계약, 중요한 정합성, 중요한 설계 변경만 | 그 조건일 때만 |
| 3 | QA | role default (cheap checklist pool) | role default (medium) | 중요한 사용자 흐름의 요구사항과 회귀 | 그 조건일 때만 |
| 4 | Curator | role default (cheap writing pool) | role default (medium) | 후보를 문서로 올릴 때 | 사용자가 요청할 때만 |

확인 방법은 `docs/harness/workflows/acceptance.md`입니다.
테스트를 삭제하거나 기대 결과를 약화하지 않습니다.

Contracts + `model_candidates` + `## Freedom`: `docs/harness/agents/<role>.md`  

**Model pool column:** usually `role default`. To override, put an **ordered list** (2–4), not one forced slug — e.g. `kimi-k2.7-code → composer-2.5-fast → haiku`. Pick first available at runtime. Avoid K3/K3-max for routine workers.

**Freedom column:** usually `role default`. An orchestration may only **lower** a role's freedom (e.g. Reviewer `medium → low` for a template-fidelity check). Never raise it here. Scale: `docs/harness/agents/index.md`.

---

## Verification tools

검증에 쓸 도구입니다. 별도 Tester 실행을 뜻하지 않습니다. Pick from [`../tools/`](/docs/harness/tools/); do not name tools that are not catalogued.

| Tool | Rung / scope | Required | Evidence QA expects |
|------|--------------|----------|---------------------|
| `backend-unit-test` | unit → slice. Layout: `docs/knowledge/backend/testing/test-structure.md` | yes / no | command + pass/fail counts |
| `playwright-e2e` | flows: … | yes / no | spec file + run result |
| `browser-manual` | smoke only | yes / no | steps + screenshot (labelled manual) |

실행할 수 없는 도구는 `BLOCKED`와 이유를 적습니다. 그것은 구현 결함이 아닙니다. 결과를 눈으로 통과 처리하지 않습니다.

---

## Knowledge assembly

### Knowledge

| Path | Role in this situation | Kind |
|------|------------------------|------|
| `docs/knowledge/...` | … | current \| extension |

### Templates

| Path | Role |
|------|------|
| `docs/harness/templates/...` | … |

### ADR / Architecture / Patterns (optional)

| Path | Role |
|------|------|
| … | … |

---

## Dispatch (Master)

```text
Selected orchestration: docs/harness/orchestrations/<SITUATION_ID>.md
Role: docs/harness/agents/<role>.md
Model: first available from Agent assembly pool or role model_candidates
Mission: from Agent assembly
Load: Knowledge assembly only
Verify with: Verification tools table. This is the check, not a separate Tester.
Return: docs/harness/orchestration.md schema
```

---

## Run log (optional history of executions)

| When | Trigger | Result |
|------|---------|--------|
| | | |
