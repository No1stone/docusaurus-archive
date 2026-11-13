---
format: md
id: mysql-server-options-memory-and-locks
title: "MySQL과 MariaDB의 메모리와 잠금 옵션"
sidebar_label: "메모리와 잠금"
description: "innodb_buffer_pool_size, 내부 임시 테이블 메모리 한도, innodb_lock_wait_timeout과 lock_wait_timeout으로 버퍼 풀, 집계 메모리, 행 잠금과 메타데이터 잠금을 구분합니다."
slug: /knowledge/data/mysql/operations/server-options/memory-and-locks
sidebar_position: 4
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "innodb_buffer_pool_size"
  - "tmp_table_size"
  - "innodb_lock_wait_timeout"
  - "MySQL 버퍼 풀"
  - "임시 테이블 메모리"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool-resize.html"
  - "https://mariadb.com/docs/server/server-usage/storage-engines/innodb/innodb-system-variables"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/internal-temporary-tables.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
  - "https://dev.mysql.com/doc/refman/8.4/en/metadata-locking.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/transactions/metadata-locking"
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html"
---

# MySQL과 MariaDB의 메모리와 잠금 옵션

같은 조회를 두 번 실행했을 때 두 번째가 빨라졌다면, InnoDB가 첫 조회에서 읽은 데이터나 인덱스 페이지를 메모리에 두었을 수 있습니다.
반대로 두 세션이 같은 주문을 갱신하거나, 조회 트랜잭션이 열린 상태에서 `ALTER TABLE`을 실행하면 잠금이 풀릴 때까지 기다릴 수 있습니다.

## InnoDB 버퍼 풀

`innodb_buffer_pool_size`는 **InnoDB가 데이터와 인덱스 페이지를 캐시하는 메모리 크기**입니다.
자주 읽는 페이지가 버퍼 풀에 있으면 디스크에서 다시 읽는 횟수를 줄일 수 있습니다.

