---
title: Navigation contract
description: 사이드바 메뉴 key와 RouteTemplate 대응
---

# Navigation contract

> **출처:** CMS 업무 백오피스 FE navigation-contract 승격 요약.

## 포털 가정

Console(admin)에 전체 메뉴와 페이지를 두고 기준을 맞춥니다.
Tenant와 Member는 같은 `RouteTemplate`과 페이지를 재사용하고, 메뉴 노출과 진입 경로만 줄입니다.

## 계약

| 항목 | 위치 |
|------|------|
| 사이드바 메뉴 | `src/components/organisms/AdminSidebar.tsx` |
| 네비 핸들러 | `src/App.tsx`의 `handleNavigate` |
| 라우트 매핑 | `src/components/templates/RouteTemplate.tsx`의 `switch(currentPage)` |

`handleNavigate(menu, submenu)` 포맷:

- submenu 있음: `${menu}-${submenu}`
- submenu 없음: `${menu}`

## 필수 규칙

1. 사이드바 `menuItems`의 `key`는 `RouteTemplate` case와 1:1이어야 합니다.
2. 신규 메뉴는 사이드바, `RouteTemplate`, 필요 시 store reset을 한 번에 수정합니다.
3. 사용자 노출 라벨을 바꿔도 `key`는 가능한 한 고정합니다.

## 체크리스트

- [ ] `components/pages/*Page.tsx` 생성 또는 재사용
- [ ] `RouteTemplate` lazy import와 case
- [ ] `AdminSidebar` 메뉴 key
- [ ] 관련 `stores/*` reset 경로
