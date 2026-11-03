---
title: BE 03 controller list
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# BE-03 — Controller `GET` 목록

> **선행:** BE-02 · **다음:** FE-02 또는 BE-04  
> **레퍼런스:** `DeviceProductionWebController` `GET`

## 이 태스크에서 할 것

- [ ] `@GetMapping` + `@ModelAttribute WebListQuery`
- [ ] `CommonResponseUtils.responseSuccess(facade.searchForWeb(query))`
- [ ] Swagger `@Operation(summary = "Web … 목록")`

## 하지 말 것

- POST/PUT/DELETE (BE-05)
- FE 연동 (FE-02~)

## 검수

→ [QA-after-BE-03-list](./qa/QA-after-BE-03-list.md)
