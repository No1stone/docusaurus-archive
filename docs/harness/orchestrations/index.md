# Task / Situation Orchestrations

> **개요:** 상황별 레시피 모음. 있으면 재사용, 없으면 알린 뒤 template으로 작성.

Durable **recipes**: which agents + which knowledge-base docs for a situation.

Master **selects** these. Master **writes** one only when the situation is new (after feedback to the developer).

## Layout

```text
docs/harness/orchestrations/
├── index.md
├── template.md
└── <situation-id>.md
```

## Lifecycle

```text
Situation occurs
  → Master searches this folder
  → hit: reuse
  → miss: feedback to developer → write from template.md → reuse next time
```

## What each file must assemble

1. **When to use** (situation)  
2. **Agent assembly** (which subagents, order, model pool)  
3. **Knowledge assembly** (which Archive docs)  
4. Success criteria / constraints  

## vs Bundle / Profile

| | Profile | Bundle | Orchestration |
|--|---------|--------|----------------|
| Usual stack combo | ✓ | | hint only |
| Read list helper | | ✓ | |
| Agents + knowledge for a **situation** | | | ✓ (source of truth for runs) |

## Naming

`{stack}-{situation}.md` e.g. `spring-web-bff-crud.md`, `archive-extract-testing-practice.md`
