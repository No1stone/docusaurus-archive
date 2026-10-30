---
format: md
id: mysql-mariadb-compose-examples
title: "MySQL과 MariaDB Docker Compose 예제: 볼륨, 로그와 복제 옵션"
sidebar_label: "MySQL과 MariaDB Compose 예제"
slug: /knowledge/data/mysql/operations/docker-compose-examples
sidebar_position: 4
description: "MySQL 8.4와 MariaDB 11.4의 전체 Docker Compose 예제로 데이터, 설정, 백업 마운트와 로그, 읽기 전용, 내구성 옵션을 정리합니다. 환경변수로 원본과 레플리카 설정을 구분합니다."
tags:
  - MySQL
  - MariaDB
  - Docker
status: active
keywords:
  - "MySQL 8.4 Docker Compose"
  - "MariaDB 11.4 Docker Compose"
  - "read_only super_read_only"
  - "log_replica_updates"
  - "MySQL backup 볼륨"
references:
  - "https://hub.docker.com/_/mysql"
  - "https://hub.docker.com/_/mariadb"
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options-replica.html"
  - "https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
  - "https://dev.mysql.com/doc/refman/8.4/en/mysqladmin.html"
  - "https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/"
---
# MySQL과 MariaDB Docker Compose 예제

기본 Compose 파일을 두고, 서버 역할에 따라 환경변수와 시작 옵션을 바꾸어 사용하는 예제입니다.\
MySQL은 8.4, MariaDB는 11.4를 기준으로 각각 작성합니다.\
다른 글의 MySQL 8.0 예제와 구분하며, 아래 두 파일은 제품별로 독립적으로 사용합니다.

## 디렉터리 구성

```text
project/
├── compose.mysql.yaml
├── compose.mariadb.yaml
├── .env
├── mysql/
│   ├── data/       # MySQL이 사용하는 데이터와 로그
│   ├── conf/       # 추가 설정 파일, *.cnf
│   └── backup/     # 직접 생성한 백업 결과 보관
└── mariadb/
    ├── data/
    ├── conf/
    └── backup/
```

`backup/`은 DB가 자동으로 백업을 만드는 폴더가 아닙니다.\
SQL 덤프나 물리 백업 도구의 출력 경로를 `/backup` 아래로 지정할 때 사용하는 호스트 마운트입니다.\
`mysql:8.4` 이미지에 XtraBackup이 설치되어 있다는 뜻도 아닙니다.

## MySQL 8.4 전체 예제

`compose.mysql.yaml`로 저장합니다.\
아래는 문자셋, 네트워크, 로그와 읽기 전용 옵션을 한곳에서 확인할 수 있는 기본형입니다.

```yaml
services:
  mysql:
    image: mysql:8.4
    container_name: mysql
    restart: unless-stopped

    # ==========================================
    # Network
    # ==========================================

    # 기본: Bridge + 호스트 포트 바인딩
    ports:
      - "${MYSQL_PORT:-3306}:3306"

    # Host Network (Linux)
    # 활성화 시 ports 제거
    # network_mode: host

    # 컨테이너에서 Docker 호스트 접근
    # extra_hosts:
    #   - "host.docker.internal:host-gateway"

    # 사용자 정의 Bridge Network
    # networks:
    #   - db-network

    # ==========================================
    # Environment
    # ==========================================
    environment:
      TZ: Asia/Seoul
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-app}

    # ==========================================
    # Volumes
    # ==========================================
    volumes:
      # DB 데이터 영속화
      - ./mysql/data:/var/lib/mysql

      # MySQL 설정 파일
      - ./mysql/conf:/etc/mysql/conf.d:ro

      # 백업 디렉터리
      - ./mysql/backup:/backup

    # ==========================================
    # MySQL Options
    # ==========================================
    command:
      # Character Set
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_0900_ai_ci

      # 테이블명 대소문자 구분 안 함
      # 최초 DB 초기화 시 설정 필수
      - --lower-case-table-names=1

      # Master / Replica 공통
      - --server-id=${MYSQL_SERVER_ID:-1}
      - --log-bin=mysql-bin
      - --binlog-format=ROW
      - --binlog-row-image=FULL
      - --binlog-expire-logs-seconds=604800

      # Replica / Cascading Replication
      - --relay-log=relay-bin
      - --log-replica-updates=ON
      - --read-only=${MYSQL_READ_ONLY:-OFF}
      - --super-read-only=${MYSQL_SUPER_READ_ONLY:-OFF}

      # InnoDB Durability
      - --default-storage-engine=InnoDB
      - --innodb-flush-log-at-trx-commit=1
      - --sync-binlog=1

    # ==========================================
    # Health Check
    # ==========================================
    healthcheck:
      test:
        - CMD-SHELL
        - mysqladmin ping -h 127.0.0.1 --silent
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

# ==========================================
# Custom Bridge Network (Optional)
# ==========================================
# networks:
#   db-network:
#     driver: bridge
```

