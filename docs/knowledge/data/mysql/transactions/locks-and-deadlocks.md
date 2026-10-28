---
format: "md"
id: "mysql-locks-and-deadlocks"
title: "MySQL 잠금과 데드락 대응"
description: "SELECT FOR UPDATE, 인덱스 범위 잠금과 데드락을 두 세션 SQL로 확인하고 짧은 트랜잭션과 재시도 기준을 설명합니다."
sidebar_label: "잠금과 데드락 대응"
slug: "/knowledge/data/mysql/transactions/locks-and-deadlocks"
sidebar_position: 2
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 데드락"
  - "SELECT FOR UPDATE"
  - "갭 락"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-locks-set.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks-handling.html"
---
# MySQL 잠금과 데드락 대응

잠금은 동시에 변경하는 작업을 조정하지만, 범위가 넓거나 오래 유지되면 대기 시간이 늘어납니다.
잠금 문제를 볼 때는 SQL의 결과 행 수뿐 아니라 실제로 스캔하는 인덱스 범위와 트랜잭션 시간을 확인합니다.
예제는 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)과 두 세션을 사용합니다.

이 글의 기준 자료는 [InnoDB 잠금 읽기의 공식 설명](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 같은 행의 변경을 직렬화합니다

세션 A에서 실행하고 트랜잭션을 열어 둡니다.

```sql
USE mysql_notes;
START TRANSACTION;
SELECT id, status FROM orders WHERE id = 101 FOR UPDATE;
```

세션 B에서 같은 행을 변경하면 A가 끝날 때까지 대기합니다.

```sql
USE mysql_notes;
START TRANSACTION;
UPDATE orders SET amount = amount + 100 WHERE id = 101;
-- A가 ROLLBACK한 뒤 이 문장이 완료되면 실행합니다.
ROLLBACK;
```

A에서도 `ROLLBACK;`으로 잠금을 해제합니다.
잠금은 SELECT 문장 종료가 아니라 트랜잭션 종료까지 유지됩니다.
외부 API 응답을 기다리며 이 트랜잭션을 계속 열어 두지 않습니다.

## 행 잠금과 갭 잠금을 구분합니다

고유 인덱스로 존재하는 한 행을 찾는 경우와 범위 조건으로 찾는 경우의 잠금 범위는 다를 수 있습니다.
REPEATABLE READ의 범위 검색에서는 레코드와 사이 간격을 보호하는 next-key 잠금이 사용될 수 있습니다.
인덱스가 없거나 탐색 범위가 넓으면 기대보다 많은 작업이 대기할 수 있습니다.
모든 SELECT가 잠금을 잡는 것은 아니며 격리 수준과 문장 종류를 함께 봅니다.

## 서로 반대 순서로 잠그면 데드락이 생길 수 있습니다

각 세션에서 아래 순서대로 실행합니다.

```sql
-- 1. 세션 A
START TRANSACTION;
UPDATE orders SET amount = amount + 1 WHERE id = 101;

-- 2. 세션 B
START TRANSACTION;
UPDATE orders SET amount = amount + 1 WHERE id = 102;

-- 3. 세션 A: 대기합니다.
UPDATE orders SET amount = amount + 1 WHERE id = 102;

-- 4. 세션 B: 데드락 감지가 켜져 있으면 한쪽이 희생됩니다.
UPDATE orders SET amount = amount + 1 WHERE id = 101;
```

초기 구성의 InnoDB에서는 데드락 오류 1213을 확인할 수 있습니다.
어느 세션이 취소될지는 고정하지 않습니다.
확인 후 두 세션 모두 ROLLBACK하고 남은 잠금을 정리합니다.

```sql
SHOW ENGINE INNODB STATUS;
```

업무에서 여러 행을 변경할 때는 가능한 한 같은 순서로 접근하고 트랜잭션을 짧게 유지합니다.
데드락은 전체 트랜잭션 재시도 대상으로 설계하되, 외부 결제처럼 반복하면 안 되는 부수효과는 별도로 보호합니다.

## 이어서 읽기

- [MySQL 트랜잭션과 격리 수준](/docs/knowledge/data/mysql/transactions/isolation)
- [MySQL 느린 쿼리와 운영 진단](/docs/knowledge/data/mysql/operations/diagnostics)

<details>
<summary>공식 참고 자료</summary>

- [잠금 읽기](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)
- [SQL별 잠금 범위](https://dev.mysql.com/doc/refman/8.0/en/innodb-locks-set.html)
- [데드락 대응](https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks-handling.html)

</details>
