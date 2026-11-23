---
format: "md"
id: "spring-jdbc-index"
title: "JDBC와 데이터 접근"
description: "DataSource, Spring JDBC, JPA, MyBatis, Querydsl, jOOQ를 다루는 데이터 접근 입구입니다."
slug: "/knowledge/backend/spring/jdbc"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "JDBC와 데이터 접근"
  - "Spring"
  - "Spring JDBC"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "Querydsl"
  - "jOOQ"
---
# JDBC와 데이터 접근

JDBC를 기반으로 SQL 매퍼, ORM과 쿼리 DSL이 무엇을 대신하는지 비교합니다.
서로 다른 계층의 도구를 구분하고 연결, 트랜잭션과 결과 매핑을 함께 봅니다.

## 읽는 순서

JDBC와 연결 풀에서 시작해 직접 SQL을 쓰는 경로와 엔티티를 관리하는 경로를 비교합니다.
여러 기술을 함께 사용하면 영속성 컨텍스트와 트랜잭션 참여 방식까지 확인합니다.

| 글 | 다루는 내용 |
|---|---|
| [JDBC 기본](./jdbc-basics.md) | JDBC의 연결, SQL 실행, 결과 매핑과 자원 정리를 설명하고 Spring 트랜잭션과 직접 연결 사용의 차이를 비교합니다. |
| [DataSource와 커넥션 풀](./datasource-and-pool.md) | DataSource와 HikariCP의 연결 대여, 풀 대기와 트랜잭션 점유를 설명하고 설정 및 관측 항목을 정리합니다. |
| [Spring JDBC](./spring-jdbc.md) | JdbcTemplate과 NamedParameterJdbcTemplate 및 JdbcClient의 자원 처리, 매핑과 트랜잭션 참여를 설명합니다. |
| [iBATIS와 MyBatis](./ibatis-and-mybatis.md) | iBATIS와 MyBatis의 관계, Mapper SQL과 파라미터 바인딩 및 Spring 트랜잭션 연결을 설명합니다. |
| [JPA와 Hibernate](./jpa-and-hibernate.md) | JPA와 Hibernate, 영속성 컨텍스트 및 flush와 commit의 차이, 지연 로딩과 벌크 갱신의 주의점을 설명합니다. |
| [Spring Data JPA](./spring-data-jpa.md) | Repository 프록시, save의 신규 판정, Specification과 Example 및 Auditing의 적용 경계를 설명합니다. |
| [QueryDSL](./querydsl.md) | Querydsl의 생성 Q 타입과 동적 JPQL 조건, DTO projection 및 코드 생성과 벌크 갱신의 제약을 설명합니다. |
| [jOOQ](./jooq.md) | jOOQ의 스키마 기반 코드 생성과 SQL DSL, Spring 통합 및 ORM과 함께 쓸 때의 경계를 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

