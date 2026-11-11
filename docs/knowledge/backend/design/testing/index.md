---
id: knowledge-backend-testing
title: Testing
description: "예약 API 테스트를 단위·슬라이스·통합으로 나눌 때 어느 글을 보면 되는지 안내합니다."
slug: "/knowledge/backend/testing/index"
---
# Testing

예약 Facade 정책은 Port 대역만으로 확인하고, HTTP 바인딩은 Controller 슬라이스에서, 저장 결과는 Adapter를 포함한 테스트에서 확인하는 편이 읽기 쉽습니다.<br />
이 목록은 테스트 경계를 정하는 글을 안내합니다.

| 지금 겪는 문제 | 읽을 글 |
|---|---|
| 단위·슬라이스·통합·시나리오 폴더를 나누고 싶음 | [테스트 기본 구조](/docs/knowledge/backend/testing/test-structure) |

통과 기준 절차는 [acceptance](/docs/harness/workflows/acceptance)를 봅니다.<br />
템플릿: `docs/harness/templates/backend/spring/testing/`
