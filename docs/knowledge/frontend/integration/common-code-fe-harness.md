---
title: common code fe harness
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# [하네스] FE 공통코드 — 최소 로드·캐시·i18n

> **상태:** `active`  
> **BE 대응:** common-code-system-harness.md (`be-v1/docs/knowledge/frontend/development/common-code-system-harness.md`)  
> **CRUD 1세트:** [console-crud-base-set.md](./console-crud-base-set.md) §2.1 · [console-management-crud-set.md](./console-management-crud-set.md) §7.1  
> **관련:** [FE-10 i18n](../tasks/pipeline/FE-10-i18n.md), [T04 Chip](../tasks/fragments/T04-list-common-code-chip.md)

콘솔·포털 화면에서 BizEnum 공통코드(셀렉트·Chip·라벨)를 다룰 때의 **FE 단일 규칙**이다.  
풀스캔·일괄 리팩터 없이, **신규·수정 화면부터** 본 문서를 따른다.

---

## 1. 목표

1. 화면에 **필요한 `common_code_type_id`만** API로 가져온다.
2. React Query로 **타입별 캐시** — 있으면 재사용, 없으면 1회 fetch 후 캐시.
3. 라벨은 **API name 우선 + i18n 보강** — raw code 노출 금지.

---

## 1.1 로컬 DB · code 원천 (i18n 확인)

**운영 DB는 자동 sync하지 않는다.** 스테이징·운영은 검토된 SQL 수동 적용 (BE §12.1 (`be-v1/docs/knowledge/frontend/development/common-code-system-harness.md#121-운영-정책-필수`)).

**code 목록 원천:** BE `@BizEnum` — `lib-model/.../enums/livestock/` (`EnLivestockSpecies` 등).  
i18n 키: `farmLivestock.{group}.{CODE}` (10자리 code).

| 단계 | 내용 |
|------|------|
| 1. code 확인 | BE Enum 또는 로컬 DB / `operation/common-codes` API |
| 2. 로컬 DB | `livestock/upsert` 또는 `all/AllCommonCodeUpsert` |
| 3. i18n | `farmLivestock.{group}.{CODE}` ↔ `locales` ko/en |
| 4. 운영 | 확정 SQL **수동** 적용 |

**10자 검증:** `./gradlew :api-console:test --tests ai.farmpro.apiconsole.commoncodesync.livestock.CommonCodeIdRulesTest`

**에이전트:** Enum·Insert 클래스 기준 → 로컬 insert·가공 → 화면 §3. **운영 자동 sync 금지.**

---

## 2. 캐시 (단일 출처)

| 항목 | 구현 |
|------|------|
| 훅 | `useCommonCodesByType(typeId)` — `fe-v1/src/hooks/useCommonCodes.ts` |
| Query key | `commonCodesByTypeQueryKey(typeId)` |
| staleTime | 10분 · gcTime 30분 · `refetchOnMount/Focus/Reconnect: false` |
| 무효화 | `clearAllCommonCodesCache(queryClient)` — `commonCodesCache.ts` |

**금지**

- 화면마다 `fetchCommonCodeNamesByTypeFromAPI` 직접 호출 (캐시 우회)
- 동일 typeId를 여러 훅/컴포넌트에서 **각각 새로 fetch** (캐시는 맞아도 구독·로딩 UI 중복)

---

## 3. 최소 로드 원칙

### 3.1 화면별 typeId

화면·폼에 **실제로 쓰는 그룹만** 로드한다.

| 용도 | 예 (가축) |
|------|-----------|
| 목록 필터 | species, category, breed, health (필터에 있는 것만) |
| 등록 폼 | species, category, sex, breed, health (필드 있는 것만) |
| 상세 Chip | 해당 행에 표시하는 그룹만 |

도메인별 typeId 상수: `LIVESTOCK_COMMON_CODE_TYPE` 등 — `constants/*CommonCodeTypes.ts`.

### 3.2 소유권 (권장)

```
Page (또는 최상위 Sheet)
  └ use*CodeLabels()  ← 여기서만 useCommonCodesByType N회
  └ nameMaps prop 으로 하위 Form / Filter / Chip 에 전달
```

- **목록 페이지가 이미 로드한 캐시** → 슬라이딩 시트·모달은 `codeNames={nameMaps}` 로 **재조회 없이** 사용.
- 하위 컴포넌트는 `codeNames`가 있으면 그걸 쓰고, 없을 때만 훅 폴백 (단건·스토리북·데모).

레퍼런스:

