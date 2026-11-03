---
title: FE 06 detail audit
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-06 — 상세 Sheet + Card (본문)

> **선행:** FE-04 · **다음:** [FE-06b](./FE-06b-audit-jpa.md) · [FE-09](./FE-09-id-display-labels.md)  
> **레퍼런스:** `DeviceProductionDetailSheet`

## 이 태스크에서 할 것

- [ ] `*DetailSheet` — 행 클릭 시 슬라이딩 패널
- [ ] 읽기 필드: **Card** + `CardTitle` / `CardContent`
- [ ] 공통코드: Chip 또는 FieldGrid ([FE-05](./FE-05-list-chip.md)와 동일 규칙)
- [ ] FK 표시: [FE-09](./FE-09-id-display-labels.md) — `farmName` 등

## 이 태스크에서 하지 말 것

- `JpaAuditInfoSection` → **FE-06b**
- FormSheet → FE-07

## 검수

- [ ] 닫기 시 state reset
- [ ] Card 섹션 `ui-composition-rules` 틀
