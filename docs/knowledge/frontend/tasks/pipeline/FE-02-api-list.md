---
title: FE 02 list port adapter
---

> **신규 채택: 경량 헥사.** 이 문서만으로 목록 **계약 + Http 구현**을 만든다.
> ExampleItem `api/{domain}.ts` fetchList는 **이력**. 구조 개요: [application-structure](/docs/knowledge/frontend/architecture/application-structure)

# FE-02 — 목록 계약(Repository) · Http Adapter

> **선행:** BE-03 (URL 확정) · **다음:** FE-03
> **이력 레퍼런스:** `api/deviceProductions.ts` (구조만 참고, 경로 복제 금지)

## 목표

목록 GET을 Application이 쓰는 **계약**과 **Http 구현**으로 둔다.
화면·훅·React Query는 이 태스크에서 하지 않는다.

## 이 태스크에서 할 것

경로 예 (`features/{domain}/` — 폴더명은 프로젝트에 맞게):

- [ ] `ports/{Domain}Repository.ts` (또는 Gateway 등) — `list(params)` 시그니처
- [ ] `adapters/http/Http{Domain}Repository.ts` — `list` 구현
  - endpoint 등록(공유 constants 또는 feature 설정)
  - 인증 fetch·성공 판정(프로젝트 `SUCCESS_CODES` 등 · **교체 가능**)
  - 응답 → row 매핑 (예: camelCase → 화면 row)
  - `status=all`이면 쿼리 포함 여부(BE 계약에 따름)
- [ ] `app/composition`에서 계약 ← Http 구현 연결(또는 동등 DI)
- [ ] (선택) `adapters/demo/Demo{Domain}Repository.ts` 스텁 — 같은 계약

params 예: `{ keyword?, status, page, size, … }` — 필드명은 API 계약으로 교체.

## 하지 말 것

- 화면 연결 훅·캐시 키 (→ FE-03)
- create/update/deactivate/export (→ FE-08)
- Page에서 Http 모듈 직접 호출
- ExampleItem처럼 `api/*.ts`만 두고 계약 없이 진행하는 것을 **신규 표준**으로 삼기

## 이력 (ExampleItem)

`src/api/{domainPlural}.ts`의 `fetch{Domain}List` — 관찰용. 신규는 Port + Adapter.

## 검수

- [ ] Network 탭 URL·쿼리가 BE-03과 일치
- [ ] Application(아직 없어도)이 구현체가 아니라 **계약 타입**만 보도록 연결됨
