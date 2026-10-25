# Entrypoints

> **개요:** 제품별 하네스 진입 어댑터(Cursor/Codex/Claude Code).

Product adapters into the harness. Core structure stays vendor-neutral.

| Product | Doc |
|---------|-----|
| Cursor | [cursor.md](/docs/harness/entrypoints/cursor) |
| Codex | [codex.md](/docs/harness/entrypoints/codex) |
| Claude Code | [claude-code.md](/docs/harness/entrypoints/claude-code) |

## Tool mapping

Each entrypoint says how **this product** runs the capabilities described in [`../tools/`](/docs/harness/tools/). The tool pages stay product-neutral; only the mapping lives here.

| Capability | Cursor | Claude Code | Codex |
|------------|--------|-------------|-------|
| Run backend tests | project runner via shell | project runner via shell | project runner via shell |
| Playwright E2E | `npx playwright test` via shell | `npx playwright test` via shell, or Playwright MCP | `npx playwright test` via shell |
| Agent-driven browser | built-in browser tools (navigate / snapshot / click / screenshot) | Playwright MCP or equivalent browser MCP | TODO — confirm available browser capability |
