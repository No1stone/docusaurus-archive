---
id: entity-fetch-lazy-eager
title: LAZY와 EAGER
description: 예약 목록의 세대 이름 조회로 JPA LAZY, EAGER와 N+1을 설명합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-fetch-lazy-eager"
---

# JPA LAZY와 EAGER, 예약 목록에서 N+1이 생기는 과정

방문 예약을 20건 읽고 각 예약에 세대 이름을 표시한다고 가정합니다.<br />
예약과 세대를 연관 매핑했다면, 화면 응답을 만드는 코드에서 `reservation.getHousehold().getName()`을 호출할 수 있습니다.

예약을 읽는 쿼리는 한 번이어도, 아직 로딩되지 않은 세대를 각각 조회하면 추가 SQL이 반복됩니다.<br />
같은 세대를 여러 예약이 참조하거나 배치 로딩을 사용하면 건수가 달라질 수 있지만, 이 패턴이 흔히 말하는 N+1입니다.

![예약 목록과 세대 이름을 읽는 과정](/img/backend-design/jpa-list-fetch.svg)

## 조회 시점과 SQL 모양은 따로 봅니다

`LAZY`는 연관 데이터를 나중에 읽어도 된다는 힌트입니다.<br />
`EAGER`는 필요한 시점까지 연관 데이터를 가져오라는 요구입니다.<br />
EAGER라고 해서 항상 한 번의 JOIN이 생기지는 않습니다.<br />
실제 SQL은 쿼리와 구현체의 로딩 전략을 함께 봐야 합니다.

| 상황 | 먼저 확인할 것 |
|---|---|
| 상세 한 건에서 연관 정보도 필요 | fetch join, EntityGraph 또는 화면 전용 조회 |
| 목록에 세대 이름만 필요 | 필요한 열만 조회하거나 세대 ID를 모아 일괄 조회 |
| 트랜잭션 밖에서 지연 로딩 접근 | 결과 조립 위치와 영속성 컨텍스트의 수명 |
| 컬렉션을 포함한 페이지 조회 | 중복 행과 페이지 범위, 총건수 확인 |

JPA의 대표 기본값은 `@ManyToOne`과 `@OneToOne`이 EAGER, 컬렉션 연관인 `@OneToMany`와 `@ManyToMany`가 LAZY입니다.<br />
실제 목록 SQL을 확인하면서 필요한 조회 계획을 고릅니다.

## 원셋에서는 목록이 사용할 값부터 정합니다

예약 목록에 세대 ID와 이름만 필요하다면, ID를 모아 한 번에 읽고 응답에 이름을 붙일 수 있습니다.<br />
이 경우 예약 전체 그래프를 미리 읽지 않아도 됩니다.<br />
기존 연관 매핑을 통해 상세 조회를 만들 때는 필요한 관계만 조회 계획에 추가합니다.
[연관 매핑](/docs/knowledge/backend/entity/entity-associations) / [EntityGraph](/docs/knowledge/backend/entity/entity-entitygraph)

## 참고 자료

- [Jakarta Persistence의 FetchType과 연관 매핑](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
