---
title: API integration contract
description: 인증 fetch, 성공 판정, Http 구현(Adapter) 쪽
---

# API integration contract

> **채택 기준.** HTTP·인증·성공 판정은 **경량 헥사의 Http 구현** 쪽에 둡니다.
> 화면·화면 연결은 공개 개별 기능 또는 Flow만 호출합니다.
> [application-structure](../architecture/application-structure)

## 핵심 구성

| 역할 | 신규 감각 | ExampleItem 경로 (이력) |
|------|-----------|-------------------------|
| endpoint, env | shared / composition 설정 | `src/constants/api.ts` |
| 공통 client | `shared/infrastructure` | `src/utils/apiClient.ts` |
| 인증 fetch | Http 구현이 사용 | `src/utils/fetchWithAuth.ts` |
| 토큰 | Local/Http 구현 또는 shared | `src/utils/authTokenManager.ts` |
| 도메인 HTTP | `features/*/adapters/http` | `src/api/*.ts` |
| 계약 | `features/*/ports` (Repository 등) | (명시 인터페이스 없을 수 있음) |

## 기본 계약

1. 인증 요청은 `credentials: "include"`를 유지합니다(프로젝트 인증에 맞게 교체).
2. Authorization은 access token 결과로 구성합니다.
3. 성공 판정은 공통 함수(`isApiSuccess` 등)를 재사용합니다. 성공 code는 프로젝트 교체 항목입니다.
4. Page·화면 연결에서 Http 모듈을 직접 부르지 않습니다. 공개 Application 진입점만 씁니다.
5. ExampleItem의 `api/` 직접 사용은 **이력**입니다.

CMS 백오피스 운영 console base 예: `https://api.farmpro.me/console`.
로컬 기본 예: `http://localhost:3031/console` (env로 덮어쓸 수 있음).

## 에러

네트워크, 타임아웃, 권한 오류는 사용자 메시지와 로깅을 분리합니다.
wired에서 실패를 성공·빈 배열로 바꾸지 않습니다. [demo-vs-wired](../architecture/demo-vs-wired)
전역 suppress 추가는 문서화 후 진행합니다.

## 관련

- [folder-structure](../folder-structure)
- [error-timeout-policy](./error-timeout-policy)
