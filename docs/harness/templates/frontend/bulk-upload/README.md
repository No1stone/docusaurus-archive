---
title: Bulk upload
description: 파일 대량 업로드와 확인 패널입니다.
---

# Bulk upload

> **개요:** 파일 대량 업로드와 확인 패널입니다.
> ExampleItem 저장소: `nutech/fe-v1`.

## 슬롯

| 슬롯 | 요구 |
|------|------|
| file input | 템플릿 다운로드 선택 |
| preview/confirm | 건수 확인 |
| pending | 업로드 중 중복 방지 |
| error/warn | 행 단위 경고 표시 |

## fe-v1 경로

| 역할 | 경로 |
|------|------|
| 공급 bulk | `src/components/molecules/supply/SupplyBulkUploadPanel.tsx` |
| 센서 bulk | `src/components/molecules/livestock/LivestockSensorRegisterBulkPanel.tsx` |

## 스모크

- [ ] 확인 전 서버 반영 없음
- [ ] 업로드 pending
- [ ] 다크에서 경고 박스 대비

