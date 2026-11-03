---
title: weather lookup
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 태스크 카드 — `weather-weather-lookup`

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `weather-weather-lookup` |
| 메뉴 | 날씨 조회 |
| FE | `WeatherLookupDemoPage.tsx` |
| BE | `WeatherHistoryWebController.java` |
| 패턴 | **list-read** (CUD 없음) |

## 적용 Fragment

| 단계 | ID |
|------|-----|
| BE | **B02** ✓ |
| 필터 | **T01** (`weatherFields`: weatherMain, dateRange) |
| 목록 | **T03** ✓ (`WeatherConditionBadge`) |
| Chip | — (날씨는 Badge) |
| 상세 | **T05-C** PrototypeDetailSheet |
| CUD+X | — |
| 검수 | **T07** |

## 구현 상태

| L | C | U | D | X |
|---|---|---|---|---|
| ○ | — | — | — | ✗ |

## 갭 · 개발자 액션

| # | 항목 | 액션 | 비고 |
|---|------|------|------|
| 1 | 엑셀 다운로드 | `설계요청` | 필요 시 T06 download만 추가 |
| 2 | CUD | — | 조회 전용 유지 (B02) |

## 필터 규칙 (이 메뉴)

- 스코프: `farm` (member 포털)
- 상단: 농장 Select · 날씨 main · 기간(최대 3개월)
- 하단: keyword

## 검수 기록

- [ ] T07 — farm 스코프·기간·상세·TZ 변환 **없음** (배치 stat 기준)
