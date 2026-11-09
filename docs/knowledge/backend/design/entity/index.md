---
id: knowledge-backend-entity
title: Entity
description: JPA 엔티티 Knowledge. 기능 전개 후 원셋은 최소 사용·CQRS로 수렴합니다.
slug: "/knowledge/backend/entity/index"
---
# Entity

> **개요:** 엔티티는 테이블 행 모델입니다. JPA가 제공하는 기능을 기술 블로그로 펼친 뒤, 원셋은 **최소 사용 + CQRS**로 수렴합니다.
> **하네스 필독 아님.** 구현은 원셋에 있습니다.

- [엔티티 설계](/docs/knowledge/backend/entity/entity-design) — 허브. 필독 아님
  - [모델 발전사 (XML→ORM)](/docs/knowledge/backend/entity/persistence-from-xml-to-orm)
  - [VO·DTO·Entity](/docs/knowledge/backend/entity/persistence-vo-dto-entity)
  - [어노테이션 목록](/docs/knowledge/backend/entity/entity-annotations-catalog)
  - [연관과 cascade](/docs/knowledge/backend/entity/entity-associations)
  - [식별자](/docs/knowledge/backend/entity/entity-identifiers)
  - [enum 컨버터](/docs/knowledge/backend/entity/entity-enum-converter)
  - [LAZY·EAGER](/docs/knowledge/backend/entity/entity-fetch-lazy-eager)
  - [EntityGraph](/docs/knowledge/backend/entity/entity-entitygraph)
  - [더티 체킹](/docs/knowledge/backend/entity/entity-dirty-checking)
  - [DynamicInsert·Update](/docs/knowledge/backend/entity/entity-dynamic-insert-update)
  - [제약](/docs/knowledge/backend/entity/entity-constraints)
  - [최소 사용과 CQRS](/docs/knowledge/backend/entity/entity-minimal-and-cqrs) — 원셋 결말

원셋 엔티티: `docs/harness/templates/backend/spring/exampleitem/persistence/entity/`
