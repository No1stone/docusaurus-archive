# Workflow: Review

> **개요:** 구현이 이미 있을 때의 리뷰 전용 워크플로. Reviewer 산출물 형식, 미션 라벨(security / performance)로 체크리스트를 바꾸는 법, review+fix 분기.

Standalone review when the implementation already exists — a PR, a branch, or code written outside the harness. Master selects (or authors) a review orchestration under [`../orchestrations/`](../orchestrations/).

Control plane: [`../orchestration.md`](../orchestration.md)

```text
Master: locate the change set (diff, branch, paths)
    ↓  (unfamiliar repo → Scout)
Master: resolve standards (context, Profile, ADRs)
    ↓
Reviewer  (read-only)
    ↓
Optional Tester / QA if the request asks "does it work" / "is it complete"
    ↓
Master: summarize findings → developer
    ↓  (if "review + fix" was requested)
Implementer: apply fixes → Reviewer re-check
```

## Steps

### 1. Pin the change set

Review needs a boundary. Master names it: a diff range, a branch against base, or an explicit path list. "Review the project" is not a mission; it is a Scout task followed by several review missions.

### 2. Resolve what the code is judged against

Master lists the standards for this review, in [precedence](../context/precedence.md) order:

1. the project's own rules (lint config, local `AGENTS.md`) — found by Scout if needed
2. [coding conventions](../context/coding-conventions.md) and the relevant Knowledge pages
3. the Profile's Template for the layer
4. any accepted ADR the change touches

Reviewer judges **only** against this list. A finding without a citable standard is a `low` note, not a `FAIL`.

### 3. Reviewer reads, does not write

Default is read-only. Reviewer returns findings in the fixed format:

```text
- [severity: high|medium|low] message
  evidence: path:line or snippet
  standard: which rule / page / template clause
  suggestion: direction (not a patch)
```

`FAIL` if any `high` finding stands. `high` is reserved for layer leaks, boundary violations, template drift that changes behavior, secrets, and invented conventions. Style nits are `low`.

### 4. Pull in Tester / QA only when asked

| Developer asked | Roles |
|-----------------|-------|
| "Is this shaped right?" | Reviewer only |
| "…and does it work?" | + Tester with the orchestration's [verification tools](../tools/index.md) |
| "…and is the ticket done?" | + QA against the original request |

Do not run the whole pipeline for a question that only needs Reviewer.

### 5. Review + fix is an explicit branch

If the developer asked for fixes, Master says so in the mission and dispatches Implementer **after** the Reviewer report, with the findings as the mission. Reviewer then re-checks only the findings it raised. Reviewer never edits code itself.

## Mission labels (same role, different checklist)

A new kind of review does not need a new agent. Master adds a label to the Reviewer mission and lists the matching checklist page in the orchestration:

| Label | Focus | Checklist source |
|-------|-------|------------------|
| *(none)* | Structure, layering, template fidelity | coding conventions + Template |
| `security` | Input validation at the edge, secrets, auth boundaries, injection surfaces | security Knowledge page when written; until then, flag only what a listed standard covers |
| `performance` | N+1, pagination caps, transaction scope, unbounded queries | persistence Knowledge + `PageQuery` limits |
| `archive` | A Curator proposal: separation rules, sanitization, evidence bar | [`curator.md`](../agents/curator.md) rules |

If a label has no checklist page yet, Reviewer says so; it does not improvise a standard.

## Anti-patterns

- Reviewer fixing code "since it was small"
- Findings without a cited standard treated as blockers
- Running Tester and QA for a shape-only question
- Reviewing an unbounded change set

Related: [`implement.md`](./implement.md) · [`refactor.md`](./refactor.md) · [`../agents/reviewer.md`](../agents/reviewer.md)
