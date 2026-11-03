---
title: Interaction feedback and loading UX
description: 클릭, pending, Toast, Skeleton, 재조회. 웹과 Flutter 공통
---

# Interaction feedback and loading UX

> **개요:** 사용자 동작에 즉시 반응하고, 대기 중에는 처리 중임을 보여 주는 공통 기준입니다.
> 웹 CMS(React)와 Flutter 원셋에 동일하게 적용합니다.
> 연출을 위해 완료된 요청을 일부러 지연하지 않습니다.

## 상황별 UI

| 상황 | 적용 |
|------|------|
| 버튼·카드 클릭 | 눌림, Ripple/active, 짧은 색·크기 변화 |
| 저장·확인 요청 중 | 버튼 내부 로딩, 중복 클릭 방지, 버튼 크기 유지 |
| 처리 성공·실패 | Toast/SnackBar 또는 필드 오류 |
| 최초 데이터 조회 | 콘텐츠 배치와 비슷한 Skeleton (필요 시 Shimmer) |
| 추가 페이지 조회 | 기존 목록 유지 + 하단 로딩 |
| 새로고침·검색 | 기존 콘텐츠 유지 + 갱신 상태 |
| 화면·상세 전환 | 짧고 자연스러운 전환 |
| 펼치기·선택·상태 변경 | 크기·색·위치로 변화 표현 |
| 빈 결과·조회 실패 | 안내 + 재시도·등록 등 다음 행동 |

애니메이션은 장식보다 **동작과 상태 전달**에 씁니다.

## 하드 규칙

1. 실제 요청 상태(`isPending`, ViewModel pending)와 로딩 UI를 연결합니다.
2. 완료된 요청을 연출용으로 지연하지 않습니다.
3. 짧은 요청마다 Skeleton이 깜빡이거나 성공 Toast가 반복되지 않게 합니다.
4. **최초 로딩**과 **재조회·추가 조회** 표시를 구분합니다.
5. 실패 후 재시도와 입력 내용 보존을 함께 처리합니다.
6. 시스템 모션 감소(`prefers-reduced-motion`, `MediaQuery.disableAnimations`)를 존중합니다. 움직임 없이도 상태로 이해 가능하게 둡니다.

## 최초 vs 재조회 vs 추가 조회

| 구분 | 표시 |
|------|------|
| 최초 (데이터 없음) | Skeleton 또는 전체 placeholder |
| 재조회·검색 (데이터 있음) | 목록 유지 + 상단/오버레이 갱신 표시 |
| 추가 페이지 | 목록 유지 + 하단 스피너/더 보기 pending |

## 플랫폼

### 웹 (React, fe-v1)

- 키보드 포커스, `aria-busy` / `aria-live`, `prefers-reduced-motion`
- 공통: `PendingButton`, `Skeleton`(`motion-safe:animate-pulse`), `TableLoadingSkeleton`, sonner Toast
- 카탈로그 페이지: `InteractionFeedbackCatalogPage` (라우트 `ops-ui-interaction`)
- Example 적용: 농장 정보 Demo 저장 버튼 등 CMS 원셋 pending

### Flutter (nutag_app_v1 oneset_demo)

- 터치 Ripple, `MediaQuery.disableAnimationsOf`
- 공통: `OnesetPendingButton`, `OnesetSkeleton`, `OnesetAsyncBody`, `showOnesetToast`, `onesetPageRoute`
- 카탈로그: Catalog 탭 Interaction 구역
- Example 적용: 로그인, 프로필 저장, Items 최초/재조회/더 보기

## 공통 컴포넌트 경로

| 역할 | 웹 | Flutter |
|------|-----|---------|
| pending 버튼 | `src/components/molecules/PendingButton.tsx` | `lib/oneset_demo/shared/ui/oneset_pending_button.dart` |
| Skeleton | `src/components/ui/skeleton.tsx`, `TableLoadingSkeleton` | `oneset_skeleton.dart` |
| Toast | sonner | `oneset_toast.dart` |
| 목록 상태 | 페이지 + Skeleton / ErrorAlert | `OnesetAsyncBody` |
| 화면 전환 | CSS / 라우트 | `oneset_page_route.dart` |

## 검수

- [ ] 느린 네트워크에서 최초 Skeleton이 보임
- [ ] 검색·새로고침 시 기존 목록이 유지됨
- [ ] 더 보기 시 하단만 로딩
- [ ] 저장 더블클릭이 두 번 요청을 만들지 않음
- [ ] 성공 Toast가 짧은 연속 저장에서 과다 반복되지 않음
- [ ] 모션 감소 설정에서도 상태(문구·disabled·aria)로 이해 가능
- [ ] 카탈로그에서 눌림·pending·성공·실패·재시도·Skeleton을 직접 확인

## 관련

- Flutter: [oneset-demo-runbook](/docs/knowledge/client/flutter-harness/oneset-demo-runbook), [ui-catalog](/docs/harness/templates/flutter/ui-catalog/)
- CMS: [cms-crud](/docs/harness/templates/frontend/cms-crud/), [UIConventions](/docs/knowledge/frontend/conventions/UIConventions)
