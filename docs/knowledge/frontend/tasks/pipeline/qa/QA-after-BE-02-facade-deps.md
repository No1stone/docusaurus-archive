---
title: QA after BE 02 facade deps
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA-after-BE-02 — Facade 의존성

> **선행:** [BE-02](../BE-02-facade-list.md) · pageId: ________

- [ ] `{Domain}Facade`에 타 패키지 `*Service` 주입 없음 (자기 도메인 제외)
- [ ] cross-domain은 `*Facade` / `common/facade/*` 만

규칙: console-bff-facade-dependency-rule.md (`be-v1/docs/knowledge/frontend/development/console-bff-facade-dependency-rule.md`)

**판정:** ☐ 통과 · ☐ 실패
