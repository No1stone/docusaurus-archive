---
title: QA after FE 08 crud
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA-after-FE-08 — CUD·비활성·다운로드

> **선행:** [FE-08](../FE-08-mutations-download.md) (경량 헥사: 기능 → 계약 → Http)

- [ ] 등록·수정 토스트 + 목록 invalidate
- [ ] 비활성 라벨(프로젝트 문구), 선택 0건 시 버튼 비활성
- [ ] Page·훅에서 Http/`api` 직접 호출 없음 (개별 기능·Repository 경로)
- [ ] (다운로드 있을 때) Export 기능으로 페이징 순회 · applied 시드 · size는 계약(기본 예 100)

**판정:** ☐ 통과 · ☐ 실패
