---
title: Error and timeout policy
description: 전역 suppress, ErrorBoundary, 요청 레이어 타임아웃 방향
---

# Error and timeout policy

> **개요:** 타임아웃과 네트워크 오류를 어떻게 숨기거나 드러낼지에 대한 정책입니다.
> CMS 업무 백오피스 FE `error-timeout-policy`(review-needed)와 `App.tsx` 전역 처리를 아카이브용으로 정리했습니다.
> 앱의 suppress 코드를 이 문서만으로 바꾸지 않습니다. 새 작업의 기준선으로 씁니다.

## fe-v1에서 관찰된 상태

- `App.tsx`에 timeout / getPage / fetch / network 관련 전역 suppress가 넓습니다.
- `ErrorBoundary`와 전역 리스너에서 비슷한 오류를 중복으로 막을 수 있습니다.
- QueryClient 재시도에서 timeout, getPage 계열은 재시도하지 않는 분기가 있습니다.

## 위험

- 실제 장애 신호가 로그와 UI에서 사라질 수 있습니다.
- 디버깅이 어렵고, 전역 `fetch` 오버라이드 부수효과가 커질 수 있습니다.

## 정책 (아카이브 기준)

1. suppress 대상은 **명시 목록**으로만 유지합니다. 새 문자열 매칭을 암묵적으로 늘리지 않습니다.
2. suppress는 사용자 토스트와 개발 로그 채널을 분리한 뒤에만 적용합니다.
3. `window.fetch` 전역 오버라이드보다 **요청 레이어 타임아웃**(api client)을 우선 검토합니다.
4. 목록/리포트 페이지는 전역 suppress에 의존하지 말고, 슬롯의 **error UI**와 `useDataLoadErrorToast` 같은 페이지 단위 처리를 씁니다.
5. ErrorBoundary는 복구 불능 UI에 쓰고, 예상된 timeout을 Boundary로 삼키지 않습니다.

## CMS / 리포트와의 연결

| 표면 | 기대 |
|------|------|
| 목록 로드 실패 | 테이블 error 슬롯 또는 토스트 + 재시도 |
| mutation 실패 | 폼/시트에 메시지, pending 해제 |
| 타임아웃 | 사용자 메시지 1회. 동일 오류를 Boundary에 반복 throw하지 않음 |

## ExampleItem 경로 (참고)

- `src/App.tsx` (전역 QueryClient, ErrorBoundary, suppress)
- `src/components/molecules/ErrorBoundary.tsx`
- `src/hooks/useDataLoadErrorToast.ts`
- `src/utils/apiClient.ts`, `fetchWithAuth.ts`

## 관련

- [api-integration-contract](./api-integration-contract)
- [loading-action-ux](../design/loading-action-ux)
- [report-readonly 원셋](/docs/harness/templates/frontend/report-readonly/)
