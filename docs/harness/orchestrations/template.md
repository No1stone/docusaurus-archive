# Orchestration: `SITUATION_ID`

> **개요:** 상황 레시피 작성 양식. Worker는 Knowledge assembly에 적힌 경로만 읽는다.

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

| Order | Role | Model pool | Mission template | Required |
|-------|------|------------|------------------|----------|
| 0 | Master | role default (Opus-class pool) | route / approve | yes |
| 1 | Implementer | role default (cheap coding pool) | … | yes |
| 2 | Reviewer | role default (cheap checklist pool) | … | yes |
| 3 | Tester | role default (cheap checklist pool) | … | yes / no |
| 4 | QA | role default (cheap checklist pool) | … | yes |

Contracts + `model_candidates`: `docs/harness/agents/<role>.md`  

**Model pool column:** usually `role default`. To override, put an **ordered list** (2–4), not one forced slug — e.g. `kimi-k2.7-code → composer-2.5-fast → haiku`. Pick first available at runtime. Avoid K3/K3-max for routine workers.

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
Return: docs/harness/orchestration.md schema
```

---

## Run log (optional history of executions)

| When | Trigger | Result |
|------|---------|--------|
| | | |
