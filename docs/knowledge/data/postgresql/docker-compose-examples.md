---
format: md
id: postgresql-docker-compose-examples
title: "PostgreSQL 18 Docker Compose 예제: 데이터 볼륨, WAL과 복제 옵션"
sidebar_label: "Docker Compose 예제"
slug: /knowledge/data/postgresql/docker-compose-examples
sidebar_position: 1
description: "PostgreSQL 18 공식 이미지의 Docker Compose 전체 예제로 PGDATA, 설정과 백업 마운트, 메모리, WAL, 복제와 헬스체크 옵션을 설명합니다."
tags:
  - PostgreSQL
  - Docker
  - Database
status: active
keywords:
  - "PostgreSQL 18 Docker Compose"
  - "PGDATA 볼륨 경로"
  - "PostgreSQL WAL hot_standby"
  - "PostgreSQL 설정 파일"
references:
  - "https://hub.docker.com/_/postgres"
  - "https://www.postgresql.org/docs/18/runtime-config-wal.html"
  - "https://www.postgresql.org/docs/18/runtime-config-replication.html"
  - "https://www.postgresql.org/docs/18/runtime-config-resource.html"
  - "https://www.postgresql.org/docs/18/config-setting.html"
  - "https://www.postgresql.org/docs/18/hot-standby.html"
  - "https://www.postgresql.org/docs/18/app-pg-isready.html"
  - "https://www.postgresql.org/docs/18/app-pgdump.html"
---
# PostgreSQL Docker Compose 예제

PostgreSQL 18 공식 이미지를 기준으로 네트워크, 데이터와 설정 경로, 메모리, WAL과 복제 옵션을 한곳에 정리합니다.\
[MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)와 같은 방식으로 시작하되, PostgreSQL의 설정 이름과 저장 구조에 맞춰 사용합니다.

## 디렉터리 구성

```text
project/
├── compose.postgres.yaml
├── .env
└── postgres/
    ├── data/               # 호스트의 데이터 마운트
    │   └── 18/docker/      # 컨테이너 PGDATA에 해당
    ├── conf/               # 선택적으로 사용할 설정 파일
    └── backup/             # 직접 생성할 백업 결과
```

PostgreSQL 18 공식 이미지는 `/var/lib/postgresql` 아래 버전별 데이터 경로를 사용합니다.\
이 예제에서는 `PGDATA=/var/lib/postgresql/18/docker`로 명시합니다.

| 공식 이미지 | 기본 데이터 경로 | 이 경로 체계의 마운트 대상 |
|---|---|---|
| PostgreSQL 17 이전 | `/var/lib/postgresql/data` | `/var/lib/postgresql/data` |
| PostgreSQL 18 | `/var/lib/postgresql/18/docker` | 상위 `/var/lib/postgresql` |

기존 버전 데이터를 두고 이미지 태그와 경로만 바꾸는 것은 메이저 버전 마이그레이션이 아닙니다.

## 전체 Compose 예제

`compose.postgres.yaml`로 저장합니다.

```yaml
services:
  postgres:
    image: postgres:18
    container_name: postgres
    restart: unless-stopped

    # Network
    ports:
      - "${POSTGRES_PORT:-5432}:5432"

    # Linux Host Network 사용 시 ports 제거
    # network_mode: host

    # extra_hosts:
    #   - "host.docker.internal:host-gateway"

    # networks:
    #   - db-network

    # Environment
    environment:
      TZ: Asia/Seoul
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-app}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --auth-host=scram-sha-256"
      PGDATA: /var/lib/postgresql/18/docker

    # PostgreSQL 18 공식 이미지의 상위 데이터 경로에 마운트
    volumes:
      - ./postgres/data:/var/lib/postgresql
      - ./postgres/conf:/etc/postgresql:ro
      - ./postgres/backup:/backup
      # 빈 데이터 디렉터리 초기화 시 한 번 실행
      # - ./postgres/init:/docker-entrypoint-initdb.d:ro

    # 서버 옵션은 postgres -c 이름=값 형식
    command:
      - postgres
      - -c
      - listen_addresses=*
      - -c
      - timezone=Asia/Seoul
      - -c
      - log_timezone=Asia/Seoul
      - -c
      - max_connections=${POSTGRES_MAX_CONNECTIONS:-100}
      - -c
      - shared_buffers=${POSTGRES_SHARED_BUFFERS:-256MB}
      - -c
      - wal_level=replica
      - -c
      - max_wal_senders=10
      - -c
      - max_replication_slots=10
      - -c
      - hot_standby=${POSTGRES_HOT_STANDBY:-on}
      - -c
      - archive_mode=off
      - -c
      - fsync=on
      - -c
      - synchronous_commit=on
      - -c
      - full_page_writes=on
      - -c
      - log_destination=stderr
      - -c
      - logging_collector=off

    # 병렬 작업 등에 사용하는 컨테이너 공유 메모리
    shm_size: 256mb

    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -h 127.0.0.1 -U "$${POSTGRES_USER}" -d "$${POSTGRES_DB}"
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

# networks:
#   db-network:
#     driver: bridge
```

