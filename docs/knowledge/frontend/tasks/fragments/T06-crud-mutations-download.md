---
title: T06 crud mutations download
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# T06 — CRUD mutation · 다운로드

> 조각 ID: `T06` · BE B01 완비 시

## hooks

```ts
// 패턴: useDeviceProductions.ts
useCreate*()   // onSuccess: invalidateQueries all
useUpdate*()
useDeactivate*()
```

## API (`api/{domain}.ts`)

- `fetch*List`, `create*`, `update*`, `deactivateByIds`
- `fetch*ForDownload` — page 0..n, size=100
- `SUCCESS_CODES` 동일

## FormSheet

- 등록: `status: "A"` 고정, 감사 필드 숨김
- 수정: status 선택 + `JpaAuditInfoSection`

## DownloadModal

- `*DownloadSearchForm` + `downloadAdvancedExcel`
- open 시 목록 applied 필터를 initial 로

## 검수

- [ ] 등록·수정·비활성 토스트 + 목록 갱신
- [ ] 비활성 후 선택 해제
- [ ] 다운로드 100건 초과 시 페이지 순회

## 갭 시

BE에 `createForWeb` 등 없으면 **태스크 중단** → 인덱스에 `설계요청` 기록 후 B01 먼저
