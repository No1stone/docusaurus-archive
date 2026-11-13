---
id: repository-spec-and-filter
title: Spec과 Filter
description: "HTTP 호출 이력 화면의 Filter가 Specs.of를 거쳐 JPA Specification·페이징으로 이어지는 한곳 관리 방식을 설명합니다."
keywords:
  - Specification
  - Filter
  - Specs.of
  - 동적 조회
tags:
  - backend
  - jpa
  - specification
status: active
slug: "/knowledge/backend/repository/repository-spec-and-filter"
---
# JPA Specification으로 화면 검색 조건을 한곳에서 관리하기

HTTP 호출 이력 화면에는 URL, HTTP 메서드, 발생 기간이 있습니다.<br />
운영자는 세 조건을 다 넣기도 하고, 발생 기간만 넣어서 장애가 시작된 시점을 살펴보기도 합니다.

이때 조회 메서드를 조건 조합마다 추가하면 검색 규칙이 여러 곳에 흩어집니다.<br />
원셋은 입력을 Filter로 받고, 값이 들어온 필드만 `Specification` 조건으로 조립합니다.

![검색 Filter가 JPA 조회 조건이 되는 과정](/img/backend-design/jpa-specification-filter.svg)

## Filter에서 WHERE 조건까지

`Specification<T>`는 JPA Criteria API로 조회 조건을 만드는 인터페이스입니다.<br />
Repository에 `JpaSpecificationExecutor<T>`를 붙이면 Specification과 페이징 조건을 함께 넘길 수 있습니다.

```java
public interface ExampleItemRepository
        extends JpaRepository<ExampleItem, Long>,
                JpaSpecificationExecutor<ExampleItem> {
}
```

아래는 원셋에서 URL과 ID 목록을 조립하는 부분을 발췌한 예입니다.

```java
public static Specification<ExampleItem> of(ExampleItemReq.Filter filter) {
    return (root, query, builder) -> {
        PredicateBuilder predicates = new PredicateBuilder(builder, root);
        predicates.equal(ExampleItem.Fields.url, filter.getUrl());
        predicates.in(ExampleItem.Fields.id, filter.getIds());
        return predicates.build();
    };
}
```

`PredicateBuilder`는 원셋의 헬퍼입니다.<br />
목록 검색에서 제공되지 않은 조건은 건너뛰고, 값이 들어온 조건을 결합합니다.<br />
HTTP 메서드 일치와 생성 시각의 상한, 하한도 같은 자리에서 조립할 수 있습니다.

페이징과 정렬은 Adapter에서 `Pageable`로 전달합니다.<br />
Adapter는 엔티티를 읽고 호출부가 사용하는 결과 모델로 바꿉니다.
[Spring 원셋의 구현 경계](/docs/harness/templates/backend/spring/ONESET) / [Page와 Slice](/docs/knowledge/backend/repository/repository-pagination-and-slice)

## ID가 비었다는 의미는 호출 목적에 따라 달라집니다

일반 목록에서 ID 필터가 없으면 URL이나 기간만으로 검색할 수 있습니다.<br />
하지만 **선택한 ID에 해당하는 기록만** 읽는 메서드에서 빈 목록을 받으면 결과도 비어야 합니다.

이 차이는 조건 조립기에만 맡기기 어렵습니다.<br />
빈 `IN`을 생략하는 로직을 선택 조회에서도 그대로 사용하면, 의도한 대상이 하나도 없는데 전체 조회가 될 수 있습니다.<br />
원셋은 이 경로에서 Adapter가 먼저 목록이 비었는지 확인합니다.

| 입력 | 일반 검색 | ID 선택 조회 |
|---|---|---|
| ID 필터 없음 | 다른 검색 조건만 적용 | 빈 결과 |
| 선택 ID 두 개 | 두 ID에 해당하는 행만 조회 | 두 ID에 해당하는 행만 조회 |
| 선택 ID 없음 | 호출 계약에 따라 선택 필터 생략 여부 결정 | 빈 결과 |

## OR 조건이나 조인이 추가되면

예를 들어 URL이 일치하거나 메서드가 특정 값인 기록을 찾되 기간은 항상 적용하려면, OR 그룹과 기간 조건을 분리해 결합합니다.

```java
Specification<ExampleItem> filter =
        urlMatches.or(methodMatches).and(withinPeriod);
```

조인으로 결과 행이 늘어나는 조회에서는 목록과 전체 건수를 같이 확인해야 합니다.<br />
페이지에 같은 항목이 반복되거나 전체 건수가 달라지면 검색 결과가 있어도 화면에서 다음 페이지를 제대로 계산할 수 없습니다.

목록 항목의 동적 조건에 집중할 때는 Specification이 잘 맞습니다.<br />
화면 전용 DTO, 집계, 복잡한 조인까지 쿼리에서 만들기 시작하면 전용 조회 구현을 검토합니다.
[Query by Example](/docs/knowledge/backend/repository/repository-query-by-example) / [QueryDSL 동적 조회](/docs/knowledge/backend/repository/repository-querydsl-dynamic)

## 같은 화면에서 필터를 하나씩 켜 보기

원셋의 호출 이력 검색에서 URL과 메서드, 기간이 들어온다고 가정합니다.<br />
아래 WHERE는 실제 생성 SQL의 로그가 아니라, 각 입력이 어떤 조건을 만드는지 보여주는 예시입니다.

| 요청에 포함된 값 | 만들어지는 조건의 의미 |
|---|---|
| `httpMethod=GET` | `http_method = ?` |
| `url=/api/reservations`, `httpMethod=GET` | URL과 메서드가 모두 일치 |
| 시작 시각과 종료 시각 | `created_at >= ? AND created_at <= ?` |
| URL과 기간 | URL 일치 조건에 기간의 양쪽 경계 추가 |

테스트 데이터를 만들 때는 URL만 일치하는 행, 메서드만 일치하는 행, 기간 양 끝에 있는 행을 각각 넣습니다.<br />
결과 ID와 정렬 순서를 확인하면 조건을 조합하는 과정에서 잘못된 OR가 들어가거나 기간 경계가 누락된 경우를 찾을 수 있습니다.

고정 URL 조회는 메서드 이름이나 `@Query` 하나로 읽기 쉽습니다.<br />
위처럼 빈 필드를 건너뛰는 검색은 Specification이 맞고, 같은 데이터에서 URL별 실패 건수를 구해 전용 DTO로 반환한다면 집계를 표현하는 QueryDSL이나 SQL을 검토할 만합니다.
[쿼리 메서드](/docs/knowledge/backend/repository/repository-query-methods) / [QueryDSL로 전용 결과 조회](/docs/knowledge/backend/repository/repository-querydsl-custom)

## 참고 자료

- [Spring Data JPA Specification과 조건 조합](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html)
