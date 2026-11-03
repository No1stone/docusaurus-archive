---
title: BE 06 display map
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# BE-06 — 표시명 MAP (id → 도메인 이름)

> **선행:** BE-02 · **다음:** BE-03 또는 FE-02  
> **원칙:** `*_id` / UUID 는 **화면에 raw 노출 금지**. Facade에서 **일괄 조회 → Map → DTO 치환** 후 내려준다.

## 공통 Facade (api-console)

| Facade | 키 | 치환 대상 필드 | 표시 필드 / in-place |
|--------|-----|----------------|----------------------|
| `UserNameFacade` | `ad_admin.id` / `me_member.id` | `createdBy`, `updatedBy` | **in-place** 표시명 |
| `FarmNameFacade` | `fa_farm.id` | `farmId` | `farmName` setter |
| `SensorEuiFacade` | `de_sensor.id` | `deviceId` | `eui` setter |

경로: `be-v1/api-console/.../common/facade/`

## 이 태스크에서 할 것

- [ ] `searchForWeb` (또는 `findByIdForWeb`) 마지막에 `applyWebListEnrichment(items)` 호출
- [ ] `applyWebListEnrichment` — **`UserNameFacade` / `FarmNameFacade` / `SensorEuiFacade` 등만** (타 도메인 Service 직접 호출 금지) — console-bff-facade-dependency-rule.md (`be-v1/docs/knowledge/frontend/development/console-bff-facade-dependency-rule.md`)
- [ ] **오딧:** `userNameFacade.applyAuditorDisplayNames(...)` — createdBy/updatedBy getter·setter
- [ ] **농장:** `farmNameFacade.applyFarmNames(..., Item::getFarmId, Item::setFarmName)`
- [ ] **센서:** `deviceId` 있으면 `sensorEuiFacade.applySensorEuis(..., Item::getDeviceId, Item::setEui)`
- [ ] 목록 Page **한 번** 조회 후 id 수집 → Map (N+1 금지)

## 패턴 (복사)

```java
private void applyWebListEnrichment(List<{Domain}Res.WebListItem> items) {
    userNameFacade.applyAuditorDisplayNames(
        items,
        WebListItem::getCreatedBy, WebListItem::setCreatedBy,
        WebListItem::getUpdatedBy, WebListItem::setUpdatedBy
    );
    farmNameFacade.applyFarmNames(
        items,
        WebListItem::getFarmId,
        WebListItem::setFarmName
    );
    // 도메인에 맞게 추가 Facade만
}
```

## 레퍼런스

- `FarmLivestockFacade.applyWebListEnrichment`
- `DeviceProductionFacade.searchForWeb` (UserName만)
- `WeatherHistoryWebFacade` (farmName)

## 신규 `*_id` 가 있을 때

1. 기존 `*Facade`에 `findNameMap` / `apply*` 있는지 검색
2. 없으면 **도메인 Facade**에 Map 조회 추가 (Service `findByIds` 범위 조회)
3. Web DTO에 **표시용 필드** 추가 (`partnerName` 등) — id 컬럼은 FE 목록에서 숨김

## 하지 말 것

- Controller에서 Map
- 목록 row마다 `findById` 반복
- FE에 raw id만 내려주고 표시명은 FE에서 전부 조회 (BFF 역할 위반)

## 검수

→ [QA-after-BE-06-map](./qa/QA-after-BE-06-map.md)
