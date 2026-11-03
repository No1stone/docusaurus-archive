---
title: console crud base set
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# Console CRUD 기본셋 (FE ↔ BE 공통 쌍)

> **상태:** `active`
> **이 문서 작업의 목적:** 어떤 관리 메뉴든 **공통으로 반복되는 CRUD 골격**(필터 · 목록 · 조회 · 수정 · 삭제/비활성)을 FE↔BE 한 쌍으로 **공통화·문서화**하는 것.
> **파이프라인에 없는 것:** 도메인별 화면·업무 — 생산의 파트너 납품, 관리자 초대메일, 가축 조회 탭 등은 **별도 구현·별도 문서** (본 태스크 목록에 넣지 않음).
> 골드 레퍼런스: `DeviceProduction` (FE + BE)

---

## 0. 포함 / 제외 (한눈에)

| **파이프라인 (공통 CRUD)** | **도메인 특화 (파이프라인 밖)** |
|---------------------------|--------------------------------|
| 필터 (포털·keyword·status) | 파트너 납품·재고 이동 (생산) |
| 목록·페이징·Badge | 초대메일·가용성 검사 (관리자) |
| 단건 상세(카드)·id→이름 MAP | 가축 탭·분석·lifecycle UI |
| Form 등록·수정·비활성 | 초대·bulk·부분 PUT 등 업무 API |
| BE Web BFF 4종 + Facade 규칙 | 하위 테이블·연관 전용 조회 |

**원칙:** 모든 메뉴를 전부 문서화하지 않는다. **기본셋만** 맞추고, 특화는 `domains` 갭·도메인 portal 문서에만 적는다.

---

## 1. 기본셋이란

메뉴 클릭 → **필터 → 목록 → 행 클릭 → 상세/등록/수정/비활성** 까지의 **공통 골격**.

**범위 (본 문서·파이프라인 BE-01~FE-08):** 해당 메뉴 **주 테이블**에 대한 **조회(L)·등록(C)·수정(U)·삭제/비활성(D)** 만.
**범위 밖 (별도 구현·별도 세션):** 하위 연관 테이블, 테이블 특성에 맞는 **세부 조회**, 탭·차트·이력·부분 PUT 등 — 상황에 따라 UI가 자주 바뀌는 구간은 **도메인 diff**로 분리한다. (가축 조회·탭이 대표 예)

| 구분 | 파이프라인 태스크 | 도메인 별도 |
|------|-------------------|-------------|
| 목록·단건 상세(카드) | FE-04~06, BE-03 | — |
| MAP 표시명 | BE-06, FE-09 | — |
| Form CUD | FE-07~08, BE-04~05 | — |
| 탭·분석·하위 목록·lifecycle | — | 별도 BFF + FE + 문서 |
| 조회 UI 특화·수시 변경 | — | `domains` 갭 / portal 문서 |

**판정:** 기본셋 Signoff ≠ 도메인 조회 특화까지 완료. 후자는 **갭 표에 적고 태스크를 따로** 돈다.

| 층 | 마스터 문서 | 조각(Fragment) |
|----|-------------|----------------|
| FE 전체 | [console-management-crud-set.md](./console-management-crud-set.md) | T01~T07 |
| BE 전체 | console-web-bff-management-crud-set.md (`be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md`) | B01 / B02 |
| 조각 목록 | [tasks/README.md](../tasks/README.md) | |

**신규 메뉴 실행:** [tasks/pipeline/README.md](../tasks/pipeline/README.md) — **마이크로 태스크 1개씩** (BE-01→…→FE-08→해당 [QA-after-*](../tasks/pipeline/qa/README.md)).
세션당 파이프라인 문서 **1개만** 연다. `QA-01` 통합 회귀는 쓰지 않습니다.

---

## 2. FE 기본셋 (조각 조합)

### 2.1 필터 (둘 중 하나)

| 유형 | Fragment | 언제 |
|------|----------|------|
| 포털·siteCode·공통코드 Select | [T01](../tasks/fragments/T01-filter-portal-registry.md) | `portalMenuFilterRegistry` 등록 메뉴 |
| keyword + status 단순 | [T02](../tasks/fragments/T02-filter-simple-keyword.md) | ops·단순 관리 |

