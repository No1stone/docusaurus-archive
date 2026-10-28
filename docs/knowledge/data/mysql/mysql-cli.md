---
format: "md"
id: "k-mysql-cli"
title: "MySQL CLI 접속과 백업, 복구"
description: "mysql과 mysqldump로 접속, DB 선택과 논리 백업 및 복원을 수행하고 Docker 컨테이너에서 실행하는 방법을 정리합니다."
sidebar_label: "CLI와 백업, 복구"
slug: "/knowledge/k-mysql-cli"
sidebar_position: 3
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL CLI"
  - "mysqldump"
  - "MySQL 백업 복원"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/using-mysqldump.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/mysql-command-options.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html"
---
# MySQL CLI 접속과 백업, 복구

mysql은 SQL을 실행하는 클라이언트이고 mysqldump는 SQL 형태의 논리 백업을 만드는 도구입니다.
두 명령 모두 실행하는 위치와 접속 대상 서버, 계정을 먼저 확인합니다.
예제의 mysql_notes는 [실습용 DB](/docs/knowledge/data/mysql/example-schema)이며 운영 DB가 아닙니다.

이 글의 기준 자료는 [MySQL 클라이언트와 mysqldump의 공식 사용법](https://dev.mysql.com/doc/refman/8.0/en/using-mysqldump.html)입니다.

## 접속하고 DB를 선택합니다

```bash
mysql -h 127.0.0.1 -P 3306 -u app_user -p mysql_notes
```

`-P`는 포트이고 `-p`는 비밀번호 입력 옵션입니다.
명령에 비밀번호를 붙이지 않으면 대화형으로 입력받습니다.
로컬 Unix 환경에서 localhost는 소켓 연결을 사용할 수 있으므로 TCP로 확인할 때는 주소와 포트를 명시합니다.

```sql
SELECT VERSION(), USER(), CURRENT_USER(), DATABASE();
SHOW DATABASES;
USE mysql_notes;
SHOW TABLES;
SHOW GRANTS;
```

접속 성공과 특정 테이블에 대한 조회, 수정 권한은 별개입니다.
권한 변경 명령은 [계정과 권한 관리](/docs/knowledge/k-mysql-8-x)에서 설명합니다.

## InnoDB 데이터를 논리 백업합니다

```bash
mysqldump -h 127.0.0.1 -P 3306 -u backup_user -p \
  --single-transaction --no-tablespaces \
  mysql_notes > mysql-notes.sql
```

backup_user는 필요한 백업 권한을 부여해 둔 예제 계정입니다.
실제 필요한 권한과 GTID 옵션은 서버 설정과 백업 범위에 따라 확인합니다.
`--single-transaction`은 InnoDB 데이터의 일관된 읽기에 사용하며 비트랜잭션 테이블까지 같은 스냅샷을 보장하지 않습니다.
덤프 도중 테이블 구조를 바꾸는 DDL도 피합니다.
저장 루틴과 이벤트까지 필요하면 `--routines`, `--events`와 그에 필요한 권한을 별도로 검토합니다.

명령의 종료 코드와 오류 출력을 확인합니다.
파일이 생겼다는 사실만으로 백업 성공을 판단하지 않습니다.

## 별도 DB로 복원해 확인합니다

위 덤프는 --databases 옵션을 사용하지 않아 DB 생성 명령을 포함하지 않습니다.
실습용 백업이라면 별도 DB를 만든 뒤 복원을 확인할 수 있습니다.

```sql
CREATE DATABASE mysql_notes_restore
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p \
  mysql_notes_restore < mysql-notes.sql
```

```sql
SELECT COUNT(*) FROM mysql_notes_restore.orders;
SHOW CREATE TABLE mysql_notes_restore.orders;
```

다른 글의 변경이 없는 초기 예제는 주문 4건입니다.
복잡한 뷰나 루틴이 원본 DB 이름을 참조하는 백업은 대상 이름 변경만으로 독립 복원이 되지 않을 수 있습니다.

## Docker 안에서 접속합니다

```bash
docker exec -it mysql-notes mysql -u root -p mysql_notes
```

mysql-notes는 컨테이너 이름의 예입니다.
Compose 서비스명이 mysql이면 `docker compose exec mysql mysql -u root -p mysql_notes`로 실행할 수 있습니다.
셸에 먼저 진입할 필요 없이 클라이언트를 바로 호출합니다.

## 이어서 읽기

- [MySQL 8.0 계정 생성과 권한 관리](/docs/knowledge/k-mysql-8-x)
- [MySQL Docker 배포와 데이터 보존](/docs/knowledge/data/mysql/operations/docker-and-persistence)

<details>
<summary>공식 참고 자료</summary>

- [mysql 연결 옵션](https://dev.mysql.com/doc/refman/8.0/en/mysql-command-options.html)
- [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html)
- [덤프와 복원](https://dev.mysql.com/doc/refman/8.0/en/using-mysqldump.html)

</details>
