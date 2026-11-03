---
title: Profile cms-backoffice-fe
description: CMS 업무 백오피스 FE. 경량 헥사 Profile
---

# Profile: cms-backoffice-fe

> **개요:** CMS 업무 백오피스 FE(React 콘솔) Profile입니다.
> 구조: **경량 헥사**. FE 네이밍. ExampleItem `nutech/fe-v1`은 이력.

## Question

관리 콘솔형 FE에 어떤 자산·경계를 쓰는가?

## Asset map

### Knowledge

- [Frontend index](/docs/knowledge/frontend/)
- [application-structure](/docs/knowledge/frontend/architecture/application-structure)
- [folder-structure](/docs/knowledge/frontend/folder-structure)
- [state-ownership-model](/docs/knowledge/frontend/state/state-ownership-model)
- [console-crud-base-set](/docs/knowledge/frontend/integration/console-crud-base-set)
- [console-management-crud-set](/docs/knowledge/frontend/integration/console-management-crud-set)
- [common-code-fe-harness](/docs/knowledge/frontend/integration/common-code-fe-harness) (공통코드 있을 때)
- [management-filter-kit](/docs/knowledge/frontend/architecture/management-filter-kit)
- [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired)
- [Tasks pipeline](/docs/knowledge/frontend/tasks/) (CMS CRUD 시)
- [Conventions](/docs/knowledge/frontend/conventions/)
- [dark-mode](/docs/knowledge/frontend/design/dark-mode)
- [loading-action-ux](/docs/knowledge/frontend/design/loading-action-ux)
- [ADR-0011](/docs/decisions/adr-0011)

### Templates

- [Frontend templates](/docs/harness/templates/frontend/)
- [cms-crud](/docs/harness/templates/frontend/cms-crud/)
- export 있을 때: [excel-download](/docs/harness/templates/frontend/excel-download/)

### Orchestrations

- [frontend-cms-one-set](/docs/harness/orchestrations/frontend-cms-one-set)
- [frontend-auth-shell](/docs/harness/orchestrations/frontend-auth-shell)

### Verification

| 검사 | 기록 |
|------|------|
| 타입 검사 | 실행 또는 미실행 이유. Vite 빌드 ≠ 타입 통과 |
| 번들 빌드 | 실행 또는 미실행 이유 |
| 브라우저 | [browser-manual](/docs/harness/tools/browser-manual) |
| E2E (선택) | [playwright-e2e](/docs/harness/tools/playwright-e2e) |

## Stack notes

- 전형 예: React + Vite. 패치 런타임 [ADR-0011](/docs/decisions/adr-0011)
- 경량 헥사: `useXxx` · Flow/개별 기능 · Repository 등 · Http/Demo. BE Facade 강제·용어 이식 없음
- 상태 lib 비강제. Store는 로컬로 부족할 때만. Chip·다운로드·공통코드는 기능 있을 때만
- i18n·TZ·포털·성공 code·비활성 경로·download size = 프로젝트 교체
- Flutter는 같은 책임(화면 연결 이름만 다름). 본 Profile은 웹
