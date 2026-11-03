---
title: QA after FE 10 i18n
---

> **아카이브:** FarmPro FE(`nutech/fe-v1`) guidelines에서 승격했습니다.
> ExampleItem 코드 경로는 여전히 `nutech/fe-v1`을 가리킵니다.
> BE 문서는 이 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# QA-after-FE-10 — i18n

> **선행:** [FE-10](../FE-10-i18n.md)

- [ ] `ko.json` + `en.json` 동일 키 세트
- [ ] 목록·필터·버튼·토스트 하드코드 없음
- [ ] 언어 전환(en) 시 깨진 키(`deviceProduction.xxx`) 없음
- [ ] 상태 Badge·필터에 `A`/`D` 리터럴 없음

**판정:** ☐ 통과 · ☐ 실패
