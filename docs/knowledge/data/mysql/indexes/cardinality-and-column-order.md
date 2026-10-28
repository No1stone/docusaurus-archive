---
format: "md"
id: "mysql-cardinality-and-column-order"
title: "MySQL 카디널리티와 복합 인덱스 컬럼 순서"
description: "카디널리티와 조건 선택도를 구분하고, 값의 편중과 동등 조건, 범위 및 정렬을 고려해 복합 인덱스 순서를 정하는 방법을 SQL로 비교합니다."
sidebar_label: "카디널리티와 복합 인덱스 컬럼 순서"
slug: "/knowledge/data/mysql/indexes/cardinality-and-column-order"
sidebar_position: 1
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 카디널리티"
  - "인덱스 컬럼 순서"
  - "선택도"
  - "복합 인덱스"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/show-index.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/range-optimization.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/analyze-table.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/index-condition-pushdown-optimization.html"
---
# MySQL 카디널리티와 복합 인덱스 컬럼 순서

복합 인덱스는 카디널리티가 높은 컬럼부터 무조건 배치하는 규칙으로 결정하지 않습니다.
어떤 조건이 자주 들어오는지, 동등 비교와 범위가 어디에 있는지, 어떤 정렬이 필요한지를 함께 봅니다.
카디널리티는 후보를 판단할 정보이며 실제 쿼리 패턴을 대신하지 않습니다.

## 카디널리티와 선택도를 구분합니다

카디널리티는 서로 다른 값의 개수입니다.
주문 ID는 거의 행 수만큼 다르고, 상태는 몇 가지 값만 가질 수 있습니다.
이 글에서 조건의 선택도가 높다는 것은 해당 조건이 전체 중 적은 행을 골라낸다는 의미로 사용합니다.

| 확인할 값 | 의미 |
|---|---|
| COUNT(DISTINCT 컬럼) | 저장된 서로 다른 값의 개수를 셉니다. |
| 특정 값의 COUNT(*) | 그 조건이 실제로 몇 행을 고르는지 확인합니다. |
| SHOW INDEX의 Cardinality | 인덱스 통계에서 추정한 고유값 수입니다. 정확한 COUNT와 다를 수 있습니다. |

상태 값이 두 개뿐이어도 FAILED가 전체의 1%라면 FAILED 검색은 적은 행을 고릅니다.
반대로 값이 다양한 컬럼이라도 특정 값에 대부분의 행이 몰릴 수 있습니다.
전체 고유값 수와 특정 조건의 결과 건수는 구분해야 합니다.

## 1만 건의 실습 데이터를 준비합니다

아래 예제는 MySQL 8.0.46에서 확인했습니다.
[인덱스 실습 SQL](/examples/mysql/index-order-example.sql)을 내려받아 실행하거나 다음 문장을 사용합니다.
회원 1000명, 상태 2개이며 FAILED 100건과 READY 9900건으로 구성합니다.
다시 실행하면 실습용 index_order_example만 초기화합니다.

```sql
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS mysql_notes CHARACTER SET utf8mb4;
USE mysql_notes;
DROP TABLE IF EXISTS index_order_example;
CREATE TABLE index_order_example (
  id BIGINT NOT NULL PRIMARY KEY,
  member_id INT NOT NULL,
  status VARCHAR(10) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  created_at DATETIME NOT NULL,
  memo VARCHAR(100) NOT NULL,
  KEY ix_member_status_time (member_id, status, created_at, id),
  KEY ix_status_member_time (status, member_id, created_at, id),
  KEY ix_status_time_member (status, created_at, member_id, id)
) ENGINE=InnoDB;

INSERT INTO index_order_example (id, member_id, status, created_at, memo)
WITH digit AS (
  SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
  UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
  UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
), seq AS (
  SELECT a.n + b.n * 10 + c.n * 100 + d.n * 1000 AS n
  FROM digit AS a CROSS JOIN digit AS b
  CROSS JOIN digit AS c CROSS JOIN digit AS d
)
SELECT n + 1, MOD(n, 1000) + 1,
       IF(MOD(n, 100) = 0, 'FAILED', 'READY'),
       TIMESTAMP('2026-01-01 00:00:00') + INTERVAL n SECOND,
       CONCAT('order-', n + 1)
FROM seq;

ANALYZE TABLE index_order_example;
```

```sql
SELECT COUNT(*) AS row_count,
       COUNT(DISTINCT member_id) AS member_cardinality,
       COUNT(DISTINCT status) AS status_cardinality
FROM index_order_example;

SELECT status, COUNT(*) AS matched_rows
FROM index_order_example GROUP BY status;

SELECT COUNT(*) AS matched_rows
FROM index_order_example WHERE member_id = 42;

SHOW INDEX FROM index_order_example;
```



행 수는 10000, member_id의 카디널리티는 1000, status는 2입니다.

