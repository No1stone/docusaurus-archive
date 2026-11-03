---
title: Management filter kit
description: 관리 목록 필터 molecule 규칙
---

# Management filter kit

> **출처:** FarmPro FE `architecture/management-filter-kit.md` 승격 요약.

## 위치

`fe-v1/src/components/molecules/filters/`

## 원칙

1. `ManagementPageLayout`의 `filter` 슬롯만 페이지별로 다릅니다.
2. 날짜, 기간, 검색 버튼은 공통 molecule로 두고 페이지마다 복붙하지 않습니다.
3. 도메인 `*SearchForm`은 필드 조합과 스토어 `setFilters`만 담당합니다.

## export 요약

| 컴포넌트 | 역할 |
|----------|------|
| `ManagementFilterPanel` | 필터 박스 래퍼 |
| `FilterDateField` | 단일 날짜 |
| `FilterDateRangeField` | 시작~종료 (UI 기본 최대 3개월) |
| `FilterSearchButtons` | 검색과 초기화 |

상세는 fe-v1 `molecules/filters/README.md`를 봅니다.