이 예제의 MySQL 로그는 `/var/lib/mysql/mysql-bin.000001`처럼 생성됩니다.\
호스트에서는 `./mysql/data/mysql-bin.000001`에 해당하며 `/backup`으로 자동 복사되지 않습니다.

`--binlog-format=ROW`는 명시적인 형식 확인을 위해 남겨두었습니다.\
MySQL 8.4의 기본값도 ROW이며, `binlog_format` 설정은 deprecated 상태입니다.

### MySQL 환경변수

`.env`의 비밀번호는 실제로 사용하지 않는 공개 예시입니다.

```dotenv
MYSQL_ROOT_PASSWORD=Example-only-Root-42!
MYSQL_DATABASE=app
MYSQL_PORT=3306
MYSQL_SERVER_ID=1
MYSQL_READ_ONLY=OFF
MYSQL_SUPER_READ_ONLY=OFF
```

```bash
mkdir -p mysql/data mysql/conf mysql/backup

docker compose -f compose.mysql.yaml config --quiet
docker compose -f compose.mysql.yaml up -d
docker compose -f compose.mysql.yaml ps
docker compose -f compose.mysql.yaml logs --tail=100 mysql
```

## MariaDB 11.4 전체 예제

`compose.mariadb.yaml`로 저장합니다.\
같은 목적의 설정도 MariaDB에서 사용하는 이름으로 구분합니다.

```yaml
services:
  mariadb:
    image: mariadb:11.4
    container_name: mariadb
    restart: unless-stopped

    # Network
    ports:
      - "${MARIADB_PORT:-3307}:3306"

    # Linux Host Network 사용 시 ports 제거
    # network_mode: host

    # extra_hosts:
    #   - "host.docker.internal:host-gateway"

    # networks:
    #   - db-network

    # Environment
    environment:
      TZ: Asia/Seoul
      MARIADB_ROOT_PASSWORD: ${MARIADB_ROOT_PASSWORD}
      MARIADB_DATABASE: ${MARIADB_DATABASE:-app}

    # Volumes
    volumes:
      - ./mariadb/data:/var/lib/mysql
      - ./mariadb/conf:/etc/mysql/conf.d:ro
      - ./mariadb/backup:/backup

    # MariaDB Options
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --lower-case-table-names=1
      - --default-time-zone=+09:00

      # 원본과 레플리카에서 server-id는 각각 다르게 지정
      - --server-id=${MARIADB_SERVER_ID:-11}
      - --log-bin=mariadb-bin
      - --binlog-format=ROW
      - --binlog-row-image=FULL
      - --binlog-expire-logs-seconds=604800

      # MariaDB의 복제 변경 기록 옵션
      - --relay-log=relay-bin
      - --log-slave-updates=ON
      - --read-only=${MARIADB_READ_ONLY:-OFF}

      # InnoDB Durability
      - --default-storage-engine=InnoDB
      - --innodb-flush-log-at-trx-commit=1
      - --sync-binlog=1

    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

# networks:
#   db-network:
#     driver: bridge
```

MariaDB에서는 `MARIADB_*` 환경변수와 `log-slave-updates`를 사용합니다.\
MySQL 8.4의 `super-read-only` 옵션은 이 MariaDB 11.4 예제에 넣지 않습니다.

```dotenv
MARIADB_ROOT_PASSWORD=Example-only-Maria-42!
MARIADB_DATABASE=app
MARIADB_PORT=3307
MARIADB_SERVER_ID=11
MARIADB_READ_ONLY=OFF
```

위 값은 같은 `.env`에 함께 두어도 됩니다.\
MySQL 예제와 동시에 실행할 때 포트가 겹치지 않도록 MariaDB는 호스트 포트 3307을 사용했습니다.

```bash
mkdir -p mariadb/data mariadb/conf mariadb/backup

docker compose -f compose.mariadb.yaml config --quiet
docker compose -f compose.mariadb.yaml up -d
docker compose -f compose.mariadb.yaml ps
docker compose -f compose.mariadb.yaml logs --tail=100 mariadb
```

## 역할에 따라 바꾸는 값

