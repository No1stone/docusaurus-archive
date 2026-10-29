---
format: "md"
id: "spring-data-access-spring-jdbc"
title: "Spring JDBC"
description: "JdbcTemplate, NamedParameterJdbcTemplate과 JdbcClient가 SQL 중심의 JDBC 코드를 어떻게 정리하는지 설명합니다."
slug: "/knowledge/backend/spring/data-access/spring-jdbc"
sidebar_position: 0
tags: ["Spring", "JDBC"]
status: "active"
---
# Spring JDBC

Spring JDBC는 SQL을 직접 작성하면서 연결 처리와 자원 정리, 예외 변환 등 반복 작업을 줄이는 기능을 제공합니다.
SQL을 대신 설계하거나 엔티티의 변경 상태를 추적하는 ORM과는 역할이 다릅니다.

| API | 작성 방식과 역할 |
|---|---|
| JdbcTemplate | SQL과 파라미터를 전달하고 RowMapper 등으로 결과를 변환합니다. |
| NamedParameterJdbcTemplate | 물음표 대신 이름 있는 파라미터로 SQL을 작성합니다. |
| JdbcClient | 체이닝 API로 조회와 변경을 표현합니다. 내부적으로 JdbcTemplate 계열 기능을 활용합니다. |

직접 JDBC에서 처리하던 반복 코드가 줄어들어도 SQL, 결과 매핑과 트랜잭션 범위의 판단은 남습니다.
기존 코드의 방식과 쿼리 특성을 기준으로 API를 선택합니다.

## 이어서 읽기

- [JDBC 기본](/docs/knowledge/backend/spring/data-access/jdbc-basics)
- [Spring JDBC 공식 문서](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html)
