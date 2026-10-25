# Entrypoint: Cursor

> **개요:** Cursor에서 이 하네스로 들어오는 방법.
> 공통 작업 범위는 [`../workflows/implement.md`](/docs/harness/workflows/implement)입니다.

## Master behavior

1. Read `docs/harness/CURRENT.md` and the task docs. Do not load the whole archive.
2. Follow [`../workflows/implement.md`](/docs/harness/workflows/implement) (요청 모드·단일 에이전트 기본·검증·보고).
3. 질문·확인·설명만이면 파일을 수정하지 않고 답합니다. 레시피·역할을 돌리지 않습니다.
4. Pick a recipe from [`../orchestrations/index.md`](/docs/harness/orchestrations/) by 적용 조건 only. Read that one file.
5. Using a recipe does not mean spawning every role. Default is a single agent.
6. Do not write a new recipe unless the situation will repeat. Propose a candidate only; register after user approval.
7. Curator runs only when the user asks to promote.
8. 생략한 역할을 나열해 보고하지 않습니다. 결과·검증·남은 문제만 짧게 보고합니다.

## Task prompt

```text
Role: docs/harness/agents/{role}.md
Selected orchestration: docs/harness/orchestrations/{id}.md
Mission: …
Load only Knowledge assembly paths in that file
Return: schema in docs/harness/orchestration.md
```

## Verification tool mapping

How Cursor runs the capabilities in [`../tools/`](/docs/harness/tools/):

| Tool | In Cursor |
|------|-----------|
| `backend-unit-test` | project's own runner through the shell tool (`./gradlew test`, …) |
| `playwright-e2e` | `npx playwright test` through the shell tool; read the report from the output |
| `browser-manual` | Cursor's built-in browser tools: navigate → snapshot → click / type → screenshot. Lock the tab for longer runs; stop after four failed attempts at one step |

Tester records evidence in the tool page's format. Product-specific tool names stay in this file only.
부하·동시성은 프로젝트 조건에 맞는 도구로 하며, 공통 하네스에 특정 VU·도구를 고정하지 않습니다 ([`implement.md`](/docs/harness/workflows/implement)).

Meta: [`../orchestration.md`](/docs/harness/orchestration)  
Master: [`../agents/master.md`](/docs/harness/agents/master)  
Tools: [`../tools/index.md`](/docs/harness/tools/)  
Implement hub: [`../workflows/implement.md`](/docs/harness/workflows/implement)
