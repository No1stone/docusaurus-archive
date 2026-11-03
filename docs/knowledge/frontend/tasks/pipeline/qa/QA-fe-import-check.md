---
title: QA fe import check
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA — FE import·빌드 검수 (마지막 필수)

> **시점:** FE 태스크 직후 **또는** 메뉴 [QA-signoff](./QA-signoff.md) 직전 — **반드시 1회**  
> **배경:** `ReferenceError` (심볼 미정의) 다수가 **import 누락** — 런타임·빌드 전까지 안 잡히는 경우 많음.

## 체크리스트

### 1. 변경 파일 import

이번 세션에서 수정·추가한 `fe-v1/src/**/*.{ts,tsx}` 각각:

- [ ] JSX/훅/유틸/타입 — 파일 상단 `import`에 **사용 심볼 전부** 있는지
- [ ] 경로 alias `@/` vs 상대경로 — 프로젝트 관례와 일치
- [ ] **default vs named** — `{ Foo }` / `Foo` 혼동 없음
- [ ] 같은 파일에서 **이전에 쓰던 import** 삭제·이동 후 참조 깨짐 없음

### 2. 자주 빠지는 항목 (이 메뉴 해당 시)

| 심볼 | typical path |
|------|----------------|
| `pickJpaAuditFields` | `types/jpaAudit` |
| `JpaAuditInfoSection` | `components/...` |
| `formatFarmDt` / `formatFarmAuditDt` | `utils/farmLivestockDisplay` 등 |
| `useTranslation` + namespace | `react-i18next` + `i18n` 키 파일 |
| React Query hooks | `hooks/use*` |
| shadcn/ui | `components/ui/*` |

### 3. 빌드 (권장 — import 누락 조기 발견)

`fe-v1` 루트:

```bash
npm run build:console
```

관리 콘솔 외 사이트면 `build:partner` / `build:member` 등 [build-env-matrix](../../../operations/build-env-matrix.md) 참고.

- [ ] 빌드 **성공** (실패 시 unresolved import·TS 오류 먼저 수정)

### 4. 브라우저 스모크 (해당 화면)

- [ ] 해당 메뉴 진입 — 콘솔에 `ReferenceError` / `is not defined` 없음
- [ ] 상세·탭·Form 열기 — 동일

## 실패 시

1. 누락 `import` 추가 (과도한 re-export 추가는 하지 않음)
2. 1~3 재실행 후 해당 `QA-after-FE-*` / signoff 재판정

**판정:** ☐ 통과 · ☐ 실패
