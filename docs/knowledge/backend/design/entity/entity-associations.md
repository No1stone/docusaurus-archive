---
id: entity-associations
title: 엔티티 연관과 cascade
description: 방문 예약과 세대를 예로 JPA 연관과 스칼라 ID의 쓰임을 설명합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-associations"
---

# JPA 연관 매핑과 스칼라 ID, 예약 목록에서는 무엇이 필요할까

방문 예약에는 세대 ID가 있습니다.<br />
상세 화면에서는 세대 정보도 보고 싶지만, 예약 검증이나 이력 적재에는 세대 ID 하나로 충분한 경우가 있습니다.

어떤 화면 하나에 연관 정보가 필요하다는 이유로 모든 경로에서 객체 그래프를 읽을 필요는 없습니다.<br />
이 차이를 기준으로 연관 매핑과 ID를 직접 보관하는 방식을 비교합니다.

| 매핑 | 관계를 표현하는 예 |
|---|---|
| `@ManyToOne` | 여러 예약이 하나의 세대에 속함 |
| `@OneToMany` | 세대에서 여러 예약을 탐색 |
| `@OneToOne` | 한 행이 다른 한 행과 대응 |
| `@ManyToMany` | 양쪽이 중간 테이블을 통해 여러 행과 연결 |

## 연관 필드를 쓰는 경우

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "household_id")
private Household household;
```

예약을 수정하면서 세대의 속성을 자주 사용한다면 연관 탐색으로 코드가 간결해질 수 있습니다.<br />
반대로 목록에 예약을 수십 건 읽고 각각 세대를 접근하면 추가 쿼리가 반복될 수 있습니다.
[LAZY와 EAGER의 조회 시점](/docs/knowledge/backend/entity/entity-fetch-lazy-eager)

## 원셋에서 ID로 관계를 표현하는 경우

```java
@Column(name = "household_id", nullable = false)
private Long householdId;
```

이 경우 예약 엔티티는 세대 ID를 보관합니다.<br />
세대 이름이 필요한 화면에서는 ID를 모아 한 번에 조회하고 목록에 붙입니다.<br />
DB 외래 키를 둘지는 같은 관계를 DB 제약으로도 보호할지에 대한 별도 결정입니다.

같은 컬럼에 스칼라와 연관을 함께 매핑한다면 어느 쪽이 쓰기를 소유하는지 정해야 합니다.<br />
예를 들어 스칼라를 쓰기 기준으로 두고 탐색용 연관의 조인 컬럼에 `insertable = false, updatable = false`를 지정할 수 있습니다.<br />
한 컨텍스트에서 스칼라를 바꾼 뒤 이미 읽은 연관 객체가 자동으로 바뀐다고 가정하지 않습니다.

`cascade`는 저장과 삭제를 어느 엔티티까지 전파할지 정합니다.<br />
조회에 연관이 필요하다는 사실만으로 저장이나 삭제의 수명주기까지 묶을 필요는 없습니다.
[EntityGraph로 조회 범위 지정하기](/docs/knowledge/backend/entity/entity-entitygraph) / [엔티티 설계](/docs/knowledge/backend/entity/entity-design)

## 참고 자료

- [Jakarta Persistence의 관계 매핑과 cascade](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