| 설정 | 원본 또는 단독 서버 | 레플리카 | 역할 |
|---|---|---|---|
| MySQL `server-id` | 예: 1 | 예: 2 | 같은 복제 구성 안에서 서버별 고유값 |
| MySQL `read-only` | 정책에 따라 OFF 또는 ON | 직접 쓰기를 제한할 경우 ON | 일반 클라이언트 쓰기 제한 |
| MySQL `super-read-only` | 직접 쓰기를 받을 경우 OFF | 관리자 직접 쓰기도 제한할 경우 ON | 복제 적용은 허용 |
| MariaDB `server-id` | 예: 11 | 예: 12 | 같은 복제 구성 안에서 서버별 고유값 |
| MariaDB `read-only` | 정책에 따라 OFF 또는 ON | 직접 쓰기를 제한할 경우 ON | 관련 관리자 권한의 예외 존재 |
| 복제 변경의 binlog 기록 | 구성에 따라 ON 또는 OFF | 계단식 복제나 로그 활용 시 ON | MySQL은 `log-replica-updates`, MariaDB는 `log-slave-updates` |

레플리카라는 이유만으로 `read-only=ON`이 필수인 것은 아닙니다.\
직접 쓰기를 허용할지 정책으로 정하고, 쓰기를 허용한다면 원본의 변경과 충돌하지 않도록 설계합니다.\
읽기 전용을 선택한 새 레플리카는 기준 데이터를 준비한 뒤 해당 정책을 적용합니다.\
처음부터 빈 데이터 디렉터리를 강한 읽기 전용으로 시작하면 최초 DB 생성 같은 초기화 작업이 막힐 수 있습니다.

서버 ID와 읽기 전용 옵션만으로 복제가 연결되지는 않습니다.\
기준 백업 복원과 복제 계정, 원본 주소, 시작 위치 또는 GTID 설정이 별도로 필요합니다.

### ON/OFF로 바꿀 수 있는 옵션과 아닌 옵션

```yaml
# MySQL의 command에서 해당 줄을 교체하는 예시
- --log-replica-updates=${MYSQL_LOG_REPLICA_UPDATES:-ON}

# MariaDB의 command에서 해당 줄을 교체하는 예시
- --log-slave-updates=${MARIADB_LOG_SLAVE_UPDATES:-ON}
```

`log-bin`은 켤 때 파일의 기본 이름을 지정합니다.\
바이너리 로그를 끄려면 `--log-bin=OFF`가 아니라 `--log-bin=...` 줄을 제거하고 `--skip-log-bin`을 사용합니다.

```yaml
# 바이너리 로그를 사용하지 않는 구성의 command 예시
- --skip-log-bin
```

기존 데이터에 대한 초기 환경변수는 계정이나 비밀번호 변경 기능이 아닙니다.\
`.env`의 읽기 전용 값을 바꾸는 것과 DB 계정 비밀번호를 바꾸는 작업은 구분합니다.

## 필요에 따라 추가할 옵션

아래 값은 설명용이며 기본 예제에 모두 추가할 필요는 없습니다.

| 옵션 예시 | 대상 | 쓰는 경우와 의미 |
|---|---|---|
| `--default-time-zone=+09:00` | 공통 | DB 세션 기본 타임존 지정, 컨테이너 TZ와 별도 |
| `--max-connections=100` | 공통 | 허용할 클라이언트 연결 수 설정, 연결 풀 합계 고려 |
| `--innodb-buffer-pool-size=512M` | 공통 | InnoDB 데이터와 인덱스 캐시 크기, DB 전체 메모리 제한은 아님 |
| `--max-binlog-size=256M` | 공통 | binlog 회전 기준 크기, 큰 트랜잭션은 초과 가능 |
| `--skip-name-resolve=ON` | 공통 | DB 계정 Host 판정에서 DNS 조회 생략 |
| `--gtid-mode=ON` | MySQL | GTID 기반 복제 사용 |
| `--enforce-gtid-consistency=ON` | MySQL | GTID와 호환되는 트랜잭션 동작 제한 적용 |
| `--relay-log-recovery=ON` | MySQL 레플리카 | 비정상 종료 후 relay log 복구, 원본의 필요한 로그 보관 전제 |
| `--gtid-strict-mode=ON` | MariaDB | MariaDB GTID 순서의 일관성 검사 강화, MySQL GTID 옵션과는 구분 |

`innodb-flush-log-at-trx-commit=1`, `sync-binlog=1`은 커밋 시 로그 내구성을 우선한 설정입니다.\
일반 기능 스위치처럼 무심코 OFF로 바꾸지 않고, 다른 값을 선택할 때는 장애 시 손실 가능성과 성능을 함께 판단합니다.

애플리케이션 전용 사용자가 필요하면 서비스의 `environment`에 다음 초기화 설정을 추가할 수 있습니다.

