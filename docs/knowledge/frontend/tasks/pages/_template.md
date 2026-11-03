---
title: _template
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 태스크 카드 — `{pageId}`

> 복사용 템플릿. `{...}` 치환 후 인덱스에 등록.

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `{pageId}` |
| 메뉴 | `{메뉴명}` |
| FE | `{PageComponent}.tsx` |
| BE | `{WebController}.java` |
| 패턴 | `full-crud` \| `list-read` \| `portal-tab-detail` |

## 적용 Fragment

| 단계 | ID | 문서 |
|------|-----|------|
| BE | B01 / B02 | |
| 필터 | T01 / T02 | |
| 목록 | T03 | |
| Chip | T04 / — | |
| 상세 | T05 | |
| CUD+X | T06 / — | |
| 검수 | T07 | [T07](../fragments/T07-verify-checklist.md) |

## 구현 상태

| L | C | U | D | X |
|---|---|---|---|---|
| | | | | |

## 갭 · 개발자 액션

| # | 항목 | 액션 | 비고 |
|---|------|------|------|
| 1 | | `설계요청` / `자체설계후적용` / — | |

## 파일 맵

```
fe-v1/src/
  api/{...}.ts
  hooks/use{...}.ts
  components/pages/{...}ManagePage.tsx
be-v1/.../controller/web/{...}WebController.java
```

## 검수 기록

- [ ] T07 완료 (일자: ____)
