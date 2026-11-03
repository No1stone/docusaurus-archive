---
title: livestock info
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 태스크 카드 — `livestock-livestock-info`

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `livestock-livestock-info` |
| 메뉴 | 가축(개체) 정보 |
| FE | `LivestockInfoManagePage.tsx` |
| BE | `FarmLivestockWebController.java` |
| 패턴 | **portal-tab-detail** (CRUD 1세트 미완) |

## 적용 Fragment

| 단계 | ID |
|------|-----|
| BE | B01 **△** (L+단건+lifecycle+분석) |
| 필터 | **T01** + `livestockFields` |
| 목록 | **T03** ✓ |
| Chip | **T04** ✓ |
| 상세 | **T05-B** 탭형 + 분석 확장 |
| CUD+X | **T06** ✗ |
| 검수 | **T07** |

## 구현 상태

| L | C | U | D | X |
|---|---|---|---|---|
| ○ | △ | △ | ✗ | ✗ |

## 갭 · 개발자 액션

| # | 항목 | 액션 | 비고 |
|---|------|------|------|
| 1 | Web `createForWeb` / `updateForWeb` / `deactivateByIdsForWeb` | **설계요청** | B01 승격 여부 |
| 2 | FE FormSheet·mutation | **자체설계후적용** | 대량등록 시트와 통합 여부 결정 |
| 3 | 다운로드 | **설계요청** | |
| 4 | 분석 탭 | ○ | farm-livestock-analysis-bff.md (`be-v1/docs/knowledge/frontend/development/farm-livestock-analysis-bff.md`) |
| 5 | 오딧 TZ | ○ | [farm-timezone-display-policy.md](../../integration/farm-timezone-display-policy.md) |

## 관련 문서

- [farm-livestock-portal.md](../../integration/farm-livestock-portal.md) — 인스턴스 상세

## 검수 기록

- [ ] T07 — 필터 공통코드·Chip·목록 createdAt TZ·상세 탭·lifecycle 모달
