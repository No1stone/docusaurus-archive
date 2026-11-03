---
title: T03 list table shell
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# T03 — 목록 셸 (Layout + TableShell)

> 조각 ID: `T03`

## 구현 체크

- [ ] `ManagementPageLayout` — `filter` / `list` / `sheets` 슬롯
- [ ] `ManagementTableShell` — 페이징, 선택, 등록/비활성/다운로드 훅
- [ ] React Query `use*List` — `page`, `size`, applied 필터만 queryKey
- [ ] 행 클릭 → 상세 state (`setSelected` / `setDetailId`)
- [ ] `deleteLabel` = **비활성** (물리 삭제 아님)
- [ ] `deleteDisabled={mutation.isPending \|\| selectedIds.length === 0}`

## 목록 컬럼

- 필요 최소: id, 이름/식별, 상태, 등록일시, 등록자
- 상태: Badge — i18n 활성/비활성 (`A`/`D` 노출 금지)
- 수정일·버전은 상세로 (선택)

## 코드 근거

- `DeviceProductionManagePage.tsx` (골드)
- `ManagementTableShell.tsx`
- `console-management-crud-set.md` §5

## 검수

- [ ] 빈 목록 / 로딩 / 에러 토스트
- [ ] pageSize 변경 시 page=0
- [ ] 체크박스 전选/해제
