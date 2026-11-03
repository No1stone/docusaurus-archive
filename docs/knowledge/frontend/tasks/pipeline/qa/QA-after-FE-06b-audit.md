---
title: QA after FE 06b audit
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA-after-FE-06b — JPA 오딧

> **선행:** [FE-06b](../FE-06b-audit-jpa.md)

- [ ] 상세 `JpaAuditInfoSection` `variant="card"`
- [ ] `pickJpaAuditFields` import 정상 (런타임 에러 없음)
- [ ] (포털 농장) `auditTimeZone` / 목록 `formatFarmAuditDt` 적용
- [ ] (일반) TZ prop 없을 때 브라우저 로컬 일시

**판정:** ☐ 통과 · ☐ 실패
