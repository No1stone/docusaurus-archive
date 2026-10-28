---
format: "md"
id: "mysql-isolation"
title: "MySQL 트랜잭션과 격리 수준"
description: "InnoDB의 커밋과 롤백, MVCC와 REPEATABLE READ를 설명하고 두 세션에서 읽기 일관성을 확인합니다."
sidebar_label: "트랜잭션과 격리 수준"
slug: "/knowledge/data/mysql/transactions/isolation"
sidebar_position: 1
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 트랜잭션"
  - "REPEATABLE READ"
  - "MVCC"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-consistent-read.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html"
---
# MySQL 트랜잭션과 격리 수준

트랜잭션은 함께 성공하거나 취소해야 하는 DB 변경의 경계입니다.
InnoDB에서는 COMMIT으로 확정하고 ROLLBACK으로 취소합니다.
이 경계가 외부 HTTP 호출이나 파일 변경까지 함께 되돌려 주는 것은 아닙니다.
예제는 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 사용합니다.

이 글의 기준 자료는 [InnoDB 일관된 읽기의 공식 설명](https://dev.mysql.com/doc/refman/8.0/en/innodb-consistent-read.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 변경을 확정하거나 취소합니다

```sql
USE mysql_notes;
START TRANSACTION;
UPDATE orders SET status = 'PAID', version = version + 1
WHERE id = 101 AND status = 'READY';
SELECT id, status FROM orders WHERE id = 101;
ROLLBACK;
SELECT id, status FROM orders WHERE id = 101;
```

처음에는 PAID가 보이고 롤백 후에는 READY로 돌아옵니다.
자동 커밋이 켜져 있으면 명시적 트랜잭션 밖의 문장은 보통 각각 확정됩니다.
DDL에는 암묵적 커밋을 일으키는 문장이 있으므로 테이블 변경을 같은 방식으로 롤백할 수 있다고 가정하지 않습니다.

## MySQL 기본 격리 수준과 MVCC

```sql
SELECT @@SESSION.autocommit, @@SESSION.transaction_isolation;
```

| 수준 | 일반적인 비잠금 SELECT의 읽기 특성 |
|---|---|
| READ UNCOMMITTED | 다른 트랜잭션의 미확정 변경을 읽을 수 있습니다. |
| READ COMMITTED | 각 일관된 읽기에서 새 스냅샷을 사용합니다. |
| REPEATABLE READ | 같은 트랜잭션의 일관된 읽기에서 첫 스냅샷을 유지합니다. |
| SERIALIZABLE | 다른 수준보다 강한 격리를 제공하며 읽기의 잠금 동작도 고려해야 합니다. |

InnoDB의 기본값은 REPEATABLE READ입니다.
MVCC는 과거 버전을 이용한 읽기 일관성을 지원하지만, UPDATE와 SELECT FOR UPDATE를 일반 SELECT와 같은 스냅샷 읽기로 생각하지 않습니다.

## 두 세션에서 스냅샷을 확인합니다

세션 A에서 먼저 실행합니다.

```sql
USE mysql_notes;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT amount FROM orders WHERE id = 101;
```

세션 B에서 변경을 커밋합니다.

```sql
USE mysql_notes;
START TRANSACTION;
UPDATE orders SET amount = 31000 WHERE id = 101;
COMMIT;
```

다시 세션 A에서 실행합니다.

```sql
SELECT amount FROM orders WHERE id = 101;
COMMIT;
SELECT amount FROM orders WHERE id = 101;
```

다른 변경이 없다면 트랜잭션 안에서는 30000, 종료 후 새 읽기에서는 31000을 확인합니다.
이 실습은 B의 변경을 남기므로 다음 글 전에 공통 데이터를 초기화합니다.

## 이어서 읽기

- [MySQL 잠금과 데드락 대응](/docs/knowledge/data/mysql/transactions/locks-and-deadlocks)
- [MySQL 중복 요청과 동시 갱신 방지](/docs/knowledge/data/mysql/transactions/idempotency-and-version)

<details>
<summary>공식 참고 자료</summary>

- [격리 수준](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)
- [일관된 읽기](https://dev.mysql.com/doc/refman/8.0/en/innodb-consistent-read.html)
- [암묵적 커밋](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)

</details>
