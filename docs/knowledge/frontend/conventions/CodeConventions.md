---
title: CodeConventions
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 코드 규칙 역추출 (네이밍 · 구조)

아래는 **실제 코드베이스에서 역으로 추출한** 네이밍 규칙과 구조 규칙입니다.  
“이렇게 하자”가 아니라 “지금 이렇게 되어 있다”는 관찰 결과입니다.

---

## 1. 파일/폴더 구조 (관찰된 구조)

```
src/
├── api/              # 도메인별 1파일, camelCase.ts
├── components/
│   ├── atoms/        # 최소 단위
│   ├── molecules/    # SearchForm, DownloadSearchForm, 공통 조각
│   ├── organisms/    # Table, RegisterSheet, DetailSheet, EditSheet, Modal
│   ├── pages/        # ManagePage, XXXPage
│   ├── templates/    # Layout, Template, Route
│   └── ui/           # shadcn 스타일 공통 UI
├── constants/        # api.ts 등
├── data/
├── hooks/            # use도메인.ts, camelCase
├── stores/           # 도메인Store.ts, camelCase
├── types/            # index.ts + 도메인.ts
└── utils/
```

---

## 2. 네이밍 규칙 (코드에서 추출)

### 2.1 파일명

| 위치 | 관찰된 패턴 | 실제 예시 |
|------|-------------|-----------|
| **api/** | camelCase, 복수/복합명 위주 | `partners.ts`, `partnerMembers.ts`, `commonCodes.ts`, `liquorFiles.ts`, `productLiquorOptions.ts`, `displayPositions.ts`, `moodActions.ts`, `noteAttributes.ts`, `services.ts`, `terms.ts`, `files.ts` |
| **hooks/** | use + PascalCase (camelCase 파일명) | `usePartners.ts`, `usePartnerMembers.ts`, `useCommonCodes.ts`, `useLiquorFiles.ts` |
| **stores/** | camelCase + `Store` | `partnerStore.ts`, `partnerMemberStore.ts`, `commonCodeStore.ts`, `liquorFileStore.ts` |
| **components (모든 레이어)** | PascalCase.tsx | `PartnerManagePage.tsx`, `PartnerSearchForm.tsx`, `PartnerTable.tsx`, `PartnerRegisterSheet.tsx` |

### 2.2 API 함수 (export 이름)

| 역할 | 관찰된 패턴 | 예시 |
|------|-------------|------|
| 목록/검색 | `fetchXxx` (복수) | `fetchPartners`, `fetchPartnerMembers`, `fetchLiquors`, `fetchMoods`, `fetchSigungus` |
| 단건 조회 | `fetchXxx` (단수) | `fetchPartner`, `fetchPartnerMember`, `fetchLiquor`, `fetchMood`, `fetchSigungu` |
| 생성 | `createXxx` | `createPartner`, `createLiquor`, `createMood` |
| 수정 | `updateXxx` | `updatePartner`, `updateLiquor`, `updateMood` |
| 삭제 단건 | `deleteXxx` (단수) | `deletePartner`, `deleteLiquor`, `deleteMood` |
| 삭제 복수 | `deleteXxxs` (복수) | `deletePartners`, `deleteLiquors`, `deleteMoods`, `deleteSigungus` |
| 다운로드용 목록 | `fetchXxxForDownload` / `fetchXxxsForDownload` | `fetchPartnersForDownload`, `fetchPartnerMembersForDownload`, `fetchLiquorsForDownload`, `fetchSigungusForDownload` |
| 이름/간단 목록 | `fetchXxxNames` / `fetchXxxNamesFromAPI` 등 | `fetchPartnerNamesFromAPI`, `fetchSigunguNames`, `fetchServiceNamesFromAPI` |

예외: `terms`는 `fetchTerms`, `fetchTermsById`, `createTerms`, `updateTerms`, `deleteTerms`, `fetchTermsContent`, `fetchTermsForDownload` 처럼 복수형 유지.

### 2.3 Hooks (export 이름)

| 역할 | 관찰된 패턴 | 예시 |
|------|-------------|------|
| Query Key 객체 | `xxxKeys` 또는 `xxxQueryKeys` (camelCase) | `partnerKeys`, `partnerMemberQueryKeys`, `liquorKeys`, `aromaKeys`, `releaseQueryKeys`, `portalMemberQueryKeys` |
| 목록 조회 | `useXxx` (복수) | `usePartners`, `usePartnerMembers`, `useLiquors`, `useAromas`, `useReleases` |
| 단건 조회 | `useXxx` (단수) | `usePartner`, `usePartnerMember`, `useLiquor`, `useAroma`, `useRelease` |
| 생성 Mutation | `useCreateXxx` | `useCreatePartnerMember`, `useCreateLiquor`, `useCreateAroma`, `useCreateRelease` |
| 수정 Mutation | `useUpdateXxx` | `useUpdatePartnerMember`, `useUpdateLiquor`, `useUpdateAroma` |
| 삭제 Mutation | `useDeleteXxx` / `useDeleteXxxs` | `useDeletePartnerMembers`, `useDeleteLiquors`, `useDeleteAromas`, `useDeleteReleases` |

복합 도메인: `useCommonCodeTypes`, `useCommonCodeItems`, `useCommonCodeType`, `useCommonCodeItem`, `useCreateCommonCodeType` 등.

### 2.4 Store (export 이름)

| 관찰된 패턴 | 예시 |
|-------------|------|
| 훅만 export, 이름은 `useXxxStore` | `usePartnerStore`, `usePartnerMemberStore`, `useLiquorStore`, `useAromaStore`, `useCommonCodeStore`, `useServiceStore`, `useTermsStore`, `useSigunguStore` |

파일명과 1:1: `partnerStore.ts` → `usePartnerStore`.

### 2.5 컴포넌트 (molecules)

| 용도 | 관찰된 패턴 | 예시 |
|------|-------------|------|
| 검색 폼 | `{Domain}SearchForm` | `PartnerSearchForm`, `ServiceSearchForm`, `LiquorSearchForm`, `AromaSearchForm`, `CommonCodeTypeSearchForm`, `CommonCodeSearchForm` |
| 다운로드용 검색 폼 | `{Domain}DownloadSearchForm` | `PartnerDownloadSearchForm`, `ServiceDownloadSearchForm`, `LiquorDownloadSearchForm`, `CommonCodeTypeDownloadSearchForm` |

기타: `ErrorAlert`, `ErrorBoundary`, `FileUpload`, `RichTextEditor`, `SearchInput`, `StatsCard`, `TableLoadingSkeleton`, `UserAvatar` 등 역할 기반 PascalCase.

### 2.6 컴포넌트 (organisms)

| 용도 | 관찰된 패턴 | 예시 |
|------|-------------|------|
| 테이블 | `{Domain}Table` | `PartnerTable`, `PartnerMemberTable`, `ServiceTable`, `LiquorTable`, `FaqTable`, `NoticeTable` |
| 등록 시트 | `{Domain}RegisterSheet` | `PartnerRegisterSheet`, `ServiceRegisterSheet`, `LiquorRegisterSheet` |
| 상세 시트 | `{Domain}DetailSheet` | `PartnerDetailSheet`, `PartnerMemberDetailSheet`, `ServiceDetailSheet` |
| 수정 시트 | `{Domain}EditSheet` | `PartnerEditSheet`, `PartnerMemberEditSheet`, `ServiceEditSheet` |
| 모달 (등록/상세/수정) | `{Domain}RegisterModal`, `{Domain}DetailModal`, `{Domain}EditModal` | `TermsRegisterModal`, `TermsDetailModal`, `TermsEditModal`, `CommonCodeRegisterModal`, `CommonCodeEditModal` |

섹션/기타: `CommonCodeTypeSection`, `CommonCodeSection`, `TermsSection`, `TermsContentSection`, `ReleaseListSection` 등.

### 2.7 컴포넌트 (pages)

| 용도 | 관찰된 패턴 | 예시 |
|------|-------------|------|
| CRUD 관리 화면 | `{Domain}ManagePage` | `PartnerManagePage`, `ServiceManagePage`, `LiquorManagePage`, `AromaManagePage`, `CommonCodeManagePage`, `TermsManagePage`, `AdminManagePage`, `SigunguManagePage` |
| 대시/인증/지원 등 | `{기능}Page` | `DashboardPage`, `LoginPage`, `PasswordResetPage`, `TwoFactorAuthPage`, `HelpPage`, `SupportPage`, `ContactPage` |

---

## 3. 구조 규칙 (코드에서 추출)

### 3.1 도메인 1:1 매핑

- **api**: `api/partners.ts` → 파트너 도메인 전용 (파트너 멤버 포함 시 `partnerMembers.ts` 로 분리 가능).
- **hooks**: `hooks/usePartners.ts` → `partnerKeys`, `usePartners`, `usePartner`, mutation 훅들.
- **stores**: `stores/partnerStore.ts` → `usePartnerStore`.
- **molecules**: `PartnerSearchForm`, `PartnerDownloadSearchForm`.
- **organisms**: `PartnerTable`, `PartnerRegisterSheet`, `PartnerDetailSheet`, `PartnerEditSheet`.
- **pages**: `PartnerManagePage.tsx`.

위 조합이 한 도메인(CRUD) 단위로 반복됨.

### 3.2 관리 페이지 레이아웃

- 목록+검색+시트 구조인 페이지는 전부 `ManagementPageLayout` 사용.
- 전달 props: `filter`, `list`, `sheets`, `error`, `errorMessage`, `pagination` 등 (`filter` / `list` 슬롯).
- 필터 공통 UI: `components/molecules/filters/` (`FilterDateRangeField`, `ManagementFilterPanel`) + `FilterSearchButtons`. 상세는 [management-filter-kit](/docs/knowledge/frontend/architecture/management-filter-kit).

### 3.3 페이지 키 (라우팅)

- React Router 없음. `currentPage` 문자열로 구분.
- 형식: `'메뉴-하위메뉴'` (예: `'파트너-파트너 관리'`, `'설정-서비스 관리'`).
- `RouteTemplate`에서 `currentPage` switch로 매핑.

### 3.4 필터 초기화

- 페이지 전환 시 `App.tsx`의 `handleNavigate`에서 해당 스토어의 `resetFilters()` 호출.
- 스토어는 `resetFilters()` (또는 `resetTypeFilters`/`resetItemFilters` 등) export.

### 3.5 임포트

- 대부분 **상대 경로** 사용 (예: `../../hooks/usePartners`, `../../stores/partnerStore`, `../../api/partners`).
- `@/` path alias는 tsconfig에 있으나 사용처는 소수.

### 3.6 목록(CRUD) 페이지 화면 동작 규칙 (역추출)

관리 페이지(ManagementPageLayout 쓰는 목록 화면)는 **진입 시** 아래 순서로 동작해야 기존 화면과 동일하게 동작함.

1. **마운트 시 1회** (useEffect, 의존성: queryClient, resetFilters)
   - `skipFilterEffect.current = true` 로 설정.
   - `queryClient.invalidateQueries({ queryKey: ['도메인키'] })` (예: `['partners']`).
   - 스토어 `resetFilters()` 호출.
   - `setCurrentPage(0)`, `setSorting(초기값)`.
   - `setIsFiltersInitialized(true)`, `isInitialMount.current = false`.
   - 짧은 뒤 `setTimeout` 으로 `skipFilterEffect.current = false` (예: 100ms).
   - **cleanup**: return () => {'{'} isInitialMount.current = true; setIsFiltersInitialized(false); {'}'}.
2. **useXxx(목록) 활성화 조건**
   - `enabled = isFiltersInitialized || (!isInitialMount.current && !skipFilterEffect.current)`.
   - 이렇게 해야 진입 시 필터 초기화 후에만 첫 API 호출이 나감.
3. **API 응답 → 스토어**
   - `useEffect` 로 `data`(또는 response) 가 오면 `setXxx(response.data)` 호출. 실패 시 빈 배열 등으로 정리.
4. **페이지 lazy 로딩**
   - `RouteTemplate` 에서 페이지는 `createLazyPage(() => import("../pages/XxxManagePage"), 'XxxManagePage')` 형태로 등록.
5. **라우팅 케이스**
   - `RouteTemplate` 의 switch 에는 `'메뉴-하위메뉴'`(예: `'파트너-파트너 관리'`) 와, 필요 시 `'하위메뉴'`(예: `'파트너 관리'`) 둘 다 같은 페이지로 매핑하는 패턴 있음.

이 순서를 지키면 “다른 메뉴 갔다 와도 필터/페이지 초기화되고, 캐시 안 남고, 첫 요청만 깔끔히 나가는” 기존 화면 규칙이 유지됨.

---

## 4. 요약 표 (역추출 결과)

| 구분 | 파일/export 네이밍 |
|------|--------------------|
| api 파일 | camelCase, 복수/복합 (`partners`, `partnerMembers`, `commonCodes`) |
| api 함수 | `fetchXxx` / `fetchXxxs`, `createXxx`, `updateXxx`, `deleteXxx` / `deleteXxxs`, `fetchXxxForDownload` |
| hooks 파일 | `useXxx.ts` (camelCase) |
| hooks export | `xxxKeys` 또는 `xxxQueryKeys`, `useXxx`, `useCreateXxx`, `useUpdateXxx`, `useDeleteXxx(s)` |
| stores 파일 | `xxxStore.ts` |
| stores export | `useXxxStore` |
| molecules | `{Domain}SearchForm`, `{Domain}DownloadSearchForm` + 역할명 PascalCase |
| organisms | `{Domain}Table`, `{Domain}RegisterSheet`, `{Domain}DetailSheet`, `{Domain}EditSheet`, `{Domain}*Modal` |
| pages | `{Domain}ManagePage` 또는 `{기능}Page` |

이 문서는 “코드 규칙을 역으로 추출”한 네이밍·구조 정리본입니다. 필요하면 팀에서 예외나 추가 규칙을 보완해 사용하면 됩니다.
