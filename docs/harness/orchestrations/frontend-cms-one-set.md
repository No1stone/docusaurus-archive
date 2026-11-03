---
title: Orchestration frontend-cms-one-set
description: CMS CRUD 원셋 작업 레시피
---

# Orchestration: `frontend-cms-one-set`

> **개요:** CMS 관리 CRUD 원셋을 맞춘 뒤 도메인만 채웁니다.
> 안내는 [`templates/frontend/ONESET.md`](/docs/harness/templates/frontend/ONESET)와 [`cms-crud`](/docs/harness/templates/frontend/cms-crud/)입니다.
> 기본은 단일 에이전트입니다.

| Field | Value |
|-------|--------|
| ID | `frontend-cms-one-set` |
| Status | active |
| Profile hint | `docs/harness/profiles/cms-backoffice-fe.md` |

## 적용 조건

**적용합니다.**

- 관리 메뉴에 필터, 목록, 상세, 등록/수정/비활성 골격을 추가하거나 정비할 때
- CMS 업무 백오피스 FE 또는 동일 슬롯 계약을 쓰기로 한 콘솔 FE

**적용하지 않습니다.**

- 로그인/레이아웃만 → [`frontend-auth-shell`](/docs/harness/orchestrations/frontend-auth-shell)
- 읽기 전용 리포트만 → `report-readonly` 원셋 README
- 백엔드 API만 → [`spring-api-one-set`](/docs/harness/orchestrations/spring-api-one-set)

## 입력

- 도메인명, 메뉴 key, API 목록/단건/CUD 경로
- 필터 필드, 공통코드 typeId 목록
- 로컬 기동 URL과 빌드 명령

## 읽을 문서

폴더 전체를 읽지 않습니다.

| Path | 역할 |
|------|------|
| `docs/harness/templates/frontend/cms-crud/README.md` | 슬롯과 경로 |
| `docs/harness/templates/frontend/ONESET.md` | ExampleItem 규칙 |
| `docs/knowledge/frontend/integration/console-crud-base-set.md` | 기본셋 |
| `docs/knowledge/frontend/integration/common-code-fe-harness.md` | Chip/Select |
| `docs/knowledge/frontend/design/loading-action-ux.md` | Skeleton, pending |
| `docs/harness/workflows/acceptance.md` | 통과 기준 |

## 작업 순서

1. 메뉴 key, RouteTemplate, 사이드바를 맞춥니다.
2. api, hooks, store, page 골격을 folder-structure에 맞게 둡니다.
3. cms-crud 슬롯을 채웁니다 (필터, 표, 시트, pending).
4. 공통코드 nameMaps와 Chip/Badge를 연결합니다.
5. typecheck 또는 프로젝트 build를 실행합니다.
6. Chrome smoke로 원셋 체크리스트를 확인합니다.
7. 필요 시 Playwright 스펙을 추가합니다.

## DoD

- 슬롯 표 전 항목 충족
- raw code UI 없음
- 다크와 기본 반응형 스모크 통과
- browser-manual 증거(스냅샷 또는 체크 목록) 기록
