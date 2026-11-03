---
title: Query key and cache rules
description: 목록/상세 query key 패턴과 mutation 후 무효화
---

# Query key and cache rules

> **개요:** 서버 상태 캐시 키와 무효화 규칙입니다.
> FarmPro FE draft(`query-cache-rules`)와 `useDeviceProductions` 등 실제 훅 패턴을 아카이브용으로 정리했습니다.
> 특정 라이브러리(React Query)를 강제하지 않습니다. 키 모양과 무효화 우선순위만 맞춥니다.

## 기본 키 패턴

```text
[domain, 'list' | 'detail', params]
```

| 구분 | 예 |
|------|-----|
| 목록 | `['deviceProduction', 'list', listParams]` |
| 상세 | `['deviceProduction', 'detail', id]` |
| 공통코드 | 타입별 키 (`commonCodesByTypeQueryKey(typeId)`). [common-code-fe-harness](../integration/common-code-fe-harness) |

도메인 키 팩토리(`deviceProductionKeys.list` 등)를 두면 무효화 범위가 짧아집니다.

## mutation 이후

1. **우선** 관련 쿼리 무효화(`invalidate`).
2. 즉시 UI가 필요하면 `setQueryData`를 보조로 씁니다.
3. UI 스토어에 서버 목록 전체를 복사해 두지 않습니다. [state-ownership-model](./state-ownership-model)

## 공통코드 캐시

- typeId 단위 캐시, 화면에서 쓰는 타입만 로드.
- 시트는 페이지가 만든 `nameMaps`를 재사용.

## 로깅

개발용 console 로그는 배포 전에 제거하는 것을 기준으로 둡니다.

## ExampleItem 경로 (참고)

- `src/hooks/useDeviceProductions.ts`
- `src/hooks/usePartners.ts`
- `src/hooks/useCommonCodes.ts`
- `src/hooks/useFarmList.ts` (리포트/농장 목록 계열)

## 관련

- [api-integration-contract](../integration/api-integration-contract)
- [loading-action-ux](../design/loading-action-ux)
