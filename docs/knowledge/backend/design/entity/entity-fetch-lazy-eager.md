---
id: entity-fetch-lazy-eager
title: LAZY와 EAGER
description: "예약 목록에서 세대 이름을 읽다 N+1이 생기는 과정을 LAZY·EAGER로 풀어, 목록 조회에 맞는 로딩 선택을 설명합니다."
keywords:
  - LAZY
  - EAGER
  - N+1
  - 페치
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

## 같은 예약 목록을 세 가지 방법으로 읽어 보기

예약 세 건이 세대 `101`, `101`, `102`에 속한다고 가정합니다.<br />
화면에는 예약 시간과 세대 이름만 보여줍니다.

| 방법 | 실행 흐름 | 확인할 점 |
|---|---|---|
| 조회 뒤 지연 연관에 접근 | 예약 목록을 읽고, 로드되지 않은 세대가 필요할 때 추가 조회 | 같은 세대를 재사용할 수 있지만, 서로 다른 세대가 늘면 쿼리도 늘 수 있음 |
| 목록과 세대 이름을 한 쿼리에서 읽기 | 필요한 열을 JOIN으로 선택해 목록 결과 생성 | 연관으로 행이 늘어나는 경우 페이지와 count가 의도대로 동작하는지 확인 |
| ID로 별도 일괄 조회 | 예약 목록을 읽고, 세대 ID `101`, `102`를 모아 이름을 읽은 뒤 조립 | 이름 조회 범위를 해당 페이지로 제한할 수 있고 빈 ID 목록에서는 호출 생략 가능 |

측정할 때는 SQL 로그에서 실제로 나간 조회를 셉니다.<br />
테스트 데이터가 같은 세대만 반복하면 영속성 컨텍스트의 재사용 때문에 문제가 잘 드러나지 않습니다.<br />
여러 세대를 섞고 조회 전에 컨텍스트를 비운 상태에서 비교합니다.

원셋의 `DisplayNameResolver`는 세 번째 방식의 작은 예제입니다.<br />
목록과 상세를 서로 다른 결과 타입으로 설계하는 경우에는 [VO, DTO, 엔티티와 Item](/docs/knowledge/backend/entity/persistence-vo-dto-entity)에서 이어집니다.

## 참고 자료

- [Jakarta Persistence의 FetchType과 연관 매핑](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
