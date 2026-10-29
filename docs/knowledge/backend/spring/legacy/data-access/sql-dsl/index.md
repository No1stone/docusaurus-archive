---
format: "md"
id: "spring-data-access-sql-dsl"
title: "SQL DSL"
description: "jOOQ의 SQL 중심 DSL과 JPA 및 QueryDSL JPA의 역할 차이를 간단히 정리합니다."
slug: "/knowledge/backend/spring/data-access/sql-dsl"
sidebar_position: 0
tags: ["Spring", "JDBC"]
status: "active"
---
# SQL DSL

SQL DSL은 SQL을 Java 코드에서 조합할 수 있는 표현 방식입니다.
jOOQ는 SQL과 DB 스키마를 중심으로 쿼리를 구성하고 결과를 다루는 라이브러리입니다.

## jOOQ와 JPA 기반 쿼리

| 구분 | 중심에 두는 것 |
|---|---|
| jOOQ | 테이블과 컬럼, 조인 및 집계 등 SQL의 구조 |
| QueryDSL JPA | 엔티티와 JPQL 기반의 쿼리 구성 |
| JPA 구현체 | 객체의 매핑과 영속성 상태 관리 |

jOOQ를 도입한다고 JPA를 반드시 전부 교체해야 하는 것은 아닙니다.
영속성 관리와 SQL 중심 조회를 어떤 범위로 사용할지 나누어 함께 구성할 수도 있습니다.

## 이어서 읽기

- [JPA 기반 접근](/docs/knowledge/backend/spring/data-access/jpa)
- [jOOQ와 JPA 공식 설명](https://www.jooq.org/doc/latest/manual/getting-started/jooq-and-jpa/)
