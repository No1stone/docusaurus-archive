---
title: Runtime architecture
description: 부트스트랩부터 인증 상태별 렌더링까지
---

# Runtime architecture

> **출처:** CMS 업무 백오피스 FE `docs/guidelines/architecture/runtime-architecture.md` 승격 요약.
> 코드 근거는 `nutech/fe-v1`.

## 목적

앱 부트스트랩부터 인증 상태별 렌더링까지의 런타임 흐름을 표준화합니다.

## 현재 구조

| 역할 | 경로 |
|------|------|
| 엔트리 | `src/main.tsx` |
| 앱 오케스트레이션 | `src/App.tsx` |
| 인증 상태 템플릿 | `src/components/templates/AuthStateTemplate.tsx` |
| 페이지 라우팅 | `src/components/templates/RouteTemplate.tsx` |

## 부트스트랩 플로우

1. `main.tsx`에서 `App`을 렌더합니다.
2. `App`에서 `QueryClientProvider`, `ErrorBoundary`, `AuthStateTemplate`를 구성합니다.
3. 초기 효과에서 refresh token으로 세션 복구를 시도합니다.
4. 인증 상태(`unauthenticated` | `pending-2fa` | `password-reset` | `authenticated`)에 따라 화면을 전환합니다.

## 규칙

- 인증과 세션 책임은 `App`과 `authTokenManager`에 둡니다.
- 페이지 분기 책임은 `RouteTemplate`에 둡니다.
- 전역 예외 처리 골격은 `ErrorBoundary`를 중심으로 유지합니다.

## 관련 원셋

- [layout-shell](/docs/harness/templates/frontend/layout-shell/)
- [auth-login](/docs/harness/templates/frontend/auth-login/)
