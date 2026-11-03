---
title: Management filter kit
description: ManagementPageLayout filter 슬롯 공통 molecule. 표준 UI와 export
---

# Management filter kit

> **아카이브 원본:** 이 문서가 FE 필터 킷의 공통 기준입니다.
> FarmPro FE `src/components/molecules/filters/README.md`와 guidelines 요약을 합쳐 승격했습니다.
> ExampleItem 코드 경로는 `nutech/fe-v1/src/components/molecules/filters/` 입니다.

## 위치

`ManagementPageLayout`의 **`filter` 슬롯**에 넣는 공통 조각입니다.
표준 UI는 공지사항·FAQ 관리(`NoticeSearchForm`, `FaqSearchForm`)와 동일합니다.

ExampleItem 구현 경로: `nutech/fe-v1/src/components/molecules/filters/`

## 원칙

1. `filter` 슬롯만 페이지별로 필드 조합이 다릅니다.
2. 날짜, 기간, 검색 버튼은 공통 molecule로 두고 페이지마다 복붙하지 않습니다.
3. 도메인 `*SearchForm`은 필드 조합과 스토어 `setFilters`만 담당합니다.
4. 목록은 이중 Card 없이 `ManagementTableShell`만 둡니다.

## 표준 UI (공지·FAQ)

| 요소 | 규칙 |
|------|------|
| 래퍼 | `bg-card p-4 rounded-lg border` |
| 한 줄 | `flex items-end gap-3` (필요 시 wrap) |
| 라벨 | `text-sm text-muted-foreground` (검색어, 상태 등) |
| 입력 | `Input` `h-8`, `SelectTrigger` `size="sm"` |
| 버튼 | `FilterSearchButtons` (검색·초기화, 아이콘) |

데모와 `ManagementPageLayout` 페이지는 **`ManagementFilterPanel`** + **`FilterKeywordField`**로 위 패턴을 맞춥니다.

## export

| export | 용도 |
|--------|------|
| `ManagementFilterPanel` | 필터 영역 래퍼 (기본 `variant="card"`) |
| `filterFieldLabelClass` | Select 등 추가 필드 라벨 class |
| `FilterKeywordField` | 검색어 Input (단일 키워드) |
| `FilterDateField` | 단일 날짜 (`YYYY-MM-DD`) |
| `FilterDateRangeField` | 시작일·종료일 (기본 최대 3개월) |
| `FilterSearchButtons` | 검색·초기화 (`FilterSearchButtons.tsx`) |

## 도입 순서

1. `filter={<ManagementFilterPanel>…</ManagementFilterPanel>}`
2. 필드 + `FilterSearchButtons` (API 연동은 `*SearchForm` + react-hook-form 유지)
3. 목록은 `ManagementTableShell`만

## API 연동 SearchForm

`NoticeSearchForm` / `FaqSearchForm`은 스토어·스키마가 있어 그대로 두고, 신규 API 폼도 동일 클래스만 맞춥니다.
날짜가 필요하면 `FilterDateRangeField`를 패널 안에 추가합니다.

## 관련

- [ui-composition-rules](./ui-composition-rules)
- [demo-vs-wired](./demo-vs-wired)
- [cms-crud 원셋](/docs/harness/templates/frontend/cms-crud/)
- Fragment [T01](/docs/knowledge/frontend/tasks/fragments/T01-filter-portal-registry), [T02](/docs/knowledge/frontend/tasks/fragments/T02-filter-simple-keyword)
