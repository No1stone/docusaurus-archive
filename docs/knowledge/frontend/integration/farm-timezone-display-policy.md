---
title: farm timezone display policy
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# 농장 타임존 — FE 표시 정책

> **상태:** `active`  
> **관련 패턴:** [console-management-crud-set.md](./console-management-crud-set.md) §8 UI 규칙 (`JpaAuditInfoSection`), §13 포털 농장 스코프  
> **결정:** 2026-06 — BE는 브라우저 로케일·농장 작업 TZ를 알 수 없으므로 **표시 변환은 FE**, **저장은 UTC** 유지.

## 1. 원칙

| 구분 | 저장 (BE/DB) | 표시 (FE) |
|------|--------------|-----------|
| JPA 오딧 (`createdAt`, `updatedAt` 등) | UTC instant | **헤더 표시 TZ** |
| 통계·분석 (`st_*` hourly, `stat_local_hour`) | 배치에서 농장 TZ 반영 완료 | **변환 없음** — 응답값 그대로 |
| 비즈니스 이벤트 (건강·번식 `recordedAt` 등) | BE 정의대로 (UTC instant) | **헤더 표시 TZ** |
| 향후 수정 폼 입력 | API에는 **UTC** 로 전송 | 사용자 입력은 농장 로컬 |

## 2. 헤더 표시 TZ (사이트별)

| 사이트 | 헤더 UI | TZ 출처 |
|--------|---------|---------|
| **console** (개발) | `Select` — 변경 가능 | `localStorage` `farmpro.console.display-timezone`, 최초값 = **브라우저 IANA** |
| **partner** / **member** (운영) | 읽기 전용 라벨 | `farmWorkspace.timezone` (`fa_farm.timezone`, 농장 선택 시 동기화) |

콘솔에서 TZ를 바꾸면 `DisplayTimezoneProvider`를 통해 **이력·오딧·위치 `receivedAt` 등**이 한꺼번에 다시 렌더된다. 분석 차트·`stat_local_hour`는 제외.

### FE 구현

| 항목 | 파일 |
|------|------|
| Context | `src/contexts/DisplayTimezoneContext.tsx` |
| 콘솔 저장 | `src/utils/displayTimezoneStorage.ts` |
| 헤더 UI | `src/components/molecules/HeaderDisplayTimezone.tsx` |
| 포맷 훅 | `src/hooks/useFormatFarmDt.ts` |
| Provider 래핑 | `src/components/templates/AdminLayout.tsx` |

## 3. 농장 timezone 확보 (파트너·농장)

### API

`GET /web/member-farms/accessible-for-member` 응답 `MemberFarmRes.PortalAccessible.timezone` — `fa_farm.timezone`.

### FE 저장

헤더에서 농장 선택 시 `localStorage` (`farmpro.portal.farm-workspace`):

```ts
type FarmWorkspaceSelection = {
  portalMemberId: string;
  memberFarmId: number;
  farmId: number;
  timezone?: string; // IANA, 예: Asia/Seoul
};
```

연동 지점: `AdminHeader`, `PortalWorkspaceSelectPage`, `App.tsx` (`buildFarmWorkspaceSelection`).

### 읽기 헬퍼

| 함수 | 파일 |
|------|------|
| `useDisplayTimezone()` | `src/contexts/DisplayTimezoneContext.tsx` |
| `useFormatFarmDt()` | `src/hooks/useFormatFarmDt.ts` |
| `resolveFarmWorkspaceTimezone(user)` | `src/hooks/useFarmWorkspaceTimezone.ts` |
| `formatFarmAuditDt(iso, timeZone)` | `src/utils/farmLivestockDisplay.ts` |
| `formatFarmDt(iso, locale?, timeZone?)` | `src/utils/farmLivestockDisplay.ts` |

미선택·미저장 시 fallback: `FARM_DEFAULT_TIMEZONE` (`Asia/Seoul`).

## 4. 적용 범위

### 헤더 TZ 변환 **함**

- 가축 목록·상세 오딧 (`JpaAuditInfoSection`)
- 건강·번식·코드·프로필·감지·디바이스 이력 `recordedAt` / `eventAt`
- 위치 탭 `receivedAt`
- 콘솔 목록 `createdAt`

### 헤더 TZ 변환 **안 함**

- 분석 탭 차트·테이블 (`FarmLivestockAnalysisTab`)
- 위치 탭 `statLocalHour` (배치 로컬 시각 컬럼)

## 5. BE 역할 (의도적 비처리)

- 오딧 필드에 농장 TZ 변환 API **추가하지 않음**
- 통계 BFF는 `stat_local_hour` 등 **이미 농장 로컬 기준** 컬럼을 그대로 반환

## 6. 향후: 폼 → API (UTC)

1. 사용자가 농장 로컬 날짜·시각 입력
2. FE에서 `farmWorkspace.timezone` + 입력값 → UTC ISO
3. `PUT`/`POST` body에 UTC 전달

(아직 미구현)
