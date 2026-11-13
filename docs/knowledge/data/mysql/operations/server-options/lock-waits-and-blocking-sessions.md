---
format: md
id: mysql-server-options-lock-waits-and-blocking-sessions
title: "MySQL과 MariaDB에서 잠금 대기와 차단 세션 찾기"
sidebar_label: "잠금 대기와 차단"
description: "sys.innodb_lock_waits로 행 잠금 대기와 차단 연결을 찾고, ALTER TABLE의 메타데이터 잠금 대기까지 확인하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/lock-waits-and-blocking-sessions
sidebar_position: 19
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "innodb_lock_waits"
  - "blocking_pid"
  - "메타데이터 잠금"
  - "MySQL 잠금 대기"
  - "차단 세션"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-information-schema-examples.html"
  - "https://mariadb.com/docs/server/reference/system-tables/sys-schema/sys-schema-views/innodb_lock_waits-and-xinnodb_lock_waits-sys-schema-views"
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/metadata-locking.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/transactions/metadata-locking"
  - "https://dev.mysql.com/doc/refman/8.4/en/sys-schema-table-lock-waits.html"
  - "https://mariadb.com/docs/server/reference/system-tables/performance-schema/performance-schema-tables/performance-schema-metadata_locks-table"
  - "https://dev.mysql.com/doc/refman/8.4/en/kill.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/kill"
---

# MySQL과 MariaDB에서 잠금 대기와 차단 세션 찾기

주문 상태를 갱신하는 쿼리가 멈춘 것처럼 보여도, 실제로는 다른 트랜잭션이 끝나길 기다리고 있을 수 있습니다.
`SHOW FULL PROCESSLIST`로 기다리는 쿼리를 찾았다면, 다음은 **어느 연결이 잠금을 잡고 있는지** 확인할 차례입니다.

## InnoDB 행 잠금을 잡은 연결 찾기

MySQL 8.4와 MariaDB 10.6 이상에서는 `sys.innodb_lock_waits`로 대기 중인 연결과 그 연결을 막고 있는 연결을 함께 볼 수 있습니다.
[MySQL InnoDB 잠금 진단](https://dev.mysql.com/doc/refman/8.4/en/innodb-information-schema-examples.html), [MariaDB `innodb_lock_waits`](https://mariadb.com/docs/server/reference/system-tables/sys-schema/sys-schema-views/innodb_lock_waits-and-xinnodb_lock_waits-sys-schema-views)

```sql
SELECT
    wait_age_secs,
    waiting_pid,
    waiting_query,
    blocking_pid,
    blocking_query,
    blocking_trx_started
FROM sys.innodb_lock_waits
ORDER BY wait_age_secs DESC;
```

| 컬럼 | 확인할 내용 |
|---|---|
| `waiting_pid` | 잠금을 기다리는 연결 ID |
| `waiting_query` | 잠금을 기다리는 SQL |
| `blocking_pid` | 잠금을 보유한 연결 ID |
| `blocking_query` | 그 연결이 현재 실행 중인 SQL |
| `blocking_trx_started` | 잠금을 보유한 트랜잭션의 시작 시각 |

예를 들어 `waiting_pid`가 `42`, `blocking_pid`가 `17`이라면, **42번 연결이 17번 연결의 트랜잭션을 기다리는 상황**입니다.
`blocking_query`가 `NULL`이어도 17번 연결이 잠금을 보유할 수 있습니다.
앞선 `UPDATE`는 끝났지만 아직 커밋하지 않았다면, 그 연결은 `SHOW FULL PROCESSLIST`에서 `Sleep`으로 표시될 수 있습니다.
[MySQL 유휴 차단 세션 진단](https://dev.mysql.com/doc/refman/8.4/en/innodb-information-schema-examples.html)

## SQL 콘솔 세 개로 재현하기

테스트 DB의 InnoDB `orders` 테이블에 `id = 1001`인 행이 있다고 가정합니다.
아래 블록을 콘솔 A, B, C에 나눠 순서대로 실행합니다.

```sql
-- 콘솔 A에서 행을 잠그고 트랜잭션을 열어 둡니다.
START TRANSACTION;
SELECT id FROM orders WHERE id = 1001 FOR UPDATE;

-- 콘솔 B에서 같은 행의 잠금을 요청합니다.
SET SESSION innodb_lock_wait_timeout = 30;
START TRANSACTION;
SELECT id FROM orders WHERE id = 1001 FOR UPDATE;

-- 콘솔 B가 기다리는 동안 콘솔 C에서 확인합니다.
SELECT waiting_pid, blocking_pid, waiting_query, blocking_query
FROM sys.innodb_lock_waits;
```

콘솔 A에서 `ROLLBACK`하면 잠금이 풀리고 콘솔 B의 조회가 진행됩니다.
콘솔 B에서도 `ROLLBACK`으로 트랜잭션을 종료합니다.
[MySQL InnoDB 잠금 조회](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html)

## `ALTER TABLE`이 기다린다면 메타데이터 잠금 확인하기

`SHOW FULL PROCESSLIST`의 `State`가 `Waiting for table metadata lock`이라면 테이블 정의에 대한 잠금 대기를 확인합니다.
예를 들어 콘솔 A가 트랜잭션 안에서 `orders`를 조회한 채 열린 상태라면, 콘솔 B의 `ALTER TABLE orders`는 A의 트랜잭션이 끝날 때까지 기다릴 수 있습니다.
[MySQL 메타데이터 잠금](https://dev.mysql.com/doc/refman/8.4/en/metadata-locking.html), [MariaDB 메타데이터 잠금](https://mariadb.com/docs/server/reference/sql-statements/transactions/metadata-locking)

MySQL 8.4에서는 `sys.schema_table_lock_waits`로 대기 연결과 차단 연결을 확인합니다.
MariaDB에서는 `performance_schema.metadata_locks`에서 해당 테이블의 `PENDING`과 `GRANTED` 잠금을 확인할 수 있습니다.
MariaDB에서 이 테이블을 활용하려면 Performance Schema와 메타데이터 잠금 계측이 활성화되어 있어야 합니다.
[MySQL `schema_table_lock_waits`](https://dev.mysql.com/doc/refman/8.4/en/sys-schema-table-lock-waits.html), [MariaDB `metadata_locks`](https://mariadb.com/docs/server/reference/system-tables/performance-schema/performance-schema-tables/performance-schema-metadata_locks-table)

운영에서 차단 연결을 찾았다면 해당 연결이 처리 중이던 작업과 트랜잭션 시작 시각을 먼저 확인합니다.
원래 연결에서 작업을 마무리해 커밋하거나 취소해 롤백하면 잠금이 풀립니다.
연결 종료가 필요하다면 열린 InnoDB 트랜잭션의 롤백이 끝날 때까지 대기가 이어질 수 있습니다.
[MySQL `KILL`](https://dev.mysql.com/doc/refman/8.4/en/kill.html), [MariaDB `KILL`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/kill)
