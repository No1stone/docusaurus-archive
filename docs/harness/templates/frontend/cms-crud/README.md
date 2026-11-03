---
title: CMS CRUD
description: 관리 CRUD 본진 원셋. DeviceProduction ExampleItem
---

# CMS CRUD

> **개요:** 콘솔 관리 CRUD 본진 원셋입니다.
> ExampleItem: `DeviceProductionManagePage` (보조: `LivestockInfoManagePage`).
> 본진 ExampleItem은 **wired** 트랙입니다. 신규 메뉴는 데모로 슬롯을 맞춘 뒤 wired로 승격할 수 있습니다.
> [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired)

## 슬롯 (전부 필수)

| 슬롯 | 요구 |
|------|------|
| filter | 포털 Select 또는 keyword+status. 공통코드는 Select+nameMaps |
| table | 서버 페이징, 상태 Badge, 공통코드 Chip |
| detail | 행 클릭 Sheet/Card |
| form | 등록/수정 스키마 폼 |
| loading | Skeleton 또는 테이블 placeholder |
| empty | 빈 안내 |
| error | 로드 실패 UI/토스트 |
| action pending | 저장/비활성 중복 제출 방지 |
| dark / responsive | 하드 계약 |

## 짧은 조립 스케치

```text
Page
  useFiltersStore (draft -> applied)
  useDomainListQuery(applied)
  useDomainCodeLabels() -> nameMaps
  ManagementPageLayout
    filter: *SearchForm
    table: ManagementTableShell + Chip columns
    sheets: DetailSheet, FormSheet (mutation.isPending)
```

## fe-v1 경로

| 역할 | 경로 |
|------|------|
| 골드 페이지 | `src/components/pages/DeviceProductionManagePage.tsx` |
| 가축 페이지 | `src/components/pages/LivestockInfoManagePage.tsx` |
| 레이아웃 | `src/components/templates/ManagementPageLayout.tsx` |
| 필터 kit | `src/components/molecules/filters/` |
| 공통코드 훅 | `src/hooks/useCommonCodes.ts` |
| Knowledge | [/docs/knowledge/frontend/integration/console-crud-base-set](/docs/knowledge/frontend/integration/console-crud-base-set) |

## 스모크

- [ ] 필터 조회 후 목록 갱신
- [ ] Chip/Badge에 raw code 없음
- [ ] 상세 열기, 수정 저장 pending
- [ ] 빈 결과와 에러 상태 확인
- [ ] 다크 모드와 768px 폭에서 조작 가능

## 오케스트레이션

[frontend-cms-one-set](/docs/harness/orchestrations/frontend-cms-one-set)
