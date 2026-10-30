---
format: md
id: mysql-binary-log-recovery
title: "MySQL과 MariaDB 바이너리 로그: 파일 번호, Position과 복제 진행 위치"
sidebar_label: "바이너리 로그와 시점 복구"
slug: /knowledge/data/mysql/operations/binary-log-recovery
sidebar_position: 3
description: "바이너리 로그 파일 번호가 증가하는 조건과 내부 이벤트, Position의 의미를 설명합니다. 레플리카의 수신 및 적용 위치, LSN과 GTID의 차이도 예제로 정리합니다."
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "MySQL binlog 경로"
  - "바이너리 로그 시점 복구"
  - "GTID 복제 백업"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/binary-log.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/log-file-maintenance.html"
  - "https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-options-binary-log.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/replication-implementation.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/show-replica-status.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/create-incremental-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/working-with-binary-logs.html"
  - "https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-gtids-concepts.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/point-in-time-recovery.html"
---
# 바이너리 로그의 번호와 복제 진행 위치

바이너리 로그는 데이터 변경을 이벤트로 기록한 파일입니다.\
파일 이름의 번호는 **몇 번째 파일인지**, Position은 **그 파일 안의 어느 위치인지**를 나타냅니다.\
복제 상태 화면에서도 같은 값이 보이지만, 원본에서 읽은 위치와 레플리카에 적용한 위치를 구분해야 합니다.

이 글의 명령과 상태 필드 예시는 MySQL 8.0 기준입니다.\
MariaDB도 파일과 위치로 복제 진행을 표현하지만 상태 필드 이름과 GTID 형식에는 차이가 있습니다.

## 바이너리 로그 파일은 어디에 있나요?

기본 데이터 경로와 파일명을 사용하는 MySQL이라면 `/var/lib/mysql/binlog.000001` 같은 파일이 생성됩니다.\
Docker에 `./mysql-data:/var/lib/mysql`을 마운트했다면 호스트에서는 `./mysql-data/binlog.000001`에 해당합니다.

```text
/var/lib/mysql/
├── binlog.000001    ← 첫 번째 로그 파일
├── binlog.000002    ← 다음 로그 파일
└── binlog.index     ← 로그 파일 목록
```

경로와 기본 이름은 설정으로 변경할 수 있으며, MariaDB에서는 `mariadb-bin.000001` 같은 이름도 사용합니다.\
현재 서버의 실제 값은 다음 명령으로 확인합니다.

```sql
SHOW VARIABLES LIKE 'datadir';
SHOW VARIABLES LIKE 'log_bin';
SHOW VARIABLES LIKE 'log_bin_basename';
SHOW VARIABLES LIKE 'max_binlog_size';
SHOW BINARY LOGS;
```

`log_bin_basename`이 `/var/lib/mysql/binlog`이면 그 경로에 `binlog.000001` 같은 파일이 생성됩니다.

## 파일 번호는 언제 올라가나요?

파일 번호는 현재 파일을 닫고 새 로그 파일을 만드는 **로그 회전** 때 증가합니다.

| 발생 조건 | 동작 |
|---|---|
| `max_binlog_size` 도달 | 트랜잭션 경계를 지켜 다음 파일로 전환 |
| MySQL 서버 재시작 | 새 바이너리 로그 파일 생성 |
| `FLUSH BINARY LOGS` 실행 | 현재 파일을 닫고 다음 번호의 파일 생성 |

```text
binlog.000007에 기록
        ↓ 파일 크기 도달 또는 로그 회전
binlog.000008에 이어서 기록
```

파일 번호는 날짜나 트랜잭션 건수를 뜻하지 않습니다.\
큰 트랜잭션 하나를 여러 binlog 파일에 나누지 않으므로, 파일 크기는 `max_binlog_size`를 넘을 수도 있습니다.

## 파일 안에는 무엇이 쌓이나요?

한 파일 안에는 여러 트랜잭션의 변경 이벤트가 순서대로 기록됩니다.\
InnoDB에서는 트랜잭션별 변경 이벤트를 캐시에 모았다가 커밋 과정에서 바이너리 로그에 기록합니다.\
여기서는 InnoDB 테이블의 데이터 변경을 기준으로 설명합니다.

