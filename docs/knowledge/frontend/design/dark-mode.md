---
title: Dark mode
description: FE 다크 모드 하드 계약
---

# Dark mode

> **개요:** 콘솔 FE에서 다크 모드는 하드 규칙입니다.
> ExampleItem: fe-v1 `AdminLayout` 토글과 `globals.css`의 `.dark` 토큰.

## 계약

1. 루트에 dark class(또는 동등한 테마 스위치)를 둘 수 있어야 합니다.
2. 표면, 테두리, 텍스트는 라이트와 다크 토큰을 함께 정의합니다.
3. 상태 색(성공, 경고, Chip)은 `dark:` 대비를 확인합니다.
4. raw hex만 하드코딩해 다크에서 뭉개지는 UI를 만들지 않습니다.

## fe-v1 근거

- 토글과 localStorage: `src/components/templates/AdminLayout.tsx`
- 토큰: `src/styles/globals.css` (`@custom-variant dark`, `.dark { ... }`)

## 검수

- [ ] 다크 전환 후 사이드바, 표, 필터, 시트가 읽힘
- [ ] Chip과 Badge 테두리가 보임
- [ ] 경고/정보 박스 대비 유지
