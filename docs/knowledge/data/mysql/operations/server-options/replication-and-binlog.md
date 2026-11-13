---
format: md
id: mysql-server-options-replication-and-binlog
title: "MySQL과 MariaDB의 복제와 바이너리 로그 옵션"
sidebar_label: "복제와 바이너리 로그"
description: "server_id, log_bin, relay_log, binlog_format, sync_binlog, GTID와 SHOW REPLICA STATUS로 Source와 Replica의 쓰기 정책과 로그 보관을 구분합니다."
slug: /knowledge/data/mysql/operations/server-options/replication-and-binlog
sidebar_position: 5
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "log_bin"
  - "binlog_format"
  - "log_replica_updates"
  - "sync_binlog"
  - "gtid_mode"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options.html"
  - "https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables"
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options-replica.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_super_read_only"
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html#sysvar_sync_binlog"
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options-gtids.html"
  - "https://mariadb.com/docs/server/ha-and-performance/standard-replication/gtid"
  - "https://dev.mysql.com/doc/refman/8.4/en/show-replica-status.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/show/show-replica-status"
---

# MySQL과 MariaDB의 복제와 바이너리 로그 옵션

복제를 구성할 때는 먼저 **어느 서버가 쓰기를 받고, 어느 서버가 그 변경을 따라갈지** 정합니다.
기존 문서에서는 Master와 Slave, MySQL 공식 문서에서는 Source와 Replica라는 이름을 사용합니다.

