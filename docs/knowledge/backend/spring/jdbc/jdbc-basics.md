---
format: "md"
id: "spring-jdbc-jdbc-basics"
title: "JDBC 기본"
description: "JDBC의 연결, SQL 실행, 결과 매핑과 자원 정리를 설명하고 Spring 트랜잭션과 직접 연결 사용의 차이를 비교합니다."
slug: "/knowledge/backend/spring/jdbc/jdbc-basics"
sidebar_position: 1
status: "active"
tags:
  - "Spring"
keywords:
  - "JDBC 기본"
  - "Spring"
  - "Spring JDBC"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "Querydsl"
  - "jOOQ"
---
# JDBC 기본

JDBC는 Java에서 관계형 데이터베이스와 통신하는 표준 API입니다.
JPA나 MyBatis를 사용해도 전통적인 관계형 DB 접근 경로의 아래에는 JDBC 드라이버와 연결이 있는 경우가 많습니다.
직접 JDBC 코드를 읽어 보면 상위 도구가 어떤 반복 작업을 대신하는지 이해하기 쉽습니다.

## 실행의 최소 단위

아래 코드는 `catalog(id, name)` 테이블과 DataSource가 존재하는 경우의 조회 예제입니다.
직접 연결을 빌리는 JDBC 동작을 보여 주며 Spring 선언적 트랜잭션 참여 예제는 아닙니다.

```java
String sql = "select name from catalog where id = ?";
try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setLong(1, id);
    try (ResultSet result = statement.executeQuery()) {
        if (result.next()) {
            return Optional.ofNullable(result.getString("name"));
        }
        return Optional.empty();
    }
}
```

PreparedStatement는 값을 SQL 문자열과 분리해 전달합니다.
테이블명이나 정렬 방향처럼 SQL 구조에 해당하는 부분은 `?`로 대체할 수 없으므로 허용 목록을 사용합니다.
값 바인딩을 사용한다고 임의 문자열로 만든 SQL 구조까지 안전해지는 것은 아닙니다.

## 자원의 소유자를 정합니다

| 자원 | 역할 | 정리 시점 |
|---|---|---|
| Connection | DB 세션과 실행 통로 | 사용 범위 종료 |
| PreparedStatement | SQL과 파라미터 | 실행 묶음 종료 |
| ResultSet | 조회 커서 | 결과 소비 종료 |

풀에서 빌린 Connection의 `close()`는 일반적으로 물리 연결 제거가 아니라 풀 반환입니다.
하지만 열린 트랜잭션과 세션 설정이 어떻게 초기화되는지는 풀과 드라이버 정책을 확인해야 합니다.
임시 테이블, 세션 변수와 자동 커밋 설정을 다음 요청에 남기지 않도록 관리합니다.

## 직접 커밋과 Spring 트랜잭션

직접 JDBC를 관리한다면 autoCommit, commit, rollback과 예외 시 복구를 처리해야 합니다.
Spring이 관리하는 트랜잭션 안에서 다시 임의의 연결을 빌리면 같은 트랜잭션에 참여하지 않을 수 있습니다.
Spring 환경에서는 JdbcTemplate이나 DataSourceUtils 등 관리된 연결 경로를 사용합니다.

조회가 느릴 때는 SQL 실행 시간과 연결을 빌리는 대기 시간을 나눠 봅니다.
실행 전부터 오래 기다렸다면 쿼리 인덱스만 고쳐도 해결되지 않을 수 있습니다.
타임아웃 역시 연결, 풀 대기와 SQL 실행이 각각 다릅니다.

확인은 값에 따옴표가 들어간 입력, 조회 결과 없음, 여러 행과 실행 예외를 포함합니다.
의도적으로 작은 풀에서 반복 호출해 자원 누수가 없는지도 확인할 수 있습니다.
운영 데이터로 임의의 장애 실험을 하지 않습니다.

API 기준은 [Java 17 java.sql 문서](https://docs.oracle.com/en/java/javase/17/docs/api/java.sql/java/sql/package-summary.html), Spring 참여 방식은 [연결 관리](https://docs.spring.io/spring-framework/reference/6.2/data-access/jdbc/connections.html)를 참고합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

