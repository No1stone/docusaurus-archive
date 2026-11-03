---
title: T01 filter portal registry
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# T01 — 포털 필터 (레지스트리 + siteCode)

> 조각 ID: `T01` · 예상 1~2h (신규 메뉴 필터만)

## 적용 조건

- `pageId` 가 `portalMenuFilterRegistry.ts` 에 등록됨
- `siteCode` / `currentUser` 로 파트너·농장 스코프 분기

## 구현 체크

- [ ] `PORTAL_MENU_FILTER_REGISTRY[pageId]` 스펙 정의 (`scopeFields`, `domainFields`, `*Fields`, `statusPreset`)
- [ ] 페이지: `PortalMenuFilterPanel` + `usePortalMenuFilter` 또는 `useFarmScopedMenuFilter`
- [ ] **상단:** 스코프(파트너/농장) + 도메인 Select (공통코드 → `FilterCodeSelectField`)
- [ ] **하단:** `searchTerm` / `loginId` + `FilterSearchButtons` (조회 시 applied 반영)
- [ ] `onSearch` → `setCurrentPage(0)` + selection clear

## 코드 근거

| 파일 | 역할 |
|------|------|
| `src/config/portalMenuFilterRegistry.ts` | 메뉴별 필터 단일 소스 |
| `src/components/molecules/MenuFilterPanel.tsx` | `PortalMenuFilterPanel` |
| `src/hooks/usePortalMenuFilter.ts` | siteCode·스코프 clamp |
| `src/components/molecules/LivestockMenuFilterFields.tsx` 등 | 도메인 Select 묶음 |

## siteCode 분기

- `buildPortalScopeFilterUi(siteCode, spec)` — console은 파트너/농장 필드 숨김 등
- `pageRequiresPortalContext(pageId)` — App/Route에서 `currentUser` 전달 여부

## 하지 말 것

- 페이지마다 필터 마크업 복붙 (레지스트리 없이)
- 조회 버튼 없이 draft 필드가 곧바로 API 호출

## 검수 (이 조각만)

- [ ] console / partner / member 각각 필터 필드 노출이 스펙과 일치
- [ ] 공통코드 Select 옵션 로드 실패 시 빈 목록·토스트
- [ ] 초기화 시 `baselineFilters` 복원
