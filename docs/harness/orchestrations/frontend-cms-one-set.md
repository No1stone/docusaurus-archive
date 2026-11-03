---
title: Orchestration frontend-cms-one-set
description: CMS CRUD 경량 헥사 원셋 레시피
---

# Orchestration: `frontend-cms-one-set`

> **개요:** CMS 관리 CRUD를 경량 헥사 원셋에 맞춘 뒤 도메인만 채웁니다.
> [ONESET](/docs/harness/templates/frontend/ONESET) · [cms-crud](/docs/harness/templates/frontend/cms-crud/) · [application-structure](/docs/knowledge/frontend/architecture/application-structure)

| Field | Value |
|-------|--------|
| ID | `frontend-cms-one-set` |
| Status | active |
| Profile hint | `docs/harness/profiles/cms-backoffice-fe.md` |

## 적용 조건

**적용합니다.** 관리 메뉴에 필터·목록·상세·등록/수정/비활성 골격을 추가·정비할 때.

**적용하지 않습니다.** 로그인/레이아웃만 → `frontend-auth-shell`. 읽기 전용만 → `report-readonly`. BE만 → `spring-api-one-set`.

## 입력

- 도메인명, 메뉴 key, API 경로, export·비활성·공통코드 여부
- 타입 검사 / 번들 빌드 명령

## 읽을 문서

| Path | 역할 |
|------|------|
| `docs/knowledge/frontend/architecture/application-structure.md` | 경량 헥사·네이밍 |
| `docs/knowledge/frontend/folder-structure.md` | 폴더 예시 |
| `docs/harness/templates/frontend/cms-crud/README.md` | 슬롯 |
| `docs/harness/templates/frontend/excel-download/README.md` | export 있을 때 |
| `docs/knowledge/frontend/integration/console-crud-base-set.md` | 기본셋 |
| `docs/knowledge/frontend/integration/common-code-fe-harness.md` | Chip 있을 때 |
| `docs/knowledge/frontend/design/loading-action-ux.md` | Skeleton, pending |
| `docs/harness/workflows/acceptance.md` | 통과 기준 |

## 작업 순서

1. 메뉴 key, RouteTemplate, 사이드바.
2. feature 골격: presentation / application / ports / adapters. Store는 필요할 때만. composition에서 계약←구현.
3. 화면 연결 `useXxx` + 개별 기능(목록·저장 등). 조합이 필요하면 Flow.
4. cms-crud 필수 슬롯 `filter` / `list` / `sheets`.
5. 공통코드 있으면 nameMaps·Chip. 없으면 건너뜀.
6. export 있으면 Export 기능→계약→Http + DownloadModal.
7. 타입 검사 → 번들 빌드 → 브라우저. 미실행은 이유 기록.
8. 필요 시 Playwright.

## DoD

- 있는 슬롯만 충족 (Chip·export·비활성은 조건부)
- Page·훅의 Http 직접 호출 없음
- 타입 / 번들 / 브라우저 각각 실행 또는 미실행 이유
- Vite 빌드 ≠ 타입 통과
- 다크·반응형 스모크(브라우저 했을 때)
