---
id: entity-design
title: 엔티티 설계
description: JPA 엔티티 Knowledge 허브입니다. 책임과 하위 글 목차, 원셋 최소 사용으로의 수렴을 안내합니다.
tags:
  - backend
  - jpa
  - entity
status: active
slug: "/knowledge/backend/entity/entity-design"
---

# 엔티티 설계

예약을 저장하는 엔티티에는 식별자와 상태가 들어갑니다.<br />
관리 화면에서 세대 이름이나 집계가 필요해지면, 그 값은 조회 결과에서 조립할 수 있습니다.

이 시리즈는 식별자, 연관 로딩, 변경 추적을 각각 확인합니다.<br />
원셋은 Adapter 안에서 엔티티를 다루고 호출부에는 필요한 데이터만 돌려줍니다.

## 하위 글

모델 발전 → 어노테이션·연관·Id·컨버터·로딩·EntityGraph·더티·Dynamic*·제약 → **minimal-and-cqrs**.

목록은 [Entity index](/docs/knowledge/backend/entity/index)와 같습니다.

## 관련

- [Repository](/docs/knowledge/backend/repository/index)
- [유스케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto)
- [CQRS](/docs/patterns/architecture-patterns/cqrs)
