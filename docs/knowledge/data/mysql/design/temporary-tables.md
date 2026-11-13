---
format: md
id: mysql-temporary-tables
title: "MySQL과 MariaDB 임시 테이블 사용법"
sidebar_label: "임시 테이블"
description: "CREATE TEMPORARY TABLE의 세션 수명과 InnoDB, MEMORY 저장 방식을 구분하고, 배치에서 ID 목록을 재사용하는 SQL과 Spring JDBC에서 같은 DataSource 연결을 쓰는 조건을 정리합니다."
slug: /knowledge/data/mysql/design/temporary-tables
sidebar_position: 6
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "MySQL 임시 테이블"
  - "CREATE TEMPORARY TABLE"
  - "InnoDB MEMORY 임시 테이블"
  - "임시 테이블스페이스"
  - "Spring JdbcTemplate DataSource"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/create-temporary-table.html"
  - "https://mariadb.com/docs/server/server-usage/tables/create-table"
  - "https://dev.mysql.com/doc/refman/8.4/en/commit.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-temporary-tablespace.html"
  - "https://mariadb.com/docs/server/server-usage/storage-engines/innodb/innodb-tablespaces/innodb-temporary-tablespaces"
  - "https://dev.mysql.com/doc/refman/8.4/en/memory-storage-engine.html"
  - "https://mariadb.com/docs/server/server-usage/storage-engines/memory-storage-engine"
  - "https://dev.mysql.com/doc/refman/8.4/en/internal-temporary-tables.html"
  - "https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/datasource/DataSourceTransactionManager.html"
---

# MySQL과 MariaDB 임시 테이블 사용법

배치에서 갱신할 대상을 한 번 골라 두고, 같은 목록으로 건수를 확인하거나 여러 테이블을 갱신할 때가 있습니다.
MySQL과 MariaDB에서는 `CREATE TEMPORARY TABLE`로 중간 결과를 담아 두고 여러 SQL에서 재사용할 수 있습니다.

