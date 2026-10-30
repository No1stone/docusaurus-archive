---
format: "md"
id: "mariadb-index"
title: "MariaDB란? Docker 실행과 운영 설정"
sidebar_label: "MariaDB"
description: "MariaDB를 Docker Compose로 실행하고 볼륨, 포트, 문자셋, 타임존, 백업과 복제 설정을 예제로 설명합니다."
slug: "/knowledge/data/mariadb"
sidebar_position: 0
tags:
  - "MariaDB"
  - "Database"
status: "active"
keywords:
  - "MariaDB"
  - "MariaDB Docker Compose"
  - "MariaDB 백업"
references:
  - "https://hub.docker.com/_/mariadb"
  - "https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/mariadb-server-docker-official-image-environment-variables"
---
# MariaDB란?

MariaDB는 MySQL에서 분기된 관계형 데이터베이스입니다.
SQL 사용법이 비슷하더라도 인증 플러그인, 기본 Collation과 운영 명령은 제품과 버전에 맞춰 확인합니다.
MySQL의 시작 옵션을 MariaDB에 그대로 옮기기보다 필요한 설정의 의미를 먼저 구분합니다.

이 영역의 실행 예제는 공식 `mariadb:11.4` 이미지를 기준으로 작성합니다.
운영 배포에서는 검증한 패치 버전이나 이미지 digest로 고정합니다.

| 글 | 설명 |
|---|---|
| [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples) | 전체 설정 예제, 볼륨과 역할별 옵션 및 추가 설정 |
| [Docker 실행과 서버 설정](/docs/knowledge/data/mariadb/docker-and-settings) | Compose, 볼륨, 포트, 문자셋, 대소문자와 타임존을 설정합니다. |
| [덤프 백업과 복제 설정](/docs/knowledge/data/mariadb/backup-and-replication) | 덤프와 복제의 차이, 바이너리 로그와 함수 생성 옵션을 설명합니다. |
| [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup) | 전체, 증분, 스냅샷과 로그 및 레플리카 백업의 관계 |
| [XtraBackup과 mariadb-backup](/docs/knowledge/data/mysql/operations/online-physical-backup) | mariadb-backup의 백업, prepare와 Docker 복원 |
| [MySQL 소개](/docs/knowledge/data/mysql) | 관계형 모델과 MySQL 및 MariaDB의 관계를 설명합니다. |

## 먼저 제품과 설정을 확인합니다

```sql
SELECT VERSION(), @@version_comment;
SELECT @@character_set_server, @@collation_server, @@time_zone;
```

Docker 환경변수는 빈 데이터 디렉터리를 처음 초기화할 때 DB와 계정을 만드는 데 사용합니다.
기존 데이터에 비밀번호나 스키마 변경을 반복 적용하는 기능은 아닙니다.
자세한 동작은 [공식 이미지 환경변수 문서](https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/mariadb-server-docker-official-image-environment-variables)를 참고합니다.

<details>
<summary>공식 참고 자료</summary>

- [MariaDB 공식 이미지](https://hub.docker.com/_/mariadb)
- [컨테이너 초기화 환경변수](https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/mariadb-server-docker-official-image-environment-variables)

</details>
