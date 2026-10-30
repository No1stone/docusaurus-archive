---
format: md
id: mysql-storage-snapshots
title: "MySQL과 MariaDB 스토리지 스냅샷: 물리 백업과 트랜잭션 복구"
sidebar_label: "스토리지 스냅샷"
slug: /knowledge/data/mysql/operations/storage-snapshots
sidebar_position: 2
description: "XtraBackup 파일 백업과 스토리지 스냅샷의 차이, EBS와 로컬 스냅샷 및 쓰기 트랜잭션 도중 생성한 스냅샷의 복원 동작을 설명합니다."
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "MySQL 스냅샷"
  - "EBS DB 백업"
  - "LVM 스냅샷"
  - "스냅샷 트랜잭션 롤백"
references:
  - "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html"
  - "https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-recovery.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html"
---
# 스토리지 스냅샷

스냅샷은 SQL이나 테이블을 해석하지 않고, 스토리지에서 특정 시점의 상태를 보관합니다.\
AWS에서는 EBS 스냅샷, 로컬 서버에서는 LVM, ZFS, Btrfs 등의 기능을 사용할 수 있습니다.

```text
XtraBackup
/var/lib/mysql의 DB 파일 → 백업 도구로 파일과 로그 수집 → prepare → 파일 복원

스토리지 스냅샷
DB 파일이 담긴 볼륨, 파일시스템 → 특정 시점 상태 보관 → 해당 상태로 복원
```

예를 들어 DB 데이터가 담긴 EBS 볼륨을 스냅샷으로 보관했다면, 그 스냅샷에서 새 볼륨을 만들어 DB 데이터 경로에 연결하는 방식입니다.\
DB 메모리에만 남은 내용은 포함되지 않으므로, 생성 전 쓰기 조정과 디스크 반영 등 DB 일관성을 확보하는 절차가 필요합니다.

Docker 자체의 기능이 아니라 데이터가 저장된 하위 스토리지의 기능입니다.\
로컬 스냅샷이 원본과 같은 장치에만 남는다면 장치 장애에 대비한 별도 백업도 필요합니다.

## 쓰기 트랜잭션 중에 스냅샷을 만들면?

데이터 파일과 redo, undo 로그가 같은 시점으로 확보된 InnoDB 스냅샷이라면, 복원 후 DB가 시작하면서 장애 복구를 수행합니다.\
스냅샷 시점에 커밋하지 않은 트랜잭션은 롤백하고, 디스크에 커밋 기록이 남은 변경은 redo로 데이터 파일에 반영합니다.

```text
원본 DB: A 계좌 차감 → 스냅샷 → B 계좌 입금 → COMMIT
                         │
복원 DB: 스냅샷에서 시작 → 미커밋 이체 롤백
```

원본 DB의 작업은 스냅샷과 별개로 계속 진행됩니다.\
메모리에만 남은 내용은 스냅샷에 포함되지 않으며, 데이터와 로그가 여러 볼륨에 나뉘었다면 볼륨 사이의 시점도 맞춰야 합니다.

## 환경별로 사용할 기능

| 환경 | 기능 | 복원 기준 |
|---|---|---|
| AWS EC2의 EBS | EBS 스냅샷 | 선택한 시점의 새 볼륨 생성 |
| LVM 볼륨 | LVM 스냅샷 | 논리 볼륨의 시점 상태 |
| ZFS, Btrfs | 파일시스템 스냅샷 | 데이터셋, 서브볼륨의 시점 상태 |

Ubuntu나 Docker를 사용한다는 사실만으로 로컬 스냅샷을 사용할 수 있는 것은 아닙니다.\
DB 데이터가 저장된 볼륨과 파일시스템 구성을 먼저 확인합니다.

[운영 백업 구성](/docs/knowledge/data/mysql/operations/backup)에서 전체 백업과 증분, 바이너리 로그의 관계를 이어서 설명합니다.

<details>
<summary>공식 참고 자료</summary>

- [EBS 스냅샷 생성](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html)
- [EBS 스냅샷 동작](https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html)
- [InnoDB 복구](https://dev.mysql.com/doc/refman/8.0/en/innodb-recovery.html)
- [MySQL 백업 방법과 스냅샷](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html)

</details>
