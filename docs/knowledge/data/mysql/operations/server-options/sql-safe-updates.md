---
format: md
id: mysql-server-options-sql-safe-updates
title: "MySQL과 MariaDB에서 sql_safe_updates로 일괄 수정 실수 줄이기"
sidebar_label: "sql_safe_updates"
description: "sql_safe_updates로 UPDATE와 DELETE의 WHERE·인덱스 조건을 검사하고, IDE 경고와 ERROR 1175, PK 조건 수정, 전체 갱신 시 세션 옵션 복원을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/sql-safe-updates
sidebar_position: 12
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "sql_safe_updates"
  - "ERROR 1175"
  - "safe update mode"
  - "MySQL 안전 업데이트"
  - "WHERE 없는 UPDATE"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/mysql-tips.html#mysql-tips-safe-updates"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables#sql_safe_updates"
  - "https://dev.mysql.com/doc/refman/8.4/en/set-variable.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set"
---

# MySQL과 MariaDB에서 `sql_safe_updates`로 일괄 수정 실수 줄이기

운영 DB에서 주문 한 건의 상태를 바꾸려다가 `WHERE`를 빠뜨리면 테이블 전체가 갱신될 수 있습니다.
MySQL과 MariaDB의 `sql_safe_updates`는 이런 실수를 줄이기 위해 서버에서 `UPDATE`와 `DELETE`의 실행 조건을 검사하는 옵션입니다.
[MySQL 안전 업데이트 모드](https://dev.mysql.com/doc/refman/8.4/en/mysql-tips.html#mysql-tips-safe-updates), [MariaDB 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables#sql_safe_updates)

## IDE 경고와 DB 서버 오류 구분하기

| 메시지 | 확인할 곳 |
|---|---|
| `Unsafe query: 'Update' statement without 'where' updates all table rows at once` | IDE의 SQL 검사 설정 |
| `ERROR 1175`와 함께 `safe update mode`가 표시됨 | SQL을 실행한 DB 연결의 `@@SESSION.sql_safe_updates` |

IDE에서 경고를 띄우는 설정과 DB 서버의 실행 제한은 각각 적용됩니다.
IDE에서 경고를 확인하고 실행을 선택해도, 서버에서 안전 업데이트 모드를 사용 중이라면 해당 SQL이 거부될 수 있습니다.

```sql
SELECT
    @@SESSION.sql_safe_updates AS session_safe_updates,
    @@GLOBAL.sql_safe_updates AS global_safe_updates;

-- 현재 SQL 콘솔 연결에만 적용
SET SESSION sql_safe_updates = ON;
```

## 수정 대상은 PK로 지정하기

```sql
-- 안전 업데이트 모드에서 거부되는 예
UPDATE orders
SET status = 'CANCELLED';

-- 수정할 주문을 먼저 확인
SELECT id, status
FROM orders
WHERE id = 1001;

-- PK와 변경 전 상태를 조건으로 지정
UPDATE orders
SET status = 'CANCELLED'
WHERE id = 1001
  AND status = 'PENDING';

SELECT ROW_COUNT() AS updated_rows;
```

안전 업데이트 모드를 켰을 때는 `WHERE`가 있어도 실행이 거부될 수 있습니다.
예를 들어 `WHERE status = 'PENDING'` 조건으로 조회할 때 옵티마이저가 인덱스를 사용하지 않으면 제한에 걸릴 수 있습니다.
PK나 인덱스가 있는 조건을 썼는데도 실패한다면 `EXPLAIN UPDATE ...`로 실제 접근 방식을 확인합니다.
`LIMIT`으로 허용되는 조건은 MySQL과 MariaDB의 공식 문서에서 각각 확인할 수 있습니다.
[MySQL 안전 업데이트 모드](https://dev.mysql.com/doc/refman/8.4/en/mysql-tips.html#mysql-tips-safe-updates), [MariaDB `sql_safe_updates`](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables#sql_safe_updates)

## 전체 갱신이 필요한 작업

전체 행을 바꾸는 작업이라면 먼저 대상 건수를 확인합니다.
InnoDB 테이블을 수동으로 보정할 때는 전용 연결에서만 `sql_safe_updates`를 잠시 끄고, 트랜잭션 안에서 갱신한 뒤 영향 행 수를 확인해 `COMMIT` 또는 `ROLLBACK`을 선택할 수 있습니다.

`SET SESSION`으로 바꾼 옵션은 `ROLLBACK`을 해도 이전 값으로 돌아가지 않습니다.
같은 연결을 계속 사용한다면 작업 전에 확인한 값으로 복원합니다.
[MySQL 시스템 변수 변경](https://dev.mysql.com/doc/refman/8.4/en/set-variable.html), [MariaDB `SET`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change)
- [접속과 SQL 동작](/docs/knowledge/data/mysql/operations/server-options/connection-and-sql-mode)
- [벌크 INSERT와 UPDATE, 청크 처리](/docs/knowledge/data/mysql/operations/bulk-and-chunks)
