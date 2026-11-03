---
title: Profile farmpro-fe
description: FarmPro 콘솔 FE 작업용 Profile
---

# Profile: farmpro-fe

> **개요:** FarmPro 콘솔 FE(React, Vite) 작업용 Profile입니다.
> ExampleItem 루트: `nutech/fe-v1`.

## Question

이 종류의 FE 시스템에 보통 어떤 자산을 쓰는가?

## Asset map

### Knowledge

- [Frontend index](/docs/knowledge/frontend/)
- [folder-structure](/docs/knowledge/frontend/folder-structure)
- [console-crud-base-set](/docs/knowledge/frontend/integration/console-crud-base-set)
- [console-management-crud-set](/docs/knowledge/frontend/integration/console-management-crud-set)
- [common-code-fe-harness](/docs/knowledge/frontend/integration/common-code-fe-harness)
- [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired)
- [Tasks pipeline](/docs/knowledge/frontend/tasks/)
- [Conventions](/docs/knowledge/frontend/conventions/)
- [dark-mode](/docs/knowledge/frontend/design/dark-mode)
- [loading-action-ux](/docs/knowledge/frontend/design/loading-action-ux)

### Templates

- [Frontend templates](/docs/harness/templates/frontend/)
- 본진: [cms-crud](/docs/harness/templates/frontend/cms-crud/)

### Orchestrations

- [frontend-cms-one-set](/docs/harness/orchestrations/frontend-cms-one-set)
- [frontend-auth-shell](/docs/harness/orchestrations/frontend-auth-shell)

### Verification (default)

| Tool | Default |
|------|---------|
| 프로젝트 typecheck / `build:console` 등 | 변경 범위 최소 명령 |
| [browser-manual](/docs/harness/tools/browser-manual) | Chrome 스모크 (DoD) |
| [playwright-e2e](/docs/harness/tools/playwright-e2e) | 회귀가 필요할 때 |

순서: typecheck(또는 동등) → Chrome smoke → 필요 시 Playwright.

## Stack notes (fe-v1)

- React + Vite
- 상태 예: React Query + zustand (다른 저장소는 소유권 규칙만 동일)
- 스타일: Tailwind, dark class
- i18n, TZ: 옵셔널 하드 아님
