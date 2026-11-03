---
title: FE 05 list chip
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-05 — 목록 Chip (공통코드)

> **선행:** FE-04 · **다음:** FE-06
> **선택:** 공통코드 컬럼이 **있을 때만** 실행
> **레퍼런스:** `FarmLivestockCommonCodeChip`, `LivestockInfoManagePage`

## 이 태스크에서 할 것

- [ ] 목록 셀에 raw code **노출 금지**
- [ ] `*CommonCodeChip` 또는 `livestockCodeLabel` + i18n
- [ ] UNKNOWN 코드 → 도메인 미등록 라벨 (예: `LX000UNKWN`)
- [ ] 라벨용 `nameMaps`는 Page에서 로드 — Chip만 단독 `useCommonCodesByType` 호출 지양 ([common-code-fe-harness](../../integration/common-code-fe-harness.md))

## 하지 말 것

- 상세 Card (FE-06)
- 필터 Select (FE-01a에 이미 있음)

## 검수

- [ ] ko/en 라벨
- [ ] 빈 값 `—`

공통코드 없는 메뉴는 **이 태스크 스킵**.
