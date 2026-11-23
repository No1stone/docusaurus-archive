---
format: "md"
id: "spring-jdbc-spring-jdbc"
title: "Spring JDBC"
description: "JdbcTemplate과 NamedParameterJdbcTemplate 및 JdbcClient의 자원 처리, 매핑과 트랜잭션 참여를 설명합니다."
slug: "/knowledge/backend/spring/jdbc/spring-jdbc"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "Spring JDBC"
  - "Spring"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "Querydsl"
  - "jOOQ"
---
# Spring JDBC

Spring JDBC는 SQL을 직접 작성하면서 연결 정리와 예외 변환의 반복을 줄이는 도구입니다.
SQL 설계와 결과 매핑은 개발자가 결정하고, 자원 생명주기와 Spring 트랜잭션 연결은 프레임워크 도움을 받습니다.
ORM처럼 엔티티 변경을 자동 감지하는 도구는 아닙니다.

## 이름 있는 파라미터로 조회합니다

```java
@Repository
class CatalogJdbcRepository {
    private final NamedParameterJdbcTemplate jdbc;

    CatalogJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    List<CatalogItem> find(String status) {
        return jdbc.query("""
                select id, name from catalog
                where status = :status order by id
                """, Map.of("status", status),
                (rs, row) -> new CatalogItem(rs.getLong("id"), rs.getString("name")));
    }
}
```

`catalog` 테이블과 `CatalogItem(Long id, String name)` DTO를 가정한 부분 예제입니다.
사용자 입력은 바인딩하고, 정렬 열을 동적으로 선택한다면 허용된 열 이름에만 연결합니다.
RowMapper 안에서 다시 쿼리를 호출하면 행 수만큼 추가 조회가 생길 수 있습니다.

## 세 API의 관계

| API | 주요 특징 |
|---|---|
| JdbcTemplate | 위치 기반 인수와 콜백으로 SQL을 실행합니다. |
| NamedParameterJdbcTemplate | 이름 기반 인수와 목록 바인딩을 지원합니다. |
| JdbcClient | fluent API로 자주 쓰는 JDBC 실행을 간결하게 표현합니다. |

JdbcClient는 Framework 6.1에 추가됐고 Boot 3.2부터 자동 설정을 지원합니다.
모든 세부 기능이 하나의 API로 대체된 것은 아니며, 배치 등에는 기존 Template을 함께 사용할 수 있습니다.

```java
List<String> names = jdbcClient.sql(
        "select name from catalog where status = :status")
        .param("status", "ACTIVE")
        .query(String.class)
        .list();
```

## 예외와 결과 건수

`queryForObject` 계열은 기대한 단일 결과 수와 실제 결과 수가 다르면 예외를 던질 수 있습니다.
없음을 정상 흐름으로 처리할지, 유일해야 하는 데이터인지에 따라 API를 선택합니다.
SQL 오류는 Spring의 DataAccessException 계층으로 변환되지만 업무 오류 코드로 공개할지는 별도 결정입니다.

Template은 트랜잭션에 참여할 수 있지만 호출마다 큰 업무 묶음이 자동 생성되지는 않습니다.
여러 SQL이 함께 성공해야 한다면 상위의 명시적 트랜잭션 경계로 묶습니다.
이미지 업로드나 외부 API 성공까지 DB 롤백으로 되돌릴 수 있는 것도 아닙니다.

검증에서는 조회 없음, 두 행 이상, null 컬럼, 특수문자 인수와 실제 DB 타입을 확인합니다.
업데이트는 반환 건수를 확인해 대상 누락을 구분합니다.
대량 처리는 batchUpdate와 커밋 범위를 함께 검토하고, 메모리에 모든 결과를 모으는 조회는 별도 용량 제한을 둡니다.

API의 역할은 [Spring JDBC 공식 문서](https://docs.spring.io/spring-framework/reference/6.2/data-access/jdbc/core.html)를 참고합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

