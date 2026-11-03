---
title: BE 02 facade list
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# BE-02 — Facade `searchForWeb`

> **선행:** BE-01 · **다음:** BE-03  
> **레퍼런스:** `DeviceProductionFacade.searchForWeb`

## 이 태스크에서 할 것

- [ ] `searchForWeb` → **자기** `{Domain}Service.search` 만 호출 — 표시명 Map은 [BE-06](./BE-06-display-map.md)
- [ ] `query.toPageable()` — PK Long/Integer; String PK 등은 `createdAt DESC` — list-sort-default (`be-v1/docs/knowledge/frontend/development/console-web-bff-list-sort-default.md`)
- [ ] Facade 의존성: 자기 `*Service` + 타 도메인 `*Facade` 만 — console-bff-facade-dependency-rule.md (`be-v1/docs/knowledge/frontend/development/console-bff-facade-dependency-rule.md`)
- [ ] 클래스 `@Transactional(readOnly = true)` — 쓰기 메서드는 BE-04에서

## 하지 말 것

- 타 도메인 `*Service` 직접 주입
- Controller 매핑 (BE-03)
- create/update/deactivate (BE-04)

## 검수

- [ ] Facade 단독 호출로 Page 반환
- [ ] Facade 의존성 → [QA-after-BE-02-facade-deps](./qa/QA-after-BE-02-facade-deps.md)
- [ ] 표시명은 [BE-06](./BE-06-display-map.md) 완료 후 검수