Source는 변경을 바이너리 로그에 기록합니다.
Replica는 이 이벤트를 받아 자신의 릴레이 로그에 저장하고, 받은 변경을 데이터에 적용합니다.
Replica가 변경을 자체 바이너리 로그에도 기록할지는 다음 복제 대상이 있는지, 장애 시 쓰기 서버로 승격할지에 따라 정합니다.
[MySQL 복제 옵션](https://dev.mysql.com/doc/refman/8.4/en/replication-options.html), [MariaDB 복제 시스템 변수](https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables)

## Source와 Replica에서 보는 옵션

| 옵션 | 적용 위치 | 역할 |
|---|---|---|
| `server_id` | 복제에 참여하는 모든 서버 | 복제 구성 안에서 서버마다 고유한 ID 지정 |
| `log_bin` | 바이너리 로그를 남길 서버 | 데이터 변경 이벤트 기록 |
| `relay_log` | Replica | Source에서 받은 이벤트를 저장할 릴레이 로그 이름 지정 |
| `log_replica_updates` / `log_slave_updates` | 자체 binlog에도 복제 변경을 남길 Replica | MySQL은 `log_replica_updates`, MariaDB는 `log_slave_updates` 사용 |
| `read_only` | 애플리케이션 쓰기를 제한할 서버 | 일반 클라이언트의 직접 쓰기 제한, 복제 적용은 계속 |
| `super_read_only` | MySQL에서 쓰기를 더 강하게 제한할 서버 | `read_only`의 예외가 되는 관리 권한 계정의 직접 쓰기도 제한 |

아래는 **Source 한 대가 쓰기를 받고 Replica는 읽기에 사용하는 MySQL 8.4 구성**의 `.cnf` 예제입니다.
Replica의 바이너리 로그도 켜서 적용한 변경을 자체 로그에 남깁니다.
[MySQL Replica 옵션](https://dev.mysql.com/doc/refman/8.4/en/replication-options-replica.html), [MySQL `super_read_only`](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_super_read_only)

```ini
# Source 설정 파일
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-expire-logs-seconds = 604800

# Replica 설정 파일
[mysqld]
server-id = 2
relay-log = relay-bin
log-bin = mysql-bin
log-replica-updates = ON
super-read-only = ON
```

`read_only` 설정은 서버의 쓰기 정책에 맞춥니다.
양쪽이 서로 복제하면서 각각 애플리케이션 쓰기를 받는 구성이라면, Replica 역할도 한다는 이유만으로 `read_only`를 켤 필요는 없습니다.
이 경우에는 두 서버가 같은 행을 동시에 변경할 때 충돌을 어떻게 막을지 정해야 합니다.

## 바이너리 로그 형식, 회전과 보관

| 옵션 | 확인할 내용 |
|---|---|
| `binlog_format` | `ROW`는 변경된 행을, `STATEMENT`는 실행한 SQL 문을 기록. `MIXED`는 상황에 따라 두 형식을 사용 |
| `max_binlog_size` | 로그 파일이 회전하는 크기 기준. 트랜잭션 하나는 파일 사이에 나뉘지 않으므로 큰 트랜잭션으로 기준을 초과할 수 있음 |
| `binlog_expire_logs_seconds` | 바이너리 로그의 자동 삭제 기준 시간. `604800`은 7일 |

MySQL 8.4에서는 `ROW`가 기본이고 `binlog_format` 변수는 사용 중단 예정입니다.
기존 설정 파일을 옮길 때는 대상 제품과 버전에서 현재 형식을 확인합니다.
로그 보관 기간은 **Replica가 끊겼다가 다시 따라잡는 데 필요한 시간**과 **백업 이후 특정 시점까지 복구하는 데 필요한 기간**을 함께 고려해 정합니다.
[MySQL 바이너리 로그 옵션](https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html), [MariaDB 복제 시스템 변수](https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables)

## 커밋 내구성과 GTID

`innodb_flush_log_at_trx_commit`은 **InnoDB redo 로그**, `sync_binlog`는 **바이너리 로그**를 디스크에 동기화하는 시점을 제어합니다.
두 값을 `1`로 두는 설정은 장애가 발생했을 때 커밋된 변경과 복제에 필요한 로그를 보존하는 데 초점을 둡니다.
[MySQL InnoDB 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html), [MySQL `sync_binlog`](https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html#sysvar_sync_binlog)

GTID를 사용하면 Replica가 **이미 적용한 트랜잭션을 식별자 기준으로 추적**할 수 있습니다.
MySQL에서는 `gtid_mode`와 `enforce_gtid_consistency`를 확인합니다.
MariaDB의 `gtid_strict_mode`는 MariaDB GTID 순서에 대한 검사를 강화하는 옵션이며, GTID로 복제 위치를 선택하는 설정은 `MASTER_USE_GTID`에서 따로 지정합니다.
[MySQL GTID 옵션](https://dev.mysql.com/doc/refman/8.4/en/replication-options-gtids.html), [MariaDB GTID](https://mariadb.com/docs/server/ha-and-performance/standard-replication/gtid)

## 적용된 설정과 복제 상태 확인하기

```sql
SHOW GLOBAL VARIABLES
WHERE Variable_name IN (
    'server_id',
    'log_bin',
    'binlog_format',
    'max_binlog_size',
    'binlog_expire_logs_seconds',
    'relay_log',
    'log_replica_updates',
    'log_slave_updates',
    'read_only',
    'super_read_only',
    'innodb_flush_log_at_trx_commit',
    'sync_binlog'
);

-- 바이너리 로그를 남기는 서버에서 파일 목록 확인
SHOW BINARY LOGS;

-- Replica에서 수신 및 적용 상태 확인
SHOW REPLICA STATUS;
```

`SHOW GLOBAL VARIABLES`는 현재 서버 설정을 보여줍니다.
Replica에서 변경이 들어오지 않는다면 `SHOW REPLICA STATUS`의 **수신 스레드와 적용 스레드 상태, 최근 I/O 오류와 SQL 오류**를 확인합니다.
구버전 MariaDB 문서에서는 같은 상태 확인 명령을 `SHOW SLAVE STATUS`로 볼 수 있습니다.
[MySQL `SHOW REPLICA STATUS`](https://dev.mysql.com/doc/refman/8.4/en/show-replica-status.html), [MariaDB `SHOW REPLICA STATUS`](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/show/show-replica-status)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [바이너리 로그와 시점 복구](/docs/knowledge/data/mysql/operations/binary-log-recovery)
- [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)
- [덤프 백업과 복제 설정](/docs/knowledge/data/mariadb/backup-and-replication)
