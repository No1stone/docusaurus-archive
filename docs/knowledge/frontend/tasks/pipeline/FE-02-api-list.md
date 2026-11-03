---
title: FE 02 api list
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-02 — API 목록 fetch

> **선행:** BE-03 (URL 확정) · **다음:** FE-03  
> **레퍼런스:** `api/deviceProductions.ts`

## 이 태스크에서 할 것

- [ ] `api/{domainPlural}.ts` — `fetch{Domain}List({ keyword, status, page, size, … })`
- [ ] `API_ENDPOINTS.WEB.*` 등록
- [ ] `fetchWithAuth`, `SUCCESS_CODES`, `mapItemToRow` (camelCase → row)
- [ ] `status=all` 이면 쿼리 포함 (BE가 all 무시)

## 하지 말 것

- React Query (FE-03)
- create/update (FE-08)

## 검수

- [ ] Network 탭 URL·쿼리가 BE-03과 일치
