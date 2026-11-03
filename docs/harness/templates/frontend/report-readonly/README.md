---
title: Report readonly
description: 읽기 전용 보고 원셋. fe-v1 데모에서 쓰인 패턴을 슬롯으로 고정
---

# Report readonly

> **개요:** 읽기 전용 보고 화면 원셋입니다.
> CMS 업무 백오피스 FE에서 한동안 쓰인 농장 정보/리포트 데모 페이지 패턴을 아카이브에 정리한 것입니다.
> **fe-v1 앱을 수정하지 않아도 됩니다.** 새 저장소나 문서 작업의 복사 기준입니다.

## 데모와 wired

이 원셋 ExampleItem 경로는 대부분 **데모 트랙**입니다.
슬롯은 mock과 API가 같아야 하지만, **페이지 파일은 나눕니다.**
데모에 API 훅을 장기 혼입하지 않습니다.
상세: [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired).

## 목표

필터로 조회하고, 표(또는 요약 블록)로 읽기만 합니다.
등록/수정 FormSheet가 본진이 아닙니다.
상세는 읽기 Sheet/카드로 열고, 편집이 있으면 “데모/별도 모드”로 명시합니다.

## 슬롯

| 슬롯 | 요구 |
|------|------|
| filter | 포털 스코프, 기간, keyword 등. 공통 kit 또는 `MenuFilterPanel` 계열 |
| readonly table | `ManagementTableShell` + 행 클릭 시 읽기 상세 |
| detail readonly | Card 섹션 조립 ([ui-composition-rules](/docs/knowledge/frontend/architecture/ui-composition-rules)) |
| loading / empty / error | CMS와 동일 계열 ([loading-action-ux](/docs/knowledge/frontend/design/loading-action-ux), [error-timeout-policy](/docs/knowledge/frontend/integration/error-timeout-policy)) |
| cache | 목록/상세 키 분리, 조회 파라미터를 key에 포함 ([query-cache-rules](/docs/knowledge/frontend/state/query-cache-rules)) |
| codes | Chip + nameMaps. raw code 금지 |
| dark / responsive | 하드 계약 |

## 조립 스케치

```text
ReportPage
  portal/farm scope filter (applied)
  listQuery(applied)          # mock 또는 API 훅
  codeLabels -> nameMaps
  ManagementPageLayout
    filter: MenuFilterPanel | *SearchForm
    table: ManagementTableShell (읽기)
    detail: *DetailSheet (Card 섹션, 감사 정보 블록)
```

데모: `data/*Mocks` + 동일 슬롯.
wired: 별도 `*Page`에서 목록 훅(`useFarmList` 등)을 붙입니다.
슬롯 계약은 mock/API와 무관하게 같고, **파일을 합치지 않습니다.**

## ExampleItem 경로 (fe-v1, 참고 전용)

| 역할 | 경로 |
|------|------|
| 농장 정보/리포트 데모 페이지 | `src/components/pages/FarmInfoReportDemoPages.tsx` |
| 가축 센서 리포트 데모 | `src/components/pages/LivestockInfoReportSensorDemoPages.tsx` |
| 목 데이터 | `src/data/farmInfoReportMocks.ts` |
| 상세 시트 | `src/components/organisms/FarmInfoDemoDetailSheet.tsx` 등 |
| 목록 훅(실데이터 쪽) | `src/hooks/useFarmList.ts` |
| 레이아웃 | `src/components/templates/ManagementPageLayout.tsx` |

## CMS와의 차이

| | cms-crud | report-readonly |
|--|----------|-----------------|
| 본진 | Form CUD | 조회와 읽기 상세 |
| mutation | 필수 | 없거나 명시적 예외(데모 편집) |
| bulk | 선택 | 업로드가 있어도 “보고 등록” 보조 |

## 스모크

- [ ] 필터 적용 후 목록이 바뀜
- [ ] 행 상세가 읽기 중심으로 열림
- [ ] loading / empty / error 각각 확인
- [ ] Chip/Badge에 raw code 없음
- [ ] 다크, 좁은 폭에서 필터와 표 조작 가능

## 관련 Knowledge

- [ui-composition-rules](/docs/knowledge/frontend/architecture/ui-composition-rules)
- [query-cache-rules](/docs/knowledge/frontend/state/query-cache-rules)
- [error-timeout-policy](/docs/knowledge/frontend/integration/error-timeout-policy)
- [console-crud-base-set](/docs/knowledge/frontend/integration/console-crud-base-set) (목록 셸 공유)
