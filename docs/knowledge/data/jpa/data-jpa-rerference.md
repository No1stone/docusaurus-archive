---
format: md
id: k-data-jpa-rerference
title: "DATA JPA Rerference"
description: "Spring Data JPA와 Querydsl을 함께 볼 때 참고하는 진입 메모입니다."
tags:
  - JPA
  - Spring
status: active
slug: /knowledge/k-data-jpa-rerference
---
# DATA JPA Rerference

## 개요

Spring Data JPA는 리포지토리 인터페이스로 CRUD·쿼리 메서드를 제공하고, 복잡한 동적 쿼리는 Querydsl 등과 조합합니다.
공식 레퍼런스의 preface·리포지토리 장부터 보고, Querydsl은 `JPAQueryFactory`로 타입 안전한 경로를 만듭니다.

팜프로(partner-gateway)와 부트베이스 api-auth는 같은 방식으로 팩토리 빈을 둡니다.

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

연관관계·매핑 세부는 [연관관계](./연관관계.md), 사용 메모는 [Spring Data JPA](./spring-data-jpa.md)를 봅니다.

<details>
<summary>참고 자료</summary>

- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#preface)
- [Querydsl Reference](https://querydsl.com/static/querydsl/latest/reference/html/)
- [Spring Data JPA + Querydsl (DZone)](https://dzone.com/articles/spring-data-jpa-querydsl-taking-best-from-both-wor)
</details>
