---
format: md
id: mysql-server-options
title: "MySQL과 MariaDB 서버 옵션"
sidebar_label: "서버 옵션"
description: "MySQL과 MariaDB 서버 옵션을 설정 확인, 기본값, 접속, 메모리와 잠금, 복제와 바이너리 로그, 이벤트 스케줄러, 서버 로그, 트랜잭션과 격리 수준, 쿼리와 연결 타임아웃, 테이블 캐시와 파일 디스크립터, TLS 접속, sql_safe_updates, 프로세스 목록과 KILL, 다이제스트 누적 시간, EXPLAIN과 ANALYZE, 인덱스와 테이블 스캔, ANALYZE TABLE 통계, 함수와 타입 변환, 잠금 대기와 차단으로 나눠 안내하는 입구입니다."
slug: /knowledge/data/mysql/operations/server-options
sidebar_position: 0
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "MySQL 서버 옵션"
  - "MariaDB 시스템 변수"
  - "SHOW VARIABLES"
  - "my.cnf"
  - "서버 설정 확인"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
---

# MySQL과 MariaDB 서버 옵션

서버가 어떤 값으로 떠 있는지, 무엇을 바꿔도 되는지 먼저 확인하는 입구입니다.
옵션 이름과 적용 범위(GLOBAL, SESSION), 재시작 여부는 제품과 버전마다 다를 수 있으므로 공식 시스템 변수 문서를 함께 봅니다.

Compose로 올린 실습 서버의 역할별 옵션 예는 [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)를 봅니다.
변수 전체 목록은 [MySQL 서버 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)를 기준으로 합니다.

## 목차

| 주제 | 다룰 옵션과 확인 항목 |
|---|---|
| [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change) | `SHOW VARIABLES`, `SHOW GLOBAL VARIABLES`, `SET GLOBAL` / `SET SESSION`, 설정 파일(`my.cnf`, `*.cnf`), `SET PERSIST`, 재시작 후 유지 여부 |
| [서버 기본값](/docs/knowledge/data/mysql/operations/server-options/server-defaults) | `character_set_server`, `collation_server`, `default-time-zone`, `lower_case_table_names` |
| [접속과 SQL 동작](/docs/knowledge/data/mysql/operations/server-options/connection-and-sql-mode) | `bind_address`, `max_connections`, `wait_timeout`, `max_allowed_packet`, `sql_mode`, `skip_name_resolve` |
| [메모리와 잠금](/docs/knowledge/data/mysql/operations/server-options/memory-and-locks) | `innodb_buffer_pool_size`, `tmp_table_size`, `temptable_max_ram`, `max_heap_table_size`, `innodb_lock_wait_timeout`, `lock_wait_timeout` |
| [복제와 바이너리 로그](/docs/knowledge/data/mysql/operations/server-options/replication-and-binlog) | `server_id`, `log_bin`, `relay_log`, `binlog_format`, `sync_binlog`, `gtid_mode`, `log_replica_updates` |
| [이벤트 스케줄러](/docs/knowledge/data/mysql/operations/server-options/event-scheduler) | `event_scheduler`, `CREATE EVENT`, 재시작 후 유지, 복제 환경 활성 상태 |
| [서버 로그](/docs/knowledge/data/mysql/operations/server-options/server-logs) | `log_error`, `slow_query_log`, `long_query_time`, `general_log`, `log_output` |
| [트랜잭션과 격리 수준](/docs/knowledge/data/mysql/operations/server-options/transaction-and-isolation) | `autocommit`, `transaction_isolation`, `READ COMMITTED`, `REPEATABLE READ`, `SET TRANSACTION` |
| [쿼리와 연결 타임아웃](/docs/knowledge/data/mysql/operations/server-options/query-and-connection-timeouts) | `max_execution_time`, `max_statement_time`, `connect_timeout`, `net_read_timeout`, `net_write_timeout`, `wait_timeout` |
| [테이블 캐시와 파일 디스크립터](/docs/knowledge/data/mysql/operations/server-options/table-cache-and-file-descriptors) | `table_open_cache`, `table_definition_cache`, `open_files_limit`, `Opened_tables` |
| [TLS 접속](/docs/knowledge/data/mysql/operations/server-options/tls-connections) | `require_secure_transport`, `ssl_ca`, `ssl_cert`, `ssl_key`, JDBC `sslMode`, `Ssl_cipher` |
| [sql_safe_updates](/docs/knowledge/data/mysql/operations/server-options/sql-safe-updates) | `sql_safe_updates`, `ERROR 1175`, PK 조건 `UPDATE`/`DELETE`, 세션 옵션 복원 |
| [프로세스 목록과 KILL](/docs/knowledge/data/mysql/operations/server-options/processlist-and-kill) | `SHOW FULL PROCESSLIST`, `KILL QUERY`, `KILL CONNECTION`, 메타데이터 잠금 |
| [다이제스트 누적 시간](/docs/knowledge/data/mysql/operations/server-options/statement-digest-totals) | `events_statements_summary_by_digest`, `DIGEST_TEXT`, 누적 실행 시간, `statements_digest` |
| [EXPLAIN과 ANALYZE](/docs/knowledge/data/mysql/operations/server-options/explain-and-analyze) | `EXPLAIN FORMAT=JSON`, `EXPLAIN ANALYZE`, `ANALYZE FORMAT=JSON`, 실제 행 수와 반복 |
| [인덱스와 테이블 스캔](/docs/knowledge/data/mysql/operations/server-options/index-present-but-table-scan) | `type = ALL`, `possible_keys`와 `key`, 선택도, `ANALYZE TABLE` |
| [ANALYZE TABLE 통계](/docs/knowledge/data/mysql/operations/server-options/analyze-table-statistics) | `ANALYZE TABLE`, `Cardinality`, 히스토그램, `ANALYZE LOCAL TABLE` |
| [함수와 타입 변환](/docs/knowledge/data/mysql/operations/server-options/functions-and-type-conversion-indexes) | `DATE()` 범위 조건, 암시적 타입 변환, `EXPLAIN` 비교 |
| [잠금 대기와 차단](/docs/knowledge/data/mysql/operations/server-options/lock-waits-and-blocking-sessions) | `innodb_lock_waits`, 메타데이터 잠금, `schema_table_lock_waits` |
