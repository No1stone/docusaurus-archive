---
format: md
id: mysql-server-options-inspect-and-change
title: "MySQL과 MariaDB 서버 설정 확인과 변경"
sidebar_label: "설정 확인과 변경"
description: "SHOW VARIABLES로 SESSION과 GLOBAL 값을 구분하고, SET SESSION과 SET GLOBAL, 설정 파일과 SET PERSIST로 재시작 후에도 설정을 유지하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/inspect-and-change
sidebar_position: 1
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "SHOW VARIABLES"
  - "SET GLOBAL"
  - "SET SESSION"
  - "SET PERSIST"
  - "MySQL 설정 변경"
  - "세션 변수"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/using-system-variables.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
  - "https://dev.mysql.com/doc/refman/8.4/en/set-variable.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set"
  - "https://dev.mysql.com/doc/refman/8.4/en/option-files.html"
  - "https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/configuring-mariadb/configuring-mariadb-with-option-files"
  - "https://dev.mysql.com/doc/refman/8.4/en/persisted-system-variables.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html"
---

# MySQL과 MariaDB 서버 설정 확인과 변경

DB 서버의 기본 타임존을 `+09:00`으로 바꿨는데, 이미 열어 둔 SQL 콘솔에서는 이전 값이 보일 수 있습니다.
서버의 기본값과 현재 연결이 사용하는 값이 따로 있기 때문입니다.

서버 설정을 확인할 때는 **지금 어느 범위의 값을 보고 있는지**부터 확인합니다.

## `SHOW VARIABLES`로 현재 값 확인하기

MySQL과 MariaDB에서는 `SHOW VARIABLES`로 시스템 변수의 값을 조회합니다.
`time_zone`처럼 세션 값과 전역 값이 모두 있는 변수는 두 값을 나란히 보면 차이를 확인하기 쉽습니다.
[MySQL 시스템 변수 사용법](https://dev.mysql.com/doc/refman/8.4/en/using-system-variables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

```sql
SHOW SESSION VARIABLES LIKE 'time_zone';
SHOW GLOBAL VARIABLES LIKE 'time_zone';

-- 한 행에서 두 값을 비교
SELECT
    @@SESSION.time_zone AS session_time_zone,
    @@GLOBAL.time_zone  AS global_time_zone;

-- 서버 전역 설정 확인
SHOW GLOBAL VARIABLES LIKE 'max_connections';
```

| 범위 | `time_zone`에서의 의미 |
|---|---|
| `SESSION` | 현재 DB 연결이 사용하는 시간대 |
| `GLOBAL` | 새 DB 연결이 처음에 받아가는 기본 시간대 |

## 현재 연결만 바꿀까, 새 연결부터 바꿀까?

SQL 콘솔에서 이번 작업에만 한국 시간대를 사용하려면 `SET SESSION`을 실행합니다.
같은 서버에 연결된 다른 콘솔이나 애플리케이션에는 영향이 없습니다.
[MySQL `SET` 문법](https://dev.mysql.com/doc/refman/8.4/en/set-variable.html), [MariaDB `SET` 문법](https://mariadb.com/docs/server/reference/sql-statements/administrative-sql-statements/set-commands/set)

```sql
SET SESSION time_zone = '+09:00';
SELECT @@SESSION.time_zone;
```

서버에 새로 접속하는 연결에도 기본값을 적용하려면 `SET GLOBAL`을 사용합니다.
전역 설정을 변경하려면 해당 권한이 필요합니다.

```sql
SET GLOBAL time_zone = '+09:00';
SELECT @@GLOBAL.time_zone;
```

변경 후 **새 DB 연결을 열어** `SELECT @@SESSION.time_zone;`을 실행하면 새 기본값을 확인할 수 있습니다.
이때 기존 연결에는 이전 세션 값이 남습니다.
Spring에서 JDBC 커넥션 풀을 사용한다면, 요청이 끝나 연결을 풀에 반환해도 실제 DB 연결은 재사용될 수 있습니다.
애플리케이션에서 값이 바뀌었는지 확인할 때도 실제로 새 연결이 만들어졌는지 함께 봅니다.

## 재시작 후에도 설정 유지하기

`SET GLOBAL`로 바꾼 값은 실행 중인 서버에 적용됩니다.
재시작 후에도 같은 값을 쓰려면 서버 설정 파일이나 시작 옵션에 반영합니다.
Docker Compose에서는 기존 Compose 파일의 `command`에 옵션을 두거나, 서버가 읽는 `.cnf` 파일을 마운트할 수 있습니다.
[MySQL 설정 파일](https://dev.mysql.com/doc/refman/8.4/en/option-files.html), [MariaDB 설정 파일](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/configuring-mariadb/configuring-mariadb-with-option-files)

```ini
[mysqld]
default-time-zone = +09:00
max-connections = 150
```

MySQL은 지원되는 시스템 변수에 `SET PERSIST`도 제공합니다.
아래 예제는 실행 중인 `max_connections` 값을 바꾸고, 데이터 디렉터리의 `mysqld-auto.cnf`에 값을 저장합니다.
Compose 파일이나 마운트한 `.cnf`를 보고 설정을 관리한다면, 별도로 저장된 값이 있는지도 확인합니다.
[MySQL 설정값 영속화](https://dev.mysql.com/doc/refman/8.4/en/persisted-system-variables.html)

```sql
SET PERSIST max_connections = 150;
SHOW GLOBAL VARIABLES LIKE 'max_connections';
```

변수마다 변경할 수 있는 시점이 다릅니다.
예를 들어 `max_connections`는 실행 중에 바꿀 수 있고, `lower_case_table_names`는 **데이터 디렉터리를 처음 초기화하기 전에** 정해야 합니다.
운영 중에 설정을 바꿀 때는 공식 변수 목록의 **Scope**와 **Dynamic**을 먼저 확인합니다.
[MySQL 서버 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)
