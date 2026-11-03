---
title: Query key and cache rules
description: 캐시 키, 무효화, stale 응답, 다운로드와의 관계
---

# Query key and cache rules

> **채택 기준.** 특정 캐시 라이브러리를 강제하지 않습니다.
> 캐시는 **화면 연결 훅·서버 상태 계층**이 다룹니다. Flow·개별 기능은 훅/캐시 API를 소유하지 않습니다.
> ExampleItem 경로 예: `nutech/fe-v1` hooks (이력).

## 기본 키 패턴

```text
[domain, 'list' | 'detail', params]
```

응답에 영향을 주는 조회 조건은 `params`에 넣습니다.
사용자·워크스페이스별로 결과가 다르면 키에 그 식별자를 포함하고, 전환 시 invalidate/clear 정책을 정합니다.

| 구분 | 예 |
|------|-----|
| 목록 | `['deviceProduction', 'list', listParams]` |
| 상세 | `['deviceProduction', 'detail', id]` |
| 공통코드 | 타입별 키 |

## mutation 이후

1. 관련 list/detail **무효화(invalidate)** 를 우선합니다.
2. 즉시 UI가 필요하면 `setQueryData`는 보조입니다.
3. UI Store에 서버 목록을 복사하지 않습니다. [state-ownership-model](./state-ownership-model)

## 검색·페이지

- 검색(applied) 조건이 바뀌면 **page를 0으로** 둡니다.
- 늦게 도착한 이전 요청이 새 결과를 덮지 않게 합니다 (쿼리 키 세대, cancel, 또는 무시).

## 다운로드

- 목록 export는 **applied 필터** 기준입니다. 신규: 화면 연결 → Export 기능 → 계약 → Http. [excel-download](/docs/harness/templates/frontend/excel-download/)
- page size **100**은 ExampleItem 기본 예입니다. 서버 제한·정렬·규모에 따라 교체합니다.
- 반복 클릭·실패·언마운트 시 진행 중 결과를 무시하는 기준을 둡니다. 캐시 재시도·취소와 Flow 정책을 이중화하지 않습니다.

## 공통코드 캐시

- typeId 단위, 화면에서 쓰는 타입만.
- 시트는 페이지 `nameMaps` 재사용.

## ExampleItem 경로 (참고)

- `src/hooks/useDeviceProductions.ts`
- `src/hooks/useCommonCodes.ts`

## 관련

- [state-ownership-model](./state-ownership-model)
- [application-structure](../architecture/application-structure)
- [api-integration-contract](../integration/api-integration-contract)
- [loading-action-ux](../design/loading-action-ux)
