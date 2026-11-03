---
title: CRUD IMPLEMENTATION RUNBOOK
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# CRUD 구현 런북 (테이블 → 메뉴 → 태스크 → 검수)

> **상태:** `active`
> **목표:** 태스크 1개 구현 → **짝 QA 1개** → (마지막) Signoff. 통합 QA 없음.

---

## 1. 전체 흐름

```
① 킥오프 (domains/{pageId}.md)
② BE-01 → BE-02 → BE-06 → [QA] → BE-03 → [QA] → … → BE-05 → [QA]
③ FE-01 → [QA] → FE-04 → [QA] → FE-09 → [QA] → … → FE-10 → [QA]
③a FE 세션 마감 / Signoff 직전 → [QA-fe-import-check](./qa/QA-fe-import-check.md) **필수**
④ QA-signoff (체크만)
```

**검수:** [qa/README.md](./qa/README.md) — 구현 태스크마다 `QA-after-*` **1개 세션**.
**세션·모델:** [SESSION-DISPATCH.md](./SESSION-DISPATCH.md)

---

## 2. 킥오프 (신규 테이블·메뉴)

`domains/_kickoff-template.md` 복사 → `domains/{pageId}.md`

| 항목 | 적을 내용 |
|------|-----------|
| 테이블 / Entity | 예: `de_device_production` |
| pageId | `production-device-production` |
| Web URL | `/web/device-productions` |
| 필터 유형 | FE-01a 포털 / FE-01b 단순 |
| Chip 필요 | Y/N → FE-05 |
| 공통코드 typeId | 필터·Chip·폼에 쓰는 `common_code_type_id` 목록 (최소 집합) → [common-code-fe-harness](../../integration/common-code-fe-harness.md) |
| CUD | full / read-only |
| 조회 특화·하위 연관 | **별도** — 갭 표에만 (파이프라인 스킵 가능) |
| 오딧 TZ | 일반 / 농장 포털 |
| 복제 원본 | DeviceProduction / Livestock / Admin … |

킥오프 시 **실행할 태스크 번호만** 체크리스트로 고정 (아래 §3 참고).

---

## 3. 태스크 선택표 (메뉴 유형별)

### A. 생산관리형 — full CRUD (골드)

**예:** 디바이스 생산 정보
**도메인 시트:** [domains/device-production.md](./domains/device-production.md)

| 태스크 | 실행 |
|--------|------|
| BE-01 ~ BE-05 | ○ |
| FE-01a 또는 b | FE-01a (production 레지스트리) |
| FE-02 ~ FE-04 | ○ |
| FE-05 | — (공통코드 Chip 없음) |
| FE-06 ~ FE-08 | ○ |
| QA-after (항목별) | ○ — [qa/README](./qa/README.md) |

### B. 포털 + 공통코드 Chip

**예:** 가축(개체) 정보
**도메인 시트:** [domains/livestock-info.md](./domains/livestock-info.md)

| 태스크 | 실행 |
|--------|------|
| BE-01 ~ BE-03 | ○ |
| BE-04 ~ BE-05 | △ (Web CUD 미완 — 킥오프 후 결정) |
| FE-01a | ○ |
| FE-02 ~ FE-05 | ○ |
| FE-06 | ○ (+ farm TZ 오딧) |
| FE-07 ~ FE-08 | △ |
| QA-after (항목별) | ○ — [qa/README](./qa/README.md) |

### C. 사용자관리형 — full CRUD (커스텀 Table)

**예:** 관리자 유저
**도메인 시트:** [domains/admin-user-manage.md](./domains/admin-user-manage.md)

| 태스크 | 실행 |
|--------|------|
| BE-01 ~ BE-05 | ○ |
| FE-01a | ○ |
| FE-02 ~ FE-04 | ○ (AdminTable 변형) |
| FE-05 | — |
| FE-06 ~ FE-08 | ○ |
| QA-after (항목별) | ○ — [qa/README](./qa/README.md) |

### D. 조회 전용

**예:** 날씨 조회

| 태스크 | 실행 |
|--------|------|
| BE-01 ~ BE-03 | ○ |
| FE-01a | ○ |
| FE-02 ~ FE-04, FE-06 | ○ |
| FE-05, FE-07, FE-08 | — |
| QA-after (항목별) | ○ — [qa/README](./qa/README.md) |

