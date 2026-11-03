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

- [Spring ExampleItem 원셋](./backend/spring/) — 구현, testing, e2e. 안내는 [ONESET.md](/docs/harness/templates/backend/spring/ONESET).
- [Frontend 원셋](./frontend/) — CMS, auth, layout 등. 안내는 [ONESET.md](/docs/harness/templates/frontend/ONESET). ExampleItem은 FarmPro `fe-v1`.

### Backend (Spring)

```text
exampleitem/     도메인 원셋
support/         공통 타입
lib-cache/       공유 캐시 (Lettuce)     → cache/ 변형
lib-distributed-lock/  공유 분산락 (Redisson) → lock/ 짧은 예 (JWT)
enum/            @BizEnum 변형
```

Each Spring layer folder:

1. Lists its `.java` files  
2. Embeds full source in Markdown code blocks (visible on this site)  
3. Keeps the raw `.java` beside the README for agent copy/paste

### Frontend

```text
cms-crud/        관리 CRUD 본진
layout-shell/    Admin 셸
auth-login/      로그인
…                ONESET.md 맵 참고
```

Frontend 원셋은 슬롯 표, fe-v1 경로, 스모크 체크리스트를 README에 둡니다.
