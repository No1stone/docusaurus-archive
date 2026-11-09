---
id: repository-querydsl-dynamic
title: QueryDSL 동적 쿼리
description: "화면에서 고른 선택 조건을 BooleanBuilder·BooleanExpression으로 동적 where에 조합하는 QueryDSL 패턴을 정리합니다."
tags:
  - backend
  - querydsl
status: active
slug: "/knowledge/backend/repository/repository-querydsl-dynamic"
---
# QueryDSL에서 화면의 선택 조건을 조합하기

호출 이력에서 메서드가 GET인 건을 보고 싶을 때도 있고, 기간만 지정해 장애 시간대를 확인하고 싶을 때도 있습니다.<br />
QueryDSL에서는 선택 조건을 명시적으로 추가해 하나의 조회를 구성할 수 있습니다.

```java
BooleanBuilder conditions = new BooleanBuilder();

if (filter.getHttpMethod() != null) {
    conditions.and(item.httpMethod.eq(filter.getHttpMethod()));
}
if (filter.getStartAt() != null) {
    conditions.and(item.createdAt.goe(filter.getStartAt()));
}
if (filter.getEndAt() != null) {
    conditions.and(item.createdAt.loe(filter.getEndAt()));
}
```

`item`은 호출 이력 엔티티의 Q 타입입니다.<br />
이 조건을 `where(conditions)`에 넘기고 정렬과 조회 범위를 지정합니다.<br />
아무 조건도 없는 요청에서 전량을 읽어도 되는지는 먼저 결정하고, 화면 조회라면 페이지 상한을 적용합니다.

## 조건이 늘어도 의미를 읽을 수 있게 구성합니다

검색어를 URL 또는 본문에서 찾되 기간은 필수로 적용한다면, URL과 본문의 OR 조건을 하나로 묶은 뒤 기간을 AND로 결합합니다.<br />
조건을 한 줄씩 추가하더라도 괄호의 범위가 달라지면 조회 대상이 달라집니다.<br />
테스트에는 URL만 일치하는 행, 본문만 일치하는 행, 기간 밖의 행을 각각 넣어 확인합니다.

원셋의 단순 목록에는 [Specification](/docs/knowledge/backend/repository/repository-spec-and-filter)을 사용합니다.<br />
조인과 DTO 반환까지 함께 조립해야 할 때는 [Custom Repository](/docs/knowledge/backend/repository/repository-querydsl-custom)에서 QueryDSL을 검토합니다.

## OR 그룹에 기간 조건을 빠뜨리지 않는 방법

검색어가 URL이나 요청 본문에 포함된 기록을 찾되, 최근 하루만 조회한다고 가정합니다.<br />
URL과 본문에 대한 OR 조건을 먼저 만든 뒤 기간을 AND로 결합합니다.

```java
BooleanExpression keywordMatches =
    item.url.contains(keyword).or(item.payload.contains(keyword));
conditions.and(keywordMatches);
conditions.and(item.createdAt.goe(from));
```

검색어와 시작 시각이 모두 들어온 경우의 예제입니다.<br />
기간 밖에 URL만 일치하는 행을 테스트 데이터에 넣으면 OR의 결합 범위가 어긋났는지 확인할 수 있습니다.

## 참고 자료

- [QueryDSL 동적 표현과 BooleanBuilder](https://querydsl.com/static/querydsl/latest/reference/html/ch03.html)
