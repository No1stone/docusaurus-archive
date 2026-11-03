---
title: console management crud set
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# [지침] 관리 콘솔 CRUD 화면 1세트 (목록·등록·수정·비활성·다운로드)

> **상태:** `active`  
> **기준 구현(레퍼런스):** `DeviceProductionManagePage` (디바이스 생산 정보)  
> **백엔드 짝:** `be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md`  
> **관련:** [API Integration Contract](./api-integration-contract.md), [Management Filter Kit](./../architecture/management-filter-kit.md)

관리 콘솔(admin)에서 **필터 + 서버 페이징 목록 + 슬라이딩 시트(상세/등록/수정) + 비활성 + 엑셀 다운로드** 를 한 세트로 맞출 때 쓰는 패턴이다.

**메뉴별 작업:** [console-crud-base-set.md](./console-crud-base-set.md) 기본셋 먼저 → diff 있을 때만 [tasks/pages/](../tasks/pages/) 또는 [console-crud-page-index.md](./console-crud-page-index.md).

---

## AI 에이전트용 프롬프트 (복사해서 사용)

```
CMS 백오피스 ExampleItem(fe-v1) 관리 콘솔 화면 1세트를 구현해줘.

반드시 먼저 읽을 문서:
- docs/knowledge/frontend/integration/console-management-crud-set.md (본 문서)
- docs/knowledge/frontend/integration/api-integration-contract.md
- docs/knowledge/frontend/architecture/management-filter-kit.md
- docs/knowledge/frontend/integration/common-code-fe-harness.md (공통코드 필터·Chip·폼 Select 시)
- be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md (BE Web API)
- src/guidelines/CodeConventions.md, UIConventions.md
- 루트 AGENTS.md

도메인: [예: deviceProduction]
API 베이스: API_CONFIG.BASE_URL + /web/[resource]  (예: /web/device-productions)
i18n 네임스페이스: [예: deviceProduction]

요구사항:
1. ManagementPageLayout + ManagementFilterPanel + ManagementTableShell
2. 목록: React Query, 서버 page/size, keyword·status 필터(조회 버튼으로 applied 반영)
3. status UI: 전체/활성/비활성 — (A)/(D) 문구 노출 금지
4. 등록: POST WebCreate, status 항상 A, 등록 폼에 status·JPA 감사 필드 숨김
5. 수정: PUT /{id}, status A/D 선택 가능
6. 비활성: DELETE /delete-by-ids?ids=, 버튼 라벨 "비활성"(deleteLabel), 물리 삭제 아님
7. 다운로드: DownloadModal(슬라이딩 Sheet), fetchXxxForDownload 100건씩 페이지 순회, downloadAdvancedExcel
8. 목록 컬럼은 필요 최소만 (예: id, 이름, 상태, 등록일시, 등록자 — 수정자/버전은 목록 제외 가능)
9. api/, hooks/, types/, pages/, organisms/ 패턴 — DeviceProduction 레퍼런스 복제 후 도메인 치환

완료 기준: 목록 조회·등록·수정·비활성·다운로드 E2E, i18n ko/en 최소, SUCCESS_CODES 처리.
```

---

## 1. 범위 (1세트)

| 기능 | UI | API |
|------|-----|-----|
| 목록 | `ManagementTableShell` + 테이블 | `GET ?page&size&keyword&status` |
| 등록 | `*FormSheet` mode=create | `POST` body camelCase |
| 수정 | `*FormSheet` mode=edit | `PUT /{id}` |
| 상세 | `*DetailSheet` (행 클릭) | 목록 row 데이터 (단건 GET 없으면) |
| 비활성 | 툴바 버튼 `deleteLabel="비활성"` | `DELETE /delete-by-ids?ids=` |
| 다운로드 | `DownloadModal` | `fetch*ForDownload` 100건/페이지 |

---

## 2. 디렉터리·파일 (신규 도메인)

```
fe-v1/src/
  api/{domainPlural}.ts          # fetchList, create, update, deactivateByIds, fetchForDownload
  hooks/use{DomainPlural}.ts     # list query keys, mutations
  types/{domain}.ts              # Row, Status
  data/{domain}FormConfig.ts     # status filter options (i18n)
  components/pages/{Domain}ManagePage.tsx
  components/organisms/{Domain}DetailSheet.tsx
  components/organisms/{Domain}FormSheet.tsx
  components/molecules/{Domain}DownloadSearchForm.tsx  # 다운로드 필터
  constants/api.ts               # ENDPOINTS.{DOMAIN}
  i18n/locales/*.json            # deviceProduction.* 네임스페이스
```

