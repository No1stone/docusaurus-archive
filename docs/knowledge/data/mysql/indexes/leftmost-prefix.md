---
format: "md"
id: "mysql-leftmost-prefix"
title: "MySQL 복합 인덱스의 왼쪽부터 사용하는 규칙"
description: "복합 인덱스의 Leftmost Prefix 규칙을 SQL로 확인하고 WHERE 작성 순서, 선두 컬럼 생략과 범위 뒤 조건 및 정렬을 구분합니다."
sidebar_label: "복합 인덱스의 왼쪽부터 사용하는 규칙"
slug: "/knowledge/data/mysql/indexes/leftmost-prefix"
sidebar_position: 2
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 왼쪽 법칙"
  - "Leftmost Prefix"
  - "복합 인덱스"
  - "WHERE 조건 순서"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/range-optimization.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/index-condition-pushdown-optimization.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/index-merge-optimization.html"
---
# MySQL 복합 인덱스의 왼쪽부터 사용하는 규칙

복합 인덱스의 왼쪽 규칙은 SQL의 WHERE 조건을 왼쪽부터 적으라는 뜻이 아닙니다.
인덱스가 `(a, b, c)`로 정렬되어 있을 때 `(a)`, `(a, b)`, `(a, b, c)` 같은 선두 컬럼 조합을 탐색에 사용할 수 있다는 의미입니다.
공식 용어는 Leftmost Prefix이며, [MySQL 복합 인덱스 설명](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)에서 확인할 수 있습니다.

아래 SQL은 [카디널리티 글의 실습 테이블](/docs/knowledge/data/mysql/indexes/cardinality-and-column-order)을 먼저 준비한 뒤 실행합니다.
인덱스 ix_member_status_time은 `(member_id, status, created_at, id)` 순서입니다.

## 인덱스 순서와 WHERE 작성 순서는 다릅니다

```sql
USE mysql_notes;
EXPLAIN SELECT id FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE member_id = 42 AND status = 'READY';

EXPLAIN SELECT id FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE status = 'READY' AND member_id = 42;
```

단순 AND 동등 조건을 뒤집은 위 두 쿼리는 같은 의미이며 같은 인덱스 탐색 경로를 사용할 수 있습니다.
WHERE에 status를 먼저 썼다고 status부터 탐색하는 인덱스로 바뀌지 않습니다.
SQL의 서술 순서와 옵티마이저가 정하는 실행 경로를 구분합니다.

## 왼쪽 컬럼을 이어서 조건으로 사용합니다

| 조건 | 일반적인 B-tree 탐색 해석 |
|---|---|
| member_id = 값 | 선두 member_id 범위를 찾을 수 있습니다. |
| member_id = 값 AND status = 값 | 앞의 두 컬럼으로 범위를 좁힐 수 있습니다. |
| member_id = 값 AND status = 값 AND created_at >= 값 | 두 동등 조건 뒤에서 시각 범위를 탐색할 수 있습니다. |
| member_id = 값 AND created_at >= 값 | status가 비어 있으므로 연속된 세 컬럼 조건과 같은 방식은 아닙니다. |
| status = 값만 사용 | 선두 컬럼이 없어 보통 같은 방식의 선두 탐색을 기대할 수 없습니다. |

```sql
EXPLAIN SELECT id FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE member_id = 42;

EXPLAIN SELECT id FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE member_id = 42 AND created_at >= '2026-01-01 01:00:00';

EXPLAIN SELECT id FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE status = 'FAILED';
```

EXPLAIN의 key, key_len과 type을 함께 읽습니다.
선두 컬럼이 없다고 항상 테이블 전체 스캔만 하는 것은 아닙니다.
전체 인덱스 스캔이나 조건이 맞는 Skip Scan 등이 선택될 수 있습니다.
다른 인덱스가 있으면 그 인덱스를 선택하거나 Index Merge를 검토할 수도 있습니다.
이런 예외를 선두 조합과 동일한 탐색 효율로 일반화하지 않습니다.

## 범위 조건 뒤의 컬럼은 무조건 무시되나요?

