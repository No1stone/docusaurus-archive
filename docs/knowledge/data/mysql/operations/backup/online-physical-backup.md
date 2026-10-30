---
format: md
id: mysql-online-physical-backup
title: "XtraBackup과 mariadb-backup: 물리 백업과 복원 방법"
sidebar_label: "XtraBackup과 mariadb-backup"
description: "XtraBackup과 mariadb-backup의 파일 기반 물리 백업, 스레드와 I/O 옵션, prepare 및 Docker 복원 예제를 설명합니다."
slug: /knowledge/data/mysql/operations/online-physical-backup
sidebar_position: 1
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "MySQL 무중단 백업"
  - "온라인 물리 백업"
  - "Percona XtraBackup"
  - "mariadb-backup prepare 복원"
references:
  - "https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-options"
  - "https://docs.percona.com/percona-xtrabackup/8.0/xtrabackup-option-reference.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/create-full-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/prepare-full-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/restore-a-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/supported-versions.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/privileges.html"
  - "https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/full-backup-and-restore-with-mariadb-backup"
  - "https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-overview"
---
# XtraBackup과 mariadb-backup

[운영 백업 구성](/docs/knowledge/data/mysql/operations/backup)에서 전체, 증분, 스냅샷과 로그의 관계를 먼저 살펴볼 수 있습니다.\
이 글은 파일 기반 물리 백업 도구의 실행 방법을 다룹니다.

## XtraBackup과 mariadb-backup이란?

**XtraBackup은 Percona에서 제공하는 MySQL용 물리 백업 도구입니다.**\
SQL을 생성하는 대신 데이터 파일과 복구에 필요한 로그를 백업합니다.\
MariaDB에서는 같은 목적의 도구인 `mariadb-backup`을 사용합니다.

| 대상 | SQL 덤프 도구 | 이 글에서 사용할 물리 백업 도구 |
|---|---|---|
| MySQL 8.0 | mysqldump | Percona XtraBackup 8.0 |
| MariaDB | mariadb-dump | mariadb-backup |

두 물리 백업 도구의 기본 흐름은 `backup → prepare → copy-back`입니다.\
백업과 prepare는 원본 DB를 실행한 상태에서 수행하고, copy-back은 복원 대상 DB를 정지한 상태에서 수행합니다.

```text
backup       데이터 파일과 로그 수집
   ↓
prepare      수집한 로그를 백업 파일에 적용
   ↓
copy-back    복원 대상의 데이터 디렉터리에 복사
   ↓
DB 실행      데이터와 애플리케이션 조회 확인
```

## 백업 부하 조절

InnoDB의 SQL 덤프는 `--single-transaction`, 물리 백업은 전용 도구를 사용해 서버를 실행한 상태에서 수행할 수 있습니다.\
백업 중에는 조회, 파일 복사, 압축 작업이 CPU와 디스크 자원을 사용합니다.\
운영 서비스와 자원을 공유하므로 병렬 처리 수와 I/O 속도를 조절합니다.

### XtraBackup 옵션

| 옵션 예시 | 적용 작업 | 역할 |
|---|---|---|
| `--parallel=2` | backup의 파일 복사 | 동시에 복사할 파일의 작업 스레드 수 |
| `--throttle=20` | backup | 초당 복사 청크 수 제한, MB/s와는 다른 단위 |
| `--compress=zstd` | backup | 백업 파일 압축 |
| `--compress-threads=2` | 압축 사용 시 | 압축 작업 스레드 수, 파일 복사 스레드와 별도 |
| `--use-memory=512M` | prepare | 복구 작업에 사용할 메모리 설정, 프로세스 전체 메모리 상한과는 구분 |

`--parallel`을 높이면 파일 복사 병렬성이 늘어나지만 CPU와 디스크 부하도 증가할 수 있습니다.\
XtraBackup 8.0.35-33부터는 증분 prepare의 delta 파일 적용에도 `--parallel`을 사용할 수 있습니다.\
전체 백업 예제에서는 파일 복사 수를 조절하는 용도로 사용합니다.

### mariadb-backup 옵션

| 옵션 예시 | 적용 작업 | 역할 |
|---|---|---|
| `--parallel=2` | backup의 파일 복사 | 데이터 파일 전송 스레드 수 |
| `--throttle=20` | backup | 초당 백업 I/O 작업 수 제한, MB/s와는 다른 단위 |
| `--use-memory=512M` | prepare | prepare 단계의 버퍼 풀 크기 설정 |