**레퍼런스 트리:** `deviceProduction*` 파일 grep.

---

## 3. API 레이어 (`api/deviceProductions.ts` 패턴)

### 3.1 공통

- `fetchWithAuth`, `API_CONFIG.BASE_URL`, `API_ENDPOINTS`
- 성공 코드: `["0000CM0000", "SSPAPIC000", "0000"]`
- 목록 max size: `DEVICE_PRODUCTION_MAX_PAGE_SIZE = 100` (BE `PageQuery.MAX_SIZE` 와 동일)

### 3.2 목록

```ts
fetchDeviceProductionList({ keyword?, status, page, size })
// status=all 이면 쿼리에 포함 (BE 가 all 무시)
// mapItemToRow: camelCase → snake_case row, EnStatus code 정규화
```

### 3.3 다운로드용 전체 조회

```ts
fetchDeviceProductionsForDownload(filters, onProgress?)
// page=0..totalPages-1, size=100
// fetchDeviceProductionList 재사용
```

**레퍼런스:** `fetchSigungusForDownload` (`api/sigungus.ts`), `fetchNoteAttributesForDownload` (`api/noteAttributes.ts`)

---

## 4. React Query (`hooks/useDeviceProductions.ts`)

```ts
deviceProductionKeys = { all, list(params) }
useDeviceProductionList(params)
useCreateDeviceProduction()   // onSuccess: invalidateQueries all
useUpdateDeviceProduction()
useDeactivateDeviceProductions()
```

---

## 5. 페이지 구성 (`*ManagePage.tsx`)

### 5.1 필터 (draft / applied)

- `draftKeyword`, `draftStatus` → **조회** 시 `applied*` 반영 (목록 API는 applied 만 사용)
- `ManagementFilterPanel` + `FilterSearchButtons`
- status 옵션: `deviceProductionStatusFilterOptions(t)` — `all`, `A`, `D`
- **공통코드 필터** (해당 시): `FilterCodeSelectField` — Page에서 `use*CodeLabels()` 1회, `nameMaps` 를 필터·목록·시트에 공유 ([common-code-fe-harness.md](./common-code-fe-harness.md))

### 5.2 목록 shell

```tsx
<ManagementTableShell
  onDelete={handleDeactivate}
  deleteLabel={t("...deactivate")}
  deleteDisabled={mutation.isPending || selectedIds.length === 0}
  onDownload={handleDownloadOpen}
  onRegister={openCreateForm}
/>
```

**주의:** `ManagementTableShell` 에 `deleteLabel` 을 destructuring 해야 함 (`deleteLabel is not defined` 버그 방지).  
`deleteDisabled` 가 `false` 이면 `??` 로 선택 개수 체크가 무시되므로, 명시 시 `deleteDisabled !== undefined ? deleteDisabled : selectedCount === 0` 패턴 사용.

### 5.3 시트

- `ManagementPageLayout` `sheets` 슬롯: Detail + Form + `DownloadModal`
- 행 클릭 → 상세; 상세에서 수정 → `formMode=edit`
- 등록 시 `selected` clear, `status: "A"` 고정

---

## 6. 다운로드 (`DownloadModal`)

| 항목 | 내용 |
|------|------|
| UI | `components/organisms/DownloadModal.tsx` (우측 Sheet) |
| 필터 | `*DownloadSearchForm` — 목록과 동일 keyword/status |
| 오픈 시 | 메인 applied 필터를 initial 로 넣고 `loadDownloadData` |
| 조회 | `fetch*ForDownload` + progress/status state |
| 저장 | `downloadAdvancedExcel` (`utils/excel.ts`) |
| JSON 컬럼 | 엑셀 제외 기본 (요구 시 별도 컬럼 설계) |

**레퍼런스:** `DeviceProductionManagePage` 내 `DownloadModal` 블록, `SigunguTable` + `DownloadModal`.

---

## 7. i18n

네임스페이스 예: `deviceProduction`

