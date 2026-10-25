# Orchestration System (meta)

> **개요:** 상황 레시피를 고르고, 만들고, 실행하는 메타 규칙입니다.
> 이번 작업용 읽을거리 목록이 아닙니다.
> 요청 모드·단일 에이전트 기본·검증·보고의 공통 원칙은 [`workflows/implement.md`](/docs/harness/workflows/implement)입니다.

This file is **not** a per-job reading list.
질문·확인·설명만인 요청과 문서·다이어그램만의 수정에는 역할 파이프라인을 자동으로 돌리지 않습니다.

## What an orchestration document is

A **situation recipe**:

> Which **subagents** to assemble + which **knowledge-base documents** to assemble → for this kind of work.

Stored under [`orchestrations/`](/docs/harness/orchestrations/). Reused when the same situation recurs.

---

## Master’s real job

```text
User request
    ↓
CURRENT.md와 이번 작업 문서만
    ↓
orchestrations/index.md에서 적용 조건만 보고 선택
    ├─ hit → 해당 레시피 한 파일만 읽기 → 기본은 단일 에이전트 실행
    └─ miss → default path in workflows/implement.md
              A new recipe is proposed only when the situation will repeat
```

Master does **not** write a recipe for every request.
Master does **not** spawn every role.
Selecting a recipe is not the same as running every role in its table.
기본은 단일 에이전트입니다. 역할마다 별도 에이전트를 자동 실행하지 않습니다 ([`implement.md`](/docs/harness/workflows/implement)).
Curator runs only when the user asks to promote Knowledge or templates.
Recipe list: [`orchestrations/index.md`](/docs/harness/orchestrations/).

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
4. The run uses the [default path](/docs/harness/workflows/implement) unless a recipe already exists.

Do not write a one-off recipe and do not spawn every role.

---

## Authoring a new orchestration

Use [`orchestrations/template.md`](/docs/harness/orchestrations/template).

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

선택된 레시피가 있으면 그 읽기 목록을 따릅니다.
레시피가 없는 기본 경로에서는 작업 범위, 프로젝트 규칙과 관련 템플릿만 확인합니다.
별도 에이전트를 사용하는 경우에도 필요한 경로와 역할만 전달합니다.

## Return schema

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

- 기본 경로로 충분한 요청에 새 레시피나 불필요한 읽기 목록을 만드는 것
- 질문·문서만인 요청에 전체 역할 파이프라인을 돌리는 것
- 미실행·생략 검증을 PASS로 적는 것 ([`implement.md`](/docs/harness/workflows/implement))
- Hiding “no recipe” gaps from the developer  
- One mega orchestration for the whole Archive  
- Workers free-browsing `docs/` outside the selected recipe  
