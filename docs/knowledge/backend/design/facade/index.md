---
id: knowledge-backend-facade
title: Facade
description: "예약 정책과 화면 조립이 어디서 갈리는지, 트랜잭션·부분 실패를 어느 글에서 보면 되는지 안내합니다."
slug: "/knowledge/backend/facade/index"
---
# Facade

방문 예약을 등록하는 일과 등록 결과를 화면에 보여주는 일은 범위가 다릅니다.<br />
도메인 Facade는 예약 가능 여부와 저장을 맡고, BFF Facade는 공개 유즈케이스를 조합해 화면 응답을 만듭니다.

**하네스 필독이 아닙니다.** 구현은 원셋 DomainFacade에 있습니다.

| 지금 겪는 문제 | 읽을 글 |
|---|---|
| 시리즈 전체 흐름과 하위 글 안내 | [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design) |
| 공개 진입점 이름과 GoF·헥사 대응이 헷갈림 | [진입과 이름](/docs/knowledge/backend/facade/facade-entry-and-naming) |
| 예약은 저장됐는데 화면만 실패하는 이유를 알고 싶음 | [앱 동작 단위와 트랜잭션](/docs/knowledge/backend/facade/facade-app-unit-and-transactions) |
| 예약 불가와 저장 후 조회 실패를 테스트로 나누고 싶음 | [테스트와 실패 정책](/docs/knowledge/backend/facade/facade-testing-and-failures) |

원셋: `docs/harness/templates/backend/spring/exampleitem/facade/`
