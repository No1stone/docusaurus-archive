---
id: entity-entitygraph
title: EntityGraph
description: "예약 상세에 필요한 연관만 EntityGraph로 가져오는 방법을 설명합니다. FETCH·LOAD와 페이징에서 생기는 함정도 짚습니다."
keywords:
  - EntityGraph
  - FETCH
  - LOAD
  - 연관 로딩
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-entitygraph"
---
# EntityGraph로 상세 조회에 필요한 연관만 가져오기

예약 목록에는 예약 ID와 방문 시간만 필요합니다.<br />
예약 상세에서는 세대 이름까지 표시해야 합니다.<br />
두 화면을 위해 기본 엔티티 매핑을 바꾸면, 상세 화면의 필요가 목록 조회에도 영향을 줄 수 있습니다.

EntityGraph는 어떤 연관을 함께 읽을지 **조회 경로에서** 지정할 때 씁니다.

```java
@EntityGraph(attributePaths = "household")
@Query("select r from Reservation r where r.id = :id")
Optional<Reservation> findDetailById(@Param("id") Long id);
```

예제는 `Reservation.household` 연관이 매핑된 경우입니다.<br />
상세 조회에서 이 메서드를 호출하고, 읽은 데이터를 상세 DTO로 조립합니다.

## FETCH와 LOAD의 차이

| 그래프 유형 | 그래프에 포함된 속성 | 그래프에 없는 속성 |
|---|---|---|
| `FETCH` | EAGER로 취급 | LAZY로 취급 |
| `LOAD` | EAGER로 취급 | 기존 매핑의 fetch 설정 적용 |

영속성 제공자는 지정된 범위 밖의 상태를 추가로 가져올 수도 있습니다.<br />
그래프를 지정했다고 해서 SQL이 항상 한 번만 실행되거나 정확히 한 가지 조인 형태가 나온다고 가정하지 않습니다.

컬렉션을 함께 읽으면 SQL 결과에서 부모가 여러 행으로 펼쳐질 수 있습니다.<br />
페이지 조회와 함께 쓸 때는 결과 목록, 전체 건수, 실행 SQL을 확인합니다.<br />
목록에 필요한 값이 몇 개뿐이라면 Projection이나 별도 목록 쿼리도 비교할 수 있습니다.

원셋처럼 스칼라 ID를 우선하는 모델에는 EntityGraph를 붙일 연관 자체가 없을 수 있습니다.<br />
그런 경로는 필요한 ID를 모아 별도 조회하고 결과를 조립합니다.
[LAZY와 EAGER](/docs/knowledge/backend/entity/entity-fetch-lazy-eager) / [엔티티와 조회 모델](/docs/knowledge/backend/entity/entity-minimal-and-cqrs)

## 상세 조회 최적화를 목록에 그대로 적용하면

예약 상세 한 건에 첨부 파일을 표시하려고 컬렉션을 함께 가져온다고 가정합니다.<br />
같은 조회 계획을 목록에 붙이면 예약 하나의 첨부가 세 건일 때 SQL 결과가 여러 행으로 펼쳐질 수 있습니다.

| 조회 | 결과에서 확인할 것 |
|---|---|
| 예약 상세 한 건 | 필요한 첨부가 모두 포함되는지 |
| 예약 목록 20건 | 예약 중복 없이 페이지가 채워지는지 |
| 다음 페이지 | 같은 예약이 앞 페이지와 중복되지 않는지 |

그래프를 쓴 뒤에는 SQL뿐 아니라 화면 계약의 결과도 봅니다.<br />
목록에 파일 개수만 필요하다면 상세 그래프 대신 개수만 집계하는 조회도 비교할 수 있습니다.

## 참고 자료

- [Jakarta Persistence의 Entity Graph 동작](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
