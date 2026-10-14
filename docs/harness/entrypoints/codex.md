# Entrypoint: Codex

> **개요:** Codex에서 이 하네스로 들어오는 방법.

Adapter: Codex ↔ Origemite harness roles.

## Start here

1. Repo root: `AGENTS.md`
2. [`../orchestration.md`](../orchestration.md)
3. [`../agents/index.md`](../agents/index.md)

## Role binding

Parent session = **Master**.  
Follow [`../workflows/implement.md`](../workflows/implement.md). One agent covers the default path. Spawn another role only when that page says so.

## Verification tool mapping

How Codex runs the capabilities in [`../tools/`](../tools/index.md):

| Tool | In Codex |
|------|----------|
| `backend-unit-test` | project's own runner through the shell |
| `playwright-e2e` | `npx playwright test` through the shell |
| `browser-manual` | TODO — confirm which browser capability Codex exposes; until then Tester returns `BLOCKED` for this tool |

Do not fork harness core for Codex-only trees. Product differences stay in this entrypoint only.
