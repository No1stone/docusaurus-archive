---
title: VibeCodingPrompts
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 바이브코딩용 프롬프트 (규칙 적용)

AI에게 작업을 맡길 때 **먼저 프로젝트 규칙을 적용하라고** 안내하면, 네이밍·구조·UI가 기존 코드와 맞습니다.  
아래는 이 레포의 `CodeConventions.md`, `UIConventions.md` 를 전제로 한 **추천 프롬프트** 예시입니다.  
복사해서 채워 쓰거나, 상황에 맞게 수정해서 쓰면 됩니다.

---

## 📌 공통 전제 (거의 모든 요청에 붙이기)

작업 전에 규칙을 읽으라고 한 줄 넣어 두면 효과적입니다.

```
이 프로젝트의 코드·UI 규칙을 따르면서 해줘. 
규칙은 src/guidelines/CodeConventions.md(네이밍·구조), src/guidelines/UIConventions.md(UI·스타일) 에 정리돼 있어. 
먼저 두 문서를 참고한 다음 작업해줘.
```

짧게 쓰고 싶을 때:

```
src/guidelines/CodeConventions.md, UIConventions.md 규칙 따라서 해줘.
```

---

## 1. 새 CRUD 관리 화면 추가 (관리 콘솔 Web BFF 1세트)

**FarmPro 관리 콘솔 + api-console Web API** 는 아래 하네스 2개를 **한 세트**로 따른다.

- FE: `docs/knowledge/frontend/integration/console-management-crud-set.md`
- BE: `be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md`
- 레퍼런스 구현: `DeviceProduction` / `DeviceProductionManagePage`

```
[도메인명] 관리 콘솔 화면 1세트(BE Web BFF + FE)를 추가해줘.

먼저 읽을 문서:
- docs/knowledge/frontend/integration/console-management-crud-set.md
- be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md
- src/guidelines/CodeConventions.md, UIConventions.md
- 루트 AGENTS.md

BE: WebListQuery/WebCreate/WebUpdate, Specs.forWebList, Facade 4종, DELETE delete-by-ids → status D
FE: ManagementPageLayout, 서버 페이징, 등록(A 고정)/수정, 비활성 버튼, DownloadModal 100건 페이징 조회

DeviceProduction 코드를 복제·치환하는 방식으로 진행해줘.
```

레거시 Zustand 풀스택 CRUD(파트너·서비스 등)만 필요하면 아래 구버전 프롬프트 사용:

```
[도메인명] 에 대한 새 CRUD 관리 화면을 추가해줘.

- CodeConventions.md, UIConventions.md 규칙을 따르고,
- api/ hooks/ stores/ types/ molecules/ organisms/ pages/ 전부 기존 패턴대로 만들어줘.
- ManagementPageLayout 쓰고, 검색 폼 + 테이블 + 등록/상세/수정 시트 구조로.
- CodeConventions.md 의 **3.6 목록 페이지 화면 동작 규칙** 그대로 따라줘.
- App.tsx / RouteTemplate 라우팅 추가.
```

도메인만 바꿔서 쓰면 됨: `[파트너]` → `[서비스]`, `[약관]` 등.

---

## 2. 기존 페이지에 필터/컬럼 추가

```
[페이지명] (예: PartnerManagePage) 에 [필터/컬럼 설명] 을 추가해줘.

- CodeConventions.md, UIConventions.md 적용.
- 필터는 스토어(partnerFilters 등) 와 SearchForm, useXxx 훅 파라미터에 맞춰서 추가하고,
- 테이블 컬럼은 기존 Table/TableCell 스타일 유지해줘.
```

---

## 3. 새 시트/모달 (등록·수정·상세)

```
[도메인] 등록(또는 수정/상세) 시트 하나 추가해줘.

- UIConventions.md: Sheet 구조(SheetHeader, SheetContent, SheetFooter), Form + react-hook-form + Zod, Button variant(default/outline/ghost) 규칙 따라줘.
- CodeConventions.md: [Domain]RegisterSheet (또는 EditSheet/DetailSheet) 네이밍, organisms 에 두고, 해당 페이지에서 ManagementPageLayout 의 sheets 에 넣어줘.
- 필수 필드는 라벨에 <span className="text-destructive">*</span> 로 표시해줘.
```

---

## 4. UI만 고치기 (스타일·컴포넌트)

```
[화면/컴포넌트 이름] 의 [어떤 부분] 을 [어떻게] 바꿔줘.

- UIConventions.md 기준으로: 색은 시맨틱 토큰(bg-primary, text-muted-foreground 등) 쓰고, Button/Card/Sheet variant 유지해줘.
- components/ui 있는 걸 쓰고, 인라인 스타일이나 #hex 직접 쓰지 말아줘.
```

예: “파트너 검색 폼 버튼을 outline 으로 통일해줘”, “테이블 행 호버 색을 muted 로만 써줘” 등.

---

## 5. 리팩터링 (규칙 맞추기)

```
아래 파일(또는 이 페이지) 을 CodeConventions.md, UIConventions.md 에 맞게 리팩터링해줘.

- 네이밍(파일명, export, 컴포넌트명), 폴더 위치, api/hooks/stores 매핑이 규칙과 같게 맞춰줘.
- UI는 시맨틱 토큰 + ui 컴포넌트 + Button variant 규칙 유지해줘.
```

---

## 6. 버그 수정·기능 수정 (규칙 유지)

```
[버그 설명 또는 수정할 기능]. 

- 수정할 때 기존 코드 스타일과 규칙을 유지해줘. src/guidelines/CodeConventions.md, UIConventions.md 참고해줘.
```

---

## 7. 문서만 참고하라고 할 때

```
다음 작업 할 때: 
1) src/guidelines/CodeConventions.md 로 네이밍·폴더·api/hooks/stores/페이지 구조 확인하고,
2) src/guidelines/UIConventions.md 로 색상·Button/Card/Sheet/Form/Table 사용법 확인한 다음,
그 규칙대로 구현해줘.
```

---

## 요약

| 하고 싶은 일 | 프롬프트에 넣을 말 |
|--------------|--------------------|
| 규칙 적용 공통 | “CodeConventions.md, UIConventions.md 참고해서/따라서 해줘” |
| 새 CRUD 화면 | 도메인명 + ManagementPageLayout + api/hooks/stores/pages/RouteTemplate/handleNavigate |
| 새 시트/모달 | Sheet(또는 Dialog) 구조 + Form + Zod + Button variant + 필수 * 표시 |
| UI/스타일만 | 시맨틱 토큰 + ui 컴포넌트 + variant, 인라인/hex 자제 |
| 리팩터링 | “두 문서 규칙에 맞게 리팩터링해줘” |

바이브코딩할 때 **규칙 md 두 개를 먼저 참고하라고** 명시하고, 위 프롬프트를 조합해서 쓰면 UI·코드 규칙이 잘 적용됩니다.
