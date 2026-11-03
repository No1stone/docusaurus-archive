---
title: T05 detail card sheet
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# T05 — 상세 (Card · FieldGrid · Chip)

> 조각 ID: `T05`

## 패턴 A — FormSheet 연동 (표준 CRUD)

- `*DetailSheet` — 읽기 전용 필드
- 수정 → `*FormSheet` mode=edit
- `JpaAuditInfoSection` variant=`card` + `pickJpaAuditFields`

## 패턴 B — 탭형 상세 (가축 등)

- `AppSlidingPanel` + `Tabs`
- 탭별 `Card` + `FarmLivestockFieldGrid`
- 부분 수정: Dialog + 부분 PUT
- 오딧: 상세 하단 `JpaAuditInfoSection` (포털 농장 시 `auditTimeZone`)

## 패턴 C — 조회 전용 (날씨 등)

- `PrototypeDetailSheet` / `PrototypeDetailFields`
- 목록 row 또는 단건 GET 데이터

## UI 규칙

- 섹션: `Card` + `CardTitle` (`ui-composition-rules`)
- 공통코드: Chip 또는 읽기 Select appearance
- 통계 시계열: TZ 재변환 금지 ([farm-timezone-display-policy.md](../../integration/farm-timezone-display-policy.md))

## 검수

- [ ] 상세 로딩/실패
- [ ] 닫기 시 state reset
- [ ] 오딧 필드만 farm TZ (해당 메뉴)
