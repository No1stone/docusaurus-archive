---
format: md
id: mysql-server-options-query-and-connection-timeouts
title: "MySQL과 MariaDB의 쿼리 실행 시간과 연결 타임아웃"
sidebar_label: "쿼리와 연결 타임아웃"
description: "max_execution_time과 max_statement_time, connect_timeout, net_read_timeout, net_write_timeout, wait_timeout을 구분해 DB 타임아웃이 난 단계를 확인하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/query-and-connection-timeouts
sidebar_position: 9
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "max_execution_time"
  - "max_statement_time"
  - "wait_timeout"
  - "net_read_timeout"
  - "MySQL 쿼리 타임아웃"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/optimizer-hints.html#optimizer-hints-execution-time"
  - "https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/query-optimizations/query-limits-and-timeouts"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_max_execution_time"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set-statement"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
  - "https://github.com/brettwooldridge/HikariCP#frequently-used"
---

# MySQL과 MariaDB의 쿼리 실행 시간과 연결 타임아웃

애플리케이션에서 DB 타임아웃이 났다면 **어느 단계에서 시간이 초과됐는지**부터 확인합니다.
DB 연결을 맺을 때, 연결을 맺고 데이터를 주고받을 때, SQL을 실행할 때 각각 적용되는 옵션이 다릅니다.

## SQL 실행 시간 제한

MySQL과 MariaDB는 쿼리 실행 시간을 제한하는 옵션의 **이름, 단위, 적용 범위**가 다릅니다.
두 예제 모두 주문 조회 한 문장에 1초 제한을 적용합니다.
[MySQL `MAX_EXECUTION_TIME` 힌트](https://dev.mysql.com/doc/refman/8.4/en/optimizer-hints.html#optimizer-hints-execution-time), [MariaDB 쿼리 제한과 타임아웃](https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/query-optimizations/query-limits-and-timeouts)

| 제품 | 시스템 변수 | 단위 | 적용 범위 |
|---|---|---|---|
| MySQL 8.4 | `max_execution_time` | 밀리초 | 읽기 전용 `SELECT` |
| MariaDB | `max_statement_time` | 초, 소수점 사용 가능 | `SELECT` 외 문장에도 적용, 저장 프로시저 내부 문장 제외 |

```sql
-- MySQL 8.4
SELECT /*+ MAX_EXECUTION_TIME(1000) */ id, status
FROM orders
WHERE customer_id = 10;

-- MariaDB
SET STATEMENT max_statement_time = 1 FOR
SELECT id, status
FROM orders
WHERE customer_id = 10;
```

같은 세션의 여러 쿼리에 적용하려면 MySQL은 `SET SESSION max_execution_time = 1000`, MariaDB는 `SET SESSION max_statement_time = 1`을 사용합니다.
커넥션 풀을 사용하는 앱에서는 세션 설정이 해당 연결의 다음 작업에도 적용될 수 있습니다.
위 예제처럼 문장 단위로 지정하면 그 SQL에만 제한을 적용할 수 있습니다.
[MySQL 서버 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_max_execution_time), [MariaDB `SET STATEMENT`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set-statement)

## 서버의 연결과 전송 타임아웃

`net_read_timeout`과 `net_write_timeout`은 **DB 서버 입장**에서 읽기와 쓰기를 구분합니다.
큰 SQL이나 데이터를 업로드하는 중에는 서버가 클라이언트로부터 읽고, 큰 조회 결과를 내려주는 중에는 서버가 클라이언트에 씁니다.
[MySQL 서버 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

| 옵션 | 서버가 기다리는 대상 | 단위 |
|---|---|---|
| `connect_timeout` | 연결 초기 단계에서 클라이언트가 보내는 연결 패킷 | 초 |
| `net_read_timeout` | 클라이언트가 보내는 다음 데이터 | 초 |
| `net_write_timeout` | 클라이언트에 데이터를 쓰는 작업 | 초 |
| `wait_timeout` | 유휴 상태의 비대화형 연결에서 다음 요청 | 초 |

```sql
SHOW GLOBAL VARIABLES LIKE 'connect_timeout';

SHOW SESSION VARIABLES
WHERE Variable_name IN (
    'net_read_timeout',
    'net_write_timeout',
    'wait_timeout'
);
```

`connect_timeout`은 DB 서버가 초기 연결 패킷을 기다리는 시간입니다.
애플리케이션이 소켓 연결을 맺기 위해 기다리는 시간은 JDBC 드라이버 설정에서 확인합니다.
Spring에서 HikariCP를 쓴다면 `connectionTimeout`도 따로 봅니다.
이 값은 **애플리케이션이 풀에서 연결을 빌리기 위해 기다리는 시간**입니다.
[HikariCP 공식 설정 문서](https://github.com/brettwooldridge/HikariCP#frequently-used)

## 타임아웃이 났을 때 확인할 순서

| 증상 | 먼저 확인할 곳 |
|---|---|
| 풀에서 연결을 받기 전에 실패 | 풀의 연결 대기 시간, 사용 중인 연결 수 |
| DB에 새로 접속하는 중 실패 | JDBC 연결 설정, 서버 접속 로그 |
| 큰 요청을 올리거나 결과를 받는 중 실패 | 서버의 `net_read_timeout`, `net_write_timeout`, 클라이언트 소켓 설정 |
| SQL이 실행 제한으로 중단 | 제품별 쿼리 제한 값, 실행 계획 |
| 같은 행을 갱신하거나 DDL을 실행하는 중 대기 | 행 잠금 또는 메타데이터 잠금, 잠금을 잡고 있는 트랜잭션 |

앱에서 먼저 타임아웃을 반환했다면 DB에서 SQL이 실제로 종료됐는지도 확인합니다.
앱의 대기 시간, DB의 SQL 실행 제한, 잠금 대기 제한을 구분하면 어느 값을 조사해야 할지 좁힐 수 있습니다.

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [접속과 SQL 동작](/docs/knowledge/data/mysql/operations/server-options/connection-and-sql-mode)
- [메모리와 잠금](/docs/knowledge/data/mysql/operations/server-options/memory-and-locks)
- [서버 로그](/docs/knowledge/data/mysql/operations/server-options/server-logs)
- [느린 쿼리와 운영 진단](/docs/knowledge/data/mysql/operations/diagnostics)