`.env`는 다음과 같이 작성합니다.\
비밀번호는 실제로 사용하지 않는 공개 예시입니다.

```dotenv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Example-only-Postgres-42!
POSTGRES_DB=app
POSTGRES_PORT=5432
POSTGRES_MAX_CONNECTIONS=100
POSTGRES_SHARED_BUFFERS=256MB
POSTGRES_HOT_STANDBY=on
```

```bash
mkdir -p postgres/data postgres/conf postgres/backup

docker compose -f compose.postgres.yaml config --quiet
docker compose -f compose.postgres.yaml up -d
docker compose -f compose.postgres.yaml ps
docker compose -f compose.postgres.yaml logs --tail=100 postgres
```

`POSTGRES_USER`는 최초에 생성하는 관리자 계정입니다.\
애플리케이션용 일반 계정은 초기 SQL이나 별도 계정 생성으로 관리합니다.\
초기화 환경변수와 `/docker-entrypoint-initdb.d`의 SQL은 빈 데이터 디렉터리를 처음 초기화할 때 사용됩니다.

## 주요 옵션과 추가 설정

기본 예제의 수치는 설명용이며 장비 사양과 연결 풀, 쿼리 특성에 맞춰 조절합니다.

| 설정 | 역할 |
|---|---|
| `listen_addresses=*` | 컨테이너 내부 수신 인터페이스, Docker 포트 공개와 접속 인증은 별도 |
| `timezone`, `log_timezone` | DB 세션과 서버 로그의 기본 타임존 |
| `max_connections=100` | DB 연결 수 상한 |
| `shared_buffers=256MB` | DB가 공유하는 데이터 페이지 캐시, 프로세스 전체 메모리 상한은 아님 |
| `shm_size: 256mb` | 컨테이너의 `/dev/shm` 크기, shared_buffers와는 다른 설정 |
| `wal_level=replica` | 물리 복제와 WAL 아카이빙에 필요한 기록 수준 |
| `max_wal_senders=10` | WAL 전송 프로세스 수 상한 |
| `max_replication_slots=10` | 복제 슬롯 수 상한, 슬롯 자동 생성은 아님 |
| `hot_standby=on` | 복구 또는 대기 서버에서 읽기 쿼리 허용 |
| `archive_mode=off` | 별도 WAL 아카이브 작업 비활성화 |
| `fsync=on` | 데이터 변경의 디스크 동기화 활성화 |
| `synchronous_commit=on` | 커밋 성공 응답 전 필요한 WAL 내구성 확보, 동기 레플리카 대기는 별도 구성 |
| `full_page_writes=on` | 체크포인트 이후 첫 페이지 변경 시 전체 페이지 이미지를 WAL에 기록 |
| `log_destination=stderr`, `logging_collector=off` | 서버 로그를 컨테이너 로그로 전달 |

필요하면 command에 다음 옵션을 추가합니다.\
각 값은 `- -c` 다음 줄에 `- 이름=값` 형태로 지정합니다.

| 추가 옵션 예시 | 의미 |
|---|---|
| `work_mem=4MB` | 정렬, 해시 등의 개별 작업에 사용할 메모리 기준, 쿼리와 병렬 작업 수에 따라 합산 |
| `maintenance_work_mem=64MB` | VACUUM, 인덱스 생성 등 유지보수 작업의 메모리 설정 |
| `max_wal_size=1GB` | 자동 체크포인트를 유도하는 WAL 크기 기준, 디스크 사용량의 절대 상한은 아님 |
| `wal_keep_size=256MB` | 대기 서버를 위해 최근 WAL을 최소한으로 유지할 크기 |
| `max_slot_wal_keep_size=2GB` | 슬롯이 보존할 WAL 크기 기준, 초과하면 필요한 WAL이 제거될 수 있음 |
| `wal_level=logical` | 논리 복제나 논리 디코딩이 필요한 경우 |
| `log_min_duration_statement=1000` | 1초 이상 실행된 SQL 로그 기록 |
| `statement_timeout=30s` | SQL 실행 시간 제한, 긴 배치와 마이그레이션은 별도 고려 |

## 복제와 읽기 전용은 구분합니다

`wal_level=replica`, `hot_standby=on`만 지정한다고 복제가 연결되지는 않습니다.\
물리 복제에는 기준 데이터, 복제 사용자, 접속 허용 설정, 원본 연결 정보와 `standby.signal` 등 대기 서버 구성이 필요합니다.

PostgreSQL의 물리 복제 대기 서버는 WAL을 재생하는 복구 상태에서 동작합니다.\
`hot_standby=on`은 그동안 SELECT를 허용하는 설정이며, 직접 INSERT와 UPDATE까지 허용하는 옵션이 아닙니다.\
이 상태의 쓰기를 `default_transaction_read_only=off`로 풀 수는 없으며, 승격은 별도의 작업입니다.

일반 서버에서 새 트랜잭션의 기본값을 읽기 전용으로 두려면 다음 설정을 사용할 수 있습니다.

