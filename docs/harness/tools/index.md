# Verification Tools

> **개요:** 바이브 코딩 결과를 AI가 스스로 검증할 때 쓰는 도구 카탈로그. 도구가 뭔지는 여기, 누가 쓰는지는 Tester, 스택 기본값은 Profile, 이번 작업에 뭘 쓸지는 Orchestration, 실제 실행 명령은 Entrypoint.

Catalog of tools an agent may use to **prove** that generated code works.

Vibe coding is allowed here only because verification is not optional. On the default path the implementing agent writes the needed checks and runs a tool from this list. A separate Tester is not required for that. "It looks right" is not evidence. A green run alone does not prove the requirement.

## Catalog

| Tool | File | Proves | Typical stack | Used by |
|------|------|--------|---------------|---------|
| Backend unit / slice tests | [`backend-unit-test.md`](./backend-unit-test.md) | Service, facade, controller behave as specified | Spring, any backend | Tester |
| Playwright E2E | [`playwright-e2e.md`](./playwright-e2e.md) | A user flow works end-to-end in a real browser, repeatably | Web frontend, BFF | Tester |
| Browser manual smoke | [`browser-manual.md`](./browser-manual.md) | The screen renders and reacts as expected right now (agent-driven Chrome) | Web frontend | Tester |

## Where each concern lives

```text
tools/              what the tool is, what evidence it returns, when it is BLOCKED
agents/tester.md    Tester may only verify with tools listed here; no fake PASS
profiles/*.md       usual verification set for a kind of stack
orchestrations/*.md which tools, to which rung, for this situation
entrypoints/*.md    how this product actually runs the tool (MCP, CLI, …)
templates/          concrete test code shape (e.g. templates/backend/spring/testing/)
```

Tool pages do **not** know about products. "Open Chrome" is described here as a capability; whether that is Cursor's browser MCP or a Playwright MCP is decided in `entrypoints/`.

## Page contract

Every tool page answers, in this order:

1. **Proves** — what claim this tool can back
2. **Use when** / **Do not use when**
3. **Inputs** — what the Tester needs (running server, fixtures, env)
4. **Evidence format** — what goes under `## Artifacts` in the return
5. **BLOCKED conditions** — when the Tester must stop instead of improvising
6. **Current vs extension** — is this tool actually in use in the target project, or a recommended addition

## Adding a tool

Add one file here, then link it from the relevant Profile. Do not edit `agents/tester.md` for a new tool — the role rule already says "any tool in `tools/`".

Related: [`../agents/tester.md`](../agents/tester.md), [`../agents/qa.md`](../agents/qa.md), [`../orchestrations/template.md`](../orchestrations/template.md)
