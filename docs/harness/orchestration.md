# Orchestration System (meta)

> **개요:** 상황 레시피를 고르고, 만들고, 실행하는 메타 규칙입니다.
> 이번 작업용 읽을거리 목록이 아닙니다.

This file is **not** a per-job reading list.

## What an orchestration document is

A **situation recipe**:

> Which **subagents** to assemble + which **knowledge-base documents** to assemble → for this kind of work.

Stored under [`orchestrations/`](./orchestrations/). Reused when the same situation recurs.

---

## Master’s real job

```text
User request
    ↓
CURRENT.md와 이번 작업 문서만
    ↓
Matching orchestration exists?
    ├─ YES → reuse it
    └─ NO  → default path in workflows/implement.md
              A new recipe is proposed only when the situation will repeat
```

Master does **not** write a recipe for every request.
Master does **not** spawn every role.
Curator runs only when the user asks to promote Knowledge or templates.

---

## Two layers

| Layer | Path | Purpose |
|-------|------|---------|
| Meta (this file) | `docs/harness/orchestration.md` | Rules for select / gap / author / run |
| Situation orchestration | `docs/harness/orchestrations/*.md` | Durable recipe: agents + knowledge mix |

---

## Gap feedback (when none fits)

Master must tell the developer, clearly:

1. What situation was detected  
2. That **no orchestration** covers it (or only a partial match)  
3. What agents + knowledge pages would be needed  
4. The run uses the [default path](./workflows/implement.md) unless a recipe already exists.

Do not write a one-off recipe and do not spawn every role.

---

## Authoring a new orchestration

Use [`orchestrations/template.md`](./orchestrations/template.md).

Must define:

- **Situation** — when to select this file  
- **Agents** — which roles, in what order (+ model pool)  
- **Knowledge assembly** — exact paths to mix  
- **Templates / ADR** — if required  
- **Success criteria**

Prefer linking small knowledge pages over inlining essays.

---

## Running

Workers receive:

```text
role MD + selected orchestration MD + mission for that role
```

They load **only** the knowledge paths listed in that orchestration.

Return schema:

```markdown
## Status
PASS | FAIL | BLOCKED | PARTIAL

## Summary
## Artifacts
## Findings
## Rework Hint
```

---

## Anti-patterns

- Remixing docs every request without writing/selecting an orchestration file  
- Hiding “no recipe” gaps from the developer  
- One mega orchestration for the whole Archive  
- Workers free-browsing `docs/` outside the selected recipe  
