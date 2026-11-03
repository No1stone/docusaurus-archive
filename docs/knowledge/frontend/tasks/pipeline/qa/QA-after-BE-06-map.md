---
title: QA after BE 06 map
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA-after-BE-06 — 표시명 MAP

> **선행:** [BE-06](../BE-06-display-map.md) · pageId: ________

- [ ] 목록 JSON `createdBy` UUID 아님 (loginId/이름)
- [ ] `farmName` (또는 도메인 표시 필드) populated
- [ ] `deviceId`만 있고 `eui` 없음 — **실패**

**판정:** ☐ 통과 · ☐ 실패
