---
title: device production
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 도메인 시트 — `production-device-production`

> **유형 A** 생산관리 · **골드 스탠다드** — 태스크 전부 참고용

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `production-device-production` |
| 메뉴명 | 디바이스 생산 정보 |
| Entity | `DeviceProduction` / `de_device_production` |
| Web | `/web/device-productions` |
| 필터 | FE-01a (`MenuFilterPanel` mode=production) |
| Chip | — |
| 오딧 | FE-06 표준 `JpaAuditInfoSection` |

## 태스크 진행

| ID | 문서 | 완료 |
|----|------|------|
| BE-01 | [BE-01](../BE-01-dto-specs.md) | [x] |
| BE-02 | [BE-02](../BE-02-facade-list.md) | [x] |
| BE-06 | [BE-06](../BE-06-display-map.md) | [x] |
| BE-03 | [BE-03](../BE-03-controller-list.md) | [x] |
| BE-04 | [BE-04](../BE-04-facade-write.md) | [x] |
| BE-05 | [BE-05](../BE-05-controller-write.md) | [x] |
| FE-01a | [FE-01a](../FE-01a-filter-portal.md) | [x] |
| FE-02 | [FE-02](../FE-02-api-list.md) | [x] |
| FE-03 | [FE-03](../FE-03-hooks-list.md) | [x] |
| FE-04 | [FE-04](../FE-04-page-list.md) | [x] |
| FE-09 | [FE-09](../FE-09-id-display-labels.md) | [x] | createdBy MAP |
| FE-05 | — | — |
| FE-06 | [FE-06](../FE-06-detail-audit.md) | [x] |
| FE-06b | [FE-06b](../FE-06b-audit-jpa.md) | [x] |
| FE-07 | [FE-07](../FE-07-form-crud.md) | [x] |
| FE-08 | [FE-08](../FE-08-mutations-download.md) | [x] |
| QA-after | [qa/README](../qa/README.md) · [QA-signoff](../qa/QA-signoff.md) | [x] | (구 QA-01) |

## 파일맵

```
be-v1/lib-model/.../device/dto/DeviceProductionReq.java
be-v1/lib-model/.../device/spec/DeviceProductionSpecs.java
be-v1/api-console/.../device/facade/DeviceProductionFacade.java
be-v1/api-console/.../device/controller/web/DeviceProductionWebController.java
fe-v1/src/api/deviceProductions.ts
fe-v1/src/hooks/useDeviceProductions.ts
fe-v1/src/components/pages/DeviceProductionManagePage.tsx
fe-v1/src/components/organisms/DeviceProductionDetailSheet.tsx
fe-v1/src/components/organisms/DeviceProductionFormSheet.tsx
```

## 신규 메뉴 시

**이 시트 구조 + 파일맵**을 복사하고 Entity명만 치환. 태스크는 [CRUD-IMPLEMENTATION-RUNBOOK.md](../CRUD-IMPLEMENTATION-RUNBOOK.md) §3-A 순서.
