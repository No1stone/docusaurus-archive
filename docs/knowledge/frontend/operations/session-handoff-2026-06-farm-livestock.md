---
title: session handoff 2026 06 farm livestock
---

> **이력 (과거 세션).** 2026-06 Farm Livestock 핸드오프입니다.
> **신규 작업 지시가 아닙니다.** 공통 표준은 [Frontend](/docs/knowledge/frontend/), [cms-crud](/docs/harness/templates/frontend/cms-crud/), [cms-backoffice-fe](/docs/harness/profiles/cms-backoffice-fe)입니다.
> 범위: 도메인 예시. ExampleItem 경로 예: `nutech/fe-v1`.

# Session Handoff: Farm Livestock (2026-06)

> 1차 문서화 스냅샷 — 이 채팅 세션에서 완료·결정된 내용.

## 문서 맵 (패턴 우선)

| 순서 | 문서 | 역할 |
|------|------|------|
| 1 | [console-crud-page-index.md](../integration/console-crud-page-index.md) | 메뉴 인덱스 |
| 2 | [tasks/README.md](../tasks/README.md) | Fragment 워크플로 |
| 3 | [tasks/pages/livestock-info.md](../tasks/pages/livestock-info.md) | 가축 태스크 카드 |

## 완료 요약

### BE

- [x] `FarmLivestockAnalysisFacade` + `StatisticsAnalysisChartSupport`
- [x] 분석 API 3종 (체온·가속도·날씨 hourly)
- [x] `MemberFarmRes.PortalAccessible.timezone` — accessible-for-member

### FE

- [x] 분석 탭 BFF 연동 (`FarmLivestockAnalysisTab`, `farmLivestockAnalysis.ts`)
- [x] 농장 workspace에 `timezone` 저장 (헤더 선택)
- [x] 오딧만 농장 TZ 표시 (목록 `createdAt`, `JpaAuditInfoSection`)
- [x] 성별 미등록 `LX000UNKWN` → **미등록**
- [x] 생애주기 모달 기존값 pre-fill
- [x] `pickJpaAuditFields` import 누락 수정 (`FarmLivestockDetailSheet`)

### 인프라·버그

- [x] Vite `resolve.dedupe: ['react','react-dom']`, `strictPort: true` — Invalid hook call / 중복 dev 서버
- [x] stray `fe-v1/src/vite.config.ts` 삭제
- [x] 위치 탭 TZ 변환 **롤백** (통계는 배치 TZ 완료 전제)

## 핵심 결정

1. **통계·분석·위치 시계열**: FE TZ 변환 금지 (일배치 `stat_local_hour` 신뢰)
2. **JPA 오딧**: FE에서 `fa_farm.timezone`으로 표시만 변환; BE 변경 없음
3. **향후 폼 수정**: 화면 로컬 입력 → UTC로 API 전송 (미구현)

## 후속 세션 (수정 폼·알람·DB 마이그레이션)

### 완료

- [x] 알람 탭 감지 토글 + `PUT /web/farm-livestocks/{id}` (즉시 저장)
- [x] 가축 수정 폼 `FarmLivestockFormSheet` + `LivestockInfoManagePage` onEdit
- [x] **운영 DDL 정리** — `be-v1/docs/knowledge/frontend/development/farm-livestock-1n-log-migration.md`
  - 마스터: `sql/farm-livestock-master-create.sql`
  - 이력 7종: `sql/farm-livestock-log-tables-create.sql`

### 미완 (중요)

- [ ] **운영 DB** — 마스터 CREATE + 이력 7종 CREATE (런북 (`be-v1/docs/knowledge/frontend/development/farm-livestock-1n-log-migration.md`))
- [ ] **BE log INSERT** — `updateForWeb` 저장 시 log append (현재 마스터만 UPDATE)
- [ ] JPA 엔티티: `detection_log`, `sensor_setting_log`, `measure`, `device_log`

## 다음 작업 후보

- [ ] 로컬 DB에 farm220 테스트 데이터 import + `device_id` 연결 확인
- [ ] BE 재기동 후 member-farms `timezone` 필드 FE 확인
- [ ] 폼 UTC 변환 유틸 (출생일·이벤트 일시 수정 시)
- [ ] 관리 콘솔(농장 workspace 없음) 오딧 TZ UX

## 변경 파일 (주요)

**BE**

- `api-console/.../farm/facade/FarmLivestockAnalysisFacade.java`
- `api-console/.../statistics/facade/support/StatisticsAnalysisChartSupport.java`
- `api-console/.../farm/controller/web/FarmLivestockWebController.java`
- `api-console/.../member/facade/MemberFarmFacade.java`
- `lib-model/.../member/dto/MemberFarmRes.java`

**FE**

- `src/api/farmLivestockAnalysis.ts`, `src/types/farmLivestockAnalysis.ts`
- `src/components/molecules/farmLivestock/FarmLivestockAnalysisTab.tsx`
- `src/utils/portalWorkspaceStorage.ts`, `src/hooks/useFarmWorkspaceTimezone.ts`
- `src/utils/formatAuditDateTime.ts`, `src/utils/farmLivestockDisplay.ts`
- `src/components/molecules/JpaAuditInfoSection.tsx`
- `src/components/pages/LivestockInfoManagePage.tsx`
- `src/components/organisms/FarmLivestockDetailSheet.tsx`
- `vite.config.ts`
