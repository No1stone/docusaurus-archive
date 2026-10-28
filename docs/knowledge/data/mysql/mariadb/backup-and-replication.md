---
format: "md"
id: "mariadb-backup-and-replication"
title: "MariaDB 덤프 백업과 복제 설정"
sidebar_label: "덤프 백업과 복제 설정"
description: "mariadb-dump 백업과 복원, log_bin_trust_function_creators, server-id와 바이너리 로그의 역할을 구분하고 Compose 적용 예제를 제공합니다."
slug: "/knowledge/data/mariadb/backup-and-replication"
sidebar_position: 2
tags:
  - "MariaDB"
  - "Database"
status: "active"
keywords:
  - "MariaDB mariadb-dump"
  - "log_bin_trust_function_creators"
  - "MariaDB 복제"
  - "MariaDB 바이너리 로그"
references:
  - "https://mariadb.com/docs/server/clients-and-utilities/backup-restore-and-import-clients/mariadb-dump"
  - "https://mariadb.com/docs/server/ha-and-performance/standard-replication/setting-up-replication"
  - "https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables"
---
# MariaDB 덤프 백업과 복제 설정

덤프는 특정 시점의 데이터를 SQL 파일로 내보내는 작업입니다.
복제는 한 DB의 변경 내역을 다른 DB에 계속 전달하는 구성입니다.
백업과 복제는 목적이 다르며, `command`에 바이너리 로그 옵션을 넣는 것만으로 이중화가 완성되지는 않습니다.


물리 파일을 사용하는 온라인 백업은 [온라인 물리 백업](/docs/knowledge/data/mysql/operations/online-physical-backup)에서 별도로 설명합니다.


## 어떤 옵션을 어디에 넣나요?

| 목적 | 실행 위치와 옵션 |
|---|---|
| SQL 백업 파일 생성 | `mariadb-dump --single-transaction` 등 덤프 프로그램에 지정합니다. |
| 바이너리 로그 기록 | DB 서버 `command`의 `--log-bin`에 지정합니다. |
| 복제 서버 구분 | 각 DB 서버에 서로 다른 `--server-id`를 지정합니다. |
| 함수 생성 제한 완화 | 필요할 때 서버에 `--log-bin-trust-function-creators=1`을 지정합니다. |

`mariadbd`는 DB 서버이고 `mariadb-dump`는 별도로 실행하는 백업 프로그램입니다.
덤프 프로그램의 옵션을 서버 `command`에 넣지 않습니다.

## 실행 중인 컨테이너에서 덤프합니다

[Docker 실행 예제](/docs/knowledge/data/mariadb/docker-and-settings)의 DB를 대상으로 합니다.
아래 계정과 비밀번호는 공개 실습용입니다.

```bash
mkdir -p backups
docker compose exec -T mariadb mariadb-dump \
  -u root -ppass1234 \
  --default-character-set=utf8mb4 \
  --single-transaction --quick \
  --routines --events --triggers \
  --databases appdb > backups/appdb.sql
```

호스트 셸의 `>`가 파일을 생성하므로 백업은 컨테이너가 아닌 호스트의 `backups/`에 저장됩니다.
`-T`는 SQL을 파일로 내보내거나 입력받을 때 가상 터미널을 사용하지 않도록 합니다.

| 옵션 | 의미 |
|---|---|
| `--single-transaction` | InnoDB 데이터를 일관된 스냅샷으로 읽습니다. 덤프 중 대상 테이블의 DDL 변경은 피합니다. |
| `--quick` | 대량 결과를 클라이언트 메모리에 한꺼번에 모으지 않고 행 단위로 읽습니다. |
| `--routines` | 저장 프로시저와 함수를 포함합니다. |
| `--events` | 이벤트 정의를 포함합니다. 실행 스케줄러의 활성화 여부는 별도입니다. |
| `--triggers` | 트리거 정의를 포함합니다. 기본으로 포함되지만 예제에서 명시했습니다. |
| `--databases appdb` | DB 생성과 선택 구문을 포함해 내보냅니다. |

