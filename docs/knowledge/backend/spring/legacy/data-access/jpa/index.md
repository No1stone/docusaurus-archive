---
format: "md"
id: "spring-data-access-jpa"
title: "JPA 기반 접근"
description: "JPA 명세와 Hibernate 구현체, Spring Data JPA 및 QueryDSL JPA의 관계를 구분하고 기존 글에 연결합니다."
slug: "/knowledge/backend/spring/data-access/jpa"
sidebar_position: 0
tags: ["Spring", "JDBC"]
status: "active"
---
# JPA 기반 접근

JPA는 객체와 관계형 데이터의 영속성을 다루는 명세입니다.
Hibernate는 JPA 구현체 중 하나이며, Spring Data JPA와 QueryDSL JPA는 그 위에서 서로 다른 역할을 맡습니다.

| 구성 | 역할 |
|---|---|
| JPA | 엔티티 매핑과 영속성 관리의 표준을 정의합니다. |
| Hibernate | JPA를 구현하고 SQL 실행과 영속성 관리를 수행합니다. |
| Spring Data JPA | Repository를 중심으로 JPA 데이터 접근 코드를 구성하도록 돕습니다. |
| QueryDSL JPA | 엔티티와 경로를 바탕으로 타입 안전하게 JPA 쿼리를 구성합니다. |

```text
QueryDSL JPA로 쿼리 구성
          ↓
JPA 구현체인 Hibernate
          ↓
         JDBC
```

Spring Data JPA와 QueryDSL JPA는 함께 사용할 수 있으며, 모든 JPA 호출이 QueryDSL을 거쳐야 하는 것은 아닙니다.
이 영역은 Spring에서 사용하는 접근 구조를 정리하고, 기존 매핑과 쿼리 메모는 아래에서 연결합니다.

## 관련 글

- [JPA와 ORM 메모](/docs/knowledge/data/jpa)
- [JPA 핵심 개념](/docs/knowledge/k-jpa-core-concepts)
- [Spring Data JPA](/docs/knowledge/k-spring-data-jpa)
- [동적 쿼리 메모](/docs/knowledge/k-dynamicquery)
- [Auditing](/docs/knowledge/k-auditing)
- [Spring Data JPA 공식 문서](https://docs.spring.io/spring-data/jpa/reference/)
- [QueryDSL JPA 모듈](https://github.com/querydsl/querydsl/tree/master/querydsl-jpa)
