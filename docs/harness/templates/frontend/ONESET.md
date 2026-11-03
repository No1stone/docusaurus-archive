---
sidebar_position: 2
title: FE ONESET
description: Frontend 원셋. 경량 헥사 슬롯과 ExampleItem
---

# Frontend ExampleItem 원셋

> **개요:** 화면 골격과 경량 헥사 연결을 한 세트로 둡니다.
> **상태(가이드 / 검증된 예제)** 는 원셋 README를 봅니다.
> 대상 저장소 규칙이 이 안내보다 우선합니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (이력·참고).

## 목표

기능 경계를 맞춰 수정 위치를 찾고, 공개 조각(화면 연결·개별 기능·Flow·계약·Demo/Http)을 조합합니다.
구조: [application-structure](/docs/knowledge/frontend/architecture/application-structure).

## 원셋 상태

| 원셋 | 상태 | 비고 |
|------|------|------|
| [cms-crud](./cms-crud/) | **가이드** | DeviceProduction download `f.*` 미확인. [fe-v1-findings](/docs/knowledge/frontend/operations/fe-v1-findings) |
| [excel-download](./excel-download/) | 가이드 | Export 기능 → 계약 → Http. size 기본 예 100 |
| [wizard-register](./wizard-register/), [dashboard](./dashboard/) | 가이드 | 복사 경로 **미지정** |
| 그 외 | 가이드 | README 슬롯 기준 |

## ExampleItem 규칙

| 항목 | 값 |
|------|------|
| 앱 루트 예 | `nutech/fe-v1` |
| CMS 참고 | `DeviceProductionManagePage` (이력 경로, 검증 완료 아님) |
| 레이아웃 | `AdminLayout`, `ManagementPageLayout` (`filter` / `list` / `sheets`) |

## 원셋에 보여야 하는 연결

- Page · 화면 연결 `useXxx`
- 개별 기능 직접 호출 예 (단일 동작)
- Flow 등에서 여러 기능 조합 예 (필요할 때)
- 계약(Repository 등)과 Demo·Http 구현
- `app/composition` 조립
- 핵심 기능·조합의 테스트 기준(문서/체크)

## 검증 (구분)

| 검사 | 의미 |
|------|------|
| 타입 검사 | `tsc` 등. Vite 빌드 성공 ≠ 타입 통과 |
| 번들 빌드 | Vite 등 |
| 브라우저 동작 | [browser-manual](/docs/harness/tools/browser-manual). 필요 시 [playwright-e2e](/docs/harness/tools/playwright-e2e) |

미실행이면 이유를 남깁니다.

## 하드 슬롯 (CMS)

필터, list, 폼, 로딩, 빈, 에러, Skeleton, 액션 pending, 다크, 반응형.
Chip/Select/Badge와 엑셀 export는 **기능이 있을 때**.
Store는 로컬 state로 부족할 때만.

## 데모와 wired

같은 계약에 Demo/Http 구현. [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired).

## 복사 방식

1. README 슬롯 표 체크 (조건부 슬롯은 기능 있을 때만).
2. 데모 구현으로 슬롯을 맞출지, Http 구현을 바로 볼지 정합니다.
3. ExampleItem은 이력 매핑으로만 참고합니다. 신규는 features 책임에 맞춥니다.
4. 도메인명·API·필터·상태 코드·DELETE·page size·i18n은 대상 계약으로 교체합니다.
5. 타입 검사 / 번들 빌드 / 브라우저를 구분해서 기록합니다.
