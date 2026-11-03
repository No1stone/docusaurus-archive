---
title: Excel download
description: CMS 목록 엑셀 다운로드 원셋. FE에서 페이징 조회 후 파일 생성
---

# Excel download

> **개요:** CMS 업무 백오피스에서 목록을 엑셀로보낼 때 쓰는 FE 원셋입니다.
> 서버가 파일을 직접 주는 방식이 아니라, **FE가 `fetch*ForDownload`로 페이지를 순회한 뒤 `downloadAdvancedExcel`로 xlsx를 만듭니다.**
> ExampleItem 경로 예: `nutech/fe-v1`.

CMS CRUD와 같이 쓰는 경우가 많습니다. 단독 리포트 export에도 동일 슬롯을 씁니다.

## 슬롯

| 슬롯 | 요구 |
|------|------|
| open trigger | 목록 툴바 다운로드 버튼 |
| DownloadModal | 우측 Sheet. 필터 + 진행 상태 + 저장 |
| DownloadSearchForm | 목록과 같은 keyword/status(또는 동등 필터) |
| fetchForDownload | page 0..n, **size=100**, progress 콜백 |
| excel write | `downloadAdvancedExcel` (컬럼 정의, filename, sheetName) |
| pending / error | 조회 중·실패 토스트. 저장 중 중복 클릭 방지 |
| filter seed | 모달 오픈 시 목록 **applied** 필터를 initial로 |

## 조립 스케치

```text
ManagePage
  appliedFilters
  openDownload -> DownloadModal
    initialFilters = appliedFilters
    load: fetch*ForDownload(filters, onProgress)  # 100건씩
    save: downloadAdvancedExcel(rows, columns, filename, sheetName)
```

JSON 통짜 컬럼은 엑셀에서 기본 제외합니다. 필요하면 별도 컬럼 설계합니다.

## ExampleItem 경로

| 역할 | 경로 |
|------|------|
| Modal | `src/components/organisms/DownloadModal.tsx` |
| Excel util | `src/utils/excel.ts` (`downloadAdvancedExcel`) |
| API 패턴 | `fetch*ForDownload` (예: deviceProductions, sigungus) |
| 페이지 연결 | `DeviceProductionManagePage` DownloadModal 블록 |
| Knowledge | [T06](/docs/knowledge/frontend/tasks/fragments/T06-crud-mutations-download), [FE-08](/docs/knowledge/frontend/tasks/pipeline/FE-08-mutations-download), [console-management-crud-set §6](/docs/knowledge/frontend/integration/console-management-crud-set) |

## 스모크

- [ ] 목록 필터가 다운로드 모달 initial에 반영됨
- [ ] 100건 초과 시 페이지 순회(progress 표시)
- [ ] xlsx 저장 후 토스트
- [ ] 실패 시 사용자 메시지, pending 해제
- [ ] 다크 모드에서 Sheet 대비

## 관련 원셋

- [cms-crud](/docs/harness/templates/frontend/cms-crud/) — sheets에 DownloadModal 포함
- [report-readonly](/docs/harness/templates/frontend/report-readonly/) — 읽기 목록 export 시 동일 패턴