| 키 | 용도 |
|----|------|
| `statusAll`, `statusA`, `statusD` | 필터·뱃지 (괄호 코드 없음) |
| `deactivate` | 비활성 버튼 |
| `deactivateSuccess`, `deactivateFailed` | 토스트 |
| `downloadTitle`, `downloadFilename`, `downloadSheetName` | 다운로드 |
| `downloadFetching`, `downloadFetchFailed`, `downloadSuccess`, `downloadFailed` | 다운로드 |
| `formSaveCreateSuccess`, `formSaveEditSuccess`, `formSaveFailed` | 저장 |
| `loadFailed` | 목록 실패 |

`ko`, `en` 필수; `ja`, `es`, `ru` 는 동일 키 추가 권장.

### 7.1 공통코드 (BizEnum) 라벨

UI 문구(i18n ns)와 **코드 값 라벨**은 분리한다.

| 계층 | 규칙 |
|------|------|
| API | `co_common_code` name (타입별 `useCommonCodesByType` 캐시) |
| i18n | `{domain}.{group}.{CODE}` — 예: `farmLivestock.species.LS00000COW` |
| 표시 | `livestockCodeLabel` / 도메인 동급 헬퍼 — API name + i18n `defaultValue` |
| 폼 옵션 | `resolveLivestockNameMapForForm` — 캐시 비었을 때 i18n 키로 옵션 구성 |

**전체 규칙:** [common-code-fe-harness.md](./common-code-fe-harness.md) · Chip: [FE-05](../tasks/pipeline/FE-05-list-chip.md) · UI 문구: [FE-10](../tasks/pipeline/FE-10-i18n.md)

**레퍼런스:** `useFarmLivestockCodeLabels`, `LivestockInfoManagePage` → `codeNames` prop

---

## 8. UI 규칙 요약

- 상태 필터·뱃지: **활성 / 비활성** (문자열 `A`/`D` 노출 안 함)
- 등록 폼: status UI 없음, 저장 시 `A`
- 수정 폼: status 선택 + `JpaAuditInfoSection` (edit 만)
- **포털 농장 도메인**: 목록·상세 오딧은 [farm-timezone-display-policy.md](./farm-timezone-display-policy.md) — `auditTimeZone` / `formatFarmAuditDt`
- 목록: 수정일시·수정자·버전 컬럼 생략 가능 (상세/수정 시트에만)
- 카드 헤더 없을 때 `ManagementPageLayout` 상단 패딩 (`pt-6`)

---

## 9. 체크리스트

- [ ] `api.ts` → `API_ENDPOINTS.WEB.*` + `api/*.ts` CRUD + download fetch
- [ ] `hooks/use*.ts` + invalidate on mutation
- [ ] `ManagePage` 필터 draft/applied
- [ ] 공통코드 사용 시: Page `nameMaps` 1회 로드 · 하위 중복 fetch 최소 ([common-code-fe-harness](./common-code-fe-harness.md))
- [ ] `ManagementTableShell` deleteLabel / deleteDisabled
- [ ] FormSheet + DetailSheet
- [ ] DownloadModal + DownloadSearchForm
- [ ] i18n 5언어 또는 ko/en
- [ ] RouteTemplate / App lazy page (기존 라우팅 규칙)

---

## 10. 하지 말 것

- 목록에 mock 데이터만 사용 (API 연동 후 mock 제거)
- 비활성 버튼에 "삭제" 라벨 (도메인 합의 시 `deleteLabel` 만 변경)
- `deleteDisabled={false}` 로 선택 0건일 때 버튼 활성화
- 다운로드 시 단일 페이지만 조회 (100건 limit 무시)
- BE 에 없는 필드를 목록에 표시만 추가 (API 확장 먼저)

---

## 11. 레퍼런스 파일 (DeviceProduction)

