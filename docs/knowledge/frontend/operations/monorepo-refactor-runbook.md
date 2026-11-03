---
title: Monorepo refactor runbook
description: console/partner/farm 독립 앱 분리 단계 런북. 아카이브 원본
---

# React 모노레포 리팩토링 런북

> **아카이브 원본:** 이 문서가 모노레포 분리 작업의 단일 소스입니다.
> FarmPro FE `docs/MONOREPO_REFACTOR_RUNBOOK.md`에서 승격했습니다.
> FE 가이드·계약은 [Frontend knowledge](/docs/knowledge/frontend/)를 봅니다. fe-v1 로컬 guidelines는 쓰지 않습니다.

세션을 나눠도 여기만 최신으로 두면 이어서 진행할 수 있습니다.

| 항목 | 값 |
|------|-----|
| **최종 업데이트** | (작업할 때마다 날짜 갱신) |
| **현재 페이즈** | 0 — 준비 / 분석 |

---

## 1. 목표 (고정)

- 하나의 저장소에서 **3개의 독립 React 앱**: `console` (슈퍼어드민), `partner` (파트너 관리자), `farm` (일반 사용자).
- 각 앱은 **독립적으로** `dev` / `build` / 배포 가능.
- **기존 동작 유지**를 최우선으로, 한 번에 갈아엎지 않는다.

---

## 2. 목표 디렉터리 구조

```
apps/
  console/
  admin/
  farm/
packages/
  ui/
  api/
  auth/
  utils/
```

(실제 루트가 `fe-v1/` 아래가 될지, 저장소 루트가 될지는 **페이즈 1에서 결정**하고 아래 “결정 로그”에 기록한다.)

---

## 3. 출발점 요약 (현재 `fe-v1` — 분석 스냅샷)

- Vite + React + TypeScript, `strict: true`.
- `@tanstack/react-query` 사용.
- HTTP는 **axios가 아니라 fetch 기반** `ApiClient` + `authTokenManager`.
- **react-router-dom 없음** — `App.tsx`에서 페이지 state로 전환.
- 빌드 출력: 단일 `dist/`.

이 스냅샷은 리팩터 후에도 “무엇을 옮겼는지” 확인용으로 유지한다.

---

## 4. 공통 코드 분리 기준

| 영역 | 패키지 | 비고 |
|------|--------|------|
| UI 컴포넌트 | `packages/ui` | 기존 `components/ui` 등 |
| axios, react-query 클라이언트 | `packages/api` | 현재는 fetch; **axios 도입 여부는 결정 로그에 명시** |
| JWT, 로그인, 권한 | `packages/auth` | `authTokenManager`, `jwt` 등 |
| 유틸 | `packages/utils` | 공용 함수만 |

**Path alias (각 앱 + 공통 TS 설정):** `@ui`, `@api`, `@auth`, `@utils`.

---

## 5. 앱별 규약

- 각 앱: `main.tsx`, `App.tsx`, `routes/`, `pages/`, `layout/`.
- **역할:** console → super admin, partner(tenant) → partner admin, farm → member.
- 라우팅: `react-router-dom`, 앱별 독립 라우터 + **role 기반 route guard**.

---

## 6. Vite / 스크립트 / 산출물

- 앱마다 `vite.config.ts` 분리.
- **build outDir:** `dist/console`, `dist/partner`, `dist/farm` (루트 기준 상대 경로는 레이아웃에 맞게 조정).

**루트 `package.json` 스크립트 (필수):**

- `dev:console`, `dev:partner`, `dev:farm`
- `build:console`, `build:partner`, `build:farm`

**일상 개발:** 해당 앱만 `pnpm dev:<앱>` — 매 파일마다 production `build` 할 필요 없음.

---

## 7. 배포·Nginx (참고)

| 도메인 | 배포 경로 (서버 예시) |
|--------|------------------------|
| console.farmpro.me | `/home/ubuntu/fe/console` |
| partner.farmpro.me | `/home/ubuntu/fe/partner` |
| farm.farmpro.me | `/home/ubuntu/fe/farm` |

빌드 산출물: `dist/console`, `dist/partner`, `dist/farm`.  
SPA: `try_files $uri $uri/ /index.html` 대응.

---

## 8. 품질 바

- TypeScript **strict** 유지.
- ESLint + Prettier: 없으면 워크스페이스 루트에 통합 도입(결정 로그에 한 줄).

---

## 9. 단계별 체크리스트 (상태 갱신용)

완료 시 `[x]`로 바꾸고, **날짜**를 옆에 적는다.

### 페이즈 0 — 준비

- [ ] 이 런북과 [Frontend knowledge](/docs/knowledge/frontend/) (네비·API 계약 등) 충돌 여부 스캔
- [ ] `App.tsx` 기준 **화면/페이지 목록**과 “어느 앱으로 갈지” 1차 태깅 (표로 이 문서 하단에 추가해도 됨)

### 페이즈 1 — 워크스페이스 뼈대

- [ ] pnpm(or npm) **workspaces** 루트 `package.json` + `pnpm-workspace.yaml` (또는 npm 동등 설정)
- [ ] `apps/console`, `apps/admin`, `apps/farm` 최소 진입점 + 빈 페이지
- [ ] `packages/ui`, `api`, `auth`, `utils` 패키지 스캐폴드 + alias
- [ ] 루트 스크립트 `dev:*`, `build:*` 연결

### 페이즈 2 — 공통 패키지로 이동 (기능 동일)

- [ ] `packages/ui` — 공통 UI 1개 이상 이전·import 검증
- [ ] `packages/auth` — 토큰/JWT/로그인 흐름 이전
- [ ] `packages/api` — 클라이언트 + 에러 처리 + baseURL env (axios 도입 시 병행 기간 전략 기록)
- [ ] `packages/utils` — 공용 유틸만

### 페이즈 3 — 앱 분리 + 라우팅

- [ ] `react-router-dom` 앱별 도입
- [ ] role guard (console / admin / farm)
- [ ] 기존 state 기반 네비게이션 제거 또는 병행 구간 정의 후 제거

### 페이즈 4 — 레거시 `fe-v1` 정리

- [ ] 단일 `fe-v1` 앱 제거 또는 thin proxy 단계
- [ ] CI에서 `build:console` 등 필요한 타겟만 또는 전체

### 페이즈 5 — 배포 검증

- [ ] 로컬/스테이징에서 `dist/*` 구조와 Nginx 일치 확인

---

## 10. 결정 로그 (짧게만)

| 날짜 | 결정 | 이유 |
|------|------|------|
| | 모노레포 루트 위치 (`/` vs `fe-v1/`) | |
| | HTTP: axios 도입 vs fetch 유지 기간 | |
| | ESLint/Prettier 위치 | |

---

## 11. 이어하기용 한 줄 (채팅에 붙여 넣기)

다음 작업 시 아래를 복사해 채운다.

```
MONOREPO_REFACTOR_RUNBOOK: 페이즈 __ , 마지막으로 한 일: __ , 다음 할 일: __ , 열어둘 파일/경로: __
```

원본 문서는 아카이브
`docs/knowledge/frontend/operations/monorepo-refactor-runbook.md` 입니다.

---

## 12. 블로커 / 이슈 메모

- (여기에만 짧게: 빌드 실패, 백엔드 역할 클레임 미정 등)

## 관련

- [Frontend index](/docs/knowledge/frontend/)
- [build-env-matrix](./build-env-matrix)
- [navigation-contract](/docs/knowledge/frontend/architecture/navigation-contract)
- [folder-structure](/docs/knowledge/frontend/folder-structure)
