---
title: alarm message
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 태스크 카드 — `ops-notification-message`

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `ops-notification-message` |
| 메뉴 | 알람 메시지 |
| FE | `AlarmMessageManagePage.tsx` |
| BE | `AlarmMessageWebController.java` |
| 패턴 | **list-read** (+ 상세) |

## 적용 Fragment

| 단계 | ID |
|------|-----|
| BE | **B02** ✓ |
| 필터 | **T02** |
| 목록 | **T03** ✓ |
| 상세 | **T05-A** `AlarmMessageDetailSheet` |
| CUD+X | — |
| 검수 | **T07** |

## 구현 상태

| L | C | U | D | X |
|---|---|---|---|---|
| ○ | ✗ | ✗ | ✗ | ✗ |

## 갭 · 개발자 액션

| # | 항목 | 액션 |
|---|------|------|
| 1 | 메시지 등록/수정/비활성 | **설계요청** — B01 필요 여부·필드 정의 |
| 2 | `portalMenuFilterRegistry` 미등록 | **자체설계후적용** — ops 메뉴 레지스트리 추가 검토 |

## 검수 기록

- [ ] T07 — keyword 필터·목록·상세 (CUD 제외)