```yaml
# 최초 초기화용 기본 예제가 아니라, 초기화 후 정책에 따라 추가할 설정
- -c
- default_transaction_read_only=${POSTGRES_DEFAULT_TRANSACTION_READ_ONLY:-off}
```

이 값은 트랜잭션의 기본 설정이며 MySQL의 `super_read_only`와 동일한 강제 차단 기능이 아닙니다.\
읽기 전용 계정의 권한 설계와 물리 대기 서버의 복구 상태도 각각 구분합니다.

## conf 디렉터리는 마운트만으로 자동 적용되지 않습니다

이 예제는 `/etc/postgresql`에 설정 폴더를 연결하지만, 폴더 안의 `.conf`를 자동으로 읽게 하지는 않습니다.\
기본 예제는 command의 `-c` 옵션을 사용합니다.

설정 파일로 옮기려면 `postgres/conf/postgresql.conf`를 만들고, 해당 파일을 command에서 지정합니다.

```yaml
command:
  - postgres
  - -c
  - config_file=/etc/postgresql/postgresql.conf
```

```ini
# postgres/conf/postgresql.conf
listen_addresses = '*'
timezone = 'Asia/Seoul'
log_timezone = 'Asia/Seoul'
max_connections = 100
shared_buffers = '256MB'
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
hot_standby = on
archive_mode = off
fsync = on
synchronous_commit = on
full_page_writes = on
log_destination = 'stderr'
logging_collector = off
```

이 예시는 앞 command 블록을 대체하는 방식입니다.\
접속 허용 규칙은 `pg_hba.conf`에서 별도로 관리하며, 설정 파일을 외부로 옮겨도 네트워크 접근 권한이 자동으로 바뀌지는 않습니다.

## WAL과 backup 디렉터리

WAL은 데이터 복구와 복제에 사용하는 PostgreSQL의 변경 기록입니다.\
MySQL의 바이너리 로그와 목적이 일부 겹치지만 내부 redo 역할도 맡으므로 같은 파일 형식이나 기능으로 일대일 대응하지는 않습니다.

```text
호스트: postgres/data/18/docker/
├── base/           # DB 데이터 파일
├── global/         # 클러스터 공통 데이터
└── pg_wal/         # WAL 파일

호스트: postgres/backup/
└── app.sql         # 직접 pg_dump를 실행했을 때 생성할 논리 백업 예시
```

`/backup`을 마운트해도 WAL이 자동 복사되거나 물리 백업이 실행되지는 않습니다.\
WAL 아카이빙에는 `archive_mode`와 아카이브 명령 또는 라이브러리, 보관 대상 설정이 필요합니다.\
전체 물리 백업에는 `pg_basebackup` 같은 별도 도구를 사용합니다.

논리 백업 파일 생성은 다음과 같습니다.

```bash
docker compose -f compose.postgres.yaml exec -T postgres sh -c \
  'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /backup/app.sql'
```

같은 이름의 파일이 있으면 덮어쓰므로 실행 시 보관할 파일명을 정합니다.\
`pg_dump`는 지정한 DB를 백업하며, 역할과 같은 클러스터 전역 객체는 별도 백업 대상입니다.

## 기동과 설정 확인

```bash
docker compose -f compose.postgres.yaml exec postgres psql -U postgres -d app
```

사용자나 DB 이름을 변경했다면 명령의 값도 맞춥니다.

```sql
SELECT version();
SHOW data_directory;
SHOW config_file;
SHOW hba_file;
SHOW server_encoding;
SHOW timezone;
SHOW shared_buffers;
SHOW wal_level;
SHOW default_transaction_read_only;
SELECT pg_is_in_recovery();
```

`pg_is_in_recovery()`는 복구 중인 서버인지 확인하는 값입니다.\
`pg_isready`는 서버가 접속을 받을 상태인지 확인하지만 실제 계정 인증과 업무 SQL 성공까지 검증하지는 않습니다.

Compose 옵션과 `.env` 변경 후에는 `docker compose -f compose.postgres.yaml up -d`로 반영합니다.\
설정 파일은 항목에 따라 reload 또는 서버 재시작이 필요합니다.\
이 글의 Compose 구조 검사와 실제 DB 기동, 복제 및 백업 검증은 구분합니다.

<details>
<summary>공식 참고 자료</summary>

- [PostgreSQL 공식 이미지](https://hub.docker.com/_/postgres)
- [PostgreSQL WAL 설정](https://www.postgresql.org/docs/18/runtime-config-wal.html)
- [PostgreSQL 복제 설정](https://www.postgresql.org/docs/18/runtime-config-replication.html)
- [PostgreSQL 메모리 설정](https://www.postgresql.org/docs/18/runtime-config-resource.html)
- [PostgreSQL 설정 파일](https://www.postgresql.org/docs/18/config-setting.html)
- [PostgreSQL Hot Standby](https://www.postgresql.org/docs/18/hot-standby.html)
- [pg_isready](https://www.postgresql.org/docs/18/app-pg-isready.html)
- [pg_dump](https://www.postgresql.org/docs/18/app-pgdump.html)

</details>
