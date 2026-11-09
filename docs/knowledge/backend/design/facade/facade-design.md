---
id: facade-design
title: 애플리케이션 영역과 Facade
description: Facade Knowledge 허브입니다. GoF 이름, 경량 헥사 유스케이스, 앱 동작 단위, BFF와 도메인 분리를 하위 글로 나눕니다.
tags:
  - backend
  - facade
  - application
status: active
slug: "/knowledge/backend/facade/facade-design"
---

# 애플리케이션 영역과 Facade

방문 예약을 등록하는 일과 등록 결과를 화면에 보여주는 일은 서로 다른 범위의 작업입니다.<br />
도메인 Facade는 예약의 정책과 변경을 맡고, BFF Facade는 공개 유즈케이스를 조합해 화면을 완성합니다.

이 시리즈는 두 진입점을 나눈 이유, 트랜잭션의 범위, 실패를 어떻게 테스트하는지 다룹니다.<br />
실제 구현의 뼈대는 [Spring 원셋](/docs/harness/templates/backend/spring/ONESET)에서 확인할 수 있습니다.

## 하위 글

| 글 | 다루는 것 |
|----|-----------|
| [진입과 이름 (GoF·경량 헥사·연관 끊기)](/docs/knowledge/backend/facade/facade-entry-and-naming) | 이름 유래, UseCase 동치, Item 조립, api/model, DisplayNameResolver |
| [앱 동작 단위와 트랜잭션](/docs/knowledge/backend/facade/facade-app-unit-and-transactions) | 앱 TX ≠ DB TX, BFF vs 도메인, `@Transactional` 구현·안티패턴 |
| [테스트와 실패 정책](/docs/knowledge/backend/facade/facade-testing-and-failures) | Port 스텁, 부분 실패, Saga 경계 |

## 관련

- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [데이터 접근 경계 (Port와 Adapter)](/docs/knowledge/backend/service/service-design)
- [유스케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto)
- [CQRS](/docs/patterns/architecture-patterns/cqrs)
- [ADR-0010](/docs/decisions/adr-0010)
- 원셋: `docs/harness/templates/backend/spring/exampleitem/facade/`