| 구분 | 경로 |
|------|------|
| Page | `fe-v1/src/components/pages/DeviceProductionManagePage.tsx` |
| API | `fe-v1/src/api/deviceProductions.ts` |
| Hooks | `fe-v1/src/hooks/useDeviceProductions.ts` |
| Types | `fe-v1/src/types/deviceProduction.ts` |
| Form config | `fe-v1/src/data/deviceProductionFormConfig.ts` |
| Download form | `fe-v1/src/components/molecules/DeviceProductionDownloadSearchForm.tsx` |
| Detail/Form sheet | `fe-v1/src/components/organisms/DeviceProductionDetailSheet.tsx`, `DeviceProductionFormSheet.tsx` |
| DownloadModal | `fe-v1/src/components/organisms/DownloadModal.tsx` |
| Table shell | `fe-v1/src/components/templates/ManagementTableShell.tsx` |
| Endpoints | `fe-v1/src/constants/api.ts` → `WEB.DEVICE_PRODUCTIONS` |

---

## 12. BE와 필드 매핑

| BE (JSON) | FE Row |
|-----------|--------|
| `productionName` | `production_name` |
| `productionContents` | `production_contents` |
| `status` (code or `{code}`) | `status` `A` \| `D` |
| `createdAt` | `created_at` |
| `createdBy` | `created_by` |

요청 body 는 **camelCase** (`productionName`, `status`, …).

---

## 13. 변형 — 포털 농장 스코프 목록

관리 콘솔 CRUD 1세트와 **동일 골격**(Layout + TableShell + React Query 목록 + 시트)이나, 필터·오딧 표시가 다르다.

| 항목 | 표준 (DeviceProduction) | 포털 농장 스코프 |
|------|-------------------------|------------------|
| 필터 패널 | `ManagementFilterPanel` | `PortalMenuFilterPanel` + `useFarmScopedMenuFilter` |
| 농장 필터 | 없음 | `farmFilter` (헤더 workspace·메뉴 baseline 연동) |
| 목록 `createdAt` | `formatAuditDateTime` (브라우저 로컬) | `formatFarmAuditDt` + `useFarmWorkspaceTimezone` |
| 상세 오딧 | `JpaAuditInfoSection` 기본 | `auditTimeZone={readStoredFarmWorkspaceTimezone()}` |

정책: [farm-timezone-display-policy.md](./farm-timezone-display-policy.md) — **통계·분석 시계열은 TZ 변환 금지**.

**레퍼런스:** `LivestockInfoManagePage.tsx`, `useFarmScopedMenuFilter.ts`, `portalWorkspaceStorage.ts`

---

## 14. 변형 — 탭형 상세 시트 (FormSheet 대신)

전 필드 수정 FormSheet 대신 **슬라이딩 상세 + 탭 + 부분 모달** 인 도메인.

| 항목 | 표준 | 탭형 상세 |
|------|------|-----------|
| 상세 데이터 | 목록 row 또는 단건 GET | `fetch*ById` → `useEffect` (또는 `useQuery`) |
| 수정 | `*FormSheet` mode=edit | 탭별 모달·부분 `PUT` (예: lifecycle) |
| 부가 탭 | 없음 | 위치·분석 등 **별도 api 모듈** + `molecules/{domain}/*Tab` |
| 오딧 | FormSheet edit 시 | 상세 하단 `JpaAuditInfoSection` + `pickJpaAuditFields` |

디렉터리:

```
components/organisms/{Domain}DetailSheet.tsx   # Tabs 루트
components/molecules/{domain}/{Domain}*Tab.tsx
api/{domain}Analysis.ts                        # 서브리소스 (선택)
```

**레퍼런스:** `FarmLivestockDetailSheet.tsx`, `farmLivestockAnalysis.ts`

---

## 15. 레퍼런스 — Farm Livestock (1세트 + 변형)

| 1세트 항목 | 상태 | 비고 |
|------------|------|------|
| 목록 GET + React Query | ○ | `useFarmLivestockList`, `fetchFarmLivestockList` |
| ManagementPageLayout + TableShell | ○ | |
| 등록 | △ | `LivestockInfoRegisterBulkSheet` (대량 — 표준 FormSheet 아님) |
| 수정 FormSheet | ✗ | 탭·모달로 부분 수정 |
| 비활성 | ✗ | Web `delete-by-ids` 미연동 |
| 다운로드 | ✗ | |
| 단건 상세 GET | ○ | `fetchFarmLivestockById` |
| 분석 탭 API | ○ 확장 | `farmLivestockAnalysis.ts` |

상세·갭·테스트 데이터: [farm-livestock-portal.md](./farm-livestock-portal.md)  
BE Web API: console-web-bff-management-crud-set.md (`be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md`) §12
