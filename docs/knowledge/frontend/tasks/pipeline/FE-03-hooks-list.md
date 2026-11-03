---
title: FE 03 hooks list
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-03 — React Query 목록 훅

> **선행:** FE-02 · **다음:** FE-04
> **레퍼런스:** `hooks/useDeviceProductions.ts`

## 이 태스크에서 할 것

- [ ] `{domain}QueryKeys.all`, `.list(params)`
- [ ] `use{Domain}List(params)` — `queryFn: fetchList`, applied 필터만 key에 포함

## 검수

- [ ] 필터 변경 후 **조회** 눌렀을 때만 refetch (applied 기준)