```yaml
# MySQL
MYSQL_USER: ${MYSQL_USER:-appuser}
MYSQL_PASSWORD: ${MYSQL_PASSWORD}

# MariaDB
MARIADB_USER: ${MARIADB_USER:-appuser}
MARIADB_PASSWORD: ${MARIADB_PASSWORD}
```

두 묶음은 각 제품의 `environment` 아래에 따로 추가합니다.\
초기 SQL은 `./mysql/init:/docker-entrypoint-initdb.d:ro` 같은 마운트로 제공할 수 있으며, 빈 데이터 디렉터리의 최초 초기화 때 실행됩니다.

## 네트워크, 설정 파일과 헬스체크

| 항목 | 의미 |
|---|---|
| `ports` | 왼쪽은 호스트 포트, 오른쪽은 컨테이너 DB 포트 |
| `network_mode: host` | Linux 호스트 네트워크 사용, ports 제거 및 실제 DB 포트 충돌 확인 |
| 사용자 정의 bridge | 같은 네트워크의 앱에서 서비스 이름과 컨테이너 포트로 접속 |
| `extra_hosts` | 컨테이너에서 Docker 호스트로 접근할 이름 추가 |
| `conf/` 마운트 | 추가 `.cnf` 설정 파일, command와 같은 옵션을 중복 관리하지 않도록 구성 |

`lower-case-table-names=1`은 데이터 디렉터리를 처음 초기화하기 전에 정합니다.\
볼륨과 대소문자 설정의 세부 설명은 [MySQL Docker 배포와 데이터 보존](/docs/knowledge/data/mysql/operations/docker-and-persistence), [MariaDB 서버 설정](/docs/knowledge/data/mariadb/docker-and-settings)에서 이어집니다.

MySQL 예제의 `mysqladmin ping`은 프로세스가 접속에 응답하는지 확인합니다.\
인증 실패도 실행 중이라는 의미로 성공할 수 있으므로, 실제 계정으로 SQL을 수행하는 준비 상태 검사와는 구분합니다.\
MariaDB 예제는 공식 이미지의 `healthcheck.sh`로 연결과 InnoDB 초기화를 확인합니다.

`unhealthy`는 상태 표시이며 그 자체로 Docker의 자동 재시작을 실행하지 않습니다.\
`restart: unless-stopped`는 컨테이너 종료에 대한 정책입니다.

## 설정 반영과 확인

Compose의 command나 `.env`를 바꾼 뒤에는 `docker compose up -d`로 컨테이너 설정을 다시 반영합니다.\
마운트한 `.cnf` 내용만 바꿨다면 서버 재시작으로 다시 읽을 수 있습니다.

MySQL 예제에서는 다음처럼 실제 SQL 접속을 확인합니다.

```bash
docker compose -f compose.mysql.yaml exec mysql mysql -u root -p
```

```sql
SELECT VERSION(), @@server_id, @@read_only;
SELECT @@character_set_server, @@collation_server, @@lower_case_table_names;
SELECT @@system_time_zone, @@global.time_zone, @@session.time_zone;
SHOW VARIABLES LIKE 'log_bin%';
SHOW VARIABLES LIKE 'binlog_expire_logs_seconds';
SHOW BINARY LOGS;
```

MySQL 8.4에서 현재 binlog 위치는 `SHOW BINARY LOG STATUS`, 복제 상태는 `SHOW REPLICA STATUS`로 확인합니다.\
MariaDB에서는 `SHOW MASTER STATUS`, `SHOW SLAVE STATUS`를 사용합니다.

이 글은 시작 설정 예제입니다.\
Compose 구조 검증과 DB 실제 기동, 복제 연결 및 백업 실행 검증은 각각 구분합니다.

## 이어서 보기

- [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup)
- [바이너리 로그 번호와 복제 진행 위치](/docs/knowledge/data/mysql/operations/binary-log-recovery)
- [증분 백업 생성과 병합](/docs/knowledge/data/mysql/operations/incremental-backup-merge)

<details>
<summary>공식 참고 자료</summary>

- [MySQL 공식 이미지](https://hub.docker.com/_/mysql)
- [MariaDB 공식 이미지](https://hub.docker.com/_/mariadb)
- [MySQL 8.4 바이너리 로그 옵션](https://dev.mysql.com/doc/refman/8.4/en/replication-options-binary-log.html)
- [MySQL 8.4 레플리카 옵션](https://dev.mysql.com/doc/refman/8.4/en/replication-options-replica.html)
- [MariaDB 복제와 로그 변수](https://mariadb.com/docs/server/ha-and-performance/standard-replication/replication-and-binary-log-system-variables)
- [MariaDB 서버 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)
- [mysqladmin ping 동작](https://dev.mysql.com/doc/refman/8.4/en/mysqladmin.html)
- [Compose 변수 보간](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/)

</details>
