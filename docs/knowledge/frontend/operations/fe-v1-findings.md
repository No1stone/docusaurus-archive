---
title: fe-v1 findings
description: ExampleItem(nutech/fe-v1) 앱 이슈. 문서 범위 밖 수정 대기
---

# fe-v1 findings

> **문서만.** 이 파일은 ExampleItem 앱 결함을 기록합니다.
> 아카이브 문서 작업으로 앱 코드를 고치지 않습니다.
> 수정은 별 세션·해당 저장소에서 합니다.

기록일: 2026-11-03. 대상 경로 예: `nutech/fe-v1`.

## 1. DeviceProduction 다운로드 초기 필터

- **증상:** `DeviceProductionManagePage` DownloadModal 초기값이 `f.appliedKeyword` / `f.appliedStatus`를 참조하는데, 해당 `f`가 스코프에 없음.
- **목록 조회는** `menuFilter.productionQuery` 쪽을 씀. 헬퍼 `productionQueryToKeywordDownloadFilters`가 이미 있을 수 있음.
- **영향:** 골드 CRUD 예제의 export 경로가 깨질 수 있음 → cms-crud를 **검증된 예제**로 올리지 않음.
- **권고 수정 방향:** applied 목록 필터(또는 헬퍼)로 시드. 문서 예외 규칙은 [excel-download](/docs/harness/templates/frontend/excel-download/).

## 2. `src/vite-env.d.ts` ImportMetaEnv 닫힘

- **증상:** `ImportMetaEnv` 인터페이스에 닫는 `}` 누락 가능.
- **영향:** 타입 검사가 중단될 수 있음. vite build 성공만으로 typecheck 통과로 보지 않음.

## 3. `fetchWithAuth` DEV·preview mock

- **증상:** DEV·preview에서 네트워크 실패를 catch 후 성공 빈 배열 등으로 바꿀 수 있음.
- **문서 기준:** wired에서는 실패를 성공으로 바꾸지 않음. mock은 명시 env만. [demo-vs-wired](/docs/knowledge/frontend/architecture/demo-vs-wired)
- **권고:** UI-only mock은 예: `VITE_UI_ONLY_FETCH_MOCK=true`일 때만. 주석과 코드 정합.

## 닫힘 조건

앱에서 위 항목을 고친 뒤, cms-crud 상태를 **검증된 예제**로 올릴지 다시 판단합니다.
