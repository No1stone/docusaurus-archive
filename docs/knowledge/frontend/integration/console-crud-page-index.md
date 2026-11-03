---
title: console crud page index
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# Console CRUD — 보조 인덱스 (레퍼런스·갭 메모)

> **상태:** `active`  
> **진입점은 아님.** 공통 작업은 [console-crud-base-set.md](./console-crud-base-set.md) 만 본다.  
> **1세트** = 주 테이블 L/C/U/D. **세부·하위·연관 조회** = 별도 구현 (가축 탭·분석 등).

**범례:** ○ · △ · ✗ · —  
**CRUD:** L C U D X

---

## 골드 스탠다드

| pageId | FE | BE | 카드 |
|--------|----|----|------|
| `production-device-production` | `DeviceProductionManagePage` | `DeviceProductionWebController` | [device-production.md](../tasks/pages/device-production.md) |

---

## 포털 레지스트리 (일부 — 갭 추적용)

필터 공통: [T01](../tasks/fragments/T01-filter-portal-registry.md)

| pageId | FE | BE | L | C | U | D | 비고 |
|--------|----|----|---|---|---|---|------|
| `admin-admin-user-manage` | `AdminManagePage` | `AdminWebController` | ○ | ○ | ○ | ○ | [카드](../tasks/pages/admin-user-manage.md) |
| `weather-weather-lookup` | `WeatherLookupDemoPage` | `WeatherHistoryWebController` | ○ | — | — | — | B02 [카드](../tasks/pages/weather-lookup.md) |
| `livestock-livestock-info` | `LivestockInfoManagePage` | `FarmLivestockWebController` | ○ | △ | △ | ✗ | diff [카드](../tasks/pages/livestock-info.md) |

*파트너·재고·생산 등록 등 — 기본셋 적용 후 필요 시 행 추가.*

---

## 단순 필터 (T02) 메모

| pageId | FE | BE | 패턴 |
|--------|----|----|------|
| `ops-notification-message` | `AlarmMessageManagePage` | `AlarmMessageWebController` | B02 [카드](../tasks/pages/alarm-message.md) |

---

## UI 공통 (기본셋에 포함)

| 영역 | 태스크 |
|------|--------|
| 필터 Select + 하단 검색어 | FE-01a / FE-01b |
| 목록 + Badge | FE-04 |
| id→이름 (farmName, createdBy…) | BE-06 + FE-09 |
| 공통코드 Chip | FE-05 |
| 상세 Card | FE-06 |
| JPA 오딧 | FE-06b | QA-FE-06b |
| i18n ko/en | FE-10 | QA-FE-10 |

---

## 행 추가 규칙

기본셋 적용·T07 검수 **후** diff가 남으면 여기 한 줄 + `tasks/pages/{pageId}.md` (선택).
