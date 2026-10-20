# Entrypoint: Cursor

> **개요:** Cursor에서 이 하네스로 들어오는 방법.

## Master behavior

1. Read `docs/harness/CURRENT.md` and the task docs. Do not load the whole archive.
2. Follow [`../workflows/implement.md`](../workflows/implement.md).
3. Pick a recipe from [`../orchestrations/index.md`](../orchestrations/index.md) by 적용 조건 only. Read that one file.
4. Using a recipe does not mean spawning every role. Default is a single agent.
5. Do not write a new recipe unless the situation will repeat. Propose a candidate only; register after user approval.
6. Curator runs only when the user asks to promote.

## Task prompt

```text
Role: docs/harness/agents/{role}.md
Selected orchestration: docs/harness/orchestrations/{id}.md
Mission: …
Load only Knowledge assembly paths in that file
Return: schema in docs/harness/orchestration.md
```

## Verification tool mapping

How Cursor runs the capabilities in [`../tools/`](../tools/index.md):

| Tool | In Cursor |
|------|-----------|
| `backend-unit-test` | project's own runner through the shell tool (`./gradlew test`, …) |
| `playwright-e2e` | `npx playwright test` through the shell tool; read the report from the output |
| `browser-manual` | Cursor's built-in browser tools: navigate → snapshot → click / type → screenshot. Lock the tab for longer runs; stop after four failed attempts at one step |

Tester records evidence in the tool page's format. Product-specific tool names stay in this file only.

Meta: [`../orchestration.md`](../orchestration.md)  
Master: [`../agents/master.md`](../agents/master.md)  
Tools: [`../tools/index.md`](../tools/index.md)  
