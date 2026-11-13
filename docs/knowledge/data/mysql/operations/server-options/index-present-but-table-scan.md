---
format: md
id: mysql-server-options-index-present-but-table-scan
title: "MySQL과 MariaDB에서 인덱스가 있는데도 테이블을 스캔하는 이유"
sidebar_label: "인덱스와 테이블 스캔"
description: "인덱스가 후보에 있어도 선택도가 낮으면 옵티마이저가 type=ALL 전체 스캔을 고를 수 있는 이유와 EXPLAIN으로 후보와 실제 선택을 구분하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/index-present-but-table-scan
sidebar_position: 16
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "type = ALL"
  - "possible_keys"
  - "테이블 스캔"
  - "인덱스 선택도"
  - "MySQL 인덱스가 있어도 풀스캔"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/table-scan-avoidance.html"
  - "https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/optimization-and-indexes/building-the-best-index-for-a-given-select"
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/explain-output.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/explain"
  - "https://dev.mysql.com/doc/refman/8.4/en/multiple-column-indexes.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/order-by-optimization.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/analyze-table.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/table-statements/analyze-table"
---

# MySQL과 MariaDB에서 인덱스가 있는데도 테이블을 스캔하는 이유

`orders.status`에 인덱스가 있는데 `EXPLAIN`에서 `type = ALL`이 나올 때가 있습니다.
인덱스를 사용할 수 있는 조건이어도, 조건에 맞는 행이 많으면 옵티마이저는 테이블 전체를 읽는 쪽의 비용이 더 낮다고 판단할 수 있습니다.
작은 테이블에서도 같은 선택이 나올 수 있습니다.
[MySQL 테이블 스캔과 인덱스 선택](https://dev.mysql.com/doc/refman/8.4/en/table-scan-avoidance.html), [MariaDB 인덱스 설계 가이드](https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/optimization-and-indexes/building-the-best-index-for-a-given-select)

## 같은 인덱스에서 조건값만 바꿔 보기

주문이 10만 건이고, `ACTIVE`가 99,000건, `CANCELLED`가 1,000건이라고 가정합니다.
`status`에 보조 인덱스가 있어도 두 조건이 읽어야 할 행 수는 크게 다릅니다.

```sql
-- status 인덱스가 없는 테스트 테이블에서 한 번 실행
CREATE INDEX idx_orders_status ON orders (status);

-- 실제 상태 분포 확인
SELECT status, COUNT(*) AS order_count
FROM orders
GROUP BY status;

-- 대부분의 행에 해당하는 조건
EXPLAIN
SELECT id, customer_id, created_at
FROM orders
WHERE status = 'ACTIVE';

-- 일부 행에 해당하는 조건
EXPLAIN
SELECT id, customer_id, created_at
FROM orders
WHERE status = 'CANCELLED';
```

이 쿼리는 `status` 인덱스에 없는 `customer_id`와 `created_at`도 읽습니다.
InnoDB가 보조 인덱스를 사용하면, 조건에 맞는 인덱스 항목에서 PK를 얻고 그 PK로 실제 주문 행을 찾아갑니다.
`ACTIVE`가 대부분이라면 이 과정이 수많은 행에서 반복됩니다.
`CANCELLED`처럼 일치하는 행이 적으면 같은 인덱스에서 필요한 행만 찾아가는 편이 유리할 수 있습니다.
실제 선택은 데이터 분포, 통계, 조회 컬럼에 따라 달라집니다.
[MySQL InnoDB 클러스터드 인덱스와 보조 인덱스](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html)

## `EXPLAIN`에서 후보와 실제 선택 구분하기

| 항목 | 읽는 방법 |
|---|---|
| `possible_keys` | 옵티마이저가 행을 찾는 데 사용할 수 있다고 본 인덱스 후보 |
| `key` | 실제 계획에서 선택한 인덱스 |
| `type` | 테이블에 접근하는 방식. `ALL`은 전체 테이블 스캔 |
| `rows` | 옵티마이저가 검사할 것으로 추정한 행 수 |

`possible_keys`에 `idx_orders_status`가 있고 `key`가 `NULL`, `type`이 `ALL`이라면 인덱스 후보가 있었고 실행 계획은 전체 스캔을 선택한 것입니다.
`rows`는 추정치이므로 실제 처리량은 MySQL의 `EXPLAIN ANALYZE`나 MariaDB의 `ANALYZE FORMAT=JSON`으로 확인합니다.
[MySQL `EXPLAIN` 출력 항목](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html), [MariaDB `EXPLAIN`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/explain)

## 상태 인덱스는 언제 도움이 될까?

**카디널리티는 서로 다른 값이 얼마나 많은지**, **이 예제에서 중요한 선택도는 특정 조건에 전체 행 중 얼마나 많이 일치하는지**를 보여 줍니다.
`status`에 값이 두 종류뿐이어도, 드문 상태만 찾는 쿼리에서는 인덱스가 유용할 수 있습니다.

실제 화면이 전체 주문을 상태로 검색하는 대신 **특정 고객의 최근 활성 주문**을 읽는다면, `customer_id`와 날짜 조건까지 포함해 판단합니다.
이 경우 `(customer_id, status, created_at)`을 후보로 두고, 같은 조회에서 읽는 행 수와 별도 정렬 여부를 비교할 수 있습니다.
[MySQL 복합 인덱스](https://dev.mysql.com/doc/refman/8.4/en/multiple-column-indexes.html), [MySQL `ORDER BY` 최적화](https://dev.mysql.com/doc/refman/8.4/en/order-by-optimization.html)

대량 적재나 갱신 이후 예상 행 수와 실제 행 수가 크게 벌어졌다면, `ANALYZE TABLE`로 통계를 갱신한 뒤 실행 계획이 어떻게 바뀌는지 확인합니다.
같은 인덱스에서도 **어떤 값으로, 어느 범위의 행을, 어떤 컬럼까지 읽는지**에 따라 비용이 달라집니다.
[MySQL `ANALYZE TABLE`](https://dev.mysql.com/doc/refman/8.4/en/analyze-table.html), [MariaDB `ANALYZE TABLE`](https://mariadb.com/docs/server/reference/sql-statements/table-statements/analyze-table)
