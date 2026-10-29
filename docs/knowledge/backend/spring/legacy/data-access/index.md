---
format: "md"
id: "spring-data-access"
title: "JDBC와 데이터 접근"
description: "JDBC의 기본 연결 구조부터 Spring JDBC, MyBatis, JPA와 QueryDSL 및 jOOQ의 역할을 구분합니다."
slug: "/knowledge/backend/spring/data-access"
sidebar_position: 0
tags: ["Spring", "JDBC"]
status: "active"
---
# JDBC와 데이터 접근

Java에서는 JDBC를 통해 관계형 DB에 연결하고 SQL을 실행합니다.

MySQL Connector/J 같은 JDBC 드라이버가 Java와 실제 DB 사이의 통신을 담당합니다.

Spring Framework 이전에도, 또는 Spring 없이도, Java만으로 `DriverManager`와 `Connection`을 얻어 SQL을 실행하던 시절이 있습니다.

연결을 얻고, `Statement`나 `PreparedStatement`로 SQL을 실행하고, `ResultSet`을 읽은 뒤 자원을 정리하는 코드를 매번 작성해야 했습니다.

Spring은 이러한 반복 작업을 줄이기 위해 JdbcTemplate 등을 제공했고, 버전에 따라 JDBC API와 연결 설정 방법을 확장해 왔습니다.

## JDBC 접근의 흐름

| 시기 | 접근 방식 |
|---|---|
| Java만 (JDBC Connection) | 연결 획득, SQL 실행, 결과 조회, 자원 정리 직접 처리 |
| Spring Framework | JdbcTemplate, NamedParameterJdbcTemplate을 통한 반복 처리 축소 |
| Spring Framework 6.1 / Boot 3.2 | JdbcClient 추가, 조건에 따른 Boot 자동 설정 |

## Spring 버전별 JDBC API

아래는 Spring 쪽에서 주요 API가 추가된 시점을 중심으로 정리한 표입니다.

| Spring Framework | Spring Boot 기준 | JDBC API |
|---|---|---|
| 초기 Spring부터 | Boot 등장 이전부터 사용 | JdbcTemplate 기반 SQL 실행과 결과 처리 |
| 2.0부터 | Boot 등장 이전부터 사용 | NamedParameterJdbcTemplate 추가, 이름 있는 파라미터 지원 |
| 6.0 | Boot 3.0과 3.1 | JdbcTemplate, NamedParameterJdbcTemplate 지원 |
| 6.1부터 | Boot 3.2부터 | JdbcClient 추가, 조건에 따른 자동 설정, 기존 Template API 유지 |

JdbcTemplate은 Boot 3에서 처음 나온 기술이 아닙니다.

Boot 3.2에서 추가된 JdbcClient는 Template 계열에 실행을 위임하는 간결한 JDBC 접근 API입니다.

## 드라이버와 연결 설정

JDBC 커넥터는 DB별 드라이버이며, DataSource는 연결을 얻는 Java 표준 인터페이스입니다.
Spring Config는 DataSource 등을 Bean으로 등록하는 설정 코드이고, Boot는 조건에 맞는 구성을 자동 설정합니다.

| 계층 | 역할 |
|---|---|
| JDBC 위 추상화 | Spring JDBC, MyBatis, JPA/Hibernate, jOOQ |
| JDBC API | 연결, SQL 실행과 결과 처리의 표준 인터페이스 |
| DataSource | JDBC 연결 제공 인터페이스, 커넥션 풀 연계 |
| Spring Config | DataSource와 JDBC 접근 객체의 Bean 등록 |
| JDBC 드라이버 | MySQL Connector/J 등, Java와 DB 사이 통신 |
| DB | MySQL, MariaDB 등 관계형 데이터베이스 |

## 데이터 접근 기술의 역할

| 기술 | 맡는 역할 |
|---|---|
| 직접 JDBC | 연결 획득, SQL 실행, 결과 조회, 자원 정리 |
| Spring JDBC | JdbcTemplate, JdbcClient 기반 JDBC 반복 처리 축소 |
| MyBatis | 작성한 SQL과 객체의 매핑 |
| JPA / Hibernate | 객체의 영속성 관리 |
| jOOQ | Java 코드로 SQL 구성 |

기술의 등장 순서가 곧 이전 기술의 대체를 뜻하지는 않습니다.

QueryDSL JPA는 JPA 쿼리를 구성하는 별도 라이브러리이며, Hibernate 자체의 기능은 아닙니다.

## 역할별로 살펴보기

| 분야 | 다루는 내용 |
|---|---|
| [JDBC 기본](/docs/knowledge/backend/spring/data-access/jdbc-basics) | JDBC API와 드라이버, 직접 SQL 실행, DataSource와 커넥션 풀 |
| [Spring JDBC](/docs/knowledge/backend/spring/data-access/spring-jdbc) | JdbcTemplate, NamedParameterJdbcTemplate, JdbcClient 비교 |
| [SQL 매핑](/docs/knowledge/backend/spring/data-access/sql-mapping) | iBATIS와 MyBatis, SQL과 객체 매핑 |
| [JPA 기반 접근](/docs/knowledge/backend/spring/data-access/jpa) | JPA, Hibernate, Spring Data JPA, QueryDSL JPA의 관계 |
| [SQL DSL](/docs/knowledge/backend/spring/data-access/sql-dsl) | jOOQ 기반 Java SQL 구성 |

## 함께 읽기

- [MySQL과 MariaDB](/docs/knowledge/data/mysql): DB 타입, 테이블 설계와 운영 예제입니다.
- [데이터 접근 영역 설계](/docs/knowledge/backend/service/service-design): 애플리케이션의 업무 판단과 데이터 접근 책임을 구분합니다.

<details>
<summary>공식 참고 자료</summary>

- [JdbcTemplate API와 도입 시점](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/JdbcTemplate.html)
- [NamedParameterJdbcTemplate API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/namedparam/NamedParameterJdbcTemplate.html)
- [JdbcClient: Spring Framework 6.1부터 제공](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/simple/JdbcClient.html)
- [Spring Boot 3.2의 JdbcClient 자동 설정](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes#support-for-jdbcclient)
- [Java DataSource 인터페이스](https://docs.oracle.com/en/java/javase/17/docs/api/java.sql/javax/sql/DataSource.html)

</details>
