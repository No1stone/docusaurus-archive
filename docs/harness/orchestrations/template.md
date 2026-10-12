# Orchestration: `SITUATION_ID`

> **개요:** 상황 레시피 작성 양식입니다.
> Worker는 Knowledge assembly에 적힌 경로만 읽습니다.

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

| Order | Role | Model pool | Freedom | Mission template | Required |
|-------|------|------------|---------|------------------|----------|
| 0 | Master | role default (Opus-class pool) | role default (high) | route / approve | yes |
| 0a | Scout | role default (cheap exploration pool) | role default (medium, read-only) | repo map for … | no (unfamiliar repo only) |
| 1 | Implementer | role default (cheap coding pool) | role default (low) | … | yes |
| 2 | Reviewer | role default (cheap checklist pool) | role default (medium) | … | yes |
| 3 | Tester | role default (cheap checklist pool) | role default (medium) | … | yes / no |
| 4 | QA | role default (cheap checklist pool) | role default (medium) | … | yes |
| 5 | Curator | role default (cheap writing pool) | role default (medium) | promote … if proven | no (promotion situations) |

Contracts + `model_candidates` + `## Freedom`: `docs/harness/agents/<role>.md`  

**Model pool column:** usually `role default`. To override, put an **ordered list** (2–4), not one forced slug — e.g. `kimi-k2.7-code → composer-2.5-fast → haiku`. Pick first available at runtime. Avoid K3/K3-max for routine workers.

**Freedom column:** usually `role default`. An orchestration may only **lower** a role's freedom (e.g. Reviewer `medium → low` for a template-fidelity check). Never raise it here. Scale: `docs/harness/agents/index.md`.

---

## Verification tools

What the Tester must use to prove this situation's result. Pick from [`../tools/`](../tools/index.md); do not name tools that are not catalogued.

| Tool | Rung / scope | Required | Evidence QA expects |
|------|--------------|----------|---------------------|
| `backend-unit-test` | unit → slice | yes / no | command + pass/fail counts |
| `playwright-e2e` | flows: … | yes / no | spec file + run result |
| `browser-manual` | smoke only | yes / no | steps + screenshot (labelled manual) |

If a required tool is `BLOCKED` in the target environment, Tester returns `BLOCKED` and Master decides — the orchestration does not get silently downgraded to "looks fine".

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
Verify with: Verification tools table (Tester)
Return: docs/harness/orchestration.md schema
```

---

## Run log (optional history of executions)

| When | Trigger | Result |
|------|---------|--------|
| | | |
