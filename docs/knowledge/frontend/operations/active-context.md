---
title: active context
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 📍 Active Session Context: Farm Livestock 포털

이 문서는 현재 FE 작업 컨텍스트를 복구하기 위한 스냅샷입니다.  
다음 세션 시작 시 이 파일과 [session-handoff-2026-06-farm-livestock.md](./session-handoff-2026-06-farm-livestock.md)를 먼저 읽고 시작합니다.

## 1. 현재 완료된 작업 (Accomplished)

- **가축 분석 탭 BFF 연동**: 체온·활동량·날씨 hourly, 7일 rolling 평균
- **농장 timezone**: 헤더 workspace 저장 + 오딧 필드만 FE 변환
- **생애주기·성별**: `LX000UNKWN` 미등록 표시, 모달 pre-fill
- **하네스 문서 1차**: integration 2건 + session handoff + BE BFF 문서

## 2. 핵심 문서

| 문서 | 용도 |
|------|------|
| [CRUD-IMPLEMENTATION-RUNBOOK.md](../tasks/pipeline/CRUD-IMPLEMENTATION-RUNBOOK.md) | **CRUD 구현 절차** |
| [tasks/pipeline/README.md](../tasks/pipeline/README.md) | 태스크 목록 |
| [console-crud-page-index.md](../integration/console-crud-page-index.md) | 갭 메모 |

## 3. 남은 과제 (Next Steps)

- 로컬 farm220 테스트 데이터 import 및 `device_id` 연결
- 폼 입력 → UTC API 전송 유틸 (미구현)
- `RouteTemplate` page key 맵 표준화 (기존 backlog)

## 4. 하네스 엔지니어링 메모

- 통계 `stat_local_hour` / 분석 차트에 FE 타임존 변환 **금지**
- JPA 오딧만 `formatFarmAuditDt` + `farmWorkspace.timezone`
- BE 분석 스펙 변경 시 `be-v1/.../farm-livestock-analysis-bff.md` 동시 갱신
