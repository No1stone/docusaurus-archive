---
title: livestock info
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

> **범위:** 도메인 예시입니다. CMS 업무 백오피스 공통 표준이 아닙니다.
> 공통 표준은 Frontend 하드 규칙, cms-crud 원셋, cms-backoffice-fe 프로필을 봅니다.

# 도메인 시트 — `livestock-livestock-info`

> **유형 B** 포털 + Chip · **1세트** 진행 중 · **조회·탭은 도메인 diff** (별도 유지·수시 UI 변경)

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `livestock-livestock-info` |
| 메뉴명 | 가축(개체) 정보 |
| Entity | `FarmLivestock` / `fa_farm_livestock` |
| Web | `/web/farm-livestocks` |
| 필터 | FE-01a (`livestockFields` in registry) |
| Chip | FE-05 `FarmLivestockCommonCodeChip` |
| 오딧 | FE-06 + [farm TZ](../../../integration/farm-timezone-display-policy.md) |
| diff | 탭·lifecycle·분석 — **1세트 밖** [farm-livestock-portal.md](../../../integration/farm-livestock-portal.md) |

## 도메인 diff (별도 — 파이프라인 완료와 무관)

| 항목 | BE | FE | 비고 |
|------|----|----|------|
| 탭 상세·조회 UI | lifecycle PUT, analysis GET | `FarmLivestockDetailSheet`, `*Tab` | UI 수시 변경 |
| 분석 BFF | `FarmLivestockAnalysisFacade` | `farmLivestockAnalysis.ts` | analysis-bff (`be-v1/docs/knowledge/frontend/development/farm-livestock-analysis-bff.md`) |

## 태스크 진행 (1세트만)

| ID | 문서 | 완료 | 비고 |
|----|------|------|------|
| BE-01 | [BE-01](../BE-01-dto-specs.md) | [x] | `forWebList` |
| BE-02 | [BE-02](../BE-02-facade-list.md) | [x] | |
| BE-06 | [BE-06](../BE-06-display-map.md) | [x] | User+Farm+Sensor |
| BE-03 | [BE-03](../BE-03-controller-list.md) | [x] | + findById |
| BE-04 | [BE-04](../BE-04-facade-write.md) | [△] | lifecycle만, full CUD ✗ |
| BE-05 | [BE-05](../BE-05-controller-write.md) | [△] | lifecycle PUT만 |
| FE-01a | [FE-01a](../FE-01a-filter-portal.md) | [x] | |
| FE-02 | [FE-02](../FE-02-api-list.md) | [x] | |
| FE-03 | [FE-03](../FE-03-hooks-list.md) | [x] | list only |
| FE-04 | [FE-04](../FE-04-page-list.md) | [x] | |
| FE-09 | [FE-09](../FE-09-id-display-labels.md) | [x] | farmName, createdBy |
| FE-05 | [FE-05](../FE-05-list-chip.md) | [x] | |
| FE-06 | [FE-06](../FE-06-detail-audit.md) | [x] | 탭형 |
| FE-06b | [FE-06b](../FE-06b-audit-jpa.md) | [x] | farm TZ |
| FE-07 | [FE-07](../FE-07-form-crud.md) | [ ] | **설계요청** |
| FE-08 | [FE-08](../FE-08-mutations-download.md) | [ ] | |
| QA-01 | [QA-01](../QA-01-verify-menu.md) | [ ] | CUD 후 |

## 다음 세션 추천

1. `BE-04`~`BE-05` full CUD Web 노출 여부 결정
2. `FE-07` FormSheet vs 모달 유지 결정 후 태스크 실행
3. `QA-01`

## 파일맵

```
be-v1/.../farm/dto/FarmLivestockReq.java
be-v1/.../farm/facade/FarmLivestockFacade.java
be-v1/api-console/.../farm/controller/web/FarmLivestockWebController.java
fe-v1/src/api/farmLivestock.ts
fe-v1/src/hooks/useFarmLivestock.ts
fe-v1/src/components/pages/LivestockInfoManagePage.tsx
fe-v1/src/components/organisms/FarmLivestockDetailSheet.tsx
```
