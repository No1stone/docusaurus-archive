---
sidebar_position: 1
title: README
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# Console CRUD — 태스크·조각(Fragment) 워크플로

> **상태:** `active`  
> **실행 진입점:** [pipeline/README.md](./pipeline/README.md) — **마이크로 태스크 1개 = 세션 1개**

## 원칙

- 세션마다 **파이프라인 문서 1개만** 연다 (BE-03, FE-04 등).
- Card·Chip·오딧·BFF는 해당 태스크 문서 안에만 적혀 있음.
- 상위 문서·인덱스·마스터는 막혔을 때만.

## 빠른 링크

| 용도 | 문서 |
|------|------|
| **태스크 순서표** | [pipeline/README.md](./pipeline/README.md) |
| 개요 | [console-crud-base-set.md](../integration/console-crud-base-set.md) |
| (구) 조각 T01~T07 | [fragments/](./fragments/) — 파이프라인으로 대체·세분화됨 |

## AI 프롬프트

```
도메인 {Domain} — 태스크 {FE-04} 만 실행.

docs/knowledge/frontend/tasks/pipeline/FE-04-page-list.md 만 읽고 구현.
다른 태스크·메뉴 수정 금지.
```
