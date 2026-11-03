---
title: QA signoff
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA-signoff — 메뉴 릴리즈 체크 (선택)

> **선행:** 해당 메뉴의 `QA-after-*` 전부 통과 + **[QA-fe-import-check](./QA-fe-import-check.md)**
> **역할:** 통합 테스트 아님 — **체크리스트 마감**만

- pageId: ________
- [ ] [QA-fe-import-check](./QA-fe-import-check.md) — 변경 파일 **import** + `build:console` (또는 site build) + 화면 스모크
- [ ] domains 시트 — 계획한 QA-after-* 전부 [x]
- [ ] 갭 있으면 [console-crud-page-index](../../../integration/console-crud-page-index.md) 기록

**판정:** ☐ 메뉴 CRUD 1차 완료 · ☐ 보류