`--single-transaction`은 MyISAM 등 비트랜잭션 테이블의 일관성까지 보장하지 않습니다.
이 덤프는 `appdb`의 백업이며 DB 사용자와 권한, 서버 설정 전체를 포함한 백업은 아닙니다.
[공식 mariadb-dump 문서](https://mariadb.com/docs/server/clients-and-utilities/backup-restore-and-import-clients/mariadb-dump)의 엔진과 옵션 제약을 확인합니다.

## 복원은 별도 환경에서 확인합니다

다음 명령은 연결된 대상 DB에 덤프 내용을 반영합니다.
먼저 복원 대상이 별도의 실습 환경인지 확인합니다.

```bash
docker compose exec -T mariadb mariadb \
  --default-character-set=utf8mb4 -u root -ppass1234 < backups/appdb.sql
```

덤프 파일에는 기존 테이블을 재생성하는 구문이 포함될 수 있습니다.
백업 파일 생성 성공과 복원 성공을 구분하고, 실제 복원 후 행 수와 주요 데이터를 확인합니다.

```sql
SHOW TABLES FROM appdb;
```

## log_bin_trust_function_creators는 덤프 허용 옵션인가요?

정확히는 바이너리 로그를 사용할 때 저장 함수 등의 생성 제한을 완화하는 서버 설정입니다.
복원 과정에서 함수 생성 제한 오류가 났다면 관련될 수 있지만, 모든 덤프 오류를 해결하거나 부족한 사용자 권한과 `DEFINER` 문제를 없애는 옵션은 아닙니다.

```yaml
services:
  mariadb:
    command:
      - mariadbd
      - --log-bin-trust-function-creators=1
```

이 조각은 해당 옵션의 추가 위치만 보여줍니다.
기존 Compose에 적용할 때는 앞 글의 문자셋과 타임존 등 `command` 항목을 유지하고 옵션을 추가합니다.

```sql
SHOW GLOBAL VARIABLES LIKE 'log_bin';
SHOW GLOBAL VARIABLES LIKE 'log_bin_trust_function_creators';
```

바이너리 로그가 켜진 서버에서 함수 작성자를 신뢰하는 쪽으로 제한을 완화하므로, 필요한 경우에만 선택합니다.
관련 조건은 [복제와 바이너리 로그 변수](https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables#log_bin_trust_function_creators)를 참고합니다.

## 복제를 준비하는 Primary 시작 옵션

기본 Compose의 `command`에 다음 항목을 추가하면 Primary의 바이너리 로그를 준비할 수 있습니다.
문자셋과 타임존 등 기존 항목은 유지합니다.

```yaml
services:
  mariadb:
    command:
      - mariadbd
      - --bind-address=0.0.0.0
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_general_ci
      - --skip-name-resolve=ON
      - --lower-case-table-names=1
      - --default-time-zone=+09:00
      - --server-id=1
      - --log-bin=mariadb-bin
      - --binlog-format=ROW
      - --binlog-expire-logs-seconds=604800
```

| 옵션 | 의미 |
|---|---|
| `--server-id=1` | 복제 구성에서 서버를 식별합니다. Replica에는 2 등 다른 값을 사용합니다. |
| `--log-bin=mariadb-bin` | 데이터 변경을 바이너리 로그에 기록합니다. |
| `--binlog-format=ROW` | 변경된 행을 기준으로 기록합니다. 로그량은 변경 패턴과 데이터 크기에 따라 달라집니다. |
| `--binlog-expire-logs-seconds=604800` | 로그 보존 기간을 7일로 지정합니다. 실제 삭제는 로그 회전 등 정리 시점에 수행됩니다. |

바이너리 로그에는 디스크 공간과 쓰기 비용이 발생합니다.
Replica 지연과 복구에 필요한 기간을 고려해 보존 기간을 정합니다.
무조건 켜 두어야 하는 일반 개발 환경 옵션은 아닙니다.

```sql
SELECT @@server_id, @@log_bin, @@binlog_format;
SHOW BINARY LOGS;
```

## 복제 옵션을 넣어도 아직 이중화는 아닙니다

실제 복제에는 별도 Replica와 데이터 저장 경로, 복제 전용 계정, 일관된 초기 데이터, 복제 시작 위치 또는 GTID 및 Replica 연결 설정이 필요합니다.
자동 장애 전환에는 장애 판단과 쓰기 대상 전환, 구 Primary의 중복 쓰기를 막는 절차도 추가로 필요합니다.
Primary와 Replica 컨테이너를 같은 호스트에 띄우면 복제 실습은 가능하지만 호스트 장애를 견디는 구성은 아닙니다.

복제가 잘못된 삭제까지 전달할 수 있으므로, Replica가 있어도 별도 백업을 유지합니다.
이 글은 시작 옵션의 역할과 백업 예제를 다루며 전체 복제 구축 절차는 [공식 복제 구성 문서](https://mariadb.com/docs/server/ha-and-performance/standard-replication/setting-up-replication)에서 이어서 확인합니다.

<details>
<summary>공식 참고 자료</summary>

- [mariadb-dump](https://mariadb.com/docs/server/clients-and-utilities/backup-restore-and-import-clients/mariadb-dump)
- [복제 구성](https://mariadb.com/docs/server/ha-and-performance/standard-replication/setting-up-replication)
- [복제와 바이너리 로그 변수](https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables)

</details>
