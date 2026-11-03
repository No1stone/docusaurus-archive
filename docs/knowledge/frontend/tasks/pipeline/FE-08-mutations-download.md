---
title: FE 08 mutations download
---

> **신규 채택: 경량 헥사.** 이 문서만으로 mutation·비활성·(선택) export를 만든다.
> ExampleItem `useCreate`+`api`·Page `fetch*ForDownload` 직결은 **이력**.
> [application-structure](/docs/knowledge/frontend/architecture/application-structure) · [excel-download](/docs/harness/templates/frontend/excel-download/)

# FE-08 — mutation · 비활성 · 다운로드

> **선행:** BE-05, FE-07 · **다음:** [QA-after-FE-08-crud](./qa/QA-after-FE-08-crud.md)
> **이력 레퍼런스:** `useDeviceProductions.ts`, `DownloadModal`, `api/*ForDownload`
> ~~QA-01~~ deprecated — [QA-01-verify-menu](./QA-01-verify-menu.md)

## 목표

- CUD·비활성·export를 **개별 기능**으로 두고, 화면 연결 훅이 캐시 무효화·pending을 연결한다.
- export가 있으면: `useXxx` → `Export{Domain}List` → 계약 → Http. Page에서 fetch 직접 호출 금지.
- 여러 단계를 한 흐름으로 묶을 때만 Flow(이름 자유). 전 화면 Flow 강제 없음.

## 이 태스크에서 할 것

### 계약·Http (FE-02에 없으면 추가)

- [ ] Repository에 `create` / `update` / `deactivateByIds`(또는 프로젝트 비활성 API) / (export 시) `listForExport` 등
- [ ] Http Adapter 구현. 성공 code·경로·page size는 **교체 가능** (ExampleItem 기본 예: DELETE 비활성, export size 100)

### 개별 기능 (React 훅 금지)

- [ ] `Create{Domain}` / `Update{Domain}` / `Deactivate{Domain}`
- [ ] (export 있을 때) `Export{Domain}List` — applied 필터, page 순회, progress 콜백

### 화면 연결

- [ ] mutation 훅(또는 manage 훅) — 성공 시 관련 list/detail **invalidate**
- [ ] `ManagementTableShell` — `deleteLabel`(예: 비활성), `deleteDisabled` 선택 0건
- [ ] (export) DownloadModal + applied 시드 + pending/에러. `downloadAdvancedExcel`은 util/구현 쪽

### (선택) Flow

- [ ] 등록 후 후속 호출 등 **조합이 있을 때만** `{Domain}ManageFlow` 등

## 하지 말 것

- Page·훅에서 Http/`api/*.ts` 직접 호출
- Flow·개별 기능 안에서 React 훅 호출
- export 없이 DownloadModal만 추가
- Vite 빌드 성공을 타입 검사 통과로 보고

## 이력 (ExampleItem)

`useCreate` → `api.create`, Page 안 `fetch*ForDownload` — 이력. findings: [fe-v1-findings](/docs/knowledge/frontend/operations/fe-v1-findings)

## 검수

→ [QA-after-FE-08-crud](./qa/QA-after-FE-08-crud.md)
