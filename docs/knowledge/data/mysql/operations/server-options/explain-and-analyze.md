---
format: md
id: mysql-server-options-explain-and-analyze
title: "MySQL과 MariaDB에서 예상 실행 계획과 실제 실행 결과 비교하기"
sidebar_label: "EXPLAIN과 ANALYZE"
description: "EXPLAIN으로 옵티마이저 계획을 보고, MySQL EXPLAIN ANALYZE와 MariaDB ANALYZE FORMAT=JSON으로 실제 실행 통계를 비교하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/explain-and-analyze
sidebar_position: 15
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "EXPLAIN"
  - "EXPLAIN ANALYZE"
  - "ANALYZE FORMAT=JSON"
  - "실행 계획"
  - "r_rows"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/explain.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/analyze-format-json"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/analyze-statement"
  - "https://dev.mysql.com/doc/refman/8.4/en/order-by-optimization.html"
  - "https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/optimization-and-indexes/compound-composite-indexes"
---

# MySQL과 MariaDB에서 예상 실행 계획과 실제 실행 결과 비교하기

`performance_schema`에서 누적 실행 시간이 큰 SQL을 찾았다면, 다음은 그 SQL이 **어디에서 행을 많이 읽고 시간을 쓰는지** 확인할 차례입니다.
`EXPLAIN`으로 옵티마이저가 세운 계획을 보고, MySQL의 `EXPLAIN ANALYZE`나 MariaDB의 `ANALYZE FORMAT=JSON`으로 실제 실행 결과를 비교합니다.

## 같은 SQL에 예상 계획과 실제 실행 통계 붙이기

특정 고객의 주문 중 최근 `PAID` 상태인 주문을 최대 20건 가져오는 쿼리입니다.
두 명령에 같은 조건을 넣으면 예상했던 행 수와 실제 처리한 행 수를 비교할 수 있습니다.
[MySQL `EXPLAIN`](https://dev.mysql.com/doc/refman/8.4/en/explain.html), [MariaDB `ANALYZE FORMAT=JSON`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/analyze-format-json)

```sql
-- MySQL과 MariaDB에서 예상 실행 계획 확인
EXPLAIN FORMAT=JSON
SELECT id, status, created_at
FROM orders
WHERE customer_id = 10
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;

-- MySQL 8.4에서 실제 실행 통계 확인
EXPLAIN ANALYZE
SELECT id, status, created_at
FROM orders
WHERE customer_id = 10
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;

-- MariaDB에서 실제 실행 통계 확인
ANALYZE FORMAT=JSON
SELECT id, status, created_at
FROM orders
WHERE customer_id = 10
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;
```

실행 통계를 붙이는 명령은 SQL을 **실제로 실행**합니다.
예제는 조회로 한정합니다.
MariaDB에서 `ANALYZE` 뒤에 `UPDATE`나 `DELETE`를 붙이면 데이터도 변경됩니다.
[MySQL `EXPLAIN ANALYZE`](https://dev.mysql.com/doc/refman/8.4/en/explain.html), [MariaDB `ANALYZE`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/analyze-statement)

## 결과에서 볼 세 가지

| 확인할 항목 | MySQL 8.4 | MariaDB |
|---|---|---|
| 행 수 | 계획의 예상 `rows`와 실행 단계가 실제로 반환한 `rows` | 테이블 접근의 예상 `rows`와 실제 반복당 평균 읽기 행 수 `r_rows` |
| 반복 횟수 | `loops` | `r_loops` |
| 실행 시간 | `actual time`의 첫 행과 마지막 행까지 걸린 시간, 반복 시 회당 평균 | `r_total_time_ms`의 단계별 총 실행 시간 |

예를 들어 조인의 안쪽 단계가 **한 번에 5행씩 2,000회** 반복됐다면, 그 단계가 다룬 행은 약 1만 건입니다.
한 번의 처리량만 보면 작아도, 바깥쪽 조인에서 얼마나 자주 호출되는지에 따라 전체 비용이 커집니다.
실행 단계의 시간에는 하위 단계의 시간이 포함될 수 있으므로, 부모와 자식의 시간을 단순히 더하면 중복 집계됩니다.
[MySQL 실행 단계별 통계](https://dev.mysql.com/doc/refman/8.4/en/explain.html), [MariaDB 실행 통계 항목](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/analyze-format-json)

## 20건을 반환하는데 왜 오래 걸릴까?

`LIMIT 20`은 **최종 반환 행 수**를 제한합니다.
실행 계획에 따라 DB는 20건을 고르기 전에 더 많은 행을 읽고, `status`를 필터링하거나 `created_at`으로 정렬할 수 있습니다.

위 쿼리에서는 **주문을 읽는 단계에서 몇 행을 처리했는지**, **정렬 단계가 따로 생겼는지**를 먼저 봅니다.
읽는 행이 많고 별도 정렬도 발생한다면 `(customer_id, status, created_at)` 복합 인덱스를 후보로 검토할 수 있습니다.
인덱스 적용 전후에 같은 조건으로 실행해 **읽는 행 수와 정렬 단계가 실제로 줄었는지** 비교합니다.
[MySQL `ORDER BY` 최적화](https://dev.mysql.com/doc/refman/8.4/en/order-by-optimization.html), [MariaDB 복합 인덱스](https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/optimization-and-indexes/compound-composite-indexes)
