---
title: build env matrix
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# Build / Env Matrix

## Toolchain

- Build: Vite (`vite.config.ts`)
- UI Runtime: React 18
- Language: TypeScript (`tsconfig.json`, path alias `@/*`)

## 배포 프로필 (`VITE_DEPLOY_PROFILE`)

| 프로필 | 의미 | 기본 API 베이스 ( `VITE_API_BASE_URL` 미지정 시 ) |
|--------|------|---------------------------------------------------|
| `local` | 로컬 PC · 로컬/도커 API | `http://localhost:3031/console` (백엔드 컨텍스트 `/console` 과 동일) |
| `dev` | 팀 공용 개발(스테이징) 게이트웨이 | `VITE_DEV_API_BASE_URL` — 비어 있으면 local 과 동일 폴백 |
| `prod` | 운영 | `https://api.farmpro.me/console` |

- 로컬에서 컨텍스트 없이 게이트만 띄운 경우: `.env.development.local` 등에 `VITE_LOCAL_API_BASE_URL=http://localhost:3031` 또는 `VITE_API_BASE_URL=...` 로 덮어쓴다.

- **덮어쓰기:** `VITE_API_BASE_URL` 이 있으면 프로필보다 **항상 우선**한다.
- **런타임/번들:** `vite.config.ts` 의 `define.__DEPLOY_PROFILE__` · `__API_BASE_URL__` 로 고정된다.

### 로컬에서 쓰는 스크립트

- `npm run dev` — 기본 로컬 프로필 (`.env.development` → `VITE_DEPLOY_PROFILE=local`)
- `npm run dev:dev` — 개발 프로필 (`.env.development.dev` → 공용 dev API에 붙일 때)
- `npm run dev:console` / `dev:partner` / `dev:member` — 포털만 바꿈; 프로필은 위와 동일하게 `.env.development*` 에서 상속

### 운영 빌드

- `npm run build` / `build:prod` — `.env.production` 의 `VITE_DEPLOY_PROFILE=prod` + 운영 API
- 개발 서버에 올리는 아티팩트만 API를 바꾸려면: CI에서 `VITE_DEPLOY_PROFILE=dev` 와 `VITE_DEV_API_BASE_URL`(또는 `VITE_API_BASE_URL`) 을 주입한 뒤 `vite build --mode production` 실행

## 스크립트

- `npm run dev` -> development 모드, Vite 서버(3000), 프로필 **local**
- `npm run dev:dev` -> development.dev 모드, 프로필 **dev**
- `npm run dev:console` / `dev:partner` / `dev:member` -> 포털별 모드(`VITE_PORTAL`, `.env.development.<portal>`)
- `npm run build` / `npm run build:prod` -> production build (`dist/`), 프로필 **prod**
- `npm run build:console` / `build:partner` / `build:member` -> 포털별 production 빌드 (`dist-admin/` 등)
- `npm run preview` -> build 결과 로컬 프리뷰

## 환경 매트릭스

- **운영 API 호스트:** `https://api.farmpro.me` — 백엔드 서블릿 컨텍스트 **`/console`** → 클라이언트 베이스 URL은 **`https://api.farmpro.me/console`** (슬래시 중복 없이 path 조합).
- **파일(Static) 베이스:** 기본은 API 베이스와 동일 (`vite.config.ts`에서 `VITE_STATIC_GW_BASE_URL` 미지정 시 `apiBaseUrl` 사용). 별도 CDN이 생기면 `VITE_STATIC_GW_BASE_URL`만 분리.
- 포털(빌드 타임): `VITE_PORTAL` = `admin` | `tenant` | `member` — `.env.<mode>` 파일 및 `src/constants/portal.ts`의 `portalId`
  - **admin(console)** = 전체 메뉴 기준 포털; tenant/member 는 여기에 맞춘 서브셋으로 본다 (`architecture/navigation-contract.md`).

관련 정의:

- `vite.config.ts`의 `define.__API_BASE_URL__`, `__ENVIRONMENT__`, `__DEPLOY_PROFILE__`, `__STATIC_GW_BASE_URL__`, `loadEnv` 기반 `outDir`
- `src/constants/api.ts`
- `src/constants/portal.ts`

## 운영 규칙

1. API base URL 변경은 `vite.config.ts`와 `src/constants/api.ts`를 세트로 검토
2. 신규 환경(staging 등) 추가 시 매트릭스 표와 배포 체크리스트 동시 갱신
3. 프로필·포털 조합이 헷갈리면 CI에서는 **스크립트 이름**(예: `build:console`)만 호출하고, URL은 시크릿/변수로 주입한다.
