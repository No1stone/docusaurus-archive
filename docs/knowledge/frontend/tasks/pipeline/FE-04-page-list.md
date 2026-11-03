---
title: FE 04 page list
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-04 — 페이지 목록 셸

> **선행:** FE-01a/b, FE-03 · **다음:** FE-05 또는 FE-06
> **레퍼런스:** `DeviceProductionManagePage`

## 이 태스크에서 할 것

- [ ] `ManagementPageLayout` — `filter` / `list`
- [ ] `ManagementTableShell` — 페이징, 선택, `onRegister` (비활성·다운로드는 FE-08)
- [ ] 테이블 컬럼 — id, 이름, **상태 Badge** (활성/비활성, `A`/`D` 문자열 금지)
- [ ] 행 클릭 → `setSelected` (상세는 FE-06)
- [ ] `deleteLabel` 자리만预留 (FE-08)

## UI

- 상태: `Badge` + i18n `statusA` / `statusD`
- 로딩·빈 목록·`loadFailed` 토스트

## 하지 말 것

- Chip (FE-05)
- DetailSheet (FE-06)

## 검수

→ [QA-after-FE-04-list](./qa/QA-after-FE-04-list.md)