---

## 4. 태스크별 세부 문서 (구현 시 열 파일)

| ID | 문서 | 구현 범위 |
|----|------|-----------|
| [BE-01](./BE-01-dto-specs.md) | DTO inner + `Item`/`WebListItem` 연관 |
| [BE-02](./BE-02-facade-list.md) | `searchForWeb` — 자기 Service만; 타 도메인 Facade (규칙 (`be-v1/docs/knowledge/frontend/development/console-bff-facade-dependency-rule.md`)) |
| [BE-06](./BE-06-display-map.md) | **id→표시명 MAP** (User/Farm/Sensor…) |
| [BE-03](./BE-03-controller-list.md) | `GET` |
| [BE-04](./BE-04-facade-write.md) | create/update/deactivate Facade |
| [BE-05](./BE-05-controller-write.md) | POST/PUT/DELETE |
| [FE-01a](./FE-01a-filter-portal.md) | 포털 필터 |
| [FE-01b](./FE-01b-filter-simple.md) | 단순 필터 |
| [FE-02](./FE-02-api-list.md) | 목록 Repository + Http Adapter |
| [FE-03](./FE-03-hooks-list.md) | `List…` 개별 기능 + 화면 연결 훅 |
| [FE-04](./FE-04-page-list.md) | Layout·Table·Badge |
| [FE-09](./FE-09-id-display-labels.md) | 목록·상세 **id 숨김·이름 표시** |
| [FE-05](./FE-05-list-chip.md) | 목록 Chip (공통코드) |
| [FE-06](./FE-06-detail-audit.md) | Card 상세 본문 |
| [FE-06b](./FE-06b-audit-jpa.md) | **JpaAuditInfoSection** + TZ |
| [FE-07](./FE-07-form-crud.md) | FormSheet |
| [FE-08](./FE-08-mutations-download.md) | Create/Update/Deactivate/Export 기능·훅·(선택) Flow |
| [FE-10](./FE-10-i18n.md) | **i18n** ko/en |
| [qa/README.md](./qa/README.md) | **항목별 QA** (`QA-after-*`) |
| [qa/QA-signoff.md](./qa/QA-signoff.md) | 마감 체크 (선택) |

---

## 5. 세션 프롬프트 (표준)

### 태스크 1개 실행

```
테이블/메뉴: {pageId}
태스크: {BE-03} 만 실행.

1. docs/knowledge/frontend/tasks/pipeline/BE-03-controller-list.md 만 읽기
2. domains/{pageId}.md 의 파일맵·Entity명 참고
3. 문서 체크리스트 구현 + 문서 하단 검수
4. domains 시트에 해당 태스크 [x] 표시
다른 태스크·메뉴 수정 금지.
```

### 메뉴 CRUD 전체 (여러 세션)

```
domains/{pageId}.md 킥오프 시트 기준.
아직 [ ] 인 태스크 중 맨 위 1개만 실행 (위 프롬프트).
```

---

## 6. 예시 메뉴 (이미 구현·참고용)

| 유형 | pageId | 도메인 시트 |
|------|--------|-------------|
| 생산관리 골드 | `production-device-production` | [device-production.md](./domains/device-production.md) |
| 가축 포털 | `livestock-livestock-info` | [livestock-info.md](./domains/livestock-info.md) |
| 사용자관리 | `admin-admin-user-manage` | [admin-user-manage.md](./domains/admin-user-manage.md) |

신규 테이블은 위 셋 중 **가장 가까운 유형**을 복제 원본으로 고른다.

---

## 7. 완료 정의 (DoD)

- [ ] `domains/{pageId}.md` — 계획한 Impl + **QA-after-* 전부** [x]
- [ ] [QA-fe-import-check](./qa/QA-fe-import-check.md) — FE 변경 시 **import·build**
- [ ] [QA-signoff](./qa/QA-signoff.md) (선택)
- [ ] 갭은 시트 + [console-crud-page-index.md](../../integration/console-crud-page-index.md) 한 줄 (선택)

---

## 8. 상위 문서 (막혔을 때만)

- [console-crud-base-set.md](../../integration/console-crud-base-set.md)
- BE 마스터: `be-v1/docs/knowledge/frontend/development/console-web-bff-management-crud-set.md`
- FE 마스터: `docs/knowledge/frontend/integration/console-management-crud-set.md`
