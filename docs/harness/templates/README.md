---
sidebar_position: 9
title: Templates
---

# Templates

> **개요:** 구현 참고용 코드 템플릿입니다.
> Harness 하위입니다.
> Knowledge(왜)와 짝을 이룹니다.
> README에 파일 목록과 코드 블록으로 보입니다.

Reusable **code shapes** for agents and humans — not prose-only knowledge.

Lives under `docs/harness/templates/`.

## Start here

- [Spring ExampleItem slice](./backend/spring/) — vertical flow with embedded sources:

```text
dto → persistence → service → facade → controller → testing
(+ support stubs)
```

Each layer folder:

1. Lists its `.java` files  
2. Embeds full source in Markdown code blocks (visible on this site)  
3. Keeps the raw `.java` beside the README for agent copy/paste
