---
format: md
id: mysql-server-options-functions-and-type-conversion-indexes
title: "MySQL과 MariaDB에서 함수와 타입 변환이 인덱스에 미치는 영향"
sidebar_label: "함수와 타입 변환"
description: "DATE() 조건을 범위로 바꾸는 방법과 VARCHAR 코드의 암시적 타입 변환이 인덱스 사용에 미치는 영향을 EXPLAIN 기준으로 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/functions-and-type-conversion-indexes
sidebar_position: 18
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "DATE()"
  - "암시적 타입 변환"
  - "범위 조건"
  - "sargable"
  - "MySQL 함수와 인덱스"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/range-optimization.html"
  - "https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/query-optimizations/sargable-date-and-year"
  - "https://dev.mysql.com/doc/refman/8.4/en/type-conversion.html"
  - "https://mariadb.com/docs/server/reference/sql-functions/string-functions/type-conversion"
  - "https://dev.mysql.com/doc/refman/8.4/en/explain-output.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/explain"
---

# MySQL과 MariaDB에서 함수와 타입 변환이 인덱스에 미치는 영향

`created_at`에 인덱스를 만들었는데 `WHERE DATE(created_at) = '2026-11-13'` 조회가 느릴 때가 있습니다.
SQL이 비교하는 값은 `created_at`에서 날짜를 추출한 결과이고, 인덱스에는 원래 날짜와 시각이 들어 있습니다.
옵티마이저가 이 조건을 원본 값의 범위로 바꿀 수 있는지는 제품과 버전에 따라 달라집니다.

## `DATE()` 조건을 시작 시각과 종료 시각으로 표현하기

`created_at`이 `DATETIME(6)`이고 인덱스가 있다고 가정합니다.
아래 두 쿼리는 같은 날짜의 주문을 조회합니다.
`EXPLAIN`을 붙여 인덱스 선택과 예상 검사 행 수를 비교할 수 있습니다.

```sql
EXPLAIN
SELECT id, status, created_at
FROM orders
WHERE DATE(created_at) = '2026-11-13';

EXPLAIN
SELECT id, status, created_at
FROM orders
WHERE created_at >= '2026-11-13 00:00:00'
  AND created_at <  '2026-11-14 00:00:00';
```

범위 조건은 **당일 자정부터 다음 날 자정 직전까지**를 뜻합니다.
상한을 `23:59:59`로 두면 `23:59:59.123456`처럼 소수 초가 있는 행을 놓칠 수 있습니다.
다음 날 자정을 `<`로 비교하면 소수 초 자릿수와 관계없이 하루 전체가 포함됩니다.

MariaDB 11.1부터는 인덱스가 있는 날짜 컬럼에 대한 일부 `DATE()`와 `YEAR()` 비교를 옵티마이저가 범위 조건으로 변환할 수 있습니다.
그래서 MariaDB에서는 위 두 쿼리의 실행 계획이 같을 수 있습니다.
범위 조건을 직접 쓰면 조회의 시작과 끝이 SQL에 드러나고, 제품이나 버전을 바꿔도 같은 형태를 유지할 수 있습니다.
[MySQL 범위 최적화](https://dev.mysql.com/doc/refman/8.4/en/range-optimization.html), [MariaDB `DATE()`와 `YEAR()` 조건 최적화](https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/query-optimizations/sargable-date-and-year)

## 숫자처럼 보이는 코드도 컬럼 타입에 맞춰 비교하기

주문 코드가 `VARCHAR`이고 인덱스가 있다면, 조회 파라미터도 문자열로 전달합니다.

```sql
-- 숫자와 비교하면서 암시적 타입 변환이 발생할 수 있음
EXPLAIN
SELECT id, order_code
FROM orders
WHERE order_code = 123;

-- 문자열 컬럼을 문자열과 비교
EXPLAIN
SELECT id, order_code
FROM orders
WHERE order_code = '00123';
```

첫 번째 쿼리는 문자열을 숫자로 해석해 비교하므로 `'123'`과 `'00123'`을 같은 값으로 처리할 수 있습니다.
인덱스가 문자열 순서로 정렬돼 있어 이 조건에서는 문자열 인덱스로 값을 직접 찾기 어렵습니다.
두 번째 쿼리는 앞자리 `0`이 포함된 주문 코드 `'00123'`을 문자열로 비교합니다.
[MySQL 암시적 타입 변환](https://dev.mysql.com/doc/refman/8.4/en/type-conversion.html), [MariaDB 타입 변환](https://mariadb.com/docs/server/reference/sql-functions/string-functions/type-conversion)

Spring에서 `JdbcTemplate`으로 조회할 때도 타입을 맞춥니다.
주문 코드가 문자열이라면 요청 DTO에서 `String`으로 받고, JDBC 파라미터에도 문자열 그대로 전달합니다.
SQL 로그에 같은 `WHERE order_code = ?`가 찍혀도, 실제로 바인딩한 값이 문자열인지 숫자인지에 따라 조회 결과와 실행 계획이 달라질 수 있습니다.

## 실행 계획에서 확인할 항목

| 확인할 항목 | 비교할 내용 |
|---|---|
| `possible_keys` | 조건을 바꾼 뒤 인덱스가 후보로 잡혔는지 |
| `key` | 옵티마이저가 실제로 선택한 인덱스 |
| `type` | `range`, `ref`, `ALL` 등 테이블 접근 방식 |
| `rows` | 검사할 것으로 예상한 행 수 |

조건을 고쳤더라도 조회 범위가 테이블 대부분을 차지하면 옵티마이저가 전체 스캔을 선택할 수 있습니다.
인덱스 사용 여부와 함께 **반환하는 데이터가 의도와 일치하는지, 실제로 읽은 행 수가 줄었는지**까지 비교합니다.
[MySQL `EXPLAIN` 출력 항목](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html), [MariaDB `EXPLAIN`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/explain)
