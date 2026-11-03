---
title: _kickoff template
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 도메인 킥오프 — `{pageId}`

> `domains/_kickoff-template.md` 복사본. 구현 **[x]** 직후 **QA [x]** (쌍으로).

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `{pageId}` |
| 메뉴명 | |
| DB 테이블 / Entity | |
| Web resource | `/web/{resource}` |
| 유형 | A / B / C / D |
| i18n ns | `{camelDomain}` |
| 공통코드 typeId | (Chip/필터/폼 있을 때) `LT00…` 등 최소 목록 |
| 복제 원본 | `device-production` / … |
| 조회 특화·하위 | **별도** — 아래 **도메인 diff** 표 (1세트 완료와 분리) |

## 도메인 diff (1세트 밖 — 별도 세션·문서)

| # | 항목 | BE | FE | 문서 |
|---|------|----|----|------|
| | 예: 분석 탭 GET | 별 Facade | `*Tab.tsx` | |

## 구현 · QA (킥오프 시 — 스킵은 —)

| Impl | 완료 | QA (직후) | 완료 |
|------|------|-----------|------|
| BE-01 | [ ] | — | — |
| BE-02 | [ ] | [QA-BE-02](../qa/QA-after-BE-02-facade-deps.md) | [ ] |
| BE-06 | [ ] | [QA-BE-06](../qa/QA-after-BE-06-map.md) | [ ] |
| BE-03 | [ ] | [QA-BE-03](../qa/QA-after-BE-03-list.md) | [ ] |
| BE-04 | [ ] | — | — |
| BE-05 | [ ] | [QA-BE-05](../qa/QA-after-BE-05-write.md) | [ ] |
| FE-01a/b | [ ] | [QA-FE-01](../qa/QA-after-FE-01-filter.md) | [ ] |
| FE-02~03 | [ ] | — | — |
| FE-04 | [ ] | [QA-FE-04](../qa/QA-after-FE-04-list.md) | [ ] |
| FE-09 | [ ] | [QA-FE-09](../qa/QA-after-FE-09-labels.md) | [ ] |
| FE-05 | [ ] | [QA-FE-05](../qa/QA-after-FE-05-chip.md) | [ ] |
| FE-06+06b | [ ] | [QA-FE-06b](../qa/QA-after-FE-06b-audit.md) | [ ] |
| FE-07~08 | [ ] | [QA-FE-08](../qa/QA-after-FE-08-crud.md) | [ ] |
| FE-10 | [ ] | [QA-FE-10](../qa/QA-after-FE-10-i18n.md) | [ ] |
| Signoff | — | [QA-signoff](../qa/QA-signoff.md) | [ ] |
| Import | — | [QA-fe-import](../qa/QA-fe-import-check.md) | [ ] |

## 파일맵

```
be-v1/... fe-v1/... (태스크 완료 시)
fe-v1/src/i18n/locales/{ko,en}.json  → {ns}.*
```

## 갭

| # | 내용 | 액션 |
|---|------|------|

## Signoff

- 일자:
- 판정:
