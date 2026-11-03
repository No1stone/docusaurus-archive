---
title: Profile cms-backoffice-fe
description: CMS 업무 백오피스 FE 작업용 Profile
---

# Profile: cms-backoffice-fe

> **개요:** CMS 업무 백오피스 FE(React 콘솔) 작업용 Profile입니다.
> 제품명에 묶이지 않은 공통 표준입니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).

## Question

관리 콘솔형 FE에 보통 어떤 자산을 쓰는가?

## Asset map

### Knowledge

- [Frontend index](/docs/knowledge/frontend/)
- [folder-structure](/docs/knowledge/frontend/folder-structure)
- [console-crud-base-set](/docs/knowledge/frontend/integration/console-crud-base-set)
- [console-management-crud-set](/docs/knowledge/frontend/integration/console-management-crud-set)
- [common-code-fe-harness](/docs/knowledge/frontend/integration/common-code-fe-harness)
- [management-filter-kit](/docs/knowledge/frontend/architecture/management-filter-kit)
- [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired)
- [Tasks pipeline](/docs/knowledge/frontend/tasks/) (CMS CRUD 작업 시)
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
| 프로젝트 typecheck / build | 변경 범위 최소 명령 |
| [browser-manual](/docs/harness/tools/browser-manual) | Chrome 스모크 (DoD) |
| [playwright-e2e](/docs/harness/tools/playwright-e2e) | 회귀가 필요할 때 |

순서: typecheck(또는 동등) → Chrome smoke → 필요 시 Playwright.

## Stack notes

- 전형 예: React + Vite
- 상태 lib는 강제하지 않음. 소유권 분리만 하드. 예: React Query + zustand
- 스타일 예: Tailwind, dark class
- i18n, TZ: 옵셔널
- 가축·농장 등 도메인 문서는 예시일 뿐 표준 필수 아님
