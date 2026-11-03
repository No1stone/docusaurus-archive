---
title: BE 04 facade write
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# BE-04 — Facade 등록·수정·비활성

> **선행:** BE-01 · **다음:** BE-05
> **레퍼런스:** `DeviceProductionFacade` create/update/deactivate

## 이 태스크에서 할 것

- [ ] `createForWeb(WebCreate)` → `service.save(body.toCreate())`
- [ ] `updateForWeb(id, WebUpdate)` → `service.saveById`
- [ ] `deactivateByIdsForWeb(ids)` → `service.deleteByIds` → entity `delete()` status D
- [ ] 쓰기 메서드에 `@Transactional`

## 검수

- [ ] 비활성 후 status D (물리 삭제 X)
