---
title: device production
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 태스크 카드 — `production-device-production`

## 메타

| 항목 | 값 |
|------|-----|
| pageId | `production-device-production` |
| 메뉴 | 디바이스 생산 정보 |
| FE | `DeviceProductionManagePage.tsx` |
| BE | `DeviceProductionWebController.java` |
| 패턴 | **full-crud** (골드 스탠다드) |

## 적용 Fragment

| 단계 | ID |
|------|-----|
| BE | **B01** ✓ |
| 필터 | **T01** (production, `MenuFilterPanel` mode=production) |
| 목록 | **T03** ✓ |
| Chip | — |
| 상세 | **T05-A** ✓ |
| CUD+X | **T06** ✓ (다운로드 포함) |
| 검수 | **T07** |

## 구현 상태

| L | C | U | D | X |
|---|---|---|---|---|
| ○ | ○ | ○ | ○ | ○ |

## 갭 · 개발자 액션

| # | 항목 | 액션 |
|---|------|------|
| — | 없음 | 신규 도메인은 **이 카드 구조 복제** |

## 파일 맵

```
fe-v1/src/api/deviceProductions.ts
fe-v1/src/hooks/useDeviceProductions.ts
fe-v1/src/components/pages/DeviceProductionManagePage.tsx
fe-v1/src/components/organisms/DeviceProduction{Detail,Form}Sheet.tsx
be-v1/.../device/controller/web/DeviceProductionWebController.java
```

## 검수 기록

- [ ] T07 — 목록·등록·수정·비활성·다운로드 E2E
