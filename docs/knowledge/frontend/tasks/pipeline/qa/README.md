---
title: README
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA 마이크로 검수 (항목별)

> **원칙:** 구현 태스크 **직후** 해당 QA **1개만** 실행. `QA-01` 통합 회귀 없음.

## 매핑 (구현 → 검수)

| 구현 태스크 | QA 문서 | 스킵 조건 |
|-------------|---------|-----------|
| BE-02 | [QA-after-BE-02-facade-deps](./QA-after-BE-02-facade-deps.md) | — |
| BE-03 | [QA-after-BE-03-list](./QA-after-BE-03-list.md) | — |
| BE-06 | [QA-after-BE-06-map](./QA-after-BE-06-map.md) | MAP 없으면 — |
| BE-05 | [QA-after-BE-05-write](./QA-after-BE-05-write.md) | B02 조회전용 |
| FE-01a/b | [QA-after-FE-01-filter](./QA-after-FE-01-filter.md) | — |
| FE-04 | [QA-after-FE-04-list](./QA-after-FE-04-list.md) | — |
| FE-05 | [QA-after-FE-05-chip](./QA-after-FE-05-chip.md) | Chip 없음 |
| FE-09 | [QA-after-FE-09-labels](./QA-after-FE-09-labels.md) | — |
| FE-06b | [QA-after-FE-06b-audit](./QA-after-FE-06b-audit.md) | — |
| FE-08 | [QA-after-FE-08-crud](./QA-after-FE-08-crud.md) | CUD 없음 |
| FE-10 | [QA-after-FE-10-i18n](./QA-after-FE-10-i18n.md) | — |
| FE 세션 마감 / Signoff 직전 | **[QA-fe-import-check](./QA-fe-import-check.md)** | **필수** |
| 전부 [x] | [QA-signoff](./QA-signoff.md) | 선택 (체크만) |

## FE import (마지막 검수)

구현·QA-after 통과 후 **반드시** [QA-fe-import-check](./QA-fe-import-check.md) — 변경 `ts/tsx` import + `npm run build:console` (또는 해당 site build).

## 세션 프롬프트

```
pageId {pageId} — 구현 FE-04 완료 후 QA만.
pipeline/qa/QA-after-FE-04-list.md 만 읽고 검수·domains 시트 QA 열 [x].
코드 수정은 검수 실패 시에만.
```

## domains 시트 기록

킥오프 템플릿에 `QA-after-*` 열 추가 — 구현 태스크와 **쌍**으로 `[x]`.
