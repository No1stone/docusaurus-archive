---
sidebar_position: 2
title: FE ONESET
description: Frontend 원셋 복사 규칙과 ExampleItem
---

# Frontend ExampleItem 원셋

> **개요:** 검증된 화면 골격과 스모크 기준을 한 세트로 둡니다.
> 대상 저장소 규칙이 이 안내보다 우선합니다.
> CMS 업무 백오피스 공통 원셋입니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).

## 목표

CMS/인증/레이아웃 등 화면 유형별로 슬롯을 맞춘 뒤, 도메인 차이만 채웁니다.
백엔드 Spring ExampleItem 원셋의 FE 대응입니다.

## ExampleItem 규칙

| 항목 | 값 |
|------|------|
| 앱 루트 예 | `nutech/fe-v1` |
| CMS 골드 | `DeviceProductionManagePage` (wired 관리 CRUD) |
| 레이아웃 | `AdminLayout`, `ManagementPageLayout` |
| 검증 기본 | typecheck 또는 프로젝트 build → [browser-manual](/docs/harness/tools/browser-manual) → 필요 시 [playwright-e2e](/docs/harness/tools/playwright-e2e) |

가축 등 도메인 페이지는 표준 필수가 아닙니다. 필요할 때만 domains/portal 예시를 봅니다.

## 하드 슬롯 (CMS)

필터, 폼, 로딩, 빈, 에러, Skeleton, 액션 pending, Chip/Select/Badge, 다크, 반응형.
목록 엑셀 export가 있으면 **FE 페이징 다운로드**(`fetch*ForDownload` + `downloadAdvancedExcel`)도 슬롯에 넣습니다.
상세는 [console-crud-base-set](/docs/knowledge/frontend/integration/console-crud-base-set), [cms-crud](./cms-crud/), [excel-download](./excel-download/).

## 데모와 wired

퍼블/데모 페이지와 API 연결 페이지를 분리합니다.
데모에 API를 장기적으로 섞지 않습니다.
규칙은 [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired)입니다.

## 복사 방식

1. 해당 원셋 README의 슬롯 표를 체크합니다.
2. 데모로 슬롯을 먼저 맞출지, wired ExampleItem을 바로 볼지 정합니다.
3. fe-v1 경로를 열어 구조를 맞춥니다.
4. wired 작업 시 도메인명, API, 필터 필드만 치환합니다.
5. Chrome 스모크로 README 체크리스트를 통과합니다.

원셋 폴더에 TSX 전문을 모두 복제하지 않습니다.
경로는 저장소에서 최신본을 봅니다.
