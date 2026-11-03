---
title: FE 09 id display labels
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-09 — 목록·상세 id → 표시명 (FE)

> **선행:** BE-06, FE-04 · **다음:** FE-06  
> **원칙:** BE-06에서 Map 치환된 값을 **그대로 표시**. raw `*_id` 컬럼 노출 금지.

## BE-06 이후 FE 규칙

| API 필드 | 목록/상세 표시 | 숨김 |
|----------|----------------|------|
| `farmName` | 농장명 컬럼 | `farmId` |
| `eui` | 디바이스 EUI | `deviceId` |
| `createdBy` | 등록자 (이미 표시명) | — |
| `partnerName` 등 | 도메인명 | `partnerId` |

## 이 태스크에서 할 것

- [ ] 테이블 헤더·셀: **이름/EUI/로그인** 컬럼만 (`farmLivestock.list.farm`, `deviceEui` …)
- [ ] `mapItemToRow` / 타입에 `farm_name`, `created_by` 등 표시 필드 매핑
- [ ] 상세 `FieldGrid`: id 대신 enrichment 필드 (`farmName`, `eui`)
- [ ] 값 없음: `—`

## 레퍼런스

- `LivestockInfoManagePage` — `r.farmName`, `r.createdBy` (BE-06 후)
- `DeviceProductionManagePage` — `created_by` 표시명

## BE-06 미적용 시

- [ ] **설계요청** — FE 단독 id→이름 조회 API 추가하지 말 것
- 임시: id + `—` 또는 “미매핑” (릴리즈 전 BE-06 우선)

## 오딧과 구분

- **FE-09:** 비즈니스 FK (`farmId`, `deviceId`, `partnerId` …)
- **FE-06b:** JPA `createdBy` / `updatedAt` (감사 블록)

## 검수

- [ ] 목록에 숫자 farmId·deviceId 컬럼 없음
- [ ] Network 응답에 `farmName` 있는데 UI가 id 보여주지 않음
