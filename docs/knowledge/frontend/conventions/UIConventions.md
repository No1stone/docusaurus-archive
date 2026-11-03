---
title: UIConventions
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# UI 규칙 역추출 (디자인·컴포넌트)

코드베이스에서 **실제로 쓰이는** UI/스타일 규칙을 역으로 정리한 문서입니다.  
바이브코딩 시 `src/guidelines/UIConventions.md` 를 참고하라고 하면 이 규칙을 따르게 할 수 있습니다.

---

## 1. 디자인 토큰 (globals.css 기준)

### 1.1 색상 시맨틱

| 토큰 | 용도 | 라이트 예시 |
|------|------|-------------|
| `--primary` | 메인 액션, 강조 | #5B4FE3 |
| `--primary-foreground` | primary 위 텍스트 | 흰색 |
| `--secondary` | 보조 버튼, 배경 | 연한 보라 계열 |
| `--muted` / `--muted-foreground` | 비강조 텍스트, 설명 | #ececf0 / #717182 |
| `--accent` / `--accent-foreground` | 호버, 선택 배경 | #e9ebef |
| `--destructive` / `--destructive-foreground` | 삭제, 경고 | #d4183d / 흰색 |
| `--border` | 테두리 | rgba(0,0,0,0.12) |
| `--card` / `--card-foreground` | 카드 배경/글자 | #ffffff / 진한 글자 |
| `--input` / `--input-background` | 입력 필드 | transparent / #f3f3f5 |

- **Tailwind 사용**: `bg-primary`, `text-muted-foreground`, `border-border`, `bg-destructive` 등 시맨틱 클래스 사용.  
- **직접 hex 남발 금지**: 새 색은 가능하면 토큰 추가 후 `@theme` 에 매핑.

### 1.2 간격·타이포

- `--radius`: 0.625rem (기본 라운드)
- `--radius-sm/md/lg/xl`: radius 기준으로 계산
- 폰트: body 는 `"Malgun Gothic", "맑은 고딕", system-ui, sans-serif`
- 텍스트 크기: `text-xs` ~ `text-2xl` (Tailwind), 시맨틱은 `--text-xs` 등

### 1.3 다크 모드

- `.dark` 클래스로 `:root` 오버라이드.  
- 색은 `--background`, `--foreground`, `--primary` 등 동일 토큰명으로 다크 값 정의.

---

## 2. 공통 UI 컴포넌트 (src/components/ui)

- **출처**: Radix UI + shadcn 스타일. `cn()` (utils.ts) 로 클래스 병합.
- **data-slot**: 접근성/디버깅용 `data-slot="버튼명"` 패턴 사용 (예: `data-slot="button"`).

### 2.1 Button

- **variant**: `default`(primary), `destructive`, `outline`, `secondary`, `ghost`, `link`
- **size**: `default`, `sm`, `lg`, `icon`
- **관례**:  
  - 메인 액션: `variant="default"`  
  - 취소/보조: `variant="outline"`  
  - 테이블 행 액션·아이콘만: `variant="ghost"` + `size="sm"` 또는 `size="icon"`  
  - 삭제: `variant="destructive"` 또는 `variant="outline"` + `className="... text-destructive"`

### 2.2 Card

- **구성**: `Card` > `CardHeader`(선택) > `CardContent` > `CardFooter`(선택)
- **CardHeader**: `CardTitle`, `CardDescription`, `CardAction`(우측 액션) 가능
- **스타일**: `rounded-xl border`, `bg-card`, `text-card-foreground`
- **용도**: 검색 폼 감싸기(`Card` > `CardContent className="p-4"`), 테이블 감싸기(`CardContent className="p-0"`)
- **데모·상세·목록 부가 블록**: 소제목(`CardTitle` 또는 `h4` + `font-medium`) 아래에 읽기 전용 필드·요약 데이터를 넣을 때는 **섹션마다 Card로 묶는 것을 기본**으로 한다. `JpaAuditInfoSection` 의 `variant="card"` (`rounded-lg border bg-muted/30 p-4`) 과 같은 틀을 맞추면 슬라이드·페이지 간 시각 일관성이 좋다. 자세한 규칙: `docs/knowledge/frontend/architecture/ui-composition-rules.md` 의 「소제목 + 데이터 블록」 절 참고.

