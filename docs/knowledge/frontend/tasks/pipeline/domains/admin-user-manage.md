---
title: admin user manage
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 도메인 시트 — `admin-admin-user-manage`

> **유형 C** 사용자관리 · full CRUD (Table 커스텀)

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `admin-admin-user-manage` |
| 메뉴명 | 관리자(유저) |
| Entity | `Admin` |
| Web | `/web/admins` |
| 필터 | FE-01a (`loginId`, `status`) |
| Chip | — |
| diff | `AdminTable` (TableShell 대신), zustand + RQ |

## 태스크 진행

| ID | 문서 | 완료 |
|----|------|------|
| BE-01 ~ BE-05 | | [x] |
| FE-01a | [FE-01a](../FE-01a-filter-portal.md) | [x] |
| FE-02 ~ FE-03 | | [x] |
| FE-04 | [FE-04](../FE-04-page-list.md) | [x] △ AdminTable |
| FE-05 | — | — |
| FE-06 ~ FE-08 | | [x] △ download ✗ |
| QA-after | [qa/README](../qa/README.md) | [ ] |

## 파일맵

```
be-v1/.../admin/controller/web/AdminWebController.java
fe-v1/src/api/adminManage.ts
fe-v1/src/hooks/useAdminUsers.ts
fe-v1/src/components/pages/AdminManagePage.tsx
fe-v1/src/components/organisms/Admin{Register,Detail,Edit}Sheet.tsx
```

## 갭

| 항목 | 액션 |
|------|------|
| 다운로드 | 설계요청 |
| ManagementTableShell 통일 | 우선순위 낮음 |
