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

- [Spring ExampleItem 원셋](./backend/spring/) — 구현·testing·e2e. 안내는 [ONESET.md](./backend/spring/ONESET.md). enum 적용 세트는 조건부.

```text
controller → facade → service → repository
                         ↓
                    dto, spec, entity
enum/ applies @BizEnum to one column of that set
(+ support)
```

Each layer folder:

1. Lists its `.java` files  
2. Embeds full source in Markdown code blocks (visible on this site)  
3. Keeps the raw `.java` beside the README for agent copy/paste
