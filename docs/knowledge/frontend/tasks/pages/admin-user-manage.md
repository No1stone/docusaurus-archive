---
title: admin user manage
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 태스크 카드 — `admin-admin-user-manage`

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `admin-admin-user-manage` |
| 메뉴 | 관리자(유저) 관리 |
| FE | `AdminManagePage.tsx` |
| BE | `AdminWebController.java` |
| 패턴 | **full-crud** (Table 커스텀) |

## 적용 Fragment

| 단계 | ID |
|------|-----|
| BE | **B01** ✓ |
| 필터 | **T01** (`loginId`, `status`) |
| 목록 | **T03** △ (`AdminTable` — TableShell 대신) |
| 상세 | **T05-A** Register/Detail/Edit Sheet |
| CUD+X | **T06** △ (zustand + React Query 혼합) |
| 검수 | **T07** |

## 구현 상태

| L | C | U | D | X |
|---|---|---|---|---|
| ○ | ○ | ○ | ○ | ✗ |

## 갭 · 개발자 액션

| # | 항목 | 액션 |
|---|------|------|
| 1 | 다운로드 | **설계요청** |
| 2 | `ManagementTableShell` 통일 | **자체설계후적용** — 우선순위 낮음 |

## 검수 기록

- [ ] T07 — loginId 필터·등록·수정·비활성
