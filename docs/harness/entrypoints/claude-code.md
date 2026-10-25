# Entrypoint: Claude Code

> **개요:** Claude Code에서 이 하네스로 들어오는 방법.

Adapter: Claude Code ↔ Origemite harness roles.

## Start here

1. Repo root: `AGENTS.md`
2. [`../workflows/implement.md`](/docs/harness/workflows/implement) — 요청 모드·검증·보고
3. [`../orchestration.md`](/docs/harness/orchestration)
4. [`../agents/index.md`](/docs/harness/agents/)

## Role binding

Parent session = **Master**.  
Subagents follow [`../agents/`](/docs/harness/agents/) contracts and the [return schema](/docs/harness/orchestration#return-schema). Separate agents follow [`../workflows/implement.md`](/docs/harness/workflows/implement). Default is a single agent.

## Verification tool mapping

How Claude Code runs the capabilities in [`../tools/`](/docs/harness/tools/):

| Tool | In Claude Code |
|------|----------------|
| `backend-unit-test` | project's own runner through Bash |
| `playwright-e2e` | `npx playwright test` through Bash, or a Playwright MCP if configured |
| `browser-manual` | Playwright MCP (or equivalent browser MCP) — navigate, snapshot, click, screenshot |

Keep Claude-only config out of `docs/` and `docs/harness/templates/`.
