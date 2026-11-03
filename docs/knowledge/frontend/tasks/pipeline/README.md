---
title: README
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# CRUD 마이크로 태스크 파이프라인

> **상태:** `active`
> **구현 런북:** [CRUD-IMPLEMENTATION-RUNBOOK.md](./CRUD-IMPLEMENTATION-RUNBOOK.md) ← **CRUD 나갈 때 여기서 시작**
> **범위:** 메뉴 공통 **필터·리스트·조회·수정·삭제** 만. 도메인 특화(납품·초대메일·가축 탭 등)는 **본 파이프라인에 없음** → [기본셋 §0](../../integration/console-crud-base-set.md#0-포함--제외-한눈에)
> **원칙:** 세션 1회 = **태스크 문서 1개** + (선택) `domains/{pageId}.md` 진행 체크
> **디스패치·모델 티어:** [SESSION-DISPATCH.md](./SESSION-DISPATCH.md) — 목적 보고 태스크 1개만 넘기면 작은 모델도 가능

---

## 빠른 시작

**넓은 요청** («○○ 구현») → 먼저 [SESSION-DISPATCH §0 오케스트레이터](./SESSION-DISPATCH.md#0-오케스트레이터-한-줄-요청--분해만--구현-금지) (분해·모델만) → **새 세션**에서 Impl/QA 1개 실행.

1. [런북](./CRUD-IMPLEMENTATION-RUNBOOK.md) §2 킥오프 → `domains/_kickoff-template.md` 복사
2. 유형 A/B/C/D 선택 → 실행할 태스크 번호 확정
3. 세션마다 **Impl 1개** 또는 **QA-after 1개** (짝)
4. `domains/{pageId}.md` Impl·QA `[x]` · 마지막 [QA-signoff](./qa/QA-signoff.md)

## 예시 도메인 시트 (이미 구현·참고)

| pageId | 시트 |
|--------|------|
| `production-device-production` | [device-production.md](./domains/device-production.md) |
| `livestock-livestock-info` | [livestock-info.md](./domains/livestock-info.md) |
| `admin-admin-user-manage` | [admin-user-manage.md](./domains/admin-user-manage.md) |

---

## 태스크 목록

### BE

| # | 문서 |
|---|------|
| BE-01 | [BE-01-dto-specs.md](./BE-01-dto-specs.md) |
| BE-02 | [BE-02-facade-list.md](./BE-02-facade-list.md) |
| BE-06 | [BE-06-display-map.md](./BE-06-display-map.md) |
| BE-03 | [BE-03-controller-list.md](./BE-03-controller-list.md) |
| BE-04 | [BE-04-facade-write.md](./BE-04-facade-write.md) |
| BE-05 | [BE-05-controller-write.md](./BE-05-controller-write.md) |

### FE

| # | 문서 |
|---|------|
| FE-01a/b | [FE-01a](./FE-01a-filter-portal.md) · [FE-01b](./FE-01b-filter-simple.md) |
| FE-02 | [FE-02](./FE-02-api-list.md) — 목록 Repository + Http |
| FE-03 | [FE-03](./FE-03-hooks-list.md) — List 기능 + 화면 연결 훅 |
| FE-08 | [FE-08](./FE-08-mutations-download.md) — CUD·Export 기능·훅 |
| FE-10 | [FE-10-i18n.md](./FE-10-i18n.md) |

### QA (구현 직후 1:1)

| 문서 |
|------|
| [qa/README.md](./qa/README.md) |

---

## UI·기능 분산 (레퍼런스)

| 요소 | 참고 | 태스크 |
|------|------|--------|
| id→표시명 MAP | FarmLivestock Facade | BE-06, FE-09 |
| JPA 오딧 + TZ | DeviceProduction / Livestock | FE-06b |
| Card 상세 | DeviceProduction | FE-06 |
| Chip | Livestock | FE-05 + QA-FE-05 |
| i18n | deviceProduction ns | FE-10 + QA-FE-10 |

태스크 문서에 규칙이 들어 있음 — 한 페이지에 전부 있을 필요 없음.
