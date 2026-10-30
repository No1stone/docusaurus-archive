---
format: md
id: mysql-backup-overview
title: "MySQL과 MariaDB 운영 백업 구성: 전체, 증분, 로그와 레플리카"
sidebar_label: "운영 백업 구성"
slug: /knowledge/data/mysql/operations/backup
sidebar_position: 0
description: "대용량 DB에서 물리 백업과 스냅샷, 전체와 증분 백업, 바이너리 로그 및 레플리카 백업을 조합하는 방법을 설명합니다."
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "대용량 MySQL 백업"
  - "MariaDB 운영 백업"
  - "전체 증분 백업"
  - "레플리카 백업"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/backup-policy.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/create-incremental-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/prepare-incremental-backup.html"
  - "https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/replication.html"
---
# 대용량 DB의 운영 백업 구성

대용량 운영 DB의 백업은 데이터를 보관하는 작업과 장애 시 복구하는 과정을 함께 설계합니다.\
여기서는 파일 기반 물리 백업 또는 스토리지 스냅샷을 기준으로, 전체 백업, 증분 백업, 바이너리 로그와 레플리카를 어떻게 조합하는지 살펴봅니다.

## 백업 용어를 나누는 기준

| 구분 기준 | 항목 | 의미 |
|---|---|---|
| 보관 대상 | 논리 백업, 물리 백업 | SQL 표현 또는 DB 파일과 스토리지 상태 |
| 확보 방법 | 파일 백업 도구, 스토리지 스냅샷 | 파일과 로그 수집 또는 특정 시점 저장소 상태 확보 |
| 백업 범위 | 전체 백업, 증분 백업 | 전체 데이터 또는 기준 백업 이후 변경분 |
| 시점 복구 | 바이너리 로그 | 기준 백업 이후 목표 시점까지 변경 재적용 |
| 수행 위치 | 원본, 레플리카 | 백업 작업을 수행할 서버 |

따라서 물리 백업과 증분 백업은 서로 반대되는 개념이 아닙니다.\
물리 백업 도구로 전체 백업과 증분 백업을 만들 수 있고, 그 작업을 레플리카에서 수행할 수도 있습니다.\
DB 데이터를 복원하는 데 사용하는 스토리지 스냅샷도 물리 백업 방식에 속합니다.

## SQL 덤프, 파일 백업, 스냅샷 비교

| 방식 | 실제 보관 대상 | 복원 방법 |
|---|---|---|
| SQL 덤프, 논리 백업 | `backup.sql` 안의 CREATE, INSERT 등 | SQL 실행으로 구조와 데이터 재생성 |
| XtraBackup 등의 파일 기반 물리 백업 | `.ibd` 등 DB 데이터 파일과 복구 로그 | prepare 후 데이터 파일 복원 |
| 스토리지 스냅샷을 이용한 물리 백업 | 특정 시점의 볼륨 또는 파일시스템 상태 | 해당 상태의 볼륨, 파일시스템을 복원해 DB 실행 |

### 논리 백업: SQL로 다시 만들기

SQL 덤프 파일은 텍스트로 열어 내용을 읽을 수 있습니다.\
예를 들어 테이블과 데이터가 다음처럼 SQL로 들어 있습니다.

```sql
-- backup.sql 안의 내용 예시
CREATE TABLE vehicle (
    id BIGINT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL
);
INSERT INTO vehicle (id, plate_number) VALUES (1, '123가4567');
```

### 파일 기반 물리 백업: DB가 사용하는 파일 보관

MySQL이 데이터를 저장하는 경로가 `/var/lib/mysql`이라면 파일 배치는 다음과 비슷합니다.\
아래는 MySQL 8.0의 파일 예시이며, 실제 파일명과 배치는 버전과 설정에 따라 달라집니다.

```text
/var/lib/mysql/
├── appdb/
│   └── vehicle.ibd       ← 테이블 데이터와 인덱스, file-per-table 사용 시
├── ibdata1              ← InnoDB 시스템 테이블스페이스
├── ...                  ← redo, undo 등 엔진이 사용하는 파일
├── binlog.000001        ← 바이너리 로그
└── binlog.index         ← 바이너리 로그 파일 목록
```

`vehicle.ibd`에는 INSERT 문장이 아닌 DB 엔진이 읽는 형식의 데이터가 들어 있습니다.\
XtraBackup은 이런 데이터 파일과 복구에 필요한 로그를 백업 디렉터리에 수집합니다.\
복사하는 동안 발생한 변경을 redo 로그 등으로 모으고, `prepare`에서 백업 파일에 적용해 일관된 상태를 만듭니다.

실행 중인 데이터 폴더를 단순히 `copy`하는 것과 달리, 복사 도중 바뀐 데이터까지 맞추는 과정이 포함됩니다.

## 전체 백업과 증분 백업

전체 백업은 선택한 백업 범위의 데이터를 모두 보관합니다.\
증분 백업은 기준 백업 이후 변경된 부분을 보관하며, 단독으로는 전체 DB를 복원할 수 없습니다.

```text
일요일 전체 백업
       ↓
월요일 증분 → 화요일 증분 → 수요일 증분
```

