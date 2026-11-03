---
title: Loading and action UX
description: Skeleton과 액션 pending 하드 계약
---

# Loading and action UX

> **개요:** 로딩과 제출 중 UX를 CMS 필수 슬롯으로 둡니다.

## Skeleton

- 라우트 lazy 또는 최초 목록 로딩에 Skeleton(또는 동등한 placeholder)을 씁니다.
- fe-v1: `src/components/ui/skeleton.tsx`, `RouteTemplate` lazy fallback.

## 목록 상태

| 상태 | 요구 |
|------|------|
| loading | Skeleton 또는 테이블 placeholder |
| empty | 빈 안내 문구 |
| error | 재시도 가능한 에러 UI / 토스트 정책 |

## 액션 pending

- 등록, 수정, 비활성, 업로드 확인 버튼은 pending 동안 비활성 또는 스피너로 중복 제출을 막습니다.
- mutation `isPending`과 버튼 상태를 연결합니다.

## 검수

- [ ] 느린 네트워크에서 Skeleton이 보임
- [ ] 저장 더블클릭이 두 번 요청을 만들지 않음
