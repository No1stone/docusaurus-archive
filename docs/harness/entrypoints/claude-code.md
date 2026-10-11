# Entrypoint: Claude Code

> **개요:** Claude Code에서 이 하네스로 들어오는 방법.

Adapter: Claude Code ↔ Origemite harness roles.

## Start here

1. Repo root: `AGENTS.md`
2. [`../orchestration.md`](../orchestration.md)
3. [`../agents/index.md`](../agents/index.md)

## Role binding

Parent session = **Master**.  
Subagents / sequential role passes follow [`../agents/`](../agents/) contracts and the spawn payload in orchestration §4.

## Verification tool mapping

How Claude Code runs the capabilities in [`../tools/`](../tools/index.md):

| Tool | In Claude Code |
|------|----------------|
| `backend-unit-test` | project's own runner through Bash |
| `playwright-e2e` | `npx playwright test` through Bash, or a Playwright MCP if configured |
| `browser-manual` | Playwright MCP (or equivalent browser MCP) — navigate, snapshot, click, screenshot |

Keep Claude-only config out of `docs/` and `docs/harness/templates/`.
