---
format: "md"
id: "k-mysql-optimization"
title: "MySQL 인덱스와 실행 계획 읽기"
description: "복합 인덱스의 컬럼 순서와 EXPLAIN, EXPLAIN ANALYZE를 예제 SQL로 비교하고 범위 검색과 정렬 비용을 확인합니다."
sidebar_label: "인덱스와 실행 계획"
slug: "/knowledge/k-mysql-optimization"
sidebar_position: 4
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 인덱스"
  - "EXPLAIN ANALYZE"
  - "복합 인덱스"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/explain.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html"
---
# MySQL 인덱스와 실행 계획 읽기

인덱스는 조회 조건에 맞는 행을 찾는 경로입니다.
많이 추가한다고 모든 쿼리가 빨라지는 것은 아니며 저장 공간과 INSERT, UPDATE 비용도 늘어납니다.
느린 쿼리의 실제 입력과 데이터 분포를 확인한 뒤 인덱스를 비교합니다.
아래 예제는 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 사용합니다.

이 글의 기준 자료는 [복합 인덱스의 선두 컬럼 규칙](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 조건과 정렬을 함께 봅니다

```sql
SHOW INDEX FROM orders;

EXPLAIN
SELECT id, status, created_at
FROM orders
WHERE status = 'READY'
  AND created_at >= '2026-01-01 00:00:00'
ORDER BY created_at, id
LIMIT 20;
```

예제에는 `(status, created_at, id)` 순서의 복합 인덱스가 있습니다.
상태를 동등 조건으로 고정한 뒤 시각 범위와 정렬을 처리하는 후보입니다.
복합 인덱스는 선두 컬럼부터의 조합을 고려해야 하므로 같은 인덱스가 created_at만 사용하는 모든 쿼리에 똑같이 유리하지는 않습니다.

| 확인 항목 | 읽을 내용 |
|---|---|
| key | 선택한 인덱스를 확인합니다. |
| type | 범위 검색인지 전체 스캔인지 접근 방식을 확인합니다. |
| rows, filtered | 예상 탐색 행 수와 필터 비율을 봅니다. 실제 측정값은 아닙니다. |
| Extra | 추가 정렬과 필터, 커버링 여부를 확인합니다. |

소량의 예제 데이터에서는 전체 스캔이 합리적일 수 있습니다.
Using filesort라는 표시만으로 실제 디스크 정렬이나 성능 문제라고 단정하지 않습니다.

## EXPLAIN과 EXPLAIN ANALYZE의 차이

```sql
EXPLAIN ANALYZE
SELECT id, status, created_at
FROM orders
WHERE status = 'READY'
ORDER BY created_at, id
LIMIT 20;
```

MySQL 8.0.18 이상에서 사용하는 예제입니다.
EXPLAIN ANALYZE는 SELECT를 실제로 실행하고 단계별 시간, 행 수와 반복 횟수를 보여 줍니다.
단순히 계획만 읽는 EXPLAIN과 구분하고, 비용이 큰 조회는 운영에서 무심코 반복하지 않습니다.

## 컬럼을 함수로 감싸는 조건을 비교합니다

```sql
EXPLAIN SELECT id FROM orders
WHERE status = 'READY' AND DATE(created_at) = '2026-01-01';

EXPLAIN SELECT id FROM orders
WHERE status = 'READY'
  AND created_at >= '2026-01-01 00:00:00'
  AND created_at <  '2026-01-02 00:00:00';
```

기본 컬럼 인덱스에서는 두 번째처럼 범위를 표현하는 방식이 탐색 범위를 제한하기 유리할 수 있습니다.
함수 인덱스나 생성 컬럼을 사용한 경우에는 조건이 달라지므로 실제 계획을 봅니다.

## SQL 밖의 원인도 확인합니다

인덱스와 통계가 적절해도 잠금 대기, 연결 풀 부족이나 디스크 지연으로 응답이 느릴 수 있습니다.
SQL 모드는 GROUP BY 등 문장의 허용 규칙이므로 성능을 위해 무조건 완화하는 설정이 아닙니다.
버퍼 풀 크기도 함께 실행되는 서비스의 메모리를 고려해 측정 후 조정합니다.
진단 명령은 [느린 쿼리와 운영 진단](/docs/knowledge/data/mysql/operations/diagnostics)에서 이어갑니다.

## 인덱스 심화

- [카디널리티와 인덱스 컬럼 순서](/docs/knowledge/data/mysql/indexes/cardinality-and-column-order): 값의 개수와 조건의 선택도를 구분하고 동등 조건과 범위 조건의 배치를 비교합니다.
- [복합 인덱스의 왼쪽부터 사용하는 규칙](/docs/knowledge/data/mysql/indexes/leftmost-prefix): WHERE 작성 순서와 인덱스 정의 순서, 범위 뒤 조건과 정렬을 설명합니다.

## 이어서 읽기

- [MySQL 페이지 조회와 대량 데이터 읽기](/docs/knowledge/data/mysql/query/pagination)
- [MySQL 느린 쿼리와 운영 진단](/docs/knowledge/data/mysql/operations/diagnostics)

<details>
<summary>공식 참고 자료</summary>

- [복합 인덱스](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)
- [EXPLAIN](https://dev.mysql.com/doc/refman/8.0/en/explain.html)
- [SQL 모드](https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html)
- [InnoDB 버퍼 풀](https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html)

</details>
