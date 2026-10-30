---
format: md
id: mysql-incremental-backup-merge
title: "XtraBackup 증분 백업 병합: 최신 전체 백업본 하나로 관리하기"
sidebar_label: "증분 백업 생성과 병합"
slug: /knowledge/data/mysql/operations/incremental-backup-merge
sidebar_position: 2
description: "LSN을 기준으로 XtraBackup 증분을 생성하고 전체 백업에 순서대로 병합하는 방법을 설명합니다. apply-log-only로 병합 상태를 유지하고 복원 사본에서 최종 prepare를 수행합니다."
tags:
  - MySQL
  - Database
status: active
keywords:
  - "XtraBackup 증분 병합"
  - "apply-log-only"
  - "incremental-basedir"
  - "incremental-dir"
references:
  - "https://docs.percona.com/percona-xtrabackup/8.0/create-incremental-backup.html"
  - "https://docs.percona.com/percona-xtrabackup/8.0/prepare-incremental-backup.html"
  - "https://openlife.tistory.com/entry/MySQL-%EC%9B%90%EA%B2%A9-%EC%A6%9D%EB%B6%84-%EB%B0%B1%EC%97%85-%E2%80%93-Percona-XtraBackup"
---
# 증분을 합쳐 최신 백업본 하나로 관리하기

증분 백업은 전체 백업에 자동으로 합쳐지지 않고 별도 디렉터리에 생성됩니다.\
이 증분을 전체 백업에 순서대로 적용하면, 마지막 증분 시점까지 반영한 하나의 백업 디렉터리를 만들 수 있습니다.

```text
전체 백업 + 증분 1 + 증분 2
                ↓ 순서대로 병합
      증분 2 시점의 백업 디렉터리
```

여기서 하나의 백업본은 SQL 파일 하나가 아니라, 데이터 파일과 복구 정보를 갖춘 디렉터리입니다.\
이 글은 MySQL 8.0과 XtraBackup 8.0 기준이며 MariaDB Backup 명령을 대신하는 예제는 아닙니다.

## 생성과 병합은 다른 작업입니다

| 옵션 | 작업 | 의미 |
|---|---|---|
| `--backup` | 백업 생성 | 원본 DB에서 백업 파일 수집 |
| `--incremental-basedir` | 증분 생성 | 기준 백업의 `to_lsn` 이후 변경분 수집 |
| `--incremental-dir` | 증분 병합 | 해당 증분을 `--target-dir`의 백업에 적용 |
| `--prepare --apply-log-only` | 병합 준비 또는 적용 | redo를 적용하고 미커밋 트랜잭션 롤백은 보류 |
| `--prepare` | 최종 복원 준비 | 미커밋 트랜잭션 정리까지 완료 |

증분을 더 붙일 백업은 `--apply-log-only` 상태로 유지합니다.\
롤백까지 끝낸 백업에는 이후 증분을 이어 붙일 수 없으므로, 최종 prepare는 복원용 사본에서 수행합니다.

## 1. 전체 백업과 증분 생성

다음 경로는 새 백업을 위한 예시이며, 백업 계정과 데이터 파일 접근 설정은 [XtraBackup 기본 사용법](/docs/knowledge/data/mysql/operations/online-physical-backup)을 따릅니다.\
이미 최종 prepare한 백업을 재사용하지 않고 새 전체 백업으로 시작합니다.

```bash
# 전체 백업 생성
xtrabackup --backup --target-dir=/srv/backups/full \
  --user=backup --password=example-only --parallel=2

# 이후 변경이 발생한 시점: 전체 백업 이후의 증분 1
xtrabackup --backup --target-dir=/srv/backups/inc1 \
  --incremental-basedir=/srv/backups/full \
  --user=backup --password=example-only --parallel=2

# 다시 변경이 발생한 시점: 증분 1 이후의 증분 2
xtrabackup --backup --target-dir=/srv/backups/inc2 \
  --incremental-basedir=/srv/backups/inc1 \
  --user=backup --password=example-only --parallel=2
```

다음은 설명을 위한 LSN 연결 예시입니다.\
실제 값은 각 디렉터리의 `xtrabackup_checkpoints`에서 확인합니다.

| 백업 | `from_lsn` | `to_lsn` |
|---|---|---|
| full | 0 | 1000 |
| inc1 | 1000 | 1500 |
| inc2 | 1500 | 2100 |

## 2. 전체 백업에 증분을 순서대로 병합

원본 전체 백업과 별도로 `merged`라는 작업 사본을 만듭니다.\
`merged`는 아직 존재하지 않는 새 경로이며, 복사본을 만들 공간이 필요합니다.

