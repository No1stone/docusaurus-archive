---
title: T04 list common code chip
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# T04 — 목록 공통코드 Chip

> 조각 ID: `T04` · 공통코드 컬럼이 있는 목록

## 규칙

- 테이블 셀에 **raw code 노출 금지** (미등록·UNKNOWN 포함)
- `*CommonCodeChip` 또는 도메인 Chip + `livestockCodeLabel` / `use*CodeLabels`

## 구현 체크

- [ ] Chip variant: code 유형별 색/아이콘 (도메인 convention 따름)
- [ ] UNKNOWN: i18n 라벨 (예: `LX000UNKWN` → 미등록)
- [ ] 빈 값: `—` 또는 muted Chip

## 레퍼런스

- `FarmLivestockCommonCodeChip.tsx`
- `LivestockInfoManagePage.tsx` 목록 컬럼
- FE 공통코드 캐시·i18n: [common-code-fe-harness.md](../../integration/common-code-fe-harness.md)

## 검수

- [ ] ko/en 라벨
- [ ] 코드 변경 없이 라벨만 API/캐시에서 갱신
