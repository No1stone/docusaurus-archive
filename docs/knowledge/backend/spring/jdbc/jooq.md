---
format: "md"
id: "spring-jdbc-jooq"
title: "jOOQ"
description: "jOOQ의 스키마 기반 코드 생성과 SQL DSL, Spring 통합 및 ORM과 함께 쓸 때의 경계를 설명합니다."
slug: "/knowledge/backend/spring/jdbc/jooq"
sidebar_position: 8
status: "active"
tags:
  - "Spring"
keywords:
  - "jOOQ"
  - "Spring"
  - "Spring JDBC"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "Querydsl"
---
# jOOQ

jOOQ는 SQL을 Java 코드로 구성하고 실행하는 도구입니다.
스키마에서 생성한 테이블과 컬럼 타입을 사용하면 SQL 구조를 컴파일 단계에서 일부 확인할 수 있습니다.
JPA처럼 관리 객체의 변경을 자동 감지하는 모델과는 목적이 다릅니다.

## SQL 구조를 코드로 표현합니다

```java
List<CatalogItem> items = dsl.select(CATALOG.ID, CATALOG.NAME)
        .from(CATALOG)
        .where(CATALOG.STATUS.eq("ACTIVE"))
        .orderBy(CATALOG.ID.asc())
        .limit(20)
        .fetch(record -> new CatalogItem(
                record.get(CATALOG.ID), record.get(CATALOG.NAME)));
```

`DSLContext`, 생성한 CATALOG 타입과 DTO가 있는 부분 예제입니다.
생성 타입의 이름과 컬럼 Java 타입은 프로젝트의 코드 생성 설정에 따라 달라집니다.
SQL의 join, 집계와 윈도 함수 같은 구조를 직접 드러내고 싶을 때 검토할 수 있습니다.

## 코드 생성도 빌드의 일부입니다

```mermaid
flowchart LR
    Schema[스키마 또는 마이그레이션] --> Generate[코드 생성]
    Generate --> Types[테이블과 컬럼 타입]
    Types --> Compile[조회 코드 컴파일]
    Compile --> Runtime[실제 DB 실행]
```

개발 DB에 수동으로 만든 컬럼을 기준으로 생성하면 다른 환경에서 재현되지 않을 수 있습니다.
마이그레이션과 생성 시점을 연결하고, CI가 동일한 스키마를 사용할 수 있게 구성합니다.
생성 성공은 운영 DB와 스키마가 같다는 보장은 아닙니다.

| 확인 항목 | 이유 |
|---|---|
| DB 방언 | 생성되는 SQL과 지원 문법이 달라집니다. |
| jOOQ 버전과 JDK | 실행 및 생성 도구 요구사항을 맞춥니다. |
| 에디션과 라이선스 | DB 및 버전별 지원 범위가 다릅니다. |
| nullable 컬럼 | Java 타입만으로 모든 null 처리가 강제되지는 않습니다. |

## Spring과 JPA를 함께 쓸 때

Boot의 jOOQ 자동 설정으로 DataSource와 DSLContext를 연결할 수 있습니다.
사용자 설정을 직접 만들면 Spring 관리 트랜잭션에 참여하는 연결 경로인지 확인합니다.
JPA와 같은 DB를 사용한다는 이유만으로 트랜잭션 매니저 조합이 자동으로 맞는 것은 아닙니다.

jOOQ로 데이터를 갱신해도 이미 로딩한 JPA 엔티티의 값은 자동으로 새로워지지 않을 수 있습니다.
JPA 쓰기 뒤 jOOQ 조회를 한다면 flush 시점도 확인합니다.
쓰기와 조회 기술을 나누는 것은 가능하지만 영속성 컨텍스트 경계까지 설계해야 합니다.

검증에서는 생성 코드의 clean build와 실제 DB 실행을 분리합니다.
정렬, 집계의 null, 시간대와 DB 함수는 운영 계열 DB에서 확인합니다.
조회 결과가 맞아도 실행 계획이 비효율적일 수 있으므로 대표 데이터로 SQL을 확인합니다.

코드 생성 목적은 [jOOQ 공식 안내](https://www.jooq.org/doc/latest/manual/getting-started/use-cases/jooq-as-a-sql-builder-with-code-generation/), Boot 통합은 [SQL 데이터 접근](https://docs.spring.io/spring-boot/3.5/reference/data/sql.html)을 참고합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

