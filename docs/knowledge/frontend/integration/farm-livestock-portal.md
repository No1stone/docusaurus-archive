---
title: farm livestock portal
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# [레퍼런스] Farm Livestock — CRUD 1세트 + 포털·탭 확장

> **상태:** `active`  
> **위치:** [기본셋 vs 도메인 조회](./console-crud-base-set.md#6-도메인-diff-시-기본셋-이후--조회-특화) — 가축 **조회·탭**은 도메인 특화 구간(UI 수시 변경). **CUD·주 목록**은 1세트 파이프라인 대상.  
> **태스크 카드:** [tasks/pages/livestock-info.md](../tasks/pages/livestock-info.md)  
> **타임존:** [farm-timezone-display-policy.md](./farm-timezone-display-policy.md)  
> **분석 BFF:** farm-livestock-analysis-bff.md (`be-v1/docs/knowledge/frontend/development/farm-livestock-analysis-bff.md`)

본 문서는 **조회·탭·BFF 확장** 인스턴스이다. 신규 메뉴는 [console-crud-base-set](./console-crud-base-set.md) 1세트를 먼저 맞춘 뒤, 하위·세부 조회는 **별도 구현**으로 갭만 채운다.

---

## AI 에이전트용 프롬프트 (복사해서 사용)

```
FarmPro Farm Livestock 포털 화면·BFF를 수정/확장해줘.

반드시 먼저 읽을 문서 (순서):
1. docs/knowledge/frontend/integration/console-management-crud-set.md
2. be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md
3. docs/knowledge/frontend/integration/farm-livestock-portal.md (본 문서)
4. docs/knowledge/frontend/integration/farm-timezone-display-policy.md
5. docs/knowledge/frontend/integration/common-code-fe-harness.md (공통코드 필터·Chip·폼)
6. 루트 AGENTS.md

규칙:
- 신규 화면은 DeviceProduction 1세트에서 시작; Farm Livestock 은 포털·탭 변형(§13·§14)만 참고
- 통계 st_* / stat_local_hour 는 FE TZ 변환 금지
- JPA 오딧만 formatFarmAuditDt / JpaAuditInfoSection auditTimeZone
- 분석 API 는 FarmLivestockAnalysisFacade 패턴(별 Facade, readOnly)
- Req/Res 별도 파일·Mapper 클래스 금지 (BE 마스터 가이드 동일)
```

---

## 1. 1세트 대비 구현 상태

### BE (`/web/farm-livestocks`)

| 1세트 | 상태 | 구현 |
|-------|------|------|
| `GET` 목록 | ○ | `searchForWeb` + `FarmLivestockSpecs.forWebList` |
| `GET` 단건 | ○ | `findByIdForWeb` |
| `POST` 등록 | ✗ Web 미노출 | 레거시 `save` 만 (대량 등록 별도) |
| `PUT` 전체 수정 | ✗ | — |
| `DELETE` 비활성 | ✗ Web 미노출 | |
| 부분 수정 | ○ 확장 | `PUT /:id/lifecycle` |
| 읽기 서브리소스 | ○ 확장 | `GET /:id/analysis/temperature` 또는 accelerometer |

### FE (`LivestockInfoManagePage`)

| 1세트 | 상태 | 구현 |
|-------|------|------|
| Layout + TableShell | ○ | |
| React Query 목록 | ○ | `useFarmLivestockList` (mutation 훅은 미완) |
| 포털 필터 | ○ 변형 | `PortalMenuFilterPanel`, `useFarmScopedMenuFilter` |
| FormSheet 등록/수정 | △ / ✗ | `LivestockInfoRegisterBulkSheet` / 탭·모달 |
| 비활성·다운로드 | ✗ | |
| 탭형 상세 | ○ 변형 | `FarmLivestockDetailSheet` |

**○** = 패턴 준수 · **△** = 부분 · **✗** = 미구현 또는 의도적 제외

---

## 2. 파일 맵 (패턴 대응)

```
# FE — console-management-crud-set §2 와 대응
fe-v1/src/
  api/farmLivestock.ts              # 목록·단건·lifecycle
  api/farmLivestockAnalysis.ts      # §14 서브리소스
  hooks/useFarmLivestock.ts         # list query only (mutation TODO)
  types/farmLivestock.ts
  data/farmLivestockFormConfig.ts
  components/pages/LivestockInfoManagePage.tsx
  components/organisms/FarmLivestockDetailSheet.tsx
  components/organisms/LivestockInfoRegisterBulkSheet.tsx
  components/molecules/farmLivestock/*Tab.tsx
  utils/farmLivestockDisplay.ts
  hooks/useFarmWorkspaceTimezone.ts
  utils/portalWorkspaceStorage.ts

# BE — console-web-bff-management-crud-set §5·§11
be-v1/api-console/.../farm/
  controller/web/FarmLivestockWebController.java
  facade/FarmLivestockFacade.java
  facade/FarmLivestockAnalysisFacade.java
be-v1/lib-model/.../farm/
  dto/FarmLivestockReq.java | FarmLivestockRes.java
  spec/FarmLivestockSpecs.java
```

---

## 3. 도메인 전용 규칙 (1세트 공통 외)

### 3.1 성별 코드

- BE `EnLivestockSex.UNKNOWN` = `LX000UNKWN` (10자리)
- FE `LIVESTOCK_SEX_UNKNOWN_CODE`, i18n `farmLivestock.sex.unknown` → **미등록**

### 3.2 생애주기 모달

- `PUT /web/farm-livestocks/:id/lifecycle` — `birthDate`, `livestockSexCode`
- 모달 pre-fill: `resolveSexDraftValue`, `formatBirthDateDraft`
- Facade: 변경 시 `FarmLivestockProfileLog` / `FarmLivestockCodeLog` 기록
- 일정 공통코드·추천 offset: farm-livestock-lifecycle-common-codes.md (`be-v1/docs/knowledge/frontend/development/farm-livestock-lifecycle-common-codes.md`)
- FE fallback: `fe-v1/src/constants/livestockLifecycleCodes.ts`

### 3.3 분석 탭

- 3 API 병렬: 체온·가속도·날씨 hourly — farm-livestock-analysis-bff.md (`be-v1/docs/knowledge/frontend/development/farm-livestock-analysis-bff.md`)
- 차트 병합: `livestockAnalysisChartMocks.ts` (이름은 mock 이지만 BFF merge 로직)

### 3.4 오딧 표시

- 목록 `createdAt`: `formatFarmAuditDt(..., useFarmWorkspaceTimezone(user))`
- 상세: `JpaAuditInfoSection` + `pickJpaAuditFields` + `auditTimeZone`
- 위치·분석·이력 일시: `formatFarmDt` (TZ 변환 없음)

---

## 4. 로컬 테스트 데이터

| 항목 | 값 |
|------|-----|
| farm_id | 220 |
| de_sensor.id | 12 |
| EUI | `70B3D517C3011989` |
| 기간 | 2026-04-01 ~ 2026-06-19 |

SQL: `be-v1/docs/knowledge/frontend/development/sql/farm-livestock-analysis-export-farm220-*.sql`  
`fa_farm_livestock.device_id` ↔ `de_sensor.id` 연결 필수.

---

## 5. 백로그 (1세트 정합)

- [ ] Web `createForWeb` / `updateForWeb` / `deactivateByIdsForWeb` — 필요 시 BE §1 표 준수
- [ ] FE `useCreate/Update/Deactivate` mutation + FormSheet (전체 수정 요구 시)
- [ ] `fetchFarmLivestockForDownload` + `DownloadModal`
- [ ] 폼 입력 → UTC API 유틸 ([farm-timezone-display-policy.md](./farm-timezone-display-policy.md) §5)