임시 테이블은 **생성한 DB 세션에서만 보이고, 그 세션이 종료되면 자동으로 삭제됩니다.**
데이터를 메모리에 둘지, 디스크 파일을 사용할지는 스토리지 엔진이 결정합니다.
[MySQL `CREATE TEMPORARY TABLE`](https://dev.mysql.com/doc/refman/8.4/en/create-temporary-table.html), [MariaDB `CREATE TABLE`](https://mariadb.com/docs/server/server-usage/tables/create-table)

## DB 세션과 트랜잭션

DB 연결 하나를 유지하는 동안 트랜잭션을 여러 번 시작하고 끝낼 수 있습니다.
임시 테이블의 수명은 **DB 세션**을 따르고, InnoDB 임시 테이블에 넣은 데이터의 변경은 **트랜잭션**을 따릅니다.

| 실행 또는 상황 | 임시 테이블의 동작 |
|---|---|
| `COMMIT` | 데이터 변경 확정, 같은 세션에서 테이블 계속 사용 |
| `ROLLBACK` | 해당 트랜잭션의 InnoDB 데이터 변경 취소, 테이블 유지 |
| 별도 DB 연결에서 조회 | 생성한 세션에만 표시 |
| `DROP TEMPORARY TABLE` | 현재 세션의 임시 테이블 삭제 |
| DB 세션 종료 | 해당 세션의 임시 테이블 자동 삭제 |

같은 SQL 콘솔 연결에서 아래 쿼리를 실행하면 마지막 `SELECT`에서 `1`만 조회됩니다.
두 번째 트랜잭션의 `INSERT`는 취소되고, 임시 테이블은 그대로 남습니다.
[MySQL 트랜잭션 문서](https://dev.mysql.com/doc/refman/8.4/en/commit.html)

```sql
CREATE TEMPORARY TABLE tmp_ids (
    id BIGINT PRIMARY KEY
) ENGINE = InnoDB;

START TRANSACTION;
INSERT INTO tmp_ids VALUES (1);
COMMIT;

START TRANSACTION;
INSERT INTO tmp_ids VALUES (2);
ROLLBACK;

SELECT id FROM tmp_ids;

DROP TEMPORARY TABLE tmp_ids;
```

## 임시 테이블은 메모리에 저장될까?

`TEMPORARY`는 테이블의 사용 범위와 수명을 정합니다.
`INSERT`로 임시 테이블에 행을 추가하면 DB 안에서 쓰기 작업이 일어나고, 그 행을 어디에 저장할지는 `ENGINE` 설정에 따라 달라집니다.

| 스토리지 엔진 | 데이터 저장 위치 | 데이터 변경 롤백 |
|---|---|---|
| `InnoDB` | 디스크 파일을 사용하는 임시 테이블스페이스 | 가능 |
| `MEMORY` | RAM | 미지원 |

**MySQL 8.4**에서 사용자가 만든 InnoDB 임시 테이블의 데이터는 세션 임시 테이블스페이스에 저장됩니다.
기본 경로는 데이터 디렉터리 아래 `#innodb_temp/`입니다.
**MariaDB**는 `innodb_temp_data_file_path`에 지정된 공유 임시 테이블스페이스를 사용하며, 기본 파일 이름은 `ibtmp1`입니다.
두 경우 모두 디스크 I/O가 발생할 수 있습니다.
[MySQL 임시 테이블스페이스](https://dev.mysql.com/doc/refman/8.4/en/innodb-temporary-tablespace.html), [MariaDB 임시 테이블스페이스](https://mariadb.com/docs/server/server-usage/storage-engines/innodb/innodb-tablespaces/innodb-temporary-tablespaces)

작은 ID 목록을 RAM에 두려면 `ENGINE=MEMORY`를 지정할 수 있습니다.
직접 만든 `MEMORY` 테이블은 크기 한도에 도달하면 추가 입력이 실패합니다.
[MySQL MEMORY 엔진](https://dev.mysql.com/doc/refman/8.4/en/memory-storage-engine.html), [MariaDB MEMORY 엔진](https://mariadb.com/docs/server/server-usage/storage-engines/memory-storage-engine)

일부 `GROUP BY`나 `DISTINCT` 쿼리를 처리하면서 DB가 자체적으로 만드는 **내부 임시 테이블**도 있습니다.
MySQL은 내부 임시 테이블을 쿼리 조건과 메모리 한도에 따라 디스크에 둘 수 있습니다.
[MySQL 내부 임시 테이블](https://dev.mysql.com/doc/refman/8.4/en/internal-temporary-tables.html)

## 배치 예제에서 갱신 대상 재사용하기

만료된 쿠폰 중 상태가 `ACTIVE`인 행을 최대 1,000건씩 처리합니다.
이번에 고른 ID를 임시 테이블에 담고, 건수 확인과 일괄 갱신에 같은 목록을 사용합니다.

```sql
CREATE TEMPORARY TABLE tmp_expired_coupon_ids (
    coupon_id BIGINT NOT NULL PRIMARY KEY
) ENGINE = InnoDB;

START TRANSACTION;

INSERT INTO tmp_expired_coupon_ids (coupon_id)
SELECT id
FROM coupon
WHERE status = 'ACTIVE'
  AND expires_at < CURRENT_TIMESTAMP
ORDER BY id
LIMIT 1000;

SELECT COUNT(*) AS candidate_count
FROM tmp_expired_coupon_ids;

UPDATE coupon AS c
JOIN tmp_expired_coupon_ids AS t ON t.coupon_id = c.id
SET c.status = 'EXPIRED'
WHERE c.status = 'ACTIVE'
  AND c.expires_at < CURRENT_TIMESTAMP;

COMMIT;

DROP TEMPORARY TABLE tmp_expired_coupon_ids;
```

임시 테이블에 담긴 것은 **이번 배치에서 고른 ID 목록**입니다.
대상 선정 후 원본 행이 바뀔 수 있으므로 실제 `UPDATE`에서도 상태와 만료 조건을 다시 확인합니다.

## 배치 외 활용

| 용도 | 임시 테이블에 담는 데이터 | 활용 |
|---|---|---|
| 데이터 마이그레이션 | 기존 ID와 신규 ID 매핑 | 여러 테이블의 참조값을 같은 기준으로 변환 |
| 정합성 점검 | 누락되거나 중복된 ID | 관련 테이블과 조인해 원인 확인 |
| 중간 집계 | 일별 또는 고객사별 집계 결과 | 같은 집계로 여러 지표 계산 |
| 운영 데이터 보정 | 수정할 ID와 적용할 값 | 적용 대상 확인, 일괄 갱신, 결과 검증 |

SQL 한 문장 안에서 중간 결과를 쓸 때는 CTE(`WITH`)로 표현할 수 있습니다.
같은 중간 결과를 여러 SQL에서 재사용하거나 조인 키에 인덱스를 두고 싶을 때는 임시 테이블을 사용할 수 있습니다.

## Spring에서 JDBC 커넥션 풀과 함께 쓰기

임시 테이블을 생성하고 사용하는 SQL은 **같은 JDBC 연결**에서 실행해야 합니다.
`JdbcTemplate`과 `DataSourceTransactionManager`가 같은 `DataSource`를 사용하면, `JdbcTemplate`은 트랜잭션에 연결된 JDBC 커넥션을 재사용합니다.
[Spring `DataSourceTransactionManager` 공식 문서](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/datasource/DataSourceTransactionManager.html)

애플리케이션이 커넥션을 풀에 반환한 뒤에도 DB 세션은 살아 있을 수 있습니다.
Spring이 트랜잭션을 관리하는 코드에서는 같은 트랜잭션 범위 안에서 `JdbcTemplate`으로 생성, 조회, 갱신을 수행하고, `finally`에서 `DROP TEMPORARY TABLE IF EXISTS`를 실행해 연결 반환 전에 정리합니다.

## 관련

- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)
- [벌크 INSERT와 UPDATE, 청크 처리](/docs/knowledge/data/mysql/operations/bulk-and-chunks)
- [트랜잭션과 격리 수준](/docs/knowledge/data/mysql/transactions/isolation)
