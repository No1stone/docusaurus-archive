---
format: md
id: mysql-server-options-transaction-and-isolation
title: "MySQL과 MariaDB의 트랜잭션 기본값과 격리 수준"
sidebar_label: "트랜잭션과 격리 수준"
description: "autocommit과 트랜잭션 경계, READ COMMITTED와 REPEATABLE READ의 일반 SELECT 차이를 두 세션으로 확인하고 SET TRANSACTION 적용 범위를 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/transaction-and-isolation
sidebar_position: 8
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "autocommit"
  - "transaction_isolation"
  - "READ COMMITTED"
  - "REPEATABLE READ"
  - "SET TRANSACTION"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/commit.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/transactions/start-transaction"
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set-transaction"
  - "https://dev.mysql.com/doc/refman/8.4/en/set-transaction.html"
---

# MySQL과 MariaDB의 트랜잭션 기본값과 격리 수준

SQL 콘솔에서 `UPDATE`를 실행하면 다른 연결에서도 바뀐 값이 바로 보일 수 있습니다.
같은 SQL을 Spring의 `@Transactional` 메서드에서 실행하면 커밋이 끝난 뒤에 다른 연결에서 변경을 볼 수 있습니다.
여기서 **언제 변경을 확정하는지**는 트랜잭션 경계의 문제이고, **이미 조회 중인 다른 트랜잭션에서 언제 새 값이 보이는지**는 격리 수준의 문제입니다.

## `autocommit`과 트랜잭션 경계

InnoDB에서 `autocommit=1`이면 명시적으로 트랜잭션을 시작하지 않은 상태에서 성공한 SQL 문은 문장 단위로 커밋됩니다.
`START TRANSACTION`을 실행하면 이후 문장들을 `COMMIT`이나 `ROLLBACK`까지 한 트랜잭션으로 묶을 수 있습니다.
[MySQL `START TRANSACTION`, `COMMIT`, `ROLLBACK`](https://dev.mysql.com/doc/refman/8.4/en/commit.html), [MariaDB `START TRANSACTION`](https://mariadb.com/docs/server/reference/sql-statements/transactions/start-transaction)

```sql
SELECT @@SESSION.autocommit, @@GLOBAL.autocommit;

-- MySQL 8.4와 MariaDB 11.1.1 이상
SELECT @@SESSION.transaction_isolation, @@GLOBAL.transaction_isolation;

-- 이전 MariaDB 버전
-- SELECT @@SESSION.tx_isolation, @@GLOBAL.tx_isolation;
```

서버의 기본값과 실제 애플리케이션 연결의 값은 다를 수 있습니다.
Spring에서 `@Transactional`로 트랜잭션을 열었다면, 별도로 열어 둔 SQL 콘솔의 `autocommit` 값보다 **애플리케이션이 작업을 어디서 시작하고 끝내는지**를 봐야 합니다.

## `READ COMMITTED`와 `REPEATABLE READ`의 차이

아래 표는 InnoDB에서 **잠금을 명시하지 않은 일반 `SELECT`**를 기준으로 합니다.
예를 들어 트랜잭션 안에서 주문 상태를 읽고, 다른 연결에서 그 주문을 갱신해 커밋한 뒤, 첫 트랜잭션에서 다시 읽는 상황입니다.
[MySQL InnoDB 일관된 읽기](https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html), [MariaDB `SET TRANSACTION`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set-transaction)

| 격리 수준 | 일반 `SELECT`가 읽는 기준 | 다른 연결이 커밋한 뒤 다시 조회 |
|---|---|---|
| `READ COMMITTED` | 각 조회가 시작될 때 새 스냅샷 사용 | 새로 커밋된 값 조회 |
| `REPEATABLE READ` | 첫 일반 조회에서 만든 스냅샷을 같은 트랜잭션에서 재사용 | 첫 조회에서 본 값 유지 |

## SQL 콘솔 두 개로 확인하기

테스트용 스키마에서 아래 테이블을 만듭니다.
두 SQL 콘솔은 같은 스키마에 **서로 다른 DB 연결**로 접속합니다.

```sql
CREATE TABLE tx_demo_orders (
    id BIGINT PRIMARY KEY,
    status VARCHAR(20) NOT NULL
) ENGINE = InnoDB;

INSERT INTO tx_demo_orders (id, status) VALUES (1, 'PENDING');
COMMIT;
```

```sql
-- 1. 세션 A에서 첫 조회
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT status FROM tx_demo_orders WHERE id = 1; -- PENDING

-- 2. 세션 B에서 실행하고 커밋
START TRANSACTION;
UPDATE tx_demo_orders SET status = 'PAID' WHERE id = 1;
COMMIT;

-- 3. 세션 A로 돌아와 다시 조회
SELECT status FROM tx_demo_orders WHERE id = 1; -- PENDING
COMMIT;
```

세션 B에서 값을 `PENDING`으로 되돌리고 커밋한 다음, 세션 A의 격리 수준을 `READ COMMITTED`로 바꿔 같은 순서로 실행합니다.
이번에는 세션 A의 두 번째 조회에서 `PAID`가 보입니다.
`SELECT ... FOR UPDATE`처럼 잠금을 획득하는 조회는 일반 `SELECT`와 읽기 동작이 다르므로, 이 예제는 두 번 모두 일반 `SELECT`를 사용합니다.
[MySQL InnoDB 일관된 읽기](https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html)

## 격리 수준을 어디에 적용할까?

| 설정 | 적용 범위 |
|---|---|
| `SET TRANSACTION ISOLATION LEVEL READ COMMITTED` | 현재 연결의 다음 트랜잭션 한 번 |
| `SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED` | 현재 연결에서 이후 시작하는 트랜잭션 |
| `SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED` | 변경 이후 새로 연결하는 세션의 기본값 |
| `.cnf`의 `transaction-isolation = READ-COMMITTED` | 서버 시작 시 적용할 전역 기본값 |

SQL 콘솔에서 동작을 비교할 때는 다음 트랜잭션 한 번만 바꾸는 `SET TRANSACTION`으로 충분합니다.
서버 전체 기본값을 변경했다면 새 JDBC 연결을 열어 적용 값을 확인합니다.
커넥션 풀이 재사용하는 기존 연결에는 이전 세션 설정이 남을 수 있습니다.
[MySQL `SET TRANSACTION`](https://dev.mysql.com/doc/refman/8.4/en/set-transaction.html), [MariaDB `SET TRANSACTION`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set-transaction)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change)
- [트랜잭션과 격리 수준](/docs/knowledge/data/mysql/transactions/isolation)
- [잠금과 데드락](/docs/knowledge/data/mysql/transactions/locks-and-deadlocks)
