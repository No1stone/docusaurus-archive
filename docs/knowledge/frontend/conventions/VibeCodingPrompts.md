---
title: VibeCodingPrompts
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 바이브코딩용 프롬프트 (규칙 적용)

AI에게 작업을 맡길 때 **먼저 프로젝트 규칙을 적용하라고** 안내하면, 네이밍·구조·UI가 기존 코드와 맞습니다.
아래는 아카이브 Frontend conventions를 전제로 한 **추천 프롬프트** 예시입니다.
옛 `src/guidelines` 경로는 쓰지 않습니다.

---

## 공통 전제 (거의 모든 요청에 붙이기)

```
이 프로젝트의 코드·UI 규칙을 따르면서 해줘.
경량 헥사: docs/knowledge/frontend/architecture/application-structure.md,
folder-structure.md, state/state-ownership-model.md.
네이밍·UI: conventions/CodeConventions.md(Legacy §3.6 제외), UIConventions.md.
Page → useXxx → 개별 기능|Flow → Repository 등 ← Http/Demo. BE Facade 강제 없음.
먼저 참고한 다음 작업해줘.
```

짧게:

```
application-structure(경량 헥사) + conventions 따라줘. Legacy §3.6·api 직접 호출 금지.
```

---

## 1. 새 CRUD 관리 화면 추가 (관리 콘솔 Web BFF 1세트)

한 세트 진입:

- FE: `docs/knowledge/frontend/integration/console-management-crud-set.md` (복사용 프롬프트·교체 항목 포함)
- Profile: `docs/harness/profiles/cms-backoffice-fe.md`
- BE: 대상 계약 (예: `be-v1/.../console-web-bff-management-crud-set.md`)
- 레퍼런스: `DeviceProduction` (가이드. download 이슈는 fe-v1-findings)

```
[도메인명] 관리 콘솔 화면 1세트(BE Web BFF + FE)를 경량 헥사로 추가해줘.

먼저 읽을 문서:
- docs/knowledge/frontend/architecture/application-structure.md
- docs/knowledge/frontend/integration/console-management-crud-set.md
- docs/harness/templates/frontend/cms-crud/README.md
- docs/harness/profiles/cms-backoffice-fe.md
- (BE 있을 때) 대상 Web BFF 문서
- conventions + 대상 AGENTS.md

구조: useXxx · List/Save/Export… · (필요 시) Flow · Repository ← Http/Demo · composition
Layout filter/list/sheets. Chip·다운로드는 기능 있을 때만.
ExampleItem api/hooks 경로·A/D·DELETE·size 100·i18n은 교체 가능한 기본값.

검증: 타입 / 번들 / 브라우저 구분. Vite ≠ 타입 통과.
```

레거시 Store 복사 CRUD만 손댈 때(신규 금지, 이력 유지용):

```
[도메인명] 기존 화면만 최소 수정해줘. 신규 패턴으로 바꾸지 마.
- conventions CodeConventions/UIConventions 네이밍만 맞춤.
- §3.6 Legacy는 기존 화면에만 유지. 신규 화면에는 쓰지 마.
```

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

- 수정할 때 기존 코드 스타일과 규칙을 유지해줘.
  docs/knowledge/frontend/conventions/CodeConventions.md, UIConventions.md 참고해줘.
```

---

## 7. 문서만 참고하라고 할 때

```
다음 작업 할 때:
1) docs/knowledge/frontend/folder-structure.md + state/state-ownership-model.md 로 책임·상태 확인하고,
2) conventions/CodeConventions.md (Legacy §3.6 제외) 로 네이밍 확인하고,
3) conventions/UIConventions.md 로 Button/Card/Sheet/Form/Table 확인한 다음,
그 규칙대로 구현해줘. 타입 검사·번들 빌드·브라우저는 구분해서 보고해줘.
```

---

## 요약

| 하고 싶은 일 | 프롬프트에 넣을 말 |
|--------------|--------------------|
| 규칙 적용 공통 | “Frontend conventions + folder-structure / state-ownership 따라줘” |
| 새 CRUD 화면 | console-management-crud-set 복사용 프롬프트 + cms-crud 슬롯 (조건부 포함) |
| 새 시트/모달 | Sheet(또는 Dialog) 구조 + Form + Zod + Button variant + 필수 * 표시 |
| UI/스타일만 | 시맨틱 토큰 + ui 컴포넌트 + variant, 인라인/hex 자제 |
| 리팩터링 | “두 문서 규칙에 맞게 리팩터링해줘” |

바이브코딩할 때 **규칙 md 두 개를 먼저 참고하라고** 명시하고, 위 프롬프트를 조합해서 쓰면 UI·코드 규칙이 잘 적용됩니다.
