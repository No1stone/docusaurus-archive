# Task / Situation Orchestrations

> **개요:** 반복되는 상황의 레시피입니다.
> 없는 요청은 기본 흐름으로 처리합니다.
> 새 파일은 같은 상황이 반복될 때만 제안합니다.

Durable **recipes**: which agents + which knowledge-base docs for a situation.

Master **selects** these. Master **writes** one only when the situation is new (after feedback to the developer).

## Recipes

| ID | When |
|----|------|
| [spring-api-one-set](./spring-api-one-set.md) | Spring REST 테이블 한 세트 추가. 통과 테스트 다음 구현 |
| [spring-bugfix](./spring-bugfix.md) | 재현 테스트 다음 최소 수정 |
| [spring-refactor-layer](./spring-refactor-layer.md) | 기존 테스트가 녹색인 뒤 구조만 변경 |
| [archive-promote-pattern](./archive-promote-pattern.md) | 구현이 끝난 뒤 Curator 승격 제안 |

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