위처럼 직전 백업을 기준으로 증분을 만들었다면, 복원할 때도 전체 백업에 월요일부터 수요일까지 순서대로 적용합니다.\
같은 전체 백업을 기준으로 매번 변경분을 만드는 방식도 있으므로, 어떤 백업을 기준으로 생성했는지 함께 기록합니다.

XtraBackup에서는 데이터 페이지의 변경을 기준으로 증분을 생성합니다.\
기준 데이터 파일이 담긴 전체 백업과 증분의 연결 정보가 필요하며, 적용 명령은 도구별 prepare 절차를 따릅니다.

### 증분을 미리 병합해 최신 백업본 유지하기

증분이 생길 때마다 작업용 전체 백업에 병합하면, 복원 시 여러 증분을 처음부터 합치는 작업을 줄일 수 있습니다.\
새 증분은 병합본의 마지막 LSN 이후부터 생성하고, 병합본을 해당 시점까지 갱신합니다.

```text
전체 백업 사본 → 증분 1 병합 → 증분 2 병합 → 최신 병합본
                                                   ↓ 사본 생성
                                            최종 prepare → 복원
```

계속 갱신할 병합본은 `--apply-log-only` 상태로 유지하고, 복원용 사본에서 롤백까지 포함한 prepare를 마칩니다.\
구체적인 생성과 병합 명령은 [증분 백업 생성과 병합](/docs/knowledge/data/mysql/operations/incremental-backup-merge)에 정리했습니다.

### 스냅샷의 증분 저장

스냅샷의 증분 저장은 별도로 구분합니다.\
예를 들어 EBS는 이전 스냅샷 이후 변경된 블록을 저장하지만, 사용자는 선택한 스냅샷에서 해당 시점의 볼륨을 복원합니다.\
XtraBackup의 증분 디렉터리를 순서대로 병합하는 절차와는 다릅니다.

## 바이너리 로그를 함께 보관하는 이유

새벽 2시에 전체 백업을 만들고 오후 3시에 장애가 났다면, 전체 백업만으로는 새벽 2시 상태까지 돌아갑니다.\
그 이후의 바이너리 로그를 별도 보관했다면, 기준 백업에 대응하는 로그 위치부터 변경을 적용해 복구 시점을 더 앞으로 가져갈 수 있습니다.

```text
전체 백업 복원 → 필요한 증분 적용 → 이후 바이너리 로그 적용 → 목표 시점
```

증분을 사용하지 않는 구성이라면 전체 백업 복원 뒤 바이너리 로그를 적용합니다.\
로그 파일의 실제 위치와 역할은 [바이너리 로그와 시점 복구](/docs/knowledge/data/mysql/operations/binary-log-recovery)에서 설명합니다.

## 레플리카에서 백업하기

레플리카 백업은 새로운 백업 파일 형식이 아니라, 원본 대신 복제 서버에서 백업 작업을 수행하는 구성입니다.\
원본 서비스의 디스크와 CPU에 백업 부하가 직접 겹치는 것을 줄일 수 있습니다.

```text
원본 DB ── 복제 ──→ 레플리카
                        │
                전체 백업, 증분 백업
                        │
                  별도 백업 저장소

바이너리 로그 ─────────→ 별도 보관
```

복제가 지연됐다면 레플리카의 백업 시점도 원본보다 뒤처집니다.\
백업 데이터가 원본의 어느 GTID 또는 바이너리 로그 위치까지 반영한 상태인지 함께 확보해야 이후 변경을 이어서 적용할 수 있습니다.

레플리카 자체는 과거 백업을 대신하지 않습니다.\
잘못된 DELETE나 DROP도 복제될 수 있으므로, 이전 시점으로 돌아갈 백업과 로그를 별도로 보관합니다.

## 방법별로 이어서 보기

| 글 | 다루는 내용 |
|---|---|
| [SQL 덤프와 복원](/docs/knowledge/k-mysql-cli) | MySQL CLI, SQL 파일 생성과 재입력 |
| [XtraBackup과 mariadb-backup](/docs/knowledge/data/mysql/operations/online-physical-backup) | 파일 백업, 스레드와 I/O 옵션, prepare와 복원 |
| [증분 백업 생성과 병합](/docs/knowledge/data/mysql/operations/incremental-backup-merge) | LSN 기준 증분 생성, 최신 병합본 유지와 최종 prepare |
| [스토리지 스냅샷](/docs/knowledge/data/mysql/operations/storage-snapshots) | EBS와 로컬 스냅샷, 트랜잭션 중 촬영과 복원 |
| [바이너리 로그와 시점 복구](/docs/knowledge/data/mysql/operations/binary-log-recovery) | 실제 로그 경로, 백업 이후 변경 적용과 복제 연결 |

<details>
<summary>공식 참고 자료</summary>

- [MySQL 백업 방법](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html)
- [MySQL 백업 정책](https://dev.mysql.com/doc/refman/8.0/en/backup-policy.html)
- [XtraBackup 증분 생성](https://docs.percona.com/percona-xtrabackup/8.0/create-incremental-backup.html)
- [XtraBackup 증분 prepare](https://docs.percona.com/percona-xtrabackup/8.0/prepare-incremental-backup.html)
- [EBS 스냅샷 동작](https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html)
- [MySQL 복제](https://dev.mysql.com/doc/refman/8.0/en/replication.html)

</details>
