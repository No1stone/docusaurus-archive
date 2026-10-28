---
format: "md"
id: "mysql-joins-and-aggregation"
title: "MySQL JOIN과 집계 쿼리"
description: "INNER JOIN, LEFT JOIN과 EXISTS를 비교하고 일대다 조인에서 합계가 중복되는 문제를 예제 SQL로 확인합니다."
sidebar_label: "JOIN과 집계 쿼리"
slug: "/knowledge/data/mysql/query/joins-and-aggregation"
sidebar_position: 1
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL JOIN"
  - "LEFT JOIN WHERE 차이"
  - "GROUP BY EXISTS"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/join.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/exists-and-not-exists-subqueries.html"
---
# MySQL JOIN과 집계 쿼리

JOIN은 관계 키로 행을 연결합니다.
문법보다 먼저 결과 한 행이 회원 한 명인지, 주문 한 건인지, 주문 항목 한 건인지 정해야 합니다.
아래 예제는 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 사용합니다.

이 글의 기준 자료는 [JOIN의 공식 구문과 외부 조인 동작](https://dev.mysql.com/doc/refman/8.0/en/join.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## INNER JOIN과 LEFT JOIN은 어떻게 다른가요?

```sql
SELECT o.id, m.name, o.amount
FROM orders AS o
JOIN member AS m ON m.id = o.member_id
WHERE o.status = 'READY'
ORDER BY o.id;

SELECT m.id, m.name, o.id AS order_id
FROM member AS m
LEFT JOIN orders AS o
  ON o.member_id = m.id AND o.status = 'PAID'
ORDER BY m.id, o.id;
```

첫 쿼리는 READY 주문 101과 103을 조회합니다.
두 번째 쿼리는 결제된 주문이 없는 회원도 남깁니다.
상태 조건을 WHERE의 `o.status = 'PAID'`로 옮기면 NULL로 확장된 행이 제외되어 의미가 달라집니다.

## 일대다 JOIN에서 SUM 결과가 중복되는 이유

주문 101에는 항목이 두 개이므로 orders와 order_item을 조인하면 주문 금액 30000도 두 행에 반복됩니다.
이 상태로 `SUM(o.amount)`를 계산하면 금액이 중복 집계됩니다.
항목 금액을 먼저 주문별로 집계한 뒤 연결하는 방법을 사용할 수 있습니다.

```sql
SELECT o.id, o.amount, x.item_total
FROM orders AS o
LEFT JOIN (
  SELECT order_id, SUM(quantity * unit_price) AS item_total
  FROM order_item
  GROUP BY order_id
) AS x ON x.order_id = o.id
ORDER BY o.id;
```

주문 101의 항목 합계는 30000입니다.
항목이 없는 104의 item_total은 NULL이며, 이를 0으로 표시할지는 화면 요구에 따라 COALESCE로 처리합니다.

## JOIN 대신 EXISTS를 사용하는 경우

```sql
SELECT m.id, m.name
FROM member AS m
WHERE EXISTS (
  SELECT 1 FROM orders AS o
  WHERE o.member_id = m.id AND o.status = 'PAID'
);
```

초기 데이터에서는 회원 1만 조회됩니다.
주문 개수만큼 회원을 중복 출력할 필요가 없는 조회입니다.
EXISTS가 항상 JOIN보다 빠르다는 뜻은 아니며 실제 계획을 확인합니다.

## 그룹별 집계 조건

```sql
SELECT member_id, COUNT(*) AS order_count, SUM(amount) AS total_amount
FROM orders
WHERE status IN ('READY', 'PAID')
GROUP BY member_id
HAVING SUM(amount) >= 10000;
```

WHERE는 집계 전 행을, HAVING은 집계 결과를 제한합니다.
위 조건은 회원 1의 42000을 반환합니다.
ONLY_FULL_GROUP_BY를 끄기보다 선택 컬럼이 집계 기준과 맞는지 먼저 확인합니다.

## 이어서 읽기

- [MySQL 인덱스와 실행 계획 읽기](/docs/knowledge/k-mysql-optimization)
- [MySQL 페이지 조회와 대량 데이터 읽기](/docs/knowledge/data/mysql/query/pagination)

<details>
<summary>공식 참고 자료</summary>

- [JOIN](https://dev.mysql.com/doc/refman/8.0/en/join.html)
- [GROUP BY](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html)
- [EXISTS](https://dev.mysql.com/doc/refman/8.0/en/exists-and-not-exists-subqueries.html)

</details>
