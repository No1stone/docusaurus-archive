---
id: repository-jooq-and-sql-builders
title: jOOQ와 SQL 빌더
description: QueryDSL과 jOOQ를 비교하고 원셋 기본(JPA+Spec)과의 경계를 정리합니다.
tags:
  - backend
  - jooq
  - sql
status: active
slug: "/knowledge/backend/repository/repository-jooq-and-sql-builders"
---

# QueryDSL JPA와 jOOQ, 조회를 엔티티로 볼까 SQL로 볼까

호출 이력 화면에서 URL별 실패 건수를 집계하고, 최근 기간의 결과와 비교한다고 가정합니다.<br />
JPA 엔티티를 기준으로 조회를 확장할 수도 있고, SQL에서 사용할 테이블과 집계 형태를 먼저 정할 수도 있습니다.

| 관점 | QueryDSL JPA | jOOQ |
|---|---|---|
| 쿼리 모델 | 엔티티 기반 Q 타입 | 생성된 테이블과 컬럼, SQL DSL |
| 실행 경로 | JPA EntityManager | SQL 실행과 레코드 매핑 |
| 잘 맞는 예 | 엔티티를 중심으로 필터와 조인 조립 | SQL 기능을 사용하는 보고서와 집계 |

예를 들어 URL별 발생 건수를 SQL로 직접 표현하는 jOOQ 코드는 다음처럼 읽힙니다.

```java
dsl.select(EXAMPLE_ITEM.URL, count())
    .from(EXAMPLE_ITEM)
    .where(EXAMPLE_ITEM.RESPONSE_HTTP_STATUS.like("4%").or(EXAMPLE_ITEM.RESPONSE_HTTP_STATUS.like("5%")))
    .groupBy(EXAMPLE_ITEM.URL)
    .fetch();
```

예제는 테이블 코드가 스키마에서 생성됐다고 가정합니다.<br />
실제 결과는 화면에 필요한 형태로 매핑하고, 대상 DB 방언과 SQL을 함께 확인합니다.

원셋은 기존 목록을 JPA와 Specification으로 조회합니다.<br />
별도 읽기 모델이 SQL 중심으로 커지는 경우에는 조회 구현 안에서 jOOQ를 검토할 수 있습니다.<br />
JPA가 관리하는 엔티티를 변경한 뒤 같은 작업에서 jOOQ로 읽을 경우에는 두 접근이 같은 트랜잭션에 참여하는지와 JPA flush 시점을 확인합니다.
[QueryDSL 동적 조회](/docs/knowledge/backend/repository/repository-querydsl-dynamic) / [조회와 변경의 경계](/docs/knowledge/backend/entity/entity-minimal-and-cqrs)

## 참고 자료

- [jOOQ SQL DSL](https://www.jooq.org/doc/latest/manual/sql-building/)
