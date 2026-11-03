---
title: FE 08 mutations download
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# FE-08 — mutation · 비활성 · 다운로드

> **선행:** BE-05, FE-07 · **다음:** QA-01  
> **레퍼런스:** `useDeviceProductions.ts`, `DownloadModal`

## 이 태스크에서 할 것

- [ ] `useCreate` / `useUpdate` / `useDeactivate` — `onSuccess: invalidateQueries all`
- [ ] `ManagementTableShell` — `deleteLabel` 비활성, `deleteDisabled` 선택 0건 시 true
- [ ] (선택) `fetch*ForDownload` 100건/page + `DownloadModal`

## 검수

→ [QA-after-FE-08-crud](./qa/QA-after-FE-08-crud.md)
