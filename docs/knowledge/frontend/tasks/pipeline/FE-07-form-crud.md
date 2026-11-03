---
title: FE 07 form crud
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-07 — FormSheet 등록·수정

> **선행:** BE-05, FE-06 · **다음:** FE-08
> **레퍼런스:** `DeviceProductionFormSheet`

## 이 태스크에서 할 것

- [ ] `*FormSheet` mode `create` | `edit`
- [ ] 등록: `status: "A"` 고정, status·JPA 필드 UI 숨김
- [ ] 수정: status A/D + **FE-06b** `JpaAuditInfoSection` (edit 만)
- [ ] 상세에서 “수정” → `formMode=edit`
- [ ] BizEnum Select 필드: `FilterCodeSelectField` + `nameMaps` ([common-code-fe-harness](../../integration/common-code-fe-harness.md)) — 정적 Enum 목록 하드코딩 금지

## 검수

- [ ] 등록 폼에 status 드롭다운 없음
- [ ] camelCase body

API mutation 연결은 FE-08.
