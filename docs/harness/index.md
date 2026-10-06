---
sidebar_position: 1
title: Harness
---
# Harness

> **개요:** Origemite Archive용 휴대용 AI 작업 뼈대. 잡동사니 메모장이 아니라, 에이전트가 같은 Markdown 지식, 템플릿을 골라 쓰게 한다.

Portable AI engineering harness for Origemite Archive.

Helps coding agents (Cursor, Codex, Claude Code, …) reuse the same Markdown knowledge and templates in real projects.

## Layout

| Path | Question it answers |
|------|---------------------|
| [`orchestration.md`](./orchestration.md) | Meta: select / gap / author recipes |
| [`orchestrations/`](./orchestrations/) | Situation recipes (agents + knowledge assembly) |
| [`entrypoints/`](./entrypoints/) | Product adapters (Cursor / Codex / …) |
| [`agents/`](./agents/) | Role contracts (Master writes orchestrations; others execute) |
| [`context/`](./context/) | Identity, principles, conventions, precedence |
| [`workflows/`](./workflows/) | Default role order hints |
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