```sql
EXPLAIN FORMAT=JSON
SELECT id, memo FROM index_order_example
FORCE INDEX (ix_status_time_member)
WHERE status = 'READY'
  AND created_at >= '2026-01-01 01:00:00'
  AND member_id = 42;
```

이 인덱스는 `(status, created_at, member_id, id)` 순서입니다.
상태와 시각으로 잡은 범위 안에서 member_id 조건을 추가 검사할 수 있습니다.
뒤의 컬럼은 Index Condition Pushdown이나 결과 필터에 사용될 수 있으므로 전혀 사용하지 않는다고 표현하지 않습니다.
다만 범위 앞의 동등 조건처럼 전체 탐색 구간을 계속 좁히는 효과와는 다릅니다.
JSON 계획에서 used_key_parts, index_condition과 attached_condition을 확인합니다.
IN과 OR처럼 여러 구간을 만드는 조건도 있으므로 모든 문장을 단일 범위 공식으로 판단하지 않습니다.

## 동등 조건으로 고정한 뒤의 정렬

```sql
EXPLAIN SELECT id, created_at FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE member_id = 42 AND status = 'READY'
ORDER BY created_at, id LIMIT 5;

EXPLAIN SELECT id, created_at FROM index_order_example
FORCE INDEX (ix_member_status_time)
WHERE member_id = 42
ORDER BY created_at, id LIMIT 5;
```

MySQL 8.0.46의 예제에서는 다음 계획을 확인했습니다.

| 조건 | key_len | Extra | 해석 |
|---|---|---|---|
| member_id와 status 모두 고정 | 16 | Using index | 인덱스 순서로 결과를 읽습니다. |
| member_id만 고정 | 4 | Using index; Using filesort | 뒤의 생성 시각 정렬에 추가 정렬이 필요합니다. |

key_len 값은 이 예제의 타입과 인덱스 정의에서 측정한 값이며 모든 테이블의 고정값은 아닙니다.

첫 쿼리는 member_id와 status가 고정되어 뒤의 생성 시각과 ID 순서를 활용할 수 있습니다.
두 번째는 중간의 status가 고정되지 않아, 인덱스의 status별 정렬이 전체 생성 시각 정렬과 같지 않습니다.
따라서 추가 정렬이 필요할 수 있으며 Extra에서 Using filesort를 확인합니다.
예제의 회원 42 데이터가 우연히 모두 READY여도, 스키마가 그 사실을 보장하는 것은 아닙니다.

## 실무에서 혼동하기 쉬운 표현

| 표현 | 구분할 내용 |
|---|---|
| WHERE 왼쪽부터 인덱스를 탄다 | 기준은 SQL 조건 순서가 아니라 인덱스 정의의 컬럼 순서입니다. |
| 선두 컬럼이 없으면 인덱스를 전혀 못 쓴다 | 탐색, 전체 인덱스 스캔과 예외 최적화를 구분합니다. |
| 범위 뒤 컬럼은 모두 무시된다 | 탐색 범위와 인덱스 조건 검사 및 결과 필터를 구분합니다. |
| key가 찍혔으니 빠르다 | type, 읽는 행 수, 필터와 정렬을 함께 확인합니다. |

FORCE INDEX를 제거한 최종 쿼리에서도 계획을 확인합니다.
두 글의 예제는 접근 방식 설명을 위한 것이며 특정 인덱스를 모든 업무의 기본값으로 제안하지 않습니다.

## 이어서 읽기

- [카디널리티와 인덱스 순서](/docs/knowledge/data/mysql/indexes/cardinality-and-column-order)
- [인덱스와 실행 계획](/docs/knowledge/k-mysql-optimization)
- [Collation과 문자열 인덱스](/docs/knowledge/data/mysql/basics/collations-and-indexes)

<details>
<summary>공식 참고 자료</summary>

- [복합 인덱스와 Leftmost Prefix](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)
- [범위와 Skip Scan](https://dev.mysql.com/doc/refman/8.0/en/range-optimization.html)
- [ORDER BY 최적화](https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html)
- [Index Condition Pushdown](https://dev.mysql.com/doc/refman/8.0/en/index-condition-pushdown-optimization.html)
- [Index Merge](https://dev.mysql.com/doc/refman/8.0/en/index-merge-optimization.html)

</details>
