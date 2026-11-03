---
sidebar_position: 1
title: Frontend
description: CMS 업무 백오피스 FE 하네스 지식 입구. 하드 규칙, 원셋, 표준 문서
---

# Frontend

> **개요:** CMS 업무 백오피스 FE 하네스의 공통 원본입니다.
> 제품명에 묶이지 않은 콘솔 표준입니다. 로컬 앱 guidelines 대신 이 트리를 씁니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> 구현 원셋은 [Frontend templates](/docs/harness/templates/frontend/)를 봅니다.
> Profile: [cms-backoffice-fe](/docs/harness/profiles/cms-backoffice-fe).

## 새 작업 진입 (짧게)

1. [cms-backoffice-fe](/docs/harness/profiles/cms-backoffice-fe)와 아래 하드 규칙
2. 해당 [원셋](/docs/harness/templates/frontend/) README 슬롯만
3. 막히면 integration 또는 tasks에서 **문서 1장만**
4. 도메인 예시(가축, 농장 TZ 등)는 필요할 때만

## 하드 규칙

기본으로 지킵니다.
예외는 작업 기록에 남깁니다.

| 규칙 | 요약 |
|------|------|
| 경량 헥사 | Page → `useXxx` → 개별 기능 또는 Flow → 계약 ← Http·Demo. [application-structure](./architecture/application-structure) |
| 유스케이스 진입 | 단일 기능은 직접 호출 가능. 조합이 필요하면 Flow 등. BE처럼 전 화면 Facade 강제 없음 |
| 화면 연결 | React `useXxx`. Application은 훅을 호출하지 않음 |
| 레이아웃 슬롯 | `filter` / `list` / `sheets` (`table` prop 아님) |
| 서버 vs UI 상태 | 응답 원본=캐시 SoT. Store에 목록 복제 금지. [state-ownership](./state/state-ownership-model) |
| 다크·반응형 | 대비·좁은 폭에서 필터·표·시트 조작 가능 |
| CMS 슬롯 | 필터, 폼, 로딩, 빈, 에러, Skeleton, pending. Chip·다운로드는 **기능 있을 때** |
| 엑셀 export | `useXxx` → Export 기능 → 계약 → Http (+ `downloadAdvancedExcel`). Page 직접 fetch는 이력. [excel-download](/docs/harness/templates/frontend/excel-download/) |
| 데모·wired | 같은 계약에 Demo/Http 구현. wired에서 실패를 성공으로 바꾸지 않음 |
| 상태 lib | 비강제. 로컬 state로 충분하면 Store 생략 |
| 런타임 보안 | 패치된 React/Node ([ADR-0011](/docs/decisions/adr-0011)) |

Flutter도 같은 경량 헥사 책임입니다. 화면 연결 이름만 ViewModel·Controller 등으로 맞춥니다. 본 트리 수정 범위는 웹입니다.

## 프로젝트별 교체 항목 (기본값 ≠ 만능)

대상 API·요구에 맞게 바꿉니다.

| 항목 | ExampleItem에서 본 기본 예 |
|------|---------------------------|
| 포털 구성 | console / partner / member |
| 공통코드 | 10자리·BizEnum 등 |
| 성공 code·응답 봉투 | 프로젝트 계약 |
| 비활성 | DELETE 경로 등 |
| download page size | 100 |
| 인증 | 쿠키·Bearer·refresh |
| TZ·농장 스코프 | 도메인 정책 |

## 옵셔널

| 항목 | 취급 |
|------|------|
| i18n | 저장소가 쓰면 키 규칙을 따릅니다. |
| 타임존 표시 | 도메인 정책이 있을 때만. 예: [farm-timezone-display-policy](./integration/farm-timezone-display-policy) |
| a11y | 하드가 아닙니다. |
| 디자인 스킨 | 저장소 합의. |

## 문서 지도

### 표준 (공통)

| 문서 | 역할 |
|------|------|
| [application-structure](./architecture/application-structure) | 경량 헥사·FE 네이밍·LoginFlow |
| [folder-structure](./folder-structure) | 기능별 폴더 예시·이력 매핑 |
| [runtime-architecture](./architecture/runtime-architecture) | 부트스트랩과 인증 상태 |
| [navigation-contract](./architecture/navigation-contract) | 메뉴 key와 라우트 |
| [management-filter-kit](./architecture/management-filter-kit) | 필터 molecule |
| [ui-composition-rules](./architecture/ui-composition-rules) | 계층 조립, 카드 섹션 |
| [demo-vs-wired](./architecture/demo-vs-wired) | Demo·Http 구현 교체 |
| [state-ownership-model](./state/state-ownership-model) | 서버/UI 상태 |
| [query-cache-rules](./state/query-cache-rules) | query key와 무효화 |
| [api-integration-contract](./integration/api-integration-contract) | 인증 fetch |
| [common-code-fe-harness](./integration/common-code-fe-harness) | 공통코드 |
| [console-crud-base-set](./integration/console-crud-base-set) | CRUD 기본셋 진입 |
| [console-management-crud-set](./integration/console-management-crud-set) | FE CRUD 마스터 상세 |
| [error-timeout-policy](./integration/error-timeout-policy) | 타임아웃, suppress |
| [dark-mode](./design/dark-mode) / [responsive](./design/responsive) / [loading-action-ux](./design/loading-action-ux) | 디자인 계약 (클릭·pending·Skeleton·Toast, 웹+Flutter) |
| [Tasks](./tasks/) | CMS CRUD 마이크로 태스크 (해당 작업 시) |
| [Conventions](./conventions/) | 코딩·UI 컨벤션 |
| [Operations](./operations/) | 빌드 환경, 모노레포 런북, [fe-v1-findings](./operations/fe-v1-findings) |
| [ADR-0011](/docs/decisions/adr-0011) | React/Node 패치 런타임 |

### 도메인 예시 (표준 필수 아님)

| 문서 | 역할 |
|------|------|
| [console-crud-page-index](./integration/console-crud-page-index) | 메뉴 갭·예시 인덱스 |
| [farm-livestock-portal](./integration/farm-livestock-portal) | 가축 포털 예시 |
| [farm-timezone-display-policy](./integration/farm-timezone-display-policy) | 농장 TZ 표시 예시 |

## 원셋과 프로필

- Templates: [Frontend ONESET](/docs/harness/templates/frontend/ONESET)
- 본진: [cms-crud](/docs/harness/templates/frontend/cms-crud/)
- Profile: [cms-backoffice-fe](/docs/harness/profiles/cms-backoffice-fe)
- Orchestration: [frontend-cms-one-set](/docs/harness/orchestrations/frontend-cms-one-set), [frontend-auth-shell](/docs/harness/orchestrations/frontend-auth-shell)

## Client와의 구분

[Client](/docs/knowledge/client/)는 브라우저 일반, Flutter, WebRTC 메모입니다.
CMS 업무 백오피스 FE 하네스는 본 Frontend 트리를 씁니다.
