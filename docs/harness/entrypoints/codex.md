# Entrypoint: Codex

> **개요:** Codex에서 이 하네스로 들어오는 방법.

Adapter: Codex ↔ Origemite harness roles.

## Start here

1. Repo root: `AGENTS.md`
2. [`../workflows/implement.md`](/docs/harness/workflows/implement) — 요청 모드·검증·보고
3. [`../orchestration.md`](/docs/harness/orchestration)
4. [`../agents/index.md`](/docs/harness/agents/)

## Role binding

Parent session = **Master**.  
Follow [`../workflows/implement.md`](/docs/harness/workflows/implement). One agent covers the default path. Spawn another role only when that page says so.

## Verification tool mapping

How Codex runs the capabilities in [`../tools/`](/docs/harness/tools/):

| Tool | In Codex |
|------|----------|
| `backend-unit-test` | project's own runner through the shell |
| `playwright-e2e` | `npx playwright test` through the shell |
| `browser-manual` | TODO — confirm which browser capability Codex exposes; until then Tester returns `BLOCKED` for this tool |

Do not fork harness core for Codex-only trees. Product differences stay in this entrypoint only.
