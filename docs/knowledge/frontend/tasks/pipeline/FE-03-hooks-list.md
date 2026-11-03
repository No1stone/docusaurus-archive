---
title: FE 03 list use case hook
---

> **신규 채택: 경량 헥사.** 이 문서만으로 목록 **개별 기능 + 화면 연결 훅**을 만든다.
> ExampleItem `hooks/use*List` → `api` 직결은 **이력**. [application-structure](/docs/knowledge/frontend/architecture/application-structure)

# FE-03 — List 개별 기능 · 화면 연결 훅

> **선행:** FE-02 · **다음:** FE-04
> **이력 레퍼런스:** `hooks/useDeviceProductions.ts`

## 목표

- 개별 기능 `List{Domain}`(동작명)이 **FE-02 계약**만 호출한다.
- 화면 연결 `use{Domain}List`(또는 manage 훅의 목록 부분)이 UI·캐시와 기능을 연결한다.
- Flow는 **이 태스크에서 필수 아님** (단일 목록이면 훅 → List 직접).

## 이 태스크에서 할 것

- [ ] `application/…/List{Domain}` (또는 동등 모듈)
  - `repository.list(params)`만 사용. Http 구현·fetch 직접 호출 금지
  - React 훅을 호출하지 않음 (순수 TS)
- [ ] 화면 연결 훅
  - query key 예: `[domain, 'list', appliedParams]` ([query-cache-rules](/docs/knowledge/frontend/state/query-cache-rules))
  - `queryFn`(또는 동등)에서 `List{Domain}` 호출
  - **applied** 필터만 key·호출에 포함 (draft로 refetch 금지)
- [ ] 캐시 라이브러리는 프로젝트 선택(예: React Query). 강제 아님
- [ ] composition에 주입된 Repository를 기능이 받도록 유지

## 하지 말 것

- 훅에서 `Http*Repository` / `fetchWithAuth` / `api/*.ts` 직접 호출
- API 응답을 UI Store에 장기 복사 ([state-ownership](/docs/knowledge/frontend/state/state-ownership-model))
- create/update/export (→ FE-08)
- Page 조립·TableShell (→ FE-04)

## 이력 (ExampleItem)

`use{Domain}List`의 `queryFn: fetchList` — 이력. 신규는 `queryFn → List{Domain} → Repository`.

## 검수

- [ ] 필터 변경 후 **조회** 눌렀을 때만 refetch (applied 기준)
- [ ] List 모듈에 React import/훅 없음