DB 프로세스는 버퍼 풀 외에도 연결, 정렬, 내부 임시 테이블에 메모리를 사용합니다.
애플리케이션과 DB를 같은 장비에서 운영한다면 각 프로세스가 사용할 메모리를 함께 고려해 크기를 정합니다.
[MySQL InnoDB 버퍼 풀 설정](https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool-resize.html), [MariaDB InnoDB 시스템 변수](https://mariadb.com/docs/server/server-usage/storage-engines/innodb/innodb-system-variables)

```sql
SHOW GLOBAL VARIABLES LIKE 'innodb_buffer_pool_size';

SHOW GLOBAL STATUS
WHERE Variable_name IN (
    'Innodb_buffer_pool_read_requests',
    'Innodb_buffer_pool_reads'
);
```

`Innodb_buffer_pool_read_requests`는 논리적 읽기 요청 수이고, `Innodb_buffer_pool_reads`는 버퍼 풀에서 충족하지 못해 디스크에서 읽은 횟수입니다.
특정 작업의 영향을 보고 싶다면 작업 전후에 두 값이 얼마나 증가했는지 비교합니다.
[MySQL 서버 상태 변수](https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html)

## 내부 임시 테이블의 메모리 한도

DB는 일부 `GROUP BY`, `DISTINCT`, `UNION` 쿼리에서 중간 결과를 담기 위해 내부 임시 테이블을 만듭니다.
앞서 다룬 `CREATE TEMPORARY TABLE`은 개발자가 직접 만드는 테이블이고, 여기서 보는 옵션은 **DB가 쿼리 실행 중 자동으로 만드는 테이블**에 적용됩니다.

| 제품 | 옵션 | 의미 |
|---|---|---|
| MySQL 8.4 | `tmp_table_size` | 기본 `TempTable` 엔진에서 내부 임시 테이블 한 개의 메모리 크기 한도 |
| MySQL 8.4 | `temptable_max_ram` | `TempTable` 엔진이 공유해서 사용하는 RAM 한도. 스레드별 메모리 블록은 별도 |
| MariaDB | `tmp_table_size`, `max_heap_table_size` | 메모리 내부 임시 테이블에는 두 값 중 작은 값이 한도로 적용 |

MySQL 8.4에서 `TempTable`로 만든 내부 임시 테이블 하나가 `tmp_table_size` 한도에 도달하면 디스크 기반 InnoDB 내부 임시 테이블로 전환됩니다.
같은 집계 쿼리가 여러 연결에서 동시에 실행될 수 있으므로, 개별 테이블에 허용하는 크기와 서버 전체가 사용할 메모리를 함께 봅니다.
[MySQL 내부 임시 테이블](https://dev.mysql.com/doc/refman/8.4/en/internal-temporary-tables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

```sql
SHOW SESSION VARIABLES LIKE 'tmp_table_size';
SHOW SESSION VARIABLES LIKE 'max_heap_table_size';

-- MySQL 8.4
SHOW GLOBAL VARIABLES LIKE 'temptable_max_ram';

SHOW GLOBAL STATUS
WHERE Variable_name IN (
    'Created_tmp_tables',
    'Created_tmp_disk_tables'
);
```

디스크 임시 테이블 생성이 늘었다면 집계 대상 행 수, 조인 조건, 중간 결과에 담는 컬럼부터 확인합니다.
MySQL의 `Created_tmp_disk_tables`에는 메모리 매핑 파일을 사용한 경우가 집계되지 않으므로, 해당 설정을 쓰는 서버에서는 이 값만으로 디스크 사용량을 판단하기 어렵습니다.
[MySQL 내부 임시 테이블과 상태 변수](https://dev.mysql.com/doc/refman/8.4/en/internal-temporary-tables.html)

## 행 잠금과 메타데이터 잠금

| 옵션 | 대기 대상 | 발생 예시 |
|---|---|---|
| `innodb_lock_wait_timeout` | InnoDB 행 잠금 | 두 트랜잭션이 같은 주문 행을 갱신 |
| `lock_wait_timeout` | 메타데이터 잠금 | 열린 트랜잭션이 사용 중인 테이블에 `ALTER TABLE` 실행 |

예를 들어 세션 A에서 주문을 갱신한 뒤 커밋하지 않으면, 세션 B의 같은 행에 대한 `UPDATE`가 기다립니다.
세션 B에서 `innodb_lock_wait_timeout`을 `5`로 설정하면 이 행 잠금 대기를 5초로 제한할 수 있습니다.

다른 예로 세션 A가 트랜잭션을 열고 주문 테이블을 조회하면, 트랜잭션이 끝날 때까지 테이블의 메타데이터 잠금을 유지할 수 있습니다.
이때 세션 B에서 `ALTER TABLE`을 실행하면 테이블 정의를 바꾸기 위한 잠금을 기다립니다.
이 대기에는 `lock_wait_timeout`이 적용됩니다.
[MySQL 메타데이터 잠금](https://dev.mysql.com/doc/refman/8.4/en/metadata-locking.html), [MariaDB 메타데이터 잠금](https://mariadb.com/docs/server/reference/sql-statements/transactions/metadata-locking)

```sql
-- 현재 연결에서 InnoDB 행 잠금 대기 시간 확인
SELECT @@SESSION.innodb_lock_wait_timeout;

-- 스키마 변경용 연결에서 메타데이터 잠금 대기를 5초로 제한
SET SESSION lock_wait_timeout = 5;

SHOW FULL PROCESSLIST;
```

`SHOW FULL PROCESSLIST`에 `Waiting for table metadata lock`이 보이면, 해당 테이블을 사용한 채 열려 있는 트랜잭션이 있는지 확인합니다.
InnoDB 행 잠금 대기가 만료되면 기본 설정에서는 **대기하던 SQL 문만 롤백**됩니다.
배치가 여러 SQL을 한 트랜잭션에서 실행한다면, 오류를 받았을 때 앞선 변경까지 되돌릴지 트랜잭션 경계에서 처리해야 합니다.
[MySQL InnoDB 오류 처리](https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html), [MariaDB InnoDB 시스템 변수](https://mariadb.com/docs/server/server-usage/storage-engines/innodb/innodb-system-variables)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [임시 테이블](/docs/knowledge/data/mysql/design/temporary-tables)
- [잠금과 데드락](/docs/knowledge/data/mysql/transactions/locks-and-deadlocks)
- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)
