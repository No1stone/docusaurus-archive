---
format: "md"
id: "spring-jdbc-jpa-and-hibernate"
title: "JPA와 Hibernate"
description: "JPA와 Hibernate, 영속성 컨텍스트 및 flush와 commit의 차이, 지연 로딩과 벌크 갱신의 주의점을 설명합니다."
slug: "/knowledge/backend/spring/jdbc/jpa-and-hibernate"
sidebar_position: 5
status: "active"
tags:
  - "Spring"
keywords:
  - "JPA와 Hibernate"
  - "Spring"
  - "Spring JDBC"
  - "DataSource"
  - "JPA"
  - "Hibernate"
  - "MyBatis"
  - "Querydsl"
  - "jOOQ"
---
# JPA와 Hibernate

JPA는 객체와 관계형 데이터의 영속성 처리를 위한 표준 API이며, Hibernate는 대표적인 구현체입니다.
Spring Data JPA는 그 위에서 Repository 구현을 돕습니다.
세 이름을 같은 계층의 대체 제품으로 이해하면 설정과 오류 위치를 찾기 어렵습니다.

## 저장과 변경의 시간차

```mermaid
flowchart LR
    Load[엔티티 조회] --> Managed[영속성 컨텍스트에서 관리]
    Managed --> Change[객체 상태 변경]
    Change --> Flush[SQL 동기화]
    Flush --> Commit[DB 트랜잭션 커밋]
```

관리 중인 엔티티 변경은 dirty checking으로 SQL에 반영될 수 있습니다.
`flush()`는 변경을 DB와 동기화하지만 트랜잭션을 확정하지는 않습니다.
flush된 SQL도 이후 롤백되면 저장이 취소될 수 있습니다.
ID 생성 전략에 따라 insert가 예상보다 일찍 발생할 수도 있습니다.

```java
@Transactional
public void rename(Long id, String name) {
    Catalog entity = entityManager.find(Catalog.class, id);
    if (entity == null) throw new IllegalArgumentException("catalog not found");
    entity.rename(name);
}
```

`Catalog`는 예제 엔티티이며 `rename`의 구체적인 배치는 프로젝트 설계를 따릅니다.
JPA가 엔티티 안에 모든 업무 정책을 넣도록 강제하지는 않습니다.
영속성 동작과 도메인 정책의 위치는 다른 선택입니다.

## 엔티티 상태를 구분합니다

| 상태 | 의미 |
|---|---|
| 신규 | 아직 관리되지 않는 새 객체입니다. |
| 관리 | 영속성 컨텍스트가 식별자와 상태를 추적합니다. |
| 분리 | 이전에 관리됐지만 현재 컨텍스트 밖입니다. |
| 삭제 예정 | 삭제 작업이 등록된 상태입니다. |

같은 컨텍스트에서 같은 식별자를 조회하면 같은 관리 객체를 재사용할 수 있습니다.
이것이 모든 서버에서 공유되는 캐시라는 뜻은 아닙니다.
트랜잭션 종료와 EntityManager 수명은 OSIV 같은 구성에도 영향을 받습니다.

## 조회에서 자주 생기는 문제

지연 연관관계를 반복 접근하면 N+1 조회가 발생할 수 있습니다.
트랜잭션 밖에서 초기화되지 않은 연관을 읽으면 실패할 수 있고, OSIV가 켜져 있으면 응답 직렬화 중 SQL이 실행될 수도 있습니다.
조회 목적에 맞는 projection, fetch 계획과 DTO 변환 시점을 정합니다.
컬렉션 fetch join과 페이징을 무작정 결합하지 않습니다.

JPQL 벌크 갱신과 JDBC 쓰기는 관리 중 엔티티 상태와 자동으로 일치하지 않을 수 있습니다.
flush와 clear, 재조회 경계를 검토하고 같은 트랜잭션에서 오래된 객체를 읽지 않게 합니다.

검증에서는 객체 값뿐 아니라 실제 SQL 수, flush 시점과 별도 트랜잭션의 조회 결과를 확인합니다.
인메모리 DB만으로 운영 DB의 잠금과 SQL 문법을 검증했다고 보지는 않습니다.

명세는 [Jakarta Persistence](https://jakarta.ee/specifications/persistence/3.1/), 구현 동작은 [Hibernate ORM 6.6 사용자 안내](https://docs.jboss.org/hibernate/orm/6.6/userguide/html_single/Hibernate_User_Guide.html)를 참고합니다.

## 자주 묻는 질문

### JPA와 MyBatis 중 무엇을 고르나요?

도메인 중심 영속성과 연관 매핑이면 JPA, SQL 중심 제어면 MyBatis나 JDBC 계열이 맞는 경우가 많습니다.

### 커넥션 풀은 어디에 두나요?

DataSource 설정으로 풀을 두고, 타임아웃과 최대 연결 수를 트래픽에 맞게 맞춥니다.

