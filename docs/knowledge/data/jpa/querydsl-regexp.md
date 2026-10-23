---
format: md
id: k-querydsl-regexp
title: "Querydsl regexp"
description: "Querydsl에서 정규식·문자열 조건으로 검색할 때 참고하는 메모입니다."
tags:
  - JPA
status: active
slug: /knowledge/k-querydsl-regexp
---
# Querydsl regexp

## 개요

Querydsl로 LIKE보다 복잡한 문자열 매칭이 필요하면 DB 함수·정규식 표현을 경로에 붙입니다.
방언(MySQL `REGEXP`, PostgreSQL `~` 등)마다 연산이 달라서, 사용하는 DB에 맞는 템플릿·`Expressions`를 고릅니다.
공통으로 `JPAQueryFactory` 빈을 주입해 쿼리를 작성합니다.

```java
@Bean
public JPAQueryFactory jpaQueryFactory(EntityManager entityManager) {
    return new JPAQueryFactory(entityManager);
}
```

인덱스·콜레이션에 따라 정규식은 풀스캔이 되기 쉬워, 필터를 좁힌 뒤 쓰거나 전용 검색 엔진을 검토합니다.

<details>
<summary>참고 자료</summary>

- [Querydsl Reference](https://querydsl.com/static/querydsl/latest/reference/html/)
</details>
