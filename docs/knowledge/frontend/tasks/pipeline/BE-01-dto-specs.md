---
title: BE 01 dto specs
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# BE-01 — Web DTO + Specs `forWebList`

> **선행:** 없음 · **다음:** BE-02
> **레퍼런스:** `DeviceProductionReq.java`, `FarmLivestockRes.java`, `AlarmMessageRes.WebDetail`

## 이 태스크에서 할 것

- [ ] `{Domain}Req.WebListQuery` — `extends PageQuery`, `keyword`, `status`(all/A/D)
- [ ] (CUD 예정 시) `WebCreate` / `WebUpdate` + `toCreate()` / `toUpdate()`
- [ ] `{Domain}Res` — **Res 계층** `Id` → `Name` → `Single` → `Item` (연관 DTO 패턴 (`be-v1/docs/knowledge/frontend/development/console-bff-dto-association-pattern.md`))
- [ ] `{Domain}Res.WebListItem` — `extends Item`, **화면에 필요한 연관 필드만**
- [ ] (상세 있으면) `WebDetail` — `extends WebListItem`
- [ ] `{Domain}Res.WebCreated` / `WebUpdated` (등록·수정 응답)
- [ ] `{Domain}Specs.forWebList(query)` — keyword는 **이름 컬럼 LIKE만**, status `EnStatus.of`
- [ ] 목록 정렬: PK `Long`/`Integer` → `toPageable()`; 그 외 → Facade에서 `createdAt DESC` — list-sort-default (`be-v1/docs/knowledge/frontend/development/console-web-bff-list-sort-default.md`)

### 연관 필드 규칙

- FK 스칼라(`farmId`) → `Single` — **단방향 FK 우선**, Entity 양방향·cascade로 하위 persist 하지 않음
- 연관 객체 → `Item` / `WebListItem` / `WebDetail`에만 — **끊어 조회 후 Facade 조립** (배경 §0 (`be-v1/docs/knowledge/frontend/development/console-bff-dto-association-pattern.md`))
- 타입: `{Other}Res.Item` 또는 `Name`, 또는 동일 파일 Web 슬림 inner (`FarmAffiliation` 패턴)
- 목록 이름만: `farmName`·`eui` 등 — [BE-06](./BE-06-display-map.md)에서 Facade 보강

## 하지 말 것

- 별도 `*WebListQuery.java` / `*WebRes.java` 파일
- `Single`에 자식 연관 전개
- Web API가 레거시 `Item` 그대로 반환
- Facade·Controller (BE-02~)

## 검수

- [ ] `forWebList` 단위로 status all/A/D 동작
- [ ] keyword에 PK·UUID 컬럼 없음
- [ ] `WebListItem`에 불필요 연관·전체 Entity 필드 없음
