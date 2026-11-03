---
title: Layout shell
description: Admin 셸, 사이드바, 다크 토글입니다.
---

# Layout shell

> **개요:** Admin 셸, 사이드바, 다크 토글입니다.
> ExampleItem 저장소: `nutech/fe-v1`.

## 슬롯

| 슬롯 | 요구 |
|------|------|
| shell | 헤더 + 사이드바 + 콘텐츠 |
| dark toggle | localStorage 연동 |
| nav keys | RouteTemplate과 1:1 |

## fe-v1 경로

| 역할 | 경로 |
|------|------|
| 레이아웃 | `src/components/templates/AdminLayout.tsx` |
| 사이드바 | `src/components/organisms/AdminSidebar.tsx` |
| 라우트 | `src/components/templates/RouteTemplate.tsx` |
| 다크 토큰 | `src/styles/globals.css` |

## 스모크

- [ ] 다크 토글 후 레이아웃 대비 유지
- [ ] 메뉴 클릭 시 해당 페이지로 전환
- [ ] 좁은 폭에서 사이드바 접기 또는 오버레이