```bash
cp -a /srv/backups/full /srv/backups/merged

# 전체 백업의 redo를 적용하되 롤백은 미룸
xtrabackup --prepare --apply-log-only \
  --target-dir=/srv/backups/merged --use-memory=512M

# 증분 1 병합
xtrabackup --prepare --apply-log-only \
  --target-dir=/srv/backups/merged \
  --incremental-dir=/srv/backups/inc1 --use-memory=512M

# 증분 2 병합
xtrabackup --prepare --apply-log-only \
  --target-dir=/srv/backups/merged \
  --incremental-dir=/srv/backups/inc2 --use-memory=512M
```

결과 데이터는 `inc2`가 아니라 **`merged` 디렉터리**에 들어 있습니다.\
`merged`는 증분 2 시점까지 전진한 상태이고, 롤백을 미뤘으므로 다음 증분도 이어서 적용할 수 있습니다.

```text
merged의 to_lsn: 1000 → inc1 병합 후 1500 → inc2 병합 후 2100
```

```bash
cat /srv/backups/merged/xtrabackup_checkpoints
cat /srv/backups/inc2/xtrabackup_checkpoints
```

병합이 성공했다면 두 파일의 `to_lsn`이 맞는지와 명령의 종료 코드, `completed OK!` 로그를 확인합니다.\
같은 증분 디렉터리를 여러 사본에 반복 prepare하지 않습니다.

## 3. 새 증분도 병합본에 계속 반영

다음 증분의 기준으로 현재 병합본을 지정하면, 그 병합본의 `to_lsn` 이후 변경분을 수집합니다.\
완료된 증분을 같은 병합본에 적용하는 흐름을 반복할 수 있습니다.

```bash
xtrabackup --backup --target-dir=/srv/backups/inc3 \
  --incremental-basedir=/srv/backups/merged \
  --user=backup --password=example-only --parallel=2

xtrabackup --prepare --apply-log-only \
  --target-dir=/srv/backups/merged \
  --incremental-dir=/srv/backups/inc3 --use-memory=512M
```

```text
원본 DB → 새 증분 생성 → merged에 병합 → 다음 증분의 기준으로 사용
```

증분 생성과 병합은 앞 단계의 성공을 확인한 뒤 순서대로 실행합니다.\
같은 `merged`를 갱신하는 작업은 동시에 실행하지 않습니다.

## 4. 복원할 사본에서 최종 prepare

복원 시에는 병합본을 새 디렉터리로 복사하고, 그 사본에서 `--apply-log-only` 없이 prepare합니다.\
복사하는 동안 병합본에 다른 증분을 적용하지 않습니다.

```bash
cp -a /srv/backups/merged /srv/backups/restore-ready

xtrabackup --prepare \
  --target-dir=/srv/backups/restore-ready --use-memory=512M
```

이제 `restore-ready`를 일반 전체 백업처럼 복원할 수 있습니다.\
복원 대상 MySQL이 정지되어 있고 데이터 디렉터리가 비어 있는 별도 환경에서 실행합니다.

```bash
xtrabackup --copy-back --target-dir=/srv/backups/restore-ready \
  --datadir=/var/lib/mysql
chown -R mysql:mysql /var/lib/mysql
```

최종 prepare는 `restore-ready`에서 수행했으므로, `merged`에는 계속 증분을 이어 붙일 수 있습니다.

## 최신 병합본과 과거 백업 보관은 구분합니다

병합은 작업 디렉터리의 내용을 최신 시점으로 갱신합니다.\
최신 병합본 하나만 남기면 그 디렉터리에서 이전 전체 백업 상태를 그대로 꺼낼 수는 없습니다.\
과거 시점 복구에 필요한 원본 전체 백업, 증분과 바이너리 로그의 보관 범위는 별도로 정합니다.

병합 성공은 실제 복원 검증과 다르므로, 별도 DB에서 기동과 주요 데이터 조회도 확인합니다.\
이 글의 명령은 절차 예제이며 실제 DB에서 실행 검증한 결과를 뜻하지 않습니다.

## 이어서 보기

- [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup)
- [XtraBackup과 mariadb-backup](/docs/knowledge/data/mysql/operations/online-physical-backup)
- [LSN, 바이너리 로그와 복제 진행 위치](/docs/knowledge/data/mysql/operations/binary-log-recovery)

<details>
<summary>참고 자료</summary>

- [XtraBackup 증분 생성](https://docs.percona.com/percona-xtrabackup/8.0/create-incremental-backup.html)
- [XtraBackup 증분 병합과 prepare](https://docs.percona.com/percona-xtrabackup/8.0/prepare-incremental-backup.html)
- [참고한 증분 백업 운영 글](https://openlife.tistory.com/entry/MySQL-%EC%9B%90%EA%B2%A9-%EC%A6%9D%EB%B6%84-%EB%B0%B1%EC%97%85-%E2%80%93-Percona-XtraBackup)

</details>
