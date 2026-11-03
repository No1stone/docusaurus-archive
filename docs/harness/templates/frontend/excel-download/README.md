---
title: Excel download
description: 목록 엑셀. 화면 연결 → Export 기능 → 계약 → Http
---

# Excel download

> **상태: 가이드.** applied 필터·pending·실패 처리가 기준입니다.
> 신규: **FE가 Export 기능으로 페이지를 순회한 뒤** `downloadAdvancedExcel`로 xlsx를 만듭니다.
> Page에서 `fetch*ForDownload` 직접 호출은 ExampleItem **이력**입니다.
> [application-structure](/docs/knowledge/frontend/architecture/application-structure) · [fe-v1-findings](/docs/knowledge/frontend/operations/fe-v1-findings)

## 슬롯

| 슬롯 | 요구 |
|------|------|
| open trigger | 목록 툴바 다운로드 버튼 |
| DownloadModal | 우측 Sheet. 필터 + 진행 + 저장 |
| DownloadSearchForm | 목록과 동등 필터 |
| Export 기능 | page 순회, size 기본 예 100, progress 콜백. 계약→Http |
| excel write | `downloadAdvancedExcel` |
| pending / error | 조회 중·실패 토스트. 중복 클릭 방지 |
| filter seed | 모달 오픈 시 목록 **applied** 필터 |

## 조립 스케치

```text
ManagePage
  useXxxManage / useXxxExport     # 화면 연결
    → ExportXxxList (개별 기능)
        → XxxRepository.listForExport…
            → HttpXxxRepository
    → downloadAdvancedExcel(rows, columns, filename, sheetName)
  DownloadModal (applied 시드, pending)
```

## ExampleItem 경로 (이력)

| 역할 | 경로 |
|------|------|
| Modal | `src/components/organisms/DownloadModal.tsx` |
| Excel util | `src/utils/excel.ts` |
| API 패턴 | `fetch*ForDownload` in `src/api/*.ts` |
| 페이지 연결 | `DeviceProductionManagePage` DownloadModal 블록 |

## 스모크

- [ ] applied 필터가 모달 initial에 반영
- [ ] size 초과 시 순회·progress
- [ ] 실패 토스트, pending 중 중복 클릭 방지
- [ ] 언마운트 시 늦은 결과 무시
