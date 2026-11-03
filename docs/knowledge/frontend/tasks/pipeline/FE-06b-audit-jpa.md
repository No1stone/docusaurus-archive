---
title: FE 06b audit jpa
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-06b — JPA 오딧 표시 (공통)

> **선행:** FE-06 (상세 Sheet) · **다음:** FE-07
> **관련:** [farm-timezone-display-policy.md](../../integration/farm-timezone-display-policy.md) (포털 농장 TZ)

## 이 태스크에서 할 것

### 상세·수정 폼

- [ ] `import { pickJpaAuditFields } from "../../types/jpaAudit"`
- [ ] `JpaAuditInfoSection` `variant="card"` + `pickJpaAuditFields(row)`

```tsx
<JpaAuditInfoSection
  variant="card"
  data={pickJpaAuditFields(row)}
  className="mt-4"
  auditTimeZone={/* 포털 농장만 — 아래 */}
/>
```

### CreatedEntity만 (날씨 등)

- [ ] `scope="createdOnly"` + `pickJpaCreateAuditFields`

### 목록 `createdAt` (선택)

- [ ] 일반 콘솔: `formatAuditDateTime` / row 문자열 그대로
- [ ] 포털 농장: `formatFarmAuditDt(createdAt, useFarmWorkspaceTimezone(user))`

### TZ

| 메뉴 | 일시 |
|------|------|
| 일반 admin | `auditTimeZone` 생략 → 브라우저 로컬 |
| 포털 농장 | `auditTimeZone={readStoredFarmWorkspaceTimezone()}` |

**통계·`stat_local_hour`·분석 차트에는 TZ 변환 금지** (오딧만).

## BE와 역할 분리

| 필드 | BE (BE-06) | FE (본 태스크) |
|------|------------|----------------|
| `createdBy` / `updatedBy` | UserNameFacade → 표시명 in-place | `resolveUserLabel` 은 BE 미적용 시만 |
| `createdAt` / `updatedAt` | UTC ISO 저장 | **표시** 시 TZ 변환 (오딧만) |

## `resolveUserLabel` (예외)

BE-06 적용 후에는 보통 **불필요**. raw id가 남을 때만:

```tsx
<JpaAuditInfoSection
  data={pickJpaAuditFields(row)}
  resolveUserLabel={(id) => userLabelMap.get(id)}
/>
```

## 검수

→ [QA-after-FE-06b-audit](./qa/QA-after-FE-06b-audit.md)

## 하지 말 것

- BE에 audit TZ API 추가
- 비즈니스 이벤트 일시에 farm TZ (오딧 외)
