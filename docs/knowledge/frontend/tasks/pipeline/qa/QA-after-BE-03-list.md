---
title: QA after BE 03 list
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA-after-BE-03 — 목록 API

> **선행:** [BE-03](../BE-03-controller-list.md) · pageId: ________

- [ ] `GET /web/{resource}` 200, `code` 성공
- [ ] `page`, `size`, `keyword`, `status` 쿼리 반영
- [ ] 기본 정렬: Long/Integer PK → `id DESC`; 그 외 → `createdAt DESC` (list-sort-default (`be-v1/docs/knowledge/frontend/development/console-web-bff-list-sort-default.md`))
- [ ] Swagger `Web` summary 존재

**판정:** ☐ 통과 · ☐ 실패(→ BE-03 수정 세션)
