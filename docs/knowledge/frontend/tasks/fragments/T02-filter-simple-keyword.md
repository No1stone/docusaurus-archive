---
title: T02 filter simple keyword
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# T02 — 단순 필터 (keyword + status)

> 조각 ID: `T02` · 레지스트리 없는 ops/데모 메뉴

## 적용 조건

- `portalMenuFilterRegistry` 미등록
- keyword ± status 정도면 충분

## 구현 체크

- [ ] `ManagementFilterPanel` 래퍼
- [ ] `FilterKeywordField` + (선택) status `Select`
- [ ] `FilterSearchButtons` — draft → applied on 검색
- [ ] `useState` draft/applied 또는 단일 filters + 조회 버튼

## 코드 근거

- `AlarmMessageManagePage.tsx`, `AlarmHistoryManagePage.tsx`
- [management-filter-kit](/docs/knowledge/frontend/architecture/management-filter-kit)

## 검수

- [ ] 검색어 입력만으로 API 즉시 호출되지 않음 (조회 클릭 후)
- [ ] Card 래퍼·라벨 class (`filterFieldLabelClass`) 공지/FAQ 패턴 일치