회원 42의 주문은 10건입니다.
ANALYZE TABLE은 통계 갱신 명령이며, 통계의 Cardinality가 COUNT(DISTINCT)와 반드시 일치하는 것은 아닙니다.
복합 인덱스의 Seq_in_index별 Cardinality는 해당 위치까지의 컬럼 조합에 대한 추정값입니다.
예를 들어 두 번째 컬럼의 값을 그 컬럼 단독의 고유값 수로 읽지 않습니다.
조건끼리 상관관계가 있을 수 있으므로 여러 조건의 결과 비율을 단순히 곱해서 단정하지도 않습니다.
이 정도로 편중된 상태에서는 READY와 FAILED를 같은 비용의 조건으로 생각하지 않습니다.

## 동등 조건 둘의 순서는 카디널리티만으로 결정하지 않습니다

```sql
EXPLAIN ANALYZE
SELECT id, created_at FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE member_id = 42 AND status = 'READY'
ORDER BY created_at, id LIMIT 5;

EXPLAIN ANALYZE
SELECT id, created_at FROM index_order_example
FORCE INDEX (ix_status_member_time)
WHERE member_id = 42 AND status = 'READY'
ORDER BY created_at, id LIMIT 5;
```

두 조건이 모두 동등 비교로 주어지면 두 인덱스 모두 같은 member와 status 조합을 찾을 수 있습니다.
두 쿼리는 같은 5개 ID인 42, 1042, 2042, 3042, 4042를 반환합니다.
카디널리티만으로 첫 번째가 반드시 더 빠르다고 단정하지 않습니다.

차이는 조건 일부만 들어오는 다른 쿼리에서도 나타납니다.
회원별 목록을 자주 읽는다면 member_id 선두를, 상태별 대기 작업을 자주 읽는다면 status 선두를 후보로 볼 수 있습니다.
이후 범위와 정렬까지 고려하면 다른 인덱스가 필요할 수도 있습니다.

## 동등 조건 뒤의 범위와 정렬을 비교합니다

```sql
EXPLAIN ANALYZE
SELECT id, memo FROM index_order_example
FORCE INDEX (ix_status_member_time)
WHERE status = 'READY' AND member_id = 42
  AND created_at >= '2026-01-01 01:00:00'
ORDER BY created_at, id;

EXPLAIN ANALYZE
SELECT id, memo FROM index_order_example
FORCE INDEX (ix_status_time_member)
WHERE status = 'READY' AND member_id = 42
  AND created_at >= '2026-01-01 01:00:00'
ORDER BY created_at, id;
```

두 쿼리의 결과는 6건입니다.
첫 인덱스는 상태와 회원을 고정한 뒤 생성 시각 범위를 찾는 구조입니다.
두 번째는 상태와 생성 시각 범위 안에서 회원 조건을 추가 검사하는 형태가 될 수 있습니다.
필터나 Index Condition Pushdown이 적용되어도, 탐색할 인덱스 범위를 처음부터 좁히는 것과는 구분합니다.
실행 계획의 실제 읽기, 필터와 정렬 단계를 함께 확인합니다.

FORCE INDEX는 후보 간 접근 방식을 비교하기 위한 실습용입니다.
최종 확인에서는 이를 제거한 계획과 실제 운영 데이터의 분포를 봅니다.
예제의 1만 건은 동작 설명용이며 성능 우열이나 운영 용량의 근거로 사용하지 않습니다.

## 컬럼 순서를 결정할 때의 확인 순서

| 순서 | 확인할 내용 |
|---|---|
| 1 | 자주 실행하는 쿼리의 필수 조건과 선택 조건을 정리합니다. |
| 2 | 각 조건값의 실제 결과 건수와 편중을 확인합니다. |
| 3 | 동등 조건으로 묶을 컬럼과 범위 조건을 구분합니다. |
| 4 | ORDER BY, LIMIT과 필요한 반환 컬럼을 확인합니다. |
| 5 | 다른 쿼리에서 선두 컬럼을 재사용할 수 있는지 확인합니다. |
| 6 | 쓰기 비용과 중복 인덱스를 포함해 최종 후보를 비교합니다. |

동등 조건을 앞에 두고 범위와 정렬을 이어 보는 방식은 출발점입니다.
정렬된 상위 몇 건을 빨리 얻는 쿼리에서는 정렬 경로가 더 중요할 수 있으므로 고정 공식으로 취급하지 않습니다.

## 이어서 읽기

- [복합 인덱스의 왼쪽부터 사용하는 규칙](/docs/knowledge/data/mysql/indexes/leftmost-prefix)
- [인덱스와 실행 계획](/docs/knowledge/k-mysql-optimization)
- [페이지 조회와 대량 데이터 읽기](/docs/knowledge/data/mysql/query/pagination)

<details>
<summary>공식 참고 자료</summary>

- [복합 인덱스](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)
- [인덱스 통계와 Cardinality](https://dev.mysql.com/doc/refman/8.0/en/show-index.html)
- [범위 최적화](https://dev.mysql.com/doc/refman/8.0/en/range-optimization.html)
- [통계 갱신](https://dev.mysql.com/doc/refman/8.0/en/analyze-table.html)
- [Index Condition Pushdown](https://dev.mysql.com/doc/refman/8.0/en/index-condition-pushdown-optimization.html)

</details>
