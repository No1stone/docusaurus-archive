---
format: md
id: k-spring-data-jpa
title: "Spring DATA JPA"
description: "Spring Data JPA 학습 메모와 연결된 연관관계, 샤딩 등 참고 글 요약"
tags:
  - Spring
  - JPA
status: active
slug: /knowledge/k-spring-data-jpa
---
# Spring DATA JPA

## 개요

Spring Data JPA 학습 메모와 연결된 연관관계, 샤딩 등 참고 글 요약입니다.

> 공식 레퍼런스 전체를 대체하지 않습니다.
다음에 해당하는 내용을 찾아볼 때 이 페이지를 열었습니다.
- Auditing
- Spring Data JPA Reference
- 연관관계와 매핑
- Dynamic Query
- Hibernate를 통한 Select 동작
아래 두 링크는 위 주제군을 보강하는 글입니다.
Auditing이나 Dynamic Query 전용 튜토리얼은 아닙니다.
는 Spring Data JPA를 전제로 한 복습 노트입니다.
영속성 컨텍스트, `@Transactional`과 flush, 더티 체킹, 연관관계 매핑과 연관관계의 주인, N+1 등을 다룹니다.
엔티티를 수정한 뒤 트랜잭션이 커밋될 때 flush가 일어나 UPDATE가 나가는 흐름, `save`보다 더티 체킹을 선호하는 실무 관점 등이 정리되어 있습니다.

## Querydsl 설정

팜프로(partner-gateway)와 부트베이스 api-auth 모두 `JPAQueryFactory` 빈을 둡니다.

```java
@Configuration
public class QuerydslConfig {
    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
```

## 예제·코드

```java
class MultiDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DBContextHolder.getIp();
    }
}
```

<details>
<summary>참고 자료</summary>

- [JPA를 다시 공부하면서... 잡다한 정리](https://brunch.co.kr/@springboot/595) — 주말에 집에서 남는 시간에 작성하는 글... JPA를 다시 공부하면서... 이 글은, 필자가 오랫동안 사용하지 않아서 다 까먹었던 JPA 를 다시 공부하면서 느낀 점을 정리한 글이다. 노트에 정리한 내용을 대충 정리해서 빠르게 공유해본다. 글이 많이 지루하고, 중복 내용이 많으니.. 필요한 주제만 찾아서 읽기를 바란
- [Spring - 샤딩 모듈 개발 이야기](https://jaehoney.tistory.com/180) — 동적 데이터 소스와 스키마 이름API를 개발할 때 Java Spring으로 프로젝트를 진행하고 싶었는데 어려움이 있었다.해당 문제를 해결하고 세미나에서 발표한 내용에 대해 정리한다.모든 아키텍처나 코드는 실제 서비스와 무관하며 설명을 위해 만든 부분임을 알린다.API를 Java Spring으로 할 수 없었던 이유는 서비스
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)
</details>
