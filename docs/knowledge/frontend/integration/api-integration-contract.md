---
title: API integration contract
description: 인증 fetch, 성공 판정, 도메인 api 모듈
---

# API integration contract

> **출처:** FarmPro FE api-integration-contract 승격 요약.

## 핵심 구성

| 역할 | fe-v1 경로 |
|------|------------|
| endpoint, env | `src/constants/api.ts` |
| 공통 client | `src/utils/apiClient.ts` |
| 인증 fetch | `src/utils/fetchWithAuth.ts` |
| 토큰 | `src/utils/authTokenManager.ts` |
| 도메인 API | `src/api/*.ts` |

## 기본 계약

1. 인증 요청은 `credentials: "include"`를 유지합니다.
2. Authorization은 access token 결과로 구성합니다.
3. 성공 판정은 공통 함수(`isApiSuccess`)를 재사용합니다.
4. 페이지에서 직접 fetch를 최소화하고 `api/` 모듈을 씁니다.

FarmPro 운영 console base 예: `https://api.farmpro.me/console`.
로컬 기본 예: `http://localhost:3031/console` (env로 덮어쓸 수 있음).

## 에러

네트워크, 타임아웃, 권한 오류는 사용자 메시지와 로깅을 분리합니다.
전역 suppress 추가는 문서화 후 진행합니다.
