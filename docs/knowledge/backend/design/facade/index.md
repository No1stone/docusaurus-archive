---
id: knowledge-backend-facade
title: Facade
description: "도메인 Facade를 공개 진입점으로 두는 글 모음입니다. 앱 동작 단위, 트랜잭션 경계, 이름 규칙과 실패 테스트까지 이어서 봅니다."
slug: "/knowledge/backend/facade/index"
---
# Facade

> **개요:** 애플리케이션 영역의 책임과 이름 선택, 공개 진입점(`{Domain}Facade` / `{Feature}BffFacade`)을 다룹니다.
> 공개 여부는 이름만으로 판단하지 않습니다.
> **하네스 필독 아님.** 구현은 원셋에 있습니다.

- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design) — 허브. 필독 아님
  - [진입과 이름 (GoF·경량 헥사·연관 끊기)](/docs/knowledge/backend/facade/facade-entry-and-naming)
  - [앱 동작 단위와 트랜잭션](/docs/knowledge/backend/facade/facade-app-unit-and-transactions)
  - [테스트와 실패 정책](/docs/knowledge/backend/facade/facade-testing-and-failures)

원셋 DomainFacade: `docs/harness/templates/backend/spring/exampleitem/facade/`