```sql
BEGIN;
UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

행 기반 로그라면 위 트랜잭션을 다음과 같은 이벤트 묶음으로 이해할 수 있습니다.\
아래는 이해를 위한 도식이며 실제 파일은 바이너리 형식입니다.

```text
binlog.000007
├── 트랜잭션 시작
├── 대상 테이블 정보
├── 1번 계좌 행 변경
├── 2번 계좌 행 변경
├── 커밋 표시
├── 다음 트랜잭션 시작
└── ...
```

`ROW` 방식은 변경된 행의 정보를, `STATEMENT` 방식은 SQL 문장을 중심으로 기록합니다.\
따라서 SQL 한 번, 변경된 행 하나, 로그 이벤트 하나가 항상 일대일로 대응하지는 않습니다.

```sql
SHOW VARIABLES LIKE 'binlog_format';
```

## Position은 무엇을 세는 값인가요?

Position은 파일 내부의 **바이트 위치**입니다.\
행 수나 트랜잭션 수를 세는 값이 아니며, 기록한 이벤트의 크기에 따라 증가합니다.

```text
binlog.000007
    위치 320 ── 이벤트 기록 ──→ 480
    위치 480 ── 이벤트 기록 ──→ 790
    위치 790 ── 다음 이벤트 ──→ ...
```

숫자는 설명용입니다.\
다음 파일로 전환하면 파일 번호는 증가하고 Position은 새 파일의 시작 부분에서 다시 진행하므로, 반드시 **파일 이름과 Position을 한 쌍으로** 봅니다.

```text
binlog.000007 : 900000000
          ↓ 파일 전환
binlog.000008 : 157
```

Position 숫자가 작아졌어도 이전 상태로 돌아간 것은 아닙니다.\
파일이 바뀌었기 때문입니다.

MySQL 8.0에서는 현재 서버가 기록 중인 파일과 위치를 다음 명령으로 확인합니다.

```sql
SHOW MASTER STATUS;
```

파일 내부 이벤트의 시작 위치와 끝 위치는 다음 명령으로 확인할 수 있습니다.

```sql
SHOW BINLOG EVENTS IN 'binlog.000007' LIMIT 10;
```

출력의 `Pos`는 이벤트 시작 위치, `End_log_pos`는 다음 이벤트가 시작할 위치를 나타냅니다.\
행 변경의 상세 내용은 파일에 접근할 수 있는 환경에서 `mysqlbinlog`로 확인합니다.

```bash
mysqlbinlog --base64-output=DECODE-ROWS -vv /var/lib/mysql/binlog.000007
```

## 레플리카에서는 왜 계속 올라가나요?

레플리카는 원본의 로그를 받아 보관한 뒤, 자기 DB에 변경을 적용합니다.\
클라이언트가 레플리카에 직접 쓰기 요청을 보내지 않아도 복제 작업 자체가 데이터 변경을 발생시킵니다.

```text
원본 DB의 binlog
        ↓ 수신
레플리카의 relay log에 보관
        ↓ 적용
레플리카 데이터 변경 → 자체 redo 기록, LSN 증가
        ↓ 설정에 따라
