---
sidebar_position: 1
title: Frontend
description: FarmPro FE 하네스 지식 입구. 하드 규칙, 원셋, guidelines 승격본
---

# Frontend

> **개요:** 콘솔형 FE 하네스의 현재 지식 입구입니다.
> ExampleItem 원본은 FarmPro FE 저장소 `nutech/fe-v1`입니다.
> fe-v1 `docs/guidelines`와 `src/guidelines`를 아카이브로 승격한 본문을 포함합니다.
> 구현 원셋은 [Frontend templates](/docs/harness/templates/frontend/)를 봅니다.

## 하드 규칙

기본으로 지킵니다.
예외는 작업 기록에 남깁니다.

| 규칙 | 요약 |
|------|------|
| 가벼운 헥사 폴더 | `api` / `hooks` / `stores` / `components` 경계를 유지합니다. 앱 진입은 조립만 합니다. |
| 유스케이스 조립 | 페이지는 훅과 슬롯을 조립합니다. API 호출을 페이지에 직접 두지 않습니다. |
| 다크 모드 | 라이트와 다크 모두에서 대비와 테두리가 읽혀야 합니다. |
| 반응형 | 관리 화면은 좁은 폭에서도 필터, 표, 시트가 깨지지 않아야 합니다. |
| 공통코드 UI | Chip, Select+nameMaps, 상태 Badge를 사용합니다. raw code를 노출하지 않습니다. |
| CMS 필수 슬롯 | 필터, 스키마 폼, 로딩, 빈, 에러, Skeleton, 액션 pending |
| 데모와 wired 분리 | 퍼블/데모 화면과 API 연결 구현 화면을 나눕니다. 데모에 API를 장기 혼입하지 않습니다. |
| 상태 라이브러리 | React Query와 zustand를 강제하지 않습니다. 소유권 분리 규칙만 지킵니다. fe-v1 예는 RQ+zustand입니다. |

## 옵셔널

| 항목 | 취급 |
|------|------|
| i18n | 저장소가 쓰면 키 규칙을 따릅니다. |
| 타임존 표시 | [farm-timezone-display-policy](./integration/farm-timezone-display-policy) |
| a11y | 하드가 아닙니다. |
| 디자인 스킨 | 저장소 합의. fe-v1 `globals.css` 참고. |

## 문서 지도

### 경계와 아키텍처

| 문서 | 역할 |
|------|------|
| [folder-structure](./folder-structure) | 폴더 역할과 호출 방향 |
| [runtime-architecture](./architecture/runtime-architecture) | 부트스트랩과 인증 상태 |
| [navigation-contract](./architecture/navigation-contract) | 메뉴 key와 라우트 |
| [management-filter-kit](./architecture/management-filter-kit) | 필터 molecule |
| [ui-composition-rules](./architecture/ui-composition-rules) | 계층 조립, 카드 섹션 |
| [demo-vs-wired](./architecture/demo-vs-wired) | 데모와 구현 화면 분리 |

### 상태

| 문서 | 역할 |
|------|------|
| [state-ownership-model](./state/state-ownership-model) | 서버/UI 상태 |
| [query-cache-rules](./state/query-cache-rules) | query key와 무효화 |

### 통합과 CRUD

| 문서 | 역할 |
|------|------|
| [api-integration-contract](./integration/api-integration-contract) | 인증 fetch |
| [common-code-fe-harness](./integration/common-code-fe-harness) | 공통코드 |
| [console-crud-base-set](./integration/console-crud-base-set) | CRUD 기본셋 진입 |
| [console-management-crud-set](./integration/console-management-crud-set) | FE CRUD 마스터 상세 |
| [console-crud-page-index](./integration/console-crud-page-index) | 메뉴 갭·예시 인덱스 |
| [farm-livestock-portal](./integration/farm-livestock-portal) | 가축 포털 도메인 |
| [farm-timezone-display-policy](./integration/farm-timezone-display-policy) | 농장 TZ 표시 |
| [error-timeout-policy](./integration/error-timeout-policy) | 타임아웃, suppress |

### 디자인

| 문서 | 역할 |
|------|------|
| [dark-mode](./design/dark-mode) | 다크 |
| [responsive](./design/responsive) | 반응형 |
| [loading-action-ux](./design/loading-action-ux) | Skeleton, pending |

### 태스크·운영·컨벤션

| 문서 | 역할 |
|------|------|
| [Tasks](./tasks/) | 파이프라인, fragments, pages |
| [Operations](./operations/) | 빌드 환경, 백로그, 핸드오프 |
| [Conventions](./conventions/) | Code/UI 컨벤션, 프롬프트 |

## 원셋과 프로필

- Templates: [Frontend ONESET](/docs/harness/templates/frontend/ONESET)
- 읽기 보고: [report-readonly](/docs/harness/templates/frontend/report-readonly/)
- Profile: [farmpro-fe](/docs/harness/profiles/farmpro-fe)
- Orchestration: [frontend-cms-one-set](/docs/harness/orchestrations/frontend-cms-one-set), [frontend-auth-shell](/docs/harness/orchestrations/frontend-auth-shell)

## Client와의 구분

[Client](/docs/knowledge/client/)는 브라우저 일반, Flutter, WebRTC 메모입니다.
콘솔 FE 하네스는 본 Frontend 트리를 씁니다.
