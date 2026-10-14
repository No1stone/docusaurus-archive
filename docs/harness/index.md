---
sidebar_position: 1
title: Harness
---
# Harness

> **개요:** Origemite Archive용 휴대용 AI 작업 뼈대입니다.
> 잡동사니 메모장이 아니며, 에이전트가 같은 Markdown 지식과 템플릿을 골라 쓰게 합니다.
> 통과 가능한 코딩의 기준을 구현 전에 제시합니다. [`workflows/acceptance.md`](./workflows/acceptance.md)

Portable AI engineering harness for Origemite Archive.

Helps coding agents (Cursor, Codex, Claude Code, …) reuse the same Markdown knowledge and templates in real projects.

## Layout

| Path | Question it answers |
|------|---------------------|
| [`orchestration.md`](./orchestration.md) | Meta: select / gap / author recipes |
| [`orchestrations/`](./orchestrations/) | Situation recipes (agents + knowledge assembly) |
| [`entrypoints/`](./entrypoints/) | Product adapters (Cursor / Codex / …) |
| [`agents/`](./agents/) | Role contracts (Master writes orchestrations; others execute) |
| [`tools/`](./tools/) | Verification tools the Tester may use to prove vibe-coded results (tests, Playwright, agent-driven browser) |
| [`context/`](./context/) | Identity, principles, conventions, precedence |
| [`workflows/implement.md`](./workflows/implement.md) | 기본 개발 흐름. 매번 모든 역할을 실행하지 않습니다 |
| [`CURRENT.md`](./CURRENT.md) | 현재 상태. 작업 로그 전체가 아닙니다 |
| [`history/`](./history/) | 작업 기록. 필요할 때만 해당 월을 읽습니다 |
| [`profiles/`](./profiles/) | Usual asset combo for a *kind* of stack |
| [`bundles/`](./bundles/) | Optional read-list helper (subset of a task orchestration) |
| [`templates/`](./templates/) | Implementation reference assets (code + README) |

## Related concepts

- **Index** (`index/`) — what exists where
- **Templates** (`docs/harness/templates/`) — concrete implementation shapes
- **Docs** (`docs/`) — knowledge, architecture, patterns, ADRs, …

Harness structure must not depend on a single AI vendor. Entrypoints are thin adapters.

## Progressive loading

```text
Index (what exists)
  → Master selects orchestration for situation
      or gap feedback → write orchestration
  → workers load only that recipe’s knowledge assembly
```

History / Postmortems only if the selected orchestration lists them.