**공통 UI 규칙**

- **상단:** 스코프(파트너/농장)·상태·공통코드 → `Select` / `FilterCodeSelectField`
- **하단:** 검색어 + `FilterSearchButtons` (조회 클릭 시 applied 반영)
- siteCode: `console` | `partner` | `member` → `buildPortalScopeFilterUi`

**공통코드 (필터·목록 Chip·등록 Select)**

- API는 **10자리 code** 만 반환 — 라벨·i18n·캐시는 **FE 전담** ([common-code-fe-harness.md](./common-code-fe-harness.md))
- Page에서 `useCommonCodesByType` / 도메인 래퍼로 **필요 typeId만** 로드 → `nameMaps` 하위 전달
- 필터: `FilterCodeSelectField` + `*FormOptions(t, nameByCode)` — raw code UI 금지
- 목록: [T04](../tasks/fragments/T04-list-common-code-chip.md) Chip · 등록 폼: 동일 `nameMaps` 재사용

레지스트리 단일 소스: `src/config/portalMenuFilterRegistry.ts`

### 2.2 목록

[T03](../tasks/fragments/T03-list-table-shell.md) — `ManagementPageLayout` + `ManagementTableShell` + React Query 서버 페이징

- 상태: Badge (활성/비활성, `A`/`D` 노출 금지)
- 비활성 버튼: `deleteLabel` = 비활성
- 공통코드 컬럼 있으면 → [T04](../tasks/fragments/T04-list-common-code-chip.md) Chip 추가

### 2.3 상세·CRUD

| Fragment | 내용 |
|----------|------|
| [T05](../tasks/fragments/T05-detail-card-sheet.md) | 상세 Card · FieldGrid · (선택) Chip |
| [T06](../tasks/fragments/T06-crud-mutations-download.md) | FormSheet · mutation · DownloadModal |

표준: 행 클릭 → DetailSheet → 수정 FormSheet.
**기본셋 벗어남**(탭 상세·부분 PUT 등)은 도메인 문서·태스크 카드에서만 기술.

### 2.4 검수

[T07](../tasks/fragments/T07-verify-checklist.md) — **작업한 메뉴 1개만** 검수 (전체 회귀 X)
FE 마감 시 **[QA-fe-import-check](../tasks/pipeline/qa/QA-fe-import-check.md)** — 변경 파일 `import` + `build:console` 필수.

---

## 3. BE 기본셋 (조각)

### 3.1 CRUD 4종 (일반 관리)

B01 (`be-v1/docs/knowledge/frontend/tasks/fragments/B01-web-bff-crud-four.md`)

| HTTP | Facade |
|------|--------|
| `GET` | `searchForWeb` |
| `POST` | `createForWeb` |
| `PUT /{id}` | `updateForWeb` |
| `DELETE /delete-by-ids` | `deactivateByIdsForWeb` |

- DTO: `{Domain}Req` / `{Domain}Res` **inner class** (별도 파일 금지)
- Res: `Item`에 연관 · Web은 `WebListItem`/`WebDetail` — 연관 DTO 패턴 (`be-v1/docs/knowledge/frontend/development/console-bff-dto-association-pattern.md`)
- Specs: `forWebList` · Mapper 클래스 금지
- 목록 정렬: PK Long/Integer → `id DESC`; 그 외 → `createdAt DESC` — list-sort-default (`be-v1/docs/knowledge/frontend/development/console-web-bff-list-sort-default.md`)
- Facade: **자기 `{Domain}Service`만** · 타 도메인은 `*Facade` — console-bff-facade-dependency-rule.md (`be-v1/docs/knowledge/frontend/development/console-bff-facade-dependency-rule.md`)
- 목록: `UserNameFacade` (createdBy/updatedBy) — **[BE-06](../tasks/pipeline/BE-06-display-map.md)**

### 3.2 목록·조회만

