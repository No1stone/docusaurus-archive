---
format: "md"
id: "spring-jdbc-spring-data-jpa"
title: "Spring Data JPA"
description: "Repository 프록시, save의 신규 판정, Specification과 Example 및 Auditing의 적용 경계를 설명합니다."
slug: "/knowledge/backend/spring/jdbc/spring-data-jpa"
sidebar_position: 6
status: "active"
tags:
  - "Spring"
keywords:
  - "Spring Data JPA"
  - "Spring"
  - "Spring JDBC"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "Querydsl"
  - "jOOQ"
---
# Spring Data JPA

Spring Data JPA는 Repository 인터페이스를 바탕으로 공통 데이터 접근 구현을 제공합니다.
인터페이스의 메서드를 선언하면 프록시가 기본 구현이나 쿼리에 연결합니다.
그러나 업무 트랜잭션과 조회 성능까지 자동으로 설계되는 것은 아닙니다.

## Repository와 조회 조건

```java
public interface CatalogRepository extends JpaRepository<Catalog, Long>,
        JpaSpecificationExecutor<Catalog> {
    List<Catalog> findByStatus(String status);
}
```

```java
Specification<Catalog> active = (root, query, cb) ->
        cb.equal(root.get("status"), "ACTIVE");
boolean exists = repository.exists(active);
```

이 예제의 status는 문자열 필드라고 가정합니다.
enum이나 Converter가 적용된 필드라면 엔티티 속성 타입과 맞는 값을 사용합니다.
Specification은 Criteria 조건을 조합하고, Example은 probe와 matcher로 예시 객체 조건을 표현합니다.
존재만 필요할 때는 count 전체를 구하기보다 exists API를 사용합니다.

| 방법 | 적합한 상황 | 확인할 부분 |
|---|---|---|
| 파생 쿼리 메서드 | 고정된 간단한 조건 | 메서드 이름 길이와 조합 수 |
| Specification | 선택 조건을 조합하는 검색 | join 중복, count와 fetch |
| Example | 객체 값 기반 단순 검색 | null, 기본 primitive 값과 matcher |
| 명시적 Query | 고정 JPQL 또는 SQL | 파라미터와 DB 의존성 |

## save는 항상 insert가 아닙니다

Spring Data JPA는 새 엔티티 판정에 따라 persist 또는 merge를 선택합니다.
기본적으로 wrapper 타입 version과 ID 상태 등을 살펴봅니다.
애플리케이션에서 UUID를 미리 넣었다면 ID가 존재한다는 이유로 신규 판정이 달라질 수 있습니다.
필요하면 Persistable 등으로 생명주기와 신규 상태를 명시하되 실제 SQL을 검증합니다.

merge는 전달한 분리 객체 자체를 관리 상태로 바꾸는 것과 다릅니다.
반환되는 관리 객체를 사용하는 의미를 확인합니다.
관리 엔티티 변경은 별도 save 없이 반영될 수 있지만, 상위 트랜잭션과 flush 조건을 전제로 합니다.

## Auditing과 Version은 별개입니다

Legacy의 [Auditing 코드](/docs/knowledge/k-auditing)는 생성과 수정 정보를 공통 상위 타입에 모은 예제입니다.
현재 Boot 3에서는 `javax.persistence` 대신 `jakarta.persistence`를 사용합니다.
`@CreatedBy`는 AuditorAware가 제공한 신원을 사용하며, 외부 요청의 사용자 ID 헤더를 검증 없이 신뢰하지 않습니다.

생성 감사, 수정 감사와 `@Version`을 어떤 상속 구조에 둘지는 프로젝트 규칙입니다.
감사 애너테이션만 붙였다고 낙관적 잠금이 생기지는 않습니다.
벌크 JPQL이나 직접 SQL은 엔티티 콜백과 버전 처리 경로를 우회할 수 있으므로 별도 정책이 필요합니다.

조회 테스트는 조건 조합, 없음, 다중 결과와 페이징을 확인합니다.
저장 테스트는 insert와 update, version 충돌, 감사값과 실제 커밋 후 결과를 확인합니다.

기본 저장은 [Persisting Entities](https://docs.spring.io/spring-data/jpa/reference/3.5/jpa/entity-persistence.html), 조건은 [Specifications](https://docs.spring.io/spring-data/jpa/reference/3.5/jpa/specifications.html), 감사는 [Auditing](https://docs.spring.io/spring-data/jpa/reference/3.5/auditing.html)을 참고합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