레플리카 자체 binlog에도 변경 기록
```

바이너리 로깅과 `log_replica_updates`가 활성화돼 있으면 복제된 변경도 레플리카의 자체 binlog에 기록됩니다.\
이전 버전의 설정 이름은 `log_slave_updates`입니다.

### 복제 상태 화면의 값 구분

```sql
SHOW REPLICA STATUS\G
```

MySQL의 일반적인 파일 위치 기반 상태 필드는 다음과 같이 읽습니다.\
오른쪽은 기존 `SHOW SLAVE STATUS` 출력에서 사용하던 이름입니다.

| 값의 대상 | 현재 필드 묶음 | 기존 필드 묶음 | 의미 |
|---|---|---|---|
| 원본에서 수신한 위치 | `Source_Log_File`, `Read_Source_Log_Pos` | `Master_Log_File`, `Read_Master_Log_Pos` | 원본 로그를 어디까지 받았는지 |
| 원본 변경을 적용한 위치 | `Relay_Source_Log_File`, `Exec_Source_Log_Pos` | `Relay_Master_Log_File`, `Exec_Master_Log_Pos` | 원본 로그 중 어디까지 적용했는지 |
| 레플리카 내부 relay log 위치 | `Relay_Log_File`, `Relay_Log_Pos` | 동일 | 로컬 중계 로그에서 적용하는 위치 |

각 Position은 대응하는 파일 이름과 함께 해석합니다.\
수신은 앞서가고 적용은 뒤처질 수 있으며, 여러 적용 작업자를 쓰는 경우 적용 위치는 작업자 전체가 진행한 경계를 나타낼 수 있습니다.

원본과 레플리카의 **자체 binlog 파일 번호나 LSN이 같아야 하는 것은 아닙니다.**\
각 서버가 자기 로그를 생성하므로, 복제 상태에서 표시하는 원본 진행 위치와 레플리카 자체 로그 위치를 구분합니다.

## 물리 백업의 LSN은 무엇인가요?

LSN은 Log Sequence Number의 약자로, InnoDB redo 로그의 진행 위치입니다.\
redo 로그의 바이트가 기록되면서 증가하며, 커밋 건수나 binlog 파일 번호와는 다른 값입니다.\
한 트랜잭션 안에서 여러 변경이 발생해도 계속 증가할 수 있습니다.

XtraBackup의 `xtrabackup_checkpoints` 파일은 새 번호를 발급하는 파일이 아닙니다.\
백업의 시작과 끝 LSN을 기록해, 다음 증분 백업이 어느 지점부터 이어지는지 확인하는 메타데이터입니다.

```text
전체 백업: from_lsn = 0       to_lsn = 1000
증분 1:    from_lsn = 1000    to_lsn = 1500
증분 2:    from_lsn = 1500    to_lsn = 2100
```

위 값은 설명용이며, 각 증분을 직전 백업 기준으로 만든 경우입니다.\
이전 백업의 `to_lsn`과 다음 증분의 `from_lsn`을 연결합니다.\
증분을 실제로 합치는 명령은 [증분 백업 생성과 병합](/docs/knowledge/data/mysql/operations/incremental-backup-merge)에서 이어집니다.

```bash
cat /srv/backups/full/xtrabackup_checkpoints
cat /srv/backups/inc1/xtrabackup_checkpoints
```

LSN과 binlog Position은 서로 바꿔 쓰거나 숫자로 직접 비교하지 않습니다.\
XtraBackup에서 백업한 서버의 binlog 파일과 위치는 `xtrabackup_binlog_info`로 확인할 수 있습니다.

```bash
cat /srv/backups/full/xtrabackup_binlog_info
# 예: binlog.000007    790
```

레플리카에서 백업했다면 해당 서버의 자체 binlog 위치와, 복제 원본에서 어디까지 적용했는지도 구분해서 확보합니다.

## GTID는 파일 위치 대신 트랜잭션을 식별하는 방법입니다

파일과 Position은 “어디서부터 로그를 읽을지”를 지정합니다.\
GTID는 “어떤 트랜잭션을 이미 적용했는지”를 식별합니다.\
GTID를 사용하도록 설정한 MySQL에서는 원본 서버의 UUID와 트랜잭션 순번으로 표현합니다.

```text
3E11FA47-71CA-11E1-9E33-C80AA9429562:123
└────────── 원본 서버 UUID ──────────┘ └ 순번
```

같은 트랜잭션을 복제하면 GTID도 유지되므로, 레플리카가 처리한 것과 아직 필요한 것을 구분할 수 있습니다.\
업무 테이블의 PK나 파일 번호를 뜻하지 않습니다.\
MariaDB는 다른 GTID 형식을 사용하므로 위 예시와 구분합니다.

## 백업 복원과 복제는 어떤 지점에서 이어지나요?

백업 파일에는 특정 시점까지의 데이터가 들어 있습니다.\
그 데이터에 대응하는 binlog 파일과 Position, 또는 GTID 정보를 함께 보관하면 이후 변경을 이어서 적용할 수 있습니다.

```text
기준 백업 복원 → 필요한 증분 적용 → 대응하는 지점 이후 binlog 적용
```

복원한 DB를 레플리카로 연결하는 경우도 같은 원리입니다.\
원본에 필요한 로그가 남아 있어야 하고, 복제는 데이터 행을 비교해서 차이를 자동 수정하는 기능이 아닙니다.

스냅샷에서 미완료로 남아 롤백한 트랜잭션도 원본에서 이후 커밋됐다면 복제로 적용될 수 있습니다.\
원본에서도 커밋하지 않은 트랜잭션은 적용 대상이 아닙니다.

로그는 원본 서버와 분리해 보관하고, 실수로 데이터를 삭제했다면 그 트랜잭션 직전에서 재적용을 멈춥니다.\
전체 구성은 [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup), 실행 예제는 [XtraBackup과 mariadb-backup](/docs/knowledge/data/mysql/operations/online-physical-backup)에서 이어집니다.

<details>
<summary>공식 참고 자료</summary>

- [MySQL 바이너리 로그](https://dev.mysql.com/doc/refman/8.0/en/binary-log.html)
- [MySQL 로그 파일 관리](https://dev.mysql.com/doc/refman/8.0/en/log-file-maintenance.html)
- [MySQL 바이너리 로그 설정](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-options-binary-log.html)
- [MySQL 복제 처리 흐름](https://dev.mysql.com/doc/refman/8.0/en/replication-implementation.html)
- [MySQL 레플리카 상태](https://dev.mysql.com/doc/refman/8.0/en/show-replica-status.html)
- [InnoDB redo 로그와 LSN](https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html)
- [XtraBackup 증분과 체크포인트](https://docs.percona.com/percona-xtrabackup/8.0/create-incremental-backup.html)
- [XtraBackup 바이너리 로그 좌표](https://docs.percona.com/percona-xtrabackup/8.0/working-with-binary-logs.html)
- [MySQL GTID 형식](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-gtids-concepts.html)
- [MySQL 시점 복구](https://dev.mysql.com/doc/refman/8.0/en/point-in-time-recovery.html)

</details>
