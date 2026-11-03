---
sidebar_position: 2
title: Folder structure
description: FE 가벼운 헥사 폴더 역할과 호출 방향
---

# Folder structure

> **개요:** 콘솔 FE의 폴더 역할과 호출 방향을 고정합니다.
> ExampleItem: `nutech/fe-v1/src`.

## 역할 표

| 폴더 | 책임 | 호출해도 됨 | 호출하면 안 됨 |
|------|------|-------------|----------------|
| `api/` | HTTP 함수, 경로, DTO 매핑 | `utils`의 client | `components`, `pages` |
| `hooks/` | 서버 상태 훅(조회, mutation) | `api`, 필요 시 `stores` 무효화 연계 | 페이지 JSX |
| `stores/` | UI 상태(필터 draft, 시트 열림, 선택) | 없음(또는 순수 util) | `api` 직접 호출을 장기 보관 |
| `components/pages/` | 유스케이스 조립 | hooks, stores, molecules | fetch 직접 |
| `components/templates/` | 레이아웃, 라우트 셸 | organisms, ui | 도메인 API |
| `components/organisms/` | 사이드바, 시트 등 큰 블록 | molecules, atoms, hooks(최소화) | 페이지 전용 스토어 남용 |
| `components/molecules/` | 필터 필드, Chip 행 등 | atoms, ui | 페이지 라우팅 |
| `components/atoms/` / `ui/` | 작은 프리미티브 | 없음 | 비즈니스 규칙 |
| `types/`, `constants/`, `config/` | 계약과 상수 | 어디든 읽기 | 부작용 |

## 호출 방향

```text
pages
  -> hooks + stores + molecules/organisms
hooks
  -> api
api
  -> utils (fetchWithAuth, apiClient)
App / templates
  -> 인증 상태, RouteTemplate, layout
```

## 유스케이스 조립

페이지는 다음만 합니다.

1. 필터 스토어와 조회 훅을 연결합니다.
2. `ManagementPageLayout` 슬롯(filter, table, sheets)을 채웁니다.
3. 공통코드 `nameMaps`를 하위 Chip과 Select에 전달합니다.

비즈니스 fetch와 캐시 키는 hooks와 api에 둡니다.

## fe-v1 경로 힌트

| 관심사 | 경로 |
|--------|------|
| 엔트리 | `src/main.tsx`, `src/App.tsx` |
| 라우트 | `src/components/templates/RouteTemplate.tsx` |
| 관리 레이아웃 | `src/components/templates/ManagementPageLayout.tsx` |
| CMS 골드 예 | `src/components/pages/DeviceProductionManagePage.tsx` |
| 가축 CMS 예 | `src/components/pages/LivestockInfoManagePage.tsx` |
