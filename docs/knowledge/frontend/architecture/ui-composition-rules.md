---
title: UI composition rules
description: ui부터 pages까지의 조립 규칙. 카드 섹션과 필터 슬롯
---

# UI composition rules

> **개요:** 컴포넌트 계층 조립 규칙입니다.
> FarmPro FE `docs/guidelines/architecture/ui-composition-rules.md`와 데모/관리 UI에서 쓰던 패턴을 아카이브용으로 정리했습니다.
> 앱 코드를 이 문서 때문에 수정할 필요는 없습니다.

## 계층 범위

| 계층 | 역할 |
|------|------|
| `ui` | 재사용 프리미티브만 |
| `atoms` | 작은 조합 |
| `molecules` | 필터 필드, Chip 행, 섹션 조각 |
| `organisms` | 도메인 맥락 블록. API 호출은 최소화 |
| `templates` | 레이아웃, 표 셸, 라우트 셸 |
| `pages` | 비즈니스 플로우 조립. 상태/데이터는 하위(훅, 스토어)에 위임 |

## 규칙

1. `ui`에는 도메인 fetch와 스토어를 두지 않습니다.
2. `organisms`는 화면 덩어리를 담되, 목록 조회의 주 소유는 page + hooks에 둡니다.
3. `pages`는 슬롯을 채우는 조립에 집중합니다.

## 목록 필터

- `ManagementPageLayout`의 `filter` 슬롯만 페이지별로 필드 조합이 다릅니다.
- 공통 kit: [management-filter-kit](./management-filter-kit).

## 소제목 + 데이터 블록 (카드 우선)

데모 UI, 관리 목록 주변 패널, 시트 상세 본문에서 섹션(소제목 아래 필드, 요약, 읽기 전용 그리드)을 나눌 때는 카드 패턴을 기본으로 합니다.

| 패턴 | 내용 |
|------|------|
| Card | `Card` > `CardHeader` + `CardTitle`(소제목) > `CardContent` |
| 테이블 래핑 | 표는 `CardContent`에 `p-0` 등으로 여백을 맞춤 |
| 시스템 정보 틀 | `rounded-lg border bg-muted/30 p-4` (`JpaAuditInfoSection` 계열과 동일 계열) |
| 섹션 간격 | `Separator` 또는 `space-y-6` |

신규 작업에서는 `bg-muted/30`만 있는 플레인 블록보다 `border`까지 맞춘 카드를 선호합니다.

## ExampleItem 경로 (참고)

- 레이아웃: `ManagementPageLayout`, `ManagementTableShell`
- 상세 카드/시트: `FarmInfoDemoDetailSheet`, `PrototypeDetailSheet`, `FarmConsoleDetailContent`
- 필터: `MenuFilterPanel`, `molecules/filters/`

## 관련

- [folder-structure](../folder-structure)
- [report-readonly 원셋](/docs/harness/templates/frontend/report-readonly/)
