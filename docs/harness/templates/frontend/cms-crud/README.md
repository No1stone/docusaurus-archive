---
title: CMS CRUD
description: 관리 CRUD 본진 원셋. 경량 헥사 가이드
---

# CMS CRUD

> **상태: 가이드.** 슬롯·경량 헥사 조립 기준으로 씁니다.
> ExampleItem `DeviceProductionManagePage`는 이력 참고. download `f.*` 미선언 → 검증된 예제 아님.
> [fe-v1-findings](/docs/knowledge/frontend/operations/fe-v1-findings) · [application-structure](/docs/knowledge/frontend/architecture/application-structure)

## 슬롯

### 필수

| 슬롯 | 요구 |
|------|------|
| filter | 포털 Select 또는 keyword+status. 공통코드는 Select+nameMaps |
| list | `ManagementPageLayout` **list**. 서버 페이징, Badge. 표는 `ManagementTableShell` |
| detail | 행 클릭 Sheet/Card |
| form | 등록/수정 스키마 폼 |
| loading / empty / error | 최초 Skeleton, 빈+다음 행동, 실패+재시도. [loading-action-ux](/docs/knowledge/frontend/design/loading-action-ux) |
| action pending | `PendingButton` / `savePending`. 중복 제출 방지, 버튼 크기 유지 |
| refresh / page | 재조회는 목록 유지+`ListRefreshBanner`, 추가 페이지는 하단 로딩 |
| dark / responsive | 하드 계약 |

### 기능 있을 때

| 슬롯 | 요구 |
|------|------|
| Chip / Select+nameMaps | 공통코드 있을 때 |
| excel download | export 있을 때. [excel-download](../excel-download/) |

## 경량 헥사 조립 스케치

```text
presentation/
  XxxManagePage
  useXxxManage          # 화면 연결: 필터 UI, 캐시, Flow/기능 호출
application/
  ListXxx / LoadXxxDetail / SaveXxx / DeactivateXxx   # 개별 (직접 호출 가능)
  XxxManageFlow                                       # 필요할 때만 조합
ports/
  XxxRepository                                       # 계약
adapters/
  http/HttpXxxRepository
  demo/DemoXxxRepository
app/composition/                                      # 계약 ← 구현 연결

ManagementPageLayout
  filter / list / sheets
```

단일 목록 조회는 `useXxxManage` → `ListXxx` 직접 호출로 충분할 수 있습니다.
등록+후속 처리처럼 조합이 있으면 Flow를 둡니다.

## ExampleItem 경로 (이력)

| 역할 | 경로 |
|------|------|
| 페이지 | `src/components/pages/DeviceProductionManagePage.tsx` |
| 레이아웃 | `src/components/templates/ManagementPageLayout.tsx` |
| 훅·api | `src/hooks/useDeviceProductions.ts`, `src/api/deviceProductions.ts` |
| DownloadModal | `src/components/organisms/DownloadModal.tsx` |
| Knowledge | [console-crud-base-set](/docs/knowledge/frontend/integration/console-crud-base-set) |

## 스모크

- [ ] 필터 조회 후 목록 갱신
- [ ] Chip/Badge raw code 없음 (공통코드 있을 때)
- [ ] 상세·저장 pending (더블클릭 1회 요청)
- [ ] 최초 Skeleton vs 재조회 배너 구분
- [ ] (export) applied 필터, 페이징 순회, xlsx
- [ ] 빈·에러·재시도·다크·768px
- [ ] (선택) `ops-ui-interaction` 카탈로그에서 피드백 확인

## 오케스트레이션

[frontend-cms-one-set](/docs/harness/orchestrations/frontend-cms-one-set)
