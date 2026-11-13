---
id: entity-design
title: 엔티티 설계
description: "엔티티 책임과 하위 글 목차를 안내하는 허브입니다. 매핑 기능을 익힌 뒤 원셋처럼 엔티티를 작게 유지하는 선택으로 이어집니다."
keywords:
  - 엔티티 설계
  - JPA
  - 원셋
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

## 엔티티를 손볼 때 SQL부터 확인하는 경우

예약 시간이 바뀌지 않거나 동시 수정에서 이전 값이 덮이는 문제라면 변경 추적과 버전 필드를 먼저 봅니다.<br />
목록을 열었을 때 SQL이 반복되면 변경 모델보다 연관 로딩과 결과 타입을 확인합니다.

| 문제 | 이어서 볼 글 |
|---|---|
| 수정 메서드가 DB에 언제 반영되는지 궁금함 | [더티 체킹](/docs/knowledge/backend/entity/entity-dirty-checking) |
| 상세에서만 연관을 함께 읽고 싶음 | [EntityGraph](/docs/knowledge/backend/entity/entity-entitygraph) |
| 파티션 때문에 DB 키가 복합임 | [엔티티 식별자](/docs/knowledge/backend/entity/entity-identifiers) |

## 관련

- [Repository](/docs/knowledge/backend/repository/index)
- [유스케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto)
- [CQRS](/docs/patterns/architecture-patterns/cqrs)