`--parallel`은 CPU 사용률을 직접 제한하는 옵션이 아닙니다.\
두 도구 모두 복사 병렬 수를 작게 시작하고, 운영 응답 시간과 디스크 사용량을 보며 조절합니다.\
아래 예제의 `2`, `20`, `512M`은 옵션 적용을 보여주기 위한 값입니다.

## MySQL: XtraBackup 기본 흐름

다음은 지원 버전의 XtraBackup이 설치되어 있고 원본 데이터 파일에 접근할 수 있는 호스트에서 실행하는 예제입니다.
일반 애플리케이션 DB 계정만으로 수행되는 작업은 아닙니다.
DB 백업 계정의 권한과 운영체제 파일 접근 권한을 [공식 권한 문서](https://docs.percona.com/percona-xtrabackup/8.0/privileges.html)에 맞춰 준비합니다.
`example-only`는 실습용 비밀번호입니다.

```bash
xtrabackup --backup --datadir=/var/lib/mysql \
  --target-dir=/srv/backups/full-20261028 \
  --parallel=2 --throttle=20 \
  --user=backup --password=example-only

xtrabackup --prepare --target-dir=/srv/backups/full-20261028 \
  --use-memory=512M
```

전체 백업의 대상 디렉터리는 새 경로이거나 비어 있어야 합니다.
[backup 단계](https://docs.percona.com/percona-xtrabackup/8.0/create-full-backup.html)는 복사 중 발생하는 로그도 함께 수집합니다.
[prepare 단계](https://docs.percona.com/percona-xtrabackup/8.0/prepare-full-backup.html)는 백업 파일에 복구 작업을 적용해 일관된 상태로 만듭니다.
파일 복사 완료만 보고 prepare를 생략하지 않습니다.

### 복원은 서버를 정지하고 빈 대상에 수행합니다

아래 명령은 복원 대상의 MySQL이 정지되어 있고 `/var/lib/mysql`이 비어 있는 별도 환경을 전제로 합니다.
기존 운영 데이터를 삭제하거나 실행 중인 DB 파일 위에 덮어쓰는 명령이 아닙니다.

```bash
xtrabackup --copy-back --target-dir=/srv/backups/full-20261028 \
  --datadir=/var/lib/mysql
chown -R mysql:mysql /var/lib/mysql
```

복원 후 서버 환경에 맞게 MySQL을 시작하고 계정과 데이터를 확인합니다.
[복원 공식 문서](https://docs.percona.com/percona-xtrabackup/8.0/restore-a-backup.html)의 빈 데이터 디렉터리와 소유권 조건을 따릅니다.

## MariaDB: Docker 환경에서 물리 백업 실습

[MariaDB Docker 예제](/docs/knowledge/data/mariadb/docker-and-settings)의 `mariadb` 컨테이너와 공개 실습용 root 비밀번호 `pass1234`를 사용합니다.
해당 이미지에 백업 도구가 있는지 먼저 확인합니다.

```bash
docker exec mariadb mariadb-backup --version
```

### 1. 백업과 prepare

```bash
docker exec mariadb mariadb-backup --backup \
  --target-dir=/tmp/full-20261028 \
  --parallel=2 --throttle=20 \
  --user=root --password=pass1234

docker exec mariadb mariadb-backup --prepare \
  --target-dir=/tmp/full-20261028 \
  --use-memory=512M

mkdir -p backups
docker cp mariadb:/tmp/full-20261028 ./backups/full-20261028
```

원본 DB를 중지하지 않고 별도 디렉터리로 백업한 다음 prepare를 실행합니다.
prepare는 원본 데이터 디렉터리가 아니라 백업 파일에 수행합니다.
두 단계가 성공했는지 종료 코드와 로그를 확인한 뒤 호스트로 복사합니다.

이 예제는 간단한 실습을 위해 컨테이너 내부 임시 경로를 거칩니다.
운영에서는 백업 전용 마운트나 스트리밍 경로를 준비해 DB 컨테이너의 쓰기 계층 공간이 부족해지지 않도록 하고, 완성된 백업을 다른 장비나 저장소에도 보관합니다.
원본 서버와 같은 디스크에만 남기는 것은 장비 장애에 대한 보호가 아닙니다.
백업 경로는 실행할 때마다 새로 정합니다.

### 2. 별도 데이터 디렉터리로 복원

다음은 원본 컨테이너와 무관한 새 복원 디렉터리를 사용하는 실습입니다.
`mariadb-restore-data`는 비어 있어야 하며 실행 중인 DB가 사용해서는 안 됩니다.
앞 예제와 호환되는 이미지 버전을 사용합니다.

```bash
mkdir -p mariadb-restore-data

docker run --rm --network none \
  -v "$PWD/backups/full-20261028:/backup:ro" \
  -v "$PWD/mariadb-restore-data:/var/lib/mysql" \
  --entrypoint mariadb-backup mariadb:11.4 \
  --copy-back --target-dir=/backup --datadir=/var/lib/mysql

docker run --rm --network none \
  -v "$PWD/mariadb-restore-data:/var/lib/mysql" \
  --entrypoint sh mariadb:11.4 \
  -c 'chown -R mysql:mysql /var/lib/mysql'
```

`--copy-back`은 백업 원본을 남기면서 복사합니다.
원본 데이터 디렉터리로 복원하려면 먼저 원본 DB를 정지하고 기존 데이터의 보관 및 교체 절차를 따릅니다.
전체 과정의 기준은 [MariaDB 전체 백업과 복원](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/full-backup-and-restore-with-mariadb-backup)입니다.

### 3. 복원 DB를 실행하고 검증

앞 MariaDB 예제의 `lower-case-table-names=1`과 맞춰 별도 컨테이너를 실행합니다.
호스트 포트를 공개하지 않고 내부 명령으로 확인합니다.

```bash
docker run -d --name mariadb-restore-check --network none \
  -v "$PWD/mariadb-restore-data:/var/lib/mysql" \
  mariadb:11.4 --lower-case-table-names=1

docker logs mariadb-restore-check
# DB 준비 후 실행합니다.
docker exec mariadb-restore-check mariadb -u root -ppass1234 \
  -e "SELECT VERSION(); SHOW TABLES FROM appdb;"
```

물리 백업만으로 Compose 환경변수, 별도 마운트 설정, TLS 키와 컨테이너 헬스체크 인증 파일까지 모두 복원된다고 가정하지 않습니다.
이 항목은 별도로 보관하고, 복원 환경에서는 실제 SQL 접속과 헬스체크를 각각 확인합니다.

파일만 복원하지 말고 주요 테이블의 행 수, 금액 합계와 최근 기록 및 애플리케이션 조회까지 확인합니다.
DB 시작이 성공해도 업무 데이터 복구가 확인된 것은 아닙니다.
예제의 복원 DB는 외부에 공개되지 않으며 확인 후 중지할 수 있습니다.

```bash
docker stop mariadb-restore-check
docker rm mariadb-restore-check
```

이 명령은 바인드 마운트에 남은 복원 데이터를 삭제하지 않습니다.

## 증분 백업과 시점 복구로 연결

이 글의 실행 예제는 전체 물리 백업과 복원을 다룹니다.\
증분을 생성해 전체 백업에 계속 합치는 방법은 [증분 백업 생성과 병합](/docs/knowledge/data/mysql/operations/incremental-backup-merge)에서 별도로 설명합니다.\
증분 백업과 레플리카에서 백업하는 구성은 [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup), 백업 이후 변경 적용은 [바이너리 로그와 시점 복구](/docs/knowledge/data/mysql/operations/binary-log-recovery)에서 설명합니다.

## 이어서 읽기

- [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup)
- [스토리지 스냅샷](/docs/knowledge/data/mysql/operations/storage-snapshots)
- [바이너리 로그와 시점 복구](/docs/knowledge/data/mysql/operations/binary-log-recovery)

- [MySQL CLI와 덤프 백업](/docs/knowledge/k-mysql-cli)
- [MariaDB 덤프와 복제 설정](/docs/knowledge/data/mariadb/backup-and-replication)
- [MySQL Docker 데이터 보존](/docs/knowledge/data/mysql/operations/docker-and-persistence)

<details>
<summary>공식 참고 자료</summary>


- [XtraBackup 옵션](https://docs.percona.com/percona-xtrabackup/8.0/xtrabackup-option-reference.html)
- [mariadb-backup 옵션](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-options)

- [XtraBackup 전체 백업](https://docs.percona.com/percona-xtrabackup/8.0/create-full-backup.html)
- [XtraBackup prepare](https://docs.percona.com/percona-xtrabackup/8.0/prepare-full-backup.html)
- [XtraBackup 복원](https://docs.percona.com/percona-xtrabackup/8.0/restore-a-backup.html)
- [XtraBackup 지원 버전](https://docs.percona.com/percona-xtrabackup/8.0/supported-versions.html)
- [XtraBackup 권한](https://docs.percona.com/percona-xtrabackup/8.0/privileges.html)
- [MariaDB 전체 물리 백업과 복원](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/full-backup-and-restore-with-mariadb-backup)
- [MariaDB 백업 개요](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-overview)

</details>
