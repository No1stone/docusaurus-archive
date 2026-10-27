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

- [Spring ExampleItem 원셋](./backend/spring/) — 구현·testing·e2e. 안내는 [ONESET.md](/docs/harness/templates/backend/spring/ONESET).

```text
exampleitem/     도메인 원셋
support/         공통 타입
lib-cache/       공유 캐시 (Lettuce)     → cache/ 변형
lib-distributed-lock/  공유 분산락 (Redisson) → lock/ 짧은 예 (JWT)
enum/            @BizEnum 변형
```

Each layer folder:

1. Lists its `.java` files  
2. Embeds full source in Markdown code blocks (visible on this site)  
3. Keeps the raw `.java` beside the README for agent copy/paste