- `LivestockInfoManagePage` → `codeNames={nameMaps}` → `LivestockSensorRegisterSheet`
- `useFarmLivestockCodeLabels` — 도메인 래퍼 (nameMaps + `*Label` 헬퍼)

### 3.3 도메인 래퍼 훅

반복되는 typeId 묶음은 **도메인 훅 하나**로:

```ts
// 패턴: useFarmLivestockCodeLabels
useCommonCodesByType(LIVESTOCK_COMMON_CODE_TYPE.species);
// … 화면에 필요한 type만
```

**금지:** 등록 시트 전용인데 reproductive까지 6종 전부 로드 (최소 집합 위반).

---

## 4. i18n 규칙

### 4.1 라벨 함수

| 역할 | 함수 |
|------|------|
| 단일 코드 → 표시 문자열 | `livestockCodeLabel(group, code, t, nameByCode)` |
| API rows → id→name 맵 | `buildLivestockNameByCode(items)` |
| 셀렉트 옵션용 맵 (API 비었을 때) | `resolveLivestockNameMapForForm(group, apiMap, t)` |

- i18n 키: `farmLivestock.{species|category|sex|breed|health|reproductive}.{CODE}`
- API `name`이 있으면 `defaultValue`로 넣고, locale 번역이 있으면 i18n이 우선.
- UNKNOWN 성별 등: `farmLivestock.sex.unknown` (raw `LX000UNKWN` 노출 금지).

### 4.2 폼 옵션

- `farmLivestock*FormOptions(t, nameByCode)` — `farmLivestockFormConfig.ts`
- 정렬: BE Enum 선언 순 (`compareLivestockFormCodes`) — 가나다순 아님.
- 레거시 코드: `canonicalLivestockFormCode` / `dedupeLivestockFormCodes` 로 10자리 통일.

### 4.3 FE-10과의 관계

- UI 문구(버튼·토스트·라벨): `t("domain.key")` — FE-10.
- **코드 값 자체**는 i18n 키로만 번역 — Chip/Select에 code 리터럴 금지 (T04).

---

## 5. 구현 체크리스트 (신규·수정 시)

- [ ] 이 화면에 필요한 `common_code_type_id` 목록을 적었는가?
- [ ] Page(또는 Sheet)에서 한 번만 로드하고 `nameMaps`를 내리는가?
- [ ] 하위에서 `useCommonCodesByType` 중복 호출을 줄였는가?
- [ ] 셀렉트/Chip이 `livestockCodeLabel` + `resolveLivestockNameMapForForm` 을 쓰는가?
- [ ] ko/en `farmLivestock.{group}.*` 에 신규 코드 키를 추가했는가? (FE-10)
- [ ] 로딩: 캐시·i18n 폴백으로 빈 셀렉트가 되지 않는가?

---

## 6. 현재 갭 (레퍼런스 — 일괄 수정 대상 아님)

| 항목 | 상태 |
|------|------|
| `useCommonCodesByType` 캐시 | ○ |
| 가축 `useFarmLivestockCodeLabels` subset·`codeNames` | ○ |
| 농장 필터 `useFarmTypeCodeLabels` (species·purpose) | ○ |
| 생애주기 `useFarmLivestockLifecycleLabels` | ○ |
| 역할 `useRoleCodeLabels` | ○ |
| 데모·목 `farmEntityCodes` / `portalUserDemo` | 보류 — 프로덕션 경로만 API 전환 |
| locale/TZ 농장 필터 | △ — `farmEntityCodes` subset 유지 (Track 6) |
| `query-cache-rules.md` 공통코드 절 | ✗ — 추후 링크만 추가 |

이후 가축·다른 도메인 화면을 **건드릴 때마다** §3·§5만 맞추면 된다.

---

## 7. AI 에이전트 프롬프트 (복사)

```
FE 공통코드(셀렉트·Chip) 작업 전에 docs/knowledge/frontend/integration/common-code-fe-harness.md 를 읽고:

0. code 목록: BE lib-model enums/livestock 또는 로컬 operation/common-codes API
1. 화면에 필요한 common_code_type_id 만 useCommonCodesByType 으로 로드
2. 상위에서 nameMaps 캐시 후 하위에 prop 전달 — 불필요한 중복 fetch 금지
3. 라벨: livestockCodeLabel + resolveLivestockNameMapForForm, raw code UI 금지
4. ko/en farmLivestock.{group}.{CODE} 키 확인 (§1.1 로컬 DB/API 목록과 대조)

풀스캔 리팩터 없이, 이번에 수정하는 파일만 위 규칙에 맞출 것.
```
