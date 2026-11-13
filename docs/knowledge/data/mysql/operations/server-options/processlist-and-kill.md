---
format: md
id: mysql-server-options-processlist-and-kill
title: "MySQL과 MariaDB에서 실행 중인 쿼리 확인하고 중단하기"
sidebar_label: "프로세스 목록과 KILL"
description: "SHOW FULL PROCESSLIST로 실행 중인 SQL을 확인하고, KILL QUERY와 KILL CONNECTION으로 현재 문장만 취소할지 연결까지 종료할지 구분하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/processlist-and-kill
sidebar_position: 13
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "SHOW PROCESSLIST"
  - "KILL QUERY"
  - "KILL CONNECTION"
  - "metadata lock"
  - "Waiting for table metadata lock"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/show-processlist.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/show/show-processlist"
  - "https://dev.mysql.com/doc/refman/8.4/en/kill.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/kill"
  - "https://dev.mysql.com/doc/refman/8.4/en/metadata-locking.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/transactions/metadata-locking"
---

# MySQL과 MariaDB에서 실행 중인 쿼리 확인하고 중단하기

배치 쿼리가 오래 걸리거나 `ALTER TABLE`이 멈춘 것처럼 보이면, 먼저 DB에서 **어떤 연결이 무슨 SQL을 실행하고 있고 무엇을 기다리는지** 확인합니다.
중단이 필요하다면 현재 SQL만 취소할지, 연결과 열린 트랜잭션까지 종료할지 결정합니다.

## 실행 중인 SQL 확인하기

```sql
SHOW FULL PROCESSLIST;
```

| 컬럼 | 확인할 내용 |
|---|---|
| `Id` | DB 연결 ID. `KILL` 명령에 사용 |
| `User`, `Host`, `db` | 어떤 계정과 클라이언트가 어느 DB에 접속했는지 |
| `Command` | `Query`는 SQL 처리 중, `Sleep`은 다음 요청 대기 |
| `Time`, `State` | 현재 상태가 지속된 시간과 처리 또는 대기 상태 |
| `Info` | 현재 실행 중인 SQL |

`FULL`을 붙이면 `Info`에서 잘리지 않은 SQL을 확인할 수 있습니다.
`Time`은 현재 상태에서 보낸 시간이므로, `Sleep` 행에서는 유휴 시간을 뜻합니다.
다른 계정의 연결까지 확인하려면 해당 권한이 필요합니다.
[MySQL `SHOW PROCESSLIST`](https://dev.mysql.com/doc/refman/8.4/en/show-processlist.html), [MariaDB `SHOW PROCESSLIST`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/show/show-processlist)

## 현재 쿼리만 중단하기

연결 ID `12345`에서 오래 걸리는 조회를 실행 중이라면, 다른 관리용 연결에서 아래 명령을 실행합니다.
실행 직전에 `Id`, `User`, `Info`를 다시 확인합니다.

```sql
KILL QUERY 12345;
```

`KILL QUERY`는 현재 SQL 문을 중단하고 DB 연결은 유지합니다.
명시적 트랜잭션 안이었다면 트랜잭션이 계속 열려 있을 수 있습니다.
같은 트랜잭션에서 앞서 획득한 잠금도 남을 수 있으므로, 작업을 취소하려면 원래 연결에서 `ROLLBACK`까지 수행합니다.
[MySQL `KILL`](https://dev.mysql.com/doc/refman/8.4/en/kill.html), [MariaDB `KILL`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/kill)

## 연결까지 종료하기

```sql
KILL CONNECTION 12345;
```

`KILL CONNECTION`은 현재 SQL과 연결을 함께 종료합니다.
열린 InnoDB 트랜잭션은 롤백됩니다.
변경량이 많았다면 롤백에도 시간이 걸릴 수 있으므로, 명령을 실행한 뒤 대기 중이던 작업이 진행되는지 확인합니다.
[MySQL `KILL`](https://dev.mysql.com/doc/refman/8.4/en/kill.html), [MariaDB `KILL`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/kill)

예를 들어 `ALTER TABLE`에 `Waiting for table metadata lock`이 보인다면, `ALTER TABLE`을 기다리게 만든 연결부터 확인합니다.
그 연결은 `Sleep`으로 표시되더라도 이전 트랜잭션을 아직 열어 둔 상태일 수 있습니다.
이 경우 해당 트랜잭션을 커밋하거나 롤백해야 메타데이터 잠금이 풀립니다.
[MySQL 메타데이터 잠금](https://dev.mysql.com/doc/refman/8.4/en/metadata-locking.html), [MariaDB 메타데이터 잠금](https://mariadb.com/docs/server/reference/sql-statements/transactions/metadata-locking)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [메모리와 잠금](/docs/knowledge/data/mysql/operations/server-options/memory-and-locks)
- [쿼리와 연결 타임아웃](/docs/knowledge/data/mysql/operations/server-options/query-and-connection-timeouts)
- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)
- [느린 쿼리와 운영 진단](/docs/knowledge/data/mysql/operations/diagnostics)