B02 (`be-v1/docs/knowledge/frontend/tasks/fragments/B02-web-bff-list-read.md`) — 날씨·이력·알람 등 CUD 없을 때

CUD가 필요해지면 B02 → B01 승격 (**설계요청** 후 적용).

### 3.3 기본셋 이후 확장 (선택)

마스터 §11 (`be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md`): 단건 GET · 부분 PUT · 읽기 서브리소스 Facade 분리.

---

## 4. FE ↔ BE 필드·URL 맞춤

| 항목 | 규칙 |
|------|------|
| URL | `/web/{resource}` (`/console` context 제외) |
| 요청 body | camelCase |
| 페이징 | `page`, `size` (max 100) |
| status 필터 | `all` \| `A` \| `D` |
| 성공 코드 | `0000CM0000`, `SSPAPIC000`, `0000` |
| 공통코드 표시 | BE: code 문자열 · FE: [common-code-fe-harness](./common-code-fe-harness.md) (캐시·i18n) |

---

## 5. 레퍼런스 예시 (전체 메뉴 인덱스 아님)

기본셋 **그대로** 적용한 모범 사례만 둔다. 나머지 메뉴는 기본셋 복제 후 diff.

| 유형 | pageId | 태스크 카드 |
|------|--------|-------------|
| full-crud 골드 | `production-device-production` | [device-production.md](../tasks/pages/device-production.md) |
| list-read | `weather-weather-lookup` | [weather-lookup.md](../tasks/pages/weather-lookup.md) |
| 기본셋 + 도메인 diff | `livestock-livestock-info` | [livestock-info.md](../tasks/pages/livestock-info.md) |

더 많은 메뉴 표가 필요할 때만 [console-crud-page-index.md](./console-crud-page-index.md) 보조 참고.

---

## 6. 도메인 diff 시 (기본셋 이후 · 조회 특화)

**원칙:** 메뉴 **CUD + 주 리소스 목록/단건**은 파이프라인으로 맞춘다.
**연관·하위·테이블 특성 조회**와 그에 맞는 UI는 **항상 별도 구현** — 가축처럼 조회 쪽은 요구가 바뀌기 쉬우므로 기본셋에 끼워 넣지 않는다.

1. 기본셋 태스크 + QA-after + import 검수 통과 → **1세트 완료**로 본다
2. diff 항목만 `domains/{pageId}.md` **갭** 또는 도메인 portal 문서에 기록
3. diff마다 **독립 세션** (예: `farm-livestock-analysis-bff`, 탭 `*Tab.tsx`) — 공통 Fragment(T01~T07)는 건드리지 않음

| diff 유형 | BE | FE | 문서 예 |
|-----------|----|----|---------|
| 읽기 서브리소스 | 별 Facade·Controller | 별 `api/*`·탭 | analysis-bff |
| 부분 PUT (lifecycle) | BE-04 확장 태스크 | 모달/탭 mutation | farm-livestock-portal |
| 하위 연관 목록 | 타 도메인 Web GET | 하위 메뉴·시트 | 킥오프 갭 |
| 조회 UI 특화 | 필요 시만 | **상황별 수정** | portal §탭 |

예: 가축 — **1세트**는 목록·단건·CUD(예정) · **diff**는 탭·분석·lifecycle·TZ → [farm-livestock-portal.md](./farm-livestock-portal.md)

---

## AI 에이전트 (기본셋 적용)

```
신규(또는 정비) 관리 메뉴에 Console CRUD 기본셋만 적용해줘.

1. docs/knowledge/frontend/integration/console-crud-base-set.md (본 문서)
2. 공통코드 필터·Chip·폼 있으면 docs/knowledge/frontend/integration/common-code-fe-harness.md
3. BE B01 또는 B02 Fragment
4. FE T01/T02 → T03 → T05 → T06(해당 시)
5. DeviceProduction 레퍼런스 복제 후 도메인 치환
6. T07로 이 메뉴만 검수

도메인 특수 UI·API는 사용자 지시 있을 때만 추가. **조회 특화·하위 연관은 기본셋과 분리** — 별도 문서·별도 세션. 다른 메뉴 수정 금지.
```
