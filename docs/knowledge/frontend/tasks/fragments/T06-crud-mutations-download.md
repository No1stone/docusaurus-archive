---
title: T06 crud mutations download
---

> **신규 채택: 경량 헥사.** fragment 한 장으로 mutation·다운로드 경계를 맞춘다.
> ExampleItem `api`+`hooks` 직결·Page `fetch*ForDownload`는 **이력**.
> 파이프라인 상세: [FE-08](../pipeline/FE-08-mutations-download.md) · [application-structure](/docs/knowledge/frontend/architecture/application-structure)

# T06 — CRUD mutation · 다운로드

> 조각 ID: `T06` · BE write API 완비 시

## 개별 기능 (application)

```text
Create{Domain} / Update{Domain} / Deactivate{Domain}
(export 시) Export{Domain}List
→ {Domain}Repository 만 사용 (Http 직접 호출 금지, React 훅 금지)
```

조합이 필요하면 Flow. 단일이면 화면 연결이 기능을 직접 호출.

## 계약 · Http (ports / adapters)

- `create` · `update` · `deactivate…` · (export) 페이징 list
- 성공 code·비활성 경로·export page size → **프로젝트 교체** (ExampleItem 기본 예 size=100)

## 화면 연결 (presentation/hooks)

- mutation 성공 → list/detail invalidate
- pending·토스트는 훅·UI
- DownloadModal: applied 시드, `Export…` 호출, `downloadAdvancedExcel`

## FormSheet (FE-07과 맞춤)

- 등록/수정 필드·status 표시는 **API 계약**. ExampleItem 예: 등록 status A 고정, 수정 status 선택 + 감사 섹션

## 검수

- [ ] 등록·수정·비활성 토스트 + 목록 갱신
- [ ] 비활성 후 선택 해제 · 0건 시 버튼 비활성
- [ ] (export) size 초과 시 순회 · Page에서 fetch 직접 없음

## 갭 시

BE에 create/update/deactivate가 없으면 **태스크 중단** → 인덱스에 `설계요청` 후 BE write 먼저

## 이력

`useDeviceProductions` + `api/{domain}.ts` + Page download 블록 — 관찰용.
