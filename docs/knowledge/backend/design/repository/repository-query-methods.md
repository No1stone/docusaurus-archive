---
id: repository-query-methods
title: Repository — Query Methods
description: HTTP 호출 이력 검색을 예로 파생 쿼리, JPQL, Specification의 역할을 비교합니다.
tags:
  - backend
  - spring-data
  - jpa
status: active
slug: "/knowledge/backend/repository/repository-query-methods"
---

# Spring Data JPA 쿼리 메서드, 검색 조건이 늘면 어디에 둘까

운영 화면에서 HTTP 호출 이력을 찾는다고 가정합니다.<br />
처음에는 URL로 찾으면 충분했지만, 나중에는 HTTP 메서드와 발생 기간도 선택할 수 있게 됩니다.

URL이 항상 들어가는 조회라면 메서드 이름으로 조건을 표현할 수 있습니다.<br />
반면 화면의 필터는 URL 없이 기간만 넣는 요청도 받아야 합니다.<br />
이때 두 조회를 어떻게 다르게 설계할지 살펴봅니다.

## 항상 들어오는 조건은 이름으로 표현할 수 있습니다

Spring Data는 Repository 메서드 이름에서 속성과 조건을 해석합니다.<br />
아래 메서드는 URL과 HTTP 메서드가 모두 일치하는 기록을 조회합니다.

```java
List<ExampleItem> findByUrlAndHttpMethod(String url, String httpMethod);
```

이름에 `And`, `Or`, `Between`, `Containing` 같은 키워드를 넣을 수 있습니다.<br />
반환 타입은 용도에 따라 `Optional`, `List`, `Page`, `Slice` 등을 선택합니다.

여기서 `httpMethod`에 `null`을 넘기는 것은 필터를 빼달라는 표현이 아닙니다.<br />
예를 들어 JPA의 파생 동등 비교는 해당 값이 `null`이면 `IS NULL`로 해석할 수 있습니다.<br />
화면에서 입력을 비웠을 때 모든 메서드의 기록을 보여주려면 조건을 만드는 쪽에서 그 의도를 표현해야 합니다.

## 조건을 직접 읽어야 할 때는 쿼리를 선언합니다

예를 들어 특정 URL의 실패만 조회하는 규칙이 항상 유지된다면, 아래처럼 JPQL을 읽는 편이 조건을 확인하기 쉽습니다.

```java
@Query("""
    select e from ExampleItem e
    where e.url = :url and (e.responseHttpStatus like '4%' or e.responseHttpStatus like '5%')
    """)
List<ExampleItem> findFailures(@Param("url") String url, Pageable pageable);
```

이 코드는 호출 이력 엔티티에 `responseHttpStatus`가 매핑돼 있다고 가정한 예제입니다.<br />
`@Query`는 조회 조건을 메서드 가까이에 두기 좋고, 복잡한 DB 전용 표현이 필요하면 네이티브 SQL을 지정할 수도 있습니다.

쓰기 쿼리는 `@Modifying`과 쓰기 트랜잭션을 함께 고려합니다.<br />
벌크 UPDATE 이후에는 이미 읽어 둔 엔티티가 이전 값을 갖고 있을 수 있습니다.<br />
`clearAutomatically`를 쓰면 영속성 컨텍스트를 비우므로 아직 반영하지 않은 변경도 함께 사라질 수 있다는 점을 확인해야 합니다.
[Repository의 트랜잭션 기본값](/docs/knowledge/backend/repository/repository-transactionality)

## 원셋은 목록 검색에 Filter와 Specification을 씁니다

조회 화면에 URL, HTTP 메서드, 기간이 모두 선택 조건이라면 조건별로 Repository 메서드를 만드는 대신 Filter를 하나 전달합니다.<br />
원셋의 `ExampleItemSpecs.of(filter)`는 들어온 조건만 모아 검색합니다.<br />
예를 들어 기간만 채우면 시간 조건만 추가하고, URL도 채우면 URL 조건을 함께 적용합니다.

| 조회 목적 | 시작점 |
|---|---|
| PK 한 건 | 상속한 `findById` |
| 업무 의미가 고정된 조회 | 고정 조건을 드러내는 파생 메서드나 `@Query` |
| 화면의 선택 필터 조합 | 원셋의 `Filter → Specification` |
| 조인, 집계, 전용 DTO 반환 | 별도 조회 구현에서 QueryDSL 또는 SQL 검토 |

파생 메서드는 Spring Data의 기능이고, 목록 조건을 한곳에 모으는 것은 이 아카이브의 선택입니다.<br />
검색 화면에 필터 하나를 추가했을 때 `Filter`와 조건 조립 코드를 함께 보면 어떤 조회에 반영되는지 찾기 쉽습니다.
[Specification과 Filter](/docs/knowledge/backend/repository/repository-spec-and-filter) / [Page와 Slice](/docs/knowledge/backend/repository/repository-pagination-and-slice)

## 참고 자료

- [Spring Data JPA의 파생 쿼리, JPQL과 변경 쿼리](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)
