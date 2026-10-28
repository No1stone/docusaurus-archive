---
format: "md"
id: "mysql-docker-and-persistence"
title: "MySQL Docker 배포와 데이터 보존"
description: "Docker Compose로 MySQL 실습 환경을 구성하고 데이터 볼륨, 초기화 SQL과 버전 교체 시 백업과 복구 기준을 정리합니다."
sidebar_label: "Docker 배포와 데이터 보존"
slug: "/knowledge/data/mysql/operations/docker-and-persistence"
sidebar_position: 3
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL Docker Compose"
  - "데이터 볼륨"
  - "MySQL 초기화 SQL"
references:
  - "https://hub.docker.com/_/mysql"
  - "https://dev.mysql.com/doc/refman/8.0/en/upgrading.html"
  - "https://docs.docker.com/reference/cli/docker/compose/down/"
---
# MySQL Docker 배포와 데이터 보존

컨테이너는 교체할 수 있어도 DB 데이터는 유지되어야 합니다.
실행 설정과 데이터 저장 위치를 구분하고, 이미지 업데이트 전에 백업과 복원 가능 여부를 확인합니다.
아래는 개인 실습 환경이며 운영용 이중화와 접근 제어 구성은 포함하지 않습니다.

이 글의 기준 자료는 [MySQL 공식 이미지의 초기화와 볼륨 사용법](https://hub.docker.com/_/mysql)입니다.

## Compose로 실행합니다

```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:?set MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: mysql_notes
      MYSQL_USER: notes_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:?set MYSQL_PASSWORD}
    ports:
      - "127.0.0.1:3307:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init:/docker-entrypoint-initdb.d:ro

volumes:
  mysql-data:
```

실행 전 두 비밀번호 환경변수에 실습용 값을 설정합니다.

```bash
export MYSQL_ROOT_PASSWORD='Example-only-Root-42!'
export MYSQL_PASSWORD='Example-only-App-42!'
docker compose up -d
docker compose logs mysql
docker compose exec mysql mysql -u notes_user -p mysql_notes
```

서비스가 접속을 받을 준비가 되었는지 로그와 실제 연결로 확인합니다.
`mysql:8.0`은 같은 계열의 새 이미지로 바뀔 수 있는 태그입니다.
운영에서는 검증한 패치 버전이나 digest로 고정하고 업데이트 절차를 둡니다.

## 초기화 SQL이 다시 실행되지 않는 이유와 데이터 볼륨

[공통 예제 SQL](/examples/mysql/mysql-notes.sql)을 `init/`에 넣으면 빈 데이터 디렉터리를 초기화할 때 실행할 수 있습니다.
초기화 스크립트와 MYSQL_DATABASE 같은 초기 환경변수는 기존 데이터 볼륨에 매번 재적용되는 마이그레이션 기능이 아닙니다.

```sql
SELECT VERSION();
SELECT @@datadir, @@character_set_server, @@collation_server;
SHOW TABLES FROM mysql_notes;
```

Docker 호스트에서는 공개 포트 3307을 사용하고, 같은 Compose 네트워크의 다른 컨테이너는 `mysql:3306`으로 접근합니다.
다른 컨테이너의 localhost는 DB 컨테이너를 가리키지 않습니다.

```bash
docker compose down
docker compose up -d
```

일반 down 후에는 named volume이 유지됩니다.
반면 `docker compose down -v`는 이 예제의 데이터 볼륨을 삭제하므로 데이터 보존 절차에 사용하지 않습니다.
실행 중인 데이터 파일을 단순 복사하는 것만으로 일관된 백업이 된다고 가정하지 않습니다.

## 버전을 교체하기 전에 확인합니다

논리 백업은 [CLI와 백업, 복구](/docs/knowledge/k-mysql-cli)의 mysqldump 예제를 참고합니다.
백업 파일은 컨테이너와 다른 저장 위치에 보관하고 별도 환경에서 복원합니다.
이미지만 이전 태그로 돌리는 것이 데이터 파일 다운그레이드까지 보장하지는 않습니다.
MySQL과 MariaDB의 데이터 디렉터리도 서로 교환해서 사용하지 않습니다.

## 이어서 읽기

- [MySQL CLI 접속과 백업, 복구](/docs/knowledge/k-mysql-cli)
- [MySQL 8.0 계정 생성과 권한 관리](/docs/knowledge/k-mysql-8-x)

<details>
<summary>공식 참고 자료</summary>

- [MySQL Docker 공식 이미지](https://hub.docker.com/_/mysql)
- [MySQL 업그레이드](https://dev.mysql.com/doc/refman/8.0/en/upgrading.html)
- [Compose down](https://docs.docker.com/reference/cli/docker/compose/down/)

</details>
