---
title: FE 01a filter portal
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-01a — 필터 (포털 레지스트리)

> **선행:** 없음 · **다음:** FE-04 (또는 BE-03과 병렬)  
> **레퍼런스:** `portalMenuFilterRegistry`, `PortalMenuFilterPanel`

## 이 태스크에서 할 것

- [ ] `PORTAL_MENU_FILTER_REGISTRY` 에 `pageId` 행 추가 (`scopeFields`, `domainFields`, `statusPreset`…)
- [ ] 페이지 `filter` 슬롯: `PortalMenuFilterPanel`
- [ ] **상단:** 파트너/농장 스코프 + 공통코드·상태 `Select`
- [ ] 공통코드: 필터에 필요한 `common_code_type_id` 만 — Page `use*CodeLabels` → `nameMaps` ([common-code-fe-harness](../../integration/common-code-fe-harness.md))
- [ ] **하단:** `searchTerm` + `FilterSearchButtons`
- [ ] `usePortalMenuFilter` / `useFarmScopedMenuFilter` — **조회 클릭 시** applied

## siteCode

- `buildPortalScopeFilterUi` — console/partner/member 필드 노출 분기

## 하지 말 것

- 목록 테이블 (FE-04)
- API (FE-02)

## 검수

- [ ] 검색어 입력만으로 API 안 나감
- [ ] 초기화 동작

단순 ops 메뉴는 [FE-01b](./FE-01b-filter-simple.md) 대신 사용.
