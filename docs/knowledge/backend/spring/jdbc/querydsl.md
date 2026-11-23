---
format: "md"
id: "spring-jdbc-querydsl"
title: "QueryDSL"
description: "Querydsl의 생성 Q 타입과 동적 JPQL 조건, DTO projection 및 코드 생성과 벌크 갱신의 제약을 설명합니다."
slug: "/knowledge/backend/spring/jdbc/querydsl"
sidebar_position: 7
status: "active"
tags:
  - "Spring"
keywords:
  - "QueryDSL"
  - "Spring"
  - "Spring JDBC"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "jOOQ"
---
# QueryDSL

Querydsl은 타입을 가진 Java 표현식으로 쿼리를 구성하는 도구입니다.
JPA 모듈에서는 엔티티를 기준으로 JPQL을 만들며, SQL 모듈과는 생성 타입과 실행 경로가 다릅니다.
이 글은 Jakarta Persistence를 사용하는 Querydsl JPA 구성의 개념을 설명합니다.
의존성 좌표와 annotation processor 조합은 선택한 배포판 버전에 맞춰 확인합니다.

## Q 타입이 필요한 이유

엔티티에서 생성한 Q 타입은 경로와 타입을 코드로 표현합니다.
속성 이름을 문자열로 반복하는 것보다 리팩터링과 컴파일 오류 탐지에 도움을 줍니다.
하지만 런타임 데이터 분포와 DB 인덱스의 적절성까지 검증하는 것은 아닙니다.

```java
QCatalog catalog = QCatalog.catalog;
BooleanBuilder conditions = new BooleanBuilder();
if (status != null) {
    conditions.and(catalog.status.eq(status));
}
if (keyword != null && !keyword.isBlank()) {
    conditions.and(catalog.name.contains(keyword));
}
List<String> names = queryFactory.select(catalog.name)
        .from(catalog)
        .where(conditions)
        .orderBy(catalog.id.asc())
        .limit(20)
        .fetch();
```

QCatalog, JPAQueryFactory와 엔티티 매핑이 준비된 부분 예제입니다.
서로 다른 조건이 없을 때 전체 데이터 조회가 허용되는지 결정합니다.
문자열 검색이 어떤 SQL과 인덱스 사용으로 이어지는지도 확인합니다.

## Specification과 선택 기준

| 기준 | Specification | Querydsl JPA |
|---|---|---|
| 조건 표현 | JPA Criteria API | 생성 경로와 fluent 표현식 |
| 주요 통합 | JpaSpecificationExecutor | 커스텀 Repository와 QueryFactory |
| 사전 생성 | 문자열 경로 사용 시 불필요 | 일반적으로 Q 타입 생성 |
| 조회 모양 | Repository 실행 API에 맞춤 | 선택 컬럼과 조인을 직접 구성 |

복잡한 조회에서 DTO projection을 사용하면 필요한 컬럼만 반환할 수 있습니다.
생성자 기반 projection은 인수 순서와 타입을 맞춰야 하며, QueryProjection은 DTO가 Querydsl에 의존하는 선택입니다.
프로젝트에서 조회 DTO의 의존성을 어디까지 허용할지 정합니다.

## 생성과 실행을 각각 확인합니다

IDE에는 Q 타입이 보이는데 CI에서 실패하면 clean build와 annotation processor 설정을 확인합니다.
생성 디렉터리와 Jakarta 호환 의존성의 조합을 맞추고 `javax`와 `jakarta` 타입을 섞지 않습니다.
Q 타입이 생성됐다는 사실만으로 실행 SQL이 올바르다고 판단하지 않습니다.

벌크 update와 delete는 JPA의 관리 객체 및 감사 콜백과 별도 경로입니다.
엔티티 변경과 같은 방식으로 version이 증가한다고 가정하지 않습니다.
실행 후 clear 또는 재조회가 필요한지 확인합니다.

테스트에서는 선택 조건 조합, join으로 늘어난 행, 정렬과 페이징의 안정성을 확인합니다.
같은 정렬값이 여러 개라면 ID 같은 보조 정렬을 둡니다.
쿼리 결과와 함께 실제 SQL, 실행 계획과 count 쿼리도 봅니다.

생성 및 JPA 사용 방식은 [Querydsl 공식 저장소](https://github.com/querydsl/querydsl)와 [JPA 참조 문서](https://github.com/querydsl/querydsl/blob/master/querydsl-docs/src/main/docbook/en-US/content/tutorials/jpa.xml)를 참고합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

