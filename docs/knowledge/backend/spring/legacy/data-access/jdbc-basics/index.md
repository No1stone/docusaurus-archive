---
format: "md"
id: "spring-data-access-jdbc-basics"
title: "JDBC 기본"
description: "JDBC API와 드라이버, 직접 SQL 실행, DataSource와 커넥션 풀의 기본 역할을 설명합니다."
slug: "/knowledge/backend/spring/data-access/jdbc-basics"
sidebar_position: 0
tags: ["Spring", "JDBC"]
status: "active"
---
# JDBC 기본

JDBC는 Java에서 DB 연결과 SQL 실행, 결과 조회를 다루는 표준 API입니다.
드라이버는 이 API의 요청을 특정 DB와의 실제 통신으로 연결합니다.

## 기본 구성

| 구성 | 역할 |
|---|---|
| JDBC API | Connection, PreparedStatement와 ResultSet 등의 사용 방법을 제공합니다. |
| JDBC 드라이버 | MySQL Connector/J나 MariaDB Connector/J처럼 DB별 통신을 구현합니다. |
| 직접 JDBC | SQL 실행과 파라미터 설정, 결과 매핑 및 자원 정리를 코드에서 다룹니다. |
| DataSource | 연결을 얻는 인터페이스입니다. 구현에 따라 커넥션 풀을 사용할 수 있습니다. |
| 커넥션 풀 | 연결을 관리하며 요청에 빌려주고 반환받습니다. DataSource 자체와 같은 뜻은 아닙니다. |

직접 JDBC를 이해하면 상위 기술이 어느 반복 작업을 대신 처리하는지 구분하기 쉽습니다.
연결을 얻는 것과 트랜잭션의 시작 및 종료를 결정하는 것도 별도 책임입니다.

## 이어서 읽기

- [Spring JDBC](/docs/knowledge/backend/spring/data-access/spring-jdbc)
- [Java 17 JDBC API](https://docs.oracle.com/en/java/javase/17/docs/api/java.sql/java/sql/package-summary.html)
