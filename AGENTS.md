# AGENTS.md

> **개요:** 에이전트용 부트스트랩/라우터. 거대한 프롬프트가 아니라, harness·workflow·profile을 골라 단계적으로 읽게 하는 진입점.

Bootstrap for Origemite Archive agents. Not a giant prompt.

## Core idea

```text
Orchestration MD = situation recipe
  (which subagents + which knowledge docs)

Master selects an existing recipe
  or, if missing → feedback to developer → write the recipe
  then dispatches agents against that file
```

Master does **not** improvise a new mix every time as the normal path.

## Flow

1. [`docs/harness/context/`](./docs/harness/context/) as needed  
2. Meta: [`docs/harness/orchestration.md`](./docs/harness/orchestration.md)  
3. Master: find / gap-report / author → [`docs/harness/orchestrations/`](./docs/harness/orchestrations/)  
4. Index helps choose what to put **in** a new recipe: [`index/`](./index/INDEX.md)  
5. Run roles: [`docs/harness/agents/`](./docs/harness/agents/index.md)  

## Entrypoints

| Product | File |
|---------|------|
| Cursor | [`docs/harness/entrypoints/cursor.md`](./docs/harness/entrypoints/cursor.md) |
| Codex | [`docs/harness/entrypoints/codex.md`](./docs/harness/entrypoints/codex.md) |
| Claude Code | [`docs/harness/entrypoints/claude-code.md`](./docs/harness/entrypoints/claude-code.md) |

## Rules

- Parent chat = Master (select or author orchestration, then dispatch)  
- Workers follow the **selected** orchestration’s knowledge assembly only  
- Prefer project-local rules for app code — [`docs/harness/context/precedence.md`](./docs/harness/context/precedence.md)  
