---
format: md
id: mysql-online-physical-backup
title: "MySQL과 MariaDB 온라인 물리 백업: XtraBackup과 mariadb-backup"
sidebar_label: "온라인 물리 백업"
description: "SQL 덤프와 물리 백업의 차이를 설명하고, 실행 중인 DB에서 데이터 파일을 백업하는 XtraBackup과 mariadb-backup의 backup, prepare 및 복원 과정을 정리합니다."
slug: /knowledge/data/mysql/operations/online-physical-backup
sidebar_position: 5
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
  - "https://docs.percona.com/percona-xtrabackup/8.0/create-full-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/prepare-full-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/restore-a-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/supported-versions.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/privileges.html"
  - "https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/full-backup-and-restore-with-mariadb-backup"
  - "https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-overview"
---
# MySQL과 MariaDB 온라인 물리 백업

SQL을 내보내는 덤프 외에, DB를 실행한 상태에서 데이터 파일을 백업하는 온라인 물리 백업이 있습니다.
호스트의 데이터 디렉터리를 단순 복사하는 방식과 달리 전용 도구가 파일과 복구에 필요한 로그를 함께 수집합니다.
흔히 핫백업이라고 부르며, 바이너리 로그만 보관하는 작업과는 구분합니다.

## 덤프, 물리 백업과 바이너리 로그의 차이

| 방식 | 보관하는 것과 용도 |
|---|---|
| 논리 덤프 | 스키마와 데이터를 SQL 등으로 내보냅니다. 다른 구조나 환경으로 옮기는 작업에도 사용할 수 있습니다. |
| 물리 백업 | 데이터 파일과 복구에 필요한 로그 등을 보관합니다. 파일 형식과 서버 버전의 호환성을 확인합니다. |
| 바이너리 로그 보관 | 백업 이후의 변경을 기록합니다. 기준 백업과 연결해 시점 복구에 사용할 수 있습니다. |
| 단순 파일 복사 | 실행 중인 파일의 일관성을 보장하지 않습니다. 온라인 물리 백업과 같은 방법이 아닙니다. |

InnoDB의 논리 덤프도 `--single-transaction`으로 서버를 중지하지 않고 수행할 수 있습니다.
물리 백업만 온라인 백업이 가능한 것은 아닙니다.
물리 백업은 대량 데이터를 SQL로 다시 INSERT하는 복원 과정과 다른 경로를 사용하지만, 실제 백업과 복구 시간은 데이터와 장비에서 확인합니다.

## 제품에 맞는 도구를 사용합니다

| 대상 | 이 글에서 설명하는 도구 |
|---|---|
| 지원되는 MySQL 8.0 환경 | Percona XtraBackup 8.0 |
| MariaDB | 서버 버전에 호환되는 mariadb-backup |

MySQL과 MariaDB의 데이터 파일을 서로 교환하거나 두 백업 도구를 임의로 바꾸어 사용하지 않습니다.
서버와 백업 도구의 버전이 같은 계열이라는 이유만으로 모든 패치 조합이 지원된다고 가정하지 않습니다.
먼저 [XtraBackup 지원 버전](https://docs.percona.com/percona-xtrabackup/8.0/supported-versions.html)과 MariaDB 도구의 호환 조건을 확인합니다.

```sql
SELECT VERSION(), @@version_comment, @@datadir;
SHOW VARIABLES LIKE 'innodb_page_size';
```

## 무중단은 잠금과 부하가 없다는 뜻이 아닙니다

InnoDB를 실행한 상태에서 백업할 수 있지만, DDL이나 비트랜잭션 테이블 및 도구가 사용하는 백업 단계에 따라 잠금과 대기가 발생할 수 있습니다.
백업 파일을 읽고 쓰는 디스크 부하와 로그 수집 비용도 있습니다.
백업 중 스키마 변경을 피하고, 긴 트랜잭션과 남은 공간을 확인합니다.
[MariaDB 백업 개요](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-overview)에서도 엔진과 백업 단계에 따른 동작을 구분합니다.

```text
실행 중인 DB → backup → 데이터 파일과 로그
                         ↓
                       prepare
                         ↓
              정지된 복원 대상에 copy-back
                         ↓
                  DB 시작과 데이터 검증
```

## MySQL: XtraBackup 기본 흐름

다음은 지원 버전의 XtraBackup이 설치되어 있고 원본 데이터 파일에 접근할 수 있는 호스트에서 실행하는 예제입니다.
일반 애플리케이션 DB 계정만으로 수행되는 작업은 아닙니다.
DB 백업 계정의 권한과 운영체제 파일 접근 권한을 [공식 권한 문서](https://docs.percona.com/percona-xtrabackup/8.0/privileges.html)에 맞춰 준비합니다.
`example-only`는 실습용 비밀번호입니다.

```bash
xtrabackup --backup --datadir=/var/lib/mysql \
  --target-dir=/srv/backups/full-20261028 \
  --user=backup --password=example-only

xtrabackup --prepare --target-dir=/srv/backups/full-20261028
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
  --user=root --password=pass1234

docker exec mariadb mariadb-backup --prepare \
  --target-dir=/tmp/full-20261028

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

## 증분 백업과 시점 복구는 이어지는 별도 단계입니다

전체 백업 뒤 변경분을 보관하는 증분 백업도 가능하지만, 기준 백업과 증분의 연결 및 적용 순서를 관리해야 합니다.
물리 백업 도구가 복구에 사용한 redo 로그와, 이후 시점 복구에 사용하는 바이너리 로그는 같은 것이 아닙니다.
원하는 시점까지 복구하려면 기준 백업의 로그 위치 또는 GTID 정보와 이후 바이너리 로그를 함께 보관하고 복구 절차를 검증합니다.

이 글의 명령은 전체 물리 백업과 복원 실습이며 증분 병합과 시점 복구를 수행하지 않습니다.
암호화된 DB라면 복원에 필요한 키와 설정도 별도로 보관합니다.
복제 서버와 백업은 서로 대체하지 않습니다.

## 이어서 읽기

- [MySQL CLI와 덤프 백업](/docs/knowledge/k-mysql-cli)
- [MariaDB 덤프와 복제 설정](/docs/knowledge/data/mariadb/backup-and-replication)
- [MySQL Docker 데이터 보존](/docs/knowledge/data/mysql/operations/docker-and-persistence)

<details>
<summary>공식 참고 자료</summary>

- [XtraBackup 전체 백업](https://docs.percona.com/percona-xtrabackup/8.0/create-full-backup.html)
- [XtraBackup prepare](https://docs.percona.com/percona-xtrabackup/8.0/prepare-full-backup.html)
- [XtraBackup 복원](https://docs.percona.com/percona-xtrabackup/8.0/restore-a-backup.html)
- [XtraBackup 지원 버전](https://docs.percona.com/percona-xtrabackup/8.0/supported-versions.html)
- [XtraBackup 권한](https://docs.percona.com/percona-xtrabackup/8.0/privileges.html)
- [MariaDB 전체 물리 백업과 복원](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/full-backup-and-restore-with-mariadb-backup)
- [MariaDB 백업 개요](https://mariadb.com/docs/server/server-usage/backup-and-restore/mariadb-backup/mariadb-backup-overview)

</details>
