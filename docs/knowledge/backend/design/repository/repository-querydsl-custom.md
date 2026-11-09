---
id: repository-querydsl-custom
title: QueryDSL Custom 자리
description: Custom Impl과 JPAQueryFactory가 Spec을 넘어서는 시점을 정리합니다.
tags:
  - backend
  - querydsl
status: active
slug: "/knowledge/backend/repository/repository-querydsl-custom"
---

# QueryDSL JPA를 Custom Repository에서 사용하는 경우

HTTP 호출 이력 화면에 URL별 실패 건수와 마지막 발생 시각을 보여주려면, 개별 엔티티보다 집계 결과가 필요합니다.<br />
원셋에서는 이런 조회를 Custom Repository 메서드로 열고, 구현에서 `JPAQueryFactory`를 사용합니다.

```java
return queryFactory
    .select(item.url, item.id.count(), item.createdAt.max())
    .from(item)
    .where(item.responseHttpStatus.startsWith("4").or(item.responseHttpStatus.startsWith("5")))
    .groupBy(item.url)
    .fetch();
```

`item`은 엔티티에서 생성한 QueryDSL Q 타입입니다.<br />
실제 반환 계약에서는 `Tuple`에 담긴 URL, 건수, 시각을 읽기 모델로 바꿉니다.<br />
상위 유즈케이스는 그 결과를 받아 화면 응답을 조립할 수 있습니다.

## 기존 목록과 나누는 이유

URL과 기간에 따라 호출 이력을 그대로 읽는 화면은 Specification에서 처리합니다.<br />
집계 화면은 결과가 한 호출당 한 행에서 URL당 한 행으로 바뀝니다.<br />
메서드를 분리하면 어떤 단위로 반환하는지 코드에서 확인하기 쉽고, 각각 다른 정렬과 페이징을 적용할 수 있습니다.

집계 결과를 페이지로 반환한다면 총건수도 호출 이력 행 수가 아니라 그룹 수로 계산해야 합니다.<br />
SQL을 보고 집계 단위와 count 조건이 같은지 확인합니다.
[Custom Repository](/docs/knowledge/backend/repository/repository-custom) / [QueryDSL 동적 조건](/docs/knowledge/backend/repository/repository-querydsl-dynamic)

## 참고 자료

- [QueryDSL JPA 참조 문서](https://querydsl.com/static/querydsl/latest/reference/html/ch02.html)
