---
format: md
id: mysql-server-options-analyze-table-statistics
title: "MySQL과 MariaDB에서 ANALYZE TABLE로 인덱스 통계 갱신하기"
sidebar_label: "ANALYZE TABLE 통계"
description: "ANALYZE TABLE로 인덱스 통계를 갱신하고 EXPLAIN으로 전후 계획을 비교하는 방법과, 히스토그램, 잠금, 복제에서의 LOCAL 실행을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/analyze-table-statistics
sidebar_position: 17
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "ANALYZE TABLE"
  - "Cardinality"
  - "히스토그램"
  - "ANALYZE LOCAL TABLE"
  - "MySQL 인덱스 통계 갱신"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/analyze-table.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/table-statements/analyze-table"
  - "https://dev.mysql.com/doc/refman/8.4/en/explain-output.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/analyze-format-json"
  - "https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/query-optimizations/statistics-for-optimizing-queries/engine-independent-table-statistics"
---

# MySQL과 MariaDB에서 `ANALYZE TABLE`로 인덱스 통계 갱신하기

오래된 주문을 한꺼번에 삭제하거나 주문 상태를 일괄 변경하면, 같은 `WHERE` 조건에 해당하는 행의 비율이 달라집니다.
실행 계획에서 **옵티마이저가 예상한 행 수와 실제 행 수가 크게 벌어졌다면**, `ANALYZE TABLE`로 통계를 갱신하고 같은 쿼리의 계획을 다시 확인할 수 있습니다.

옵티마이저는 인덱스를 선택하거나 조인 순서를 정할 때 통계를 사용합니다.
InnoDB의 인덱스 카디널리티는 추정값입니다.
MySQL InnoDB는 인덱스 트리를 샘플링해 이 값을 갱신합니다.
[MySQL `ANALYZE TABLE`](https://dev.mysql.com/doc/refman/8.4/en/analyze-table.html), [MariaDB `ANALYZE TABLE`](https://mariadb.com/docs/server/reference/sql-statements/table-statements/analyze-table)

## 같은 쿼리로 통계 갱신 전후 비교하기

`orders.status`에 인덱스가 있고, 배치가 여러 주문의 상태를 `CANCELLED`로 바꿨다고 가정합니다.
같은 데이터에서 조회 조건을 고정한 채 통계 갱신 전후의 계획을 비교합니다.

```sql
-- 현재 인덱스와 카디널리티 추정값
SHOW INDEX FROM orders;

-- 갱신 전 실행 계획
EXPLAIN
SELECT id, customer_id, created_at
FROM orders
WHERE status = 'CANCELLED';

-- 인덱스 통계 갱신
ANALYZE TABLE orders;

-- 같은 조건으로 갱신 후 실행 계획 확인
EXPLAIN
SELECT id, customer_id, created_at
FROM orders
WHERE status = 'CANCELLED';
```

| 확인할 값 | 비교할 내용 |
|---|---|
| `key` | 어떤 인덱스가 선택됐는지 |
| `type` | 인덱스로 접근하는지, 테이블 전체를 스캔하는지 |
| `rows`, `filtered` | 검사할 것으로 예상한 행 수와 조건을 통과할 것으로 예상한 비율 |

통계를 갱신해도 실행 계획은 그대로일 수 있습니다.
예를 들어 `CANCELLED` 주문의 예상 건수가 실제에 가까워졌어도, 여전히 일치하는 행이 많다면 테이블 스캔이 유리할 수 있습니다.
**인덱스가 선택됐는지와 행 수 추정이 개선됐는지**를 각각 확인합니다.
실제 실행에서 읽은 행과 소요 시간은 MySQL의 `EXPLAIN ANALYZE` 또는 MariaDB의 `ANALYZE FORMAT=JSON`으로 확인합니다.
[MySQL `EXPLAIN` 출력](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html), [MariaDB `ANALYZE FORMAT=JSON`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/analyze-and-explain-statements/analyze-format-json)

## 카디널리티와 값별 분포

`SHOW INDEX`의 `Cardinality`는 인덱스에서 **서로 다른 값이 몇 종류인지**에 대한 추정치입니다.
`ACTIVE`와 `CANCELLED` 두 종류만 있다면, 두 상태가 절반씩 있는 테이블과 `ACTIVE`가 99%인 테이블의 카디널리티는 비슷할 수 있습니다.
하지만 `WHERE status = 'CANCELLED'`에 해당하는 행 수는 크게 다릅니다.

특정 값에 행이 몰려 있고 그 분포를 옵티마이저가 잘 추정하지 못한다면, **컬럼 분포를 요약하는 히스토그램**을 검토할 수 있습니다.
예를 들어 `WHERE`에 자주 등장하지만 선두 컬럼으로 사용하는 인덱스가 없는 `channel`의 분포를 수집합니다.
일반 `ANALYZE TABLE`과 컬럼 분포를 수집하는 문법은 제품별로 구분합니다.
[MySQL 히스토그램 갱신](https://dev.mysql.com/doc/refman/8.4/en/analyze-table.html), [MariaDB 엔진 독립 통계](https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/query-optimizations/statistics-for-optimizing-queries/engine-independent-table-statistics)

```sql
-- MySQL 8.4
ANALYZE TABLE orders
    UPDATE HISTOGRAM ON channel WITH 32 BUCKETS;

-- MariaDB
ANALYZE TABLE orders
    PERSISTENT FOR COLUMNS (channel) INDEXES ();
```

## 운영에서 실행할 때

큰 테이블에서 통계를 수집하기 전에는 DB 버전과 스토리지 엔진에 따른 잠금 동작을 확인합니다.
MySQL 8.4 공식 문서는 InnoDB 테이블 분석 중 읽기 잠금이 적용된다고 설명하고, MariaDB 공식 문서는 InnoDB에서 분석 중 읽기와 쓰기를 허용한다고 설명합니다.
두 제품 모두 기본적으로 `ANALYZE TABLE` 문을 바이너리 로그에 기록하므로, 복제 환경에서는 Replica에서도 분석이 실행될 수 있습니다.
현재 서버에서만 실행하려면 `ANALYZE LOCAL TABLE orders;`를 사용할 수 있습니다.
[MySQL `ANALYZE TABLE`](https://dev.mysql.com/doc/refman/8.4/en/analyze-table.html), [MariaDB `ANALYZE TABLE`](https://mariadb.com/docs/server/reference/sql-statements/table-statements/analyze-table)