### 2.3 Sheet (측면 패널)

- **구성**: `Sheet` > `SheetContent` > `SheetHeader` / `SheetTitle` / `SheetDescription` > 본문 > `SheetFooter`
- **SheetContent**: `side="right"`(기본) / `left` / `top` / `bottom`. 기본은 오른쪽 슬라이드, `w-3/4` / `sm:max-w-sm`
- **닫기**: 우측 상단 X 버튼 포함 (lucide-react `XIcon`)
- **용도**: 등록/상세/수정 폼 → `XxxRegisterSheet`, `XxxDetailSheet`, `XxxEditSheet`

### 2.4 Dialog (모달)

- **용도**: 확인 팝업, 작은 폼. Sheet 보다 짧은 단일 액션에 사용.
- **구성**: `Dialog` > `DialogContent` > `DialogHeader` / `DialogTitle` / `DialogDescription` / `DialogFooter`
- **오버레이**: `bg-black/50`, `z-50`

### 2.5 Form (react-hook-form 연동)

- **구성**: `Form`(FormProvider) > `form` > `FormField` > `FormItem` > `FormLabel` + `FormControl` + `FormMessage`
- **검증**: Zod + `@hookform/resolvers` (zodResolver). 스키마는 컴포넌트 상단 또는 별도 상수.
- **필수 표시**: `<FormLabel>이름 <span className="text-destructive">*</span></FormLabel>` 패턴

### 2.6 Table

- **구성**: `Table` > `TableHeader` > `TableRow` > `TableHead` 반복 / `TableBody` > `TableRow` > `TableCell` 반복
- **스타일**: `text-sm`, 헤더 `font-medium`, 행 `hover:bg-muted/50`, 셀 `p-2`, `whitespace-nowrap`
- **래퍼**: 테이블은 보통 `Card` > `CardContent className="p-0"` 안에 배치

### 2.7 Badge

- **variant**: `default`, `secondary`, `destructive`, `outline`
- **용도**: 상태 표시(활성/비활성 등). 필요 시 `className="bg-green-100 text-green-800"` 등으로 보조 색.

### 2.8 Input / Select / Textarea / Checkbox / Switch

- **공통**: `components/ui` 의 `Input`, `Select`, `Label`, `Form` 과 함께 사용.
- **에러**: `aria-invalid` + `ring-destructive` 스타일 적용 (FormField 연동 시 자동).

### 2.9 토스트 (알림)

- **라이브러리**: `sonner`. `import { toast } from 'sonner'`
- **사용**: `toast.success('메시지')`, `toast.error('메시지')`. mutation 성공/실패 시 훅에서 호출.
- **전역**: `App` 에 `<Toaster richColors closeButton position="top-right" />` 있음.

### 2.10 아이콘

- **라이브러리**: `lucide-react`. 예: `Search`, `RotateCcw`, `XIcon`, `AlertCircle` 등.
- **크기**: 버튼 내부 `size-4` (Tailwind), 또는 `className="size-4"`

---

## 3. 레이아웃·간격 관례

- **페이지 본문**: `space-y-6` 로 섹션 간격 (예: TablePageTemplate).
- **폼 그리드**: `grid`, `gap-4` 등으로 라벨-필드 정렬.
- **시트 내부**: `SheetHeader` / 본문 / `SheetFooter` 구분, 본문은 `flex flex-col gap-4` 또는 `space-y-4`.
- **반응형**: `sm:max-w-sm` 등 Tailwind 브레이크포인트 사용. 모바일 우선 작성.

---

## 4. 금지·자제 사항 (역추출 기준)

- **인라인 스타일**: `style={{}}` 보다 Tailwind + `cn()` 조합 유지.
- **색상**: `#hex` 직접 대신 `bg-primary`, `text-destructive`, `border-border` 등 시맨틱 사용.
- **새 UI 프리미티브**: 가능하면 `components/ui` 에 있는 것 조합. 없으면 ui 추가 후 재사용.
- **Sheet vs Dialog**: 폼이 길거나 여러 섹션이면 Sheet, 짧은 확인/한두 필드면 Dialog.

---

이 문서는 **실제 코드 사용 패턴**을 역추출한 것이므로, 바이브코딩 시 “UIConventions.md 따라줘”라고 하면 위 규칙을 기준으로 생성할 수 있습니다.
