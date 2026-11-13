---
format: md
id: mysql-server-options-server-defaults
title: "MySQL과 MariaDB 서버 기본값 설정하기"
sidebar_label: "서버 기본값"
description: "character_set_server, collation_server, default-time-zone, lower_case_table_names의 적용 시점을 구분하고 새 데이터 디렉터리 초기화용 .cnf 예제를 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/server-defaults
sidebar_position: 2
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "character_set_server"
  - "collation_server"
  - "default-time-zone"
  - "lower_case_table_names"
  - "utf8mb4"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/charset-syntax.html"
  - "https://mariadb.com/docs/server/reference/data-types/string-data-types/character-sets/setting-character-sets-and-collations"
  - "https://dev.mysql.com/doc/refman/8.4/en/time-zone-support.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/time-zones"
  - "https://dev.mysql.com/doc/refman/8.4/en/datetime.html"
  - "https://mariadb.com/docs/server/reference/data-types/date-and-time-data-types/timestamp"
  - "https://dev.mysql.com/doc/refman/8.4/en/identifier-case-sensitivity.html"
  - "https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-case-sensitivity"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
---

# MySQL과 MariaDB 서버 기본값 설정하기

새 DB를 만들 때는 문자셋, 콜레이션, 타임존, 테이블명 대소문자 처리 방식을 정합니다.
같은 서버 설정이라도 적용 시점이 다릅니다.
문자셋과 콜레이션은 새 객체를 만들 때 기본값으로 쓰이고, 타임존은 연결마다 확인할 수 있으며, 테이블명 대소문자 처리 방식은 데이터 디렉터리를 처음 초기화할 때 정합니다.

| 설정 | 영향을 받는 대상 | 대표 옵션 |
|---|---|---|
| 문자셋 | 문자열을 저장할 때 사용하는 문자 인코딩 | `character_set_server` |
| 콜레이션 | 문자열의 비교와 정렬 | `collation_server` |
| 타임존 | 새 DB 연결의 기본 시간대 | `default-time-zone` |
| 테이블명 대소문자 | DB와 테이블 이름을 저장하고 비교하는 방식 | `lower_case_table_names` |

## 문자셋과 콜레이션

문자셋은 어떤 문자를 저장할 수 있는지 정합니다.
`utf8mb4`를 쓰면 한글과 이모지를 같은 문자열 컬럼에 저장할 수 있습니다.
콜레이션은 문자열을 비교하고 정렬하는 규칙입니다.
예를 들어 이름이 `_ci`로 끝나는 콜레이션은 대소문자를 구분하지 않는 비교를 지원합니다.
[MySQL 문자셋과 콜레이션](https://dev.mysql.com/doc/refman/8.4/en/charset-syntax.html), [MariaDB 문자셋과 콜레이션](https://mariadb.com/docs/server/reference/data-types/string-data-types/character-sets/setting-character-sets-and-collations)

기본값은 **서버 → 데이터베이스 → 테이블 → 컬럼** 순서로 이어집니다.
예를 들어 테이블을 만들 때 문자셋과 콜레이션을 생략하면 데이터베이스의 기본값을 사용합니다.
기존 데이터베이스와 테이블의 정의는 서버 기본값을 바꾼 뒤에도 유지되므로, 실제 컬럼에 적용된 값은 따로 확인합니다.

```sql
SHOW GLOBAL VARIABLES LIKE 'character_set_server';
SHOW GLOBAL VARIABLES LIKE 'collation_server';

SHOW CREATE DATABASE app;
SHOW FULL COLUMNS FROM app.members;

-- 이 서버에서 utf8mb4와 함께 쓸 수 있는 콜레이션 확인
SHOW COLLATION WHERE Charset = 'utf8mb4';
```

MySQL과 MariaDB는 버전에 따라 지원하는 콜레이션과 기본값이 다릅니다.
설정을 두 제품에 공통으로 적용하거나 덤프를 옮길 때는 대상 서버의 `SHOW COLLATION` 결과에서 이름을 확인합니다.

## 서버와 연결의 타임존

Docker Compose에서 `TZ`는 컨테이너의 시간대 설정에 사용하고, DB의 `default-time-zone`은 새 DB 연결에 적용할 기본 시간대를 지정합니다.
DB 전역 `time_zone`이 `SYSTEM`이면 서버가 시스템 시간대를 따릅니다.
애플리케이션이나 SQL 콘솔에서 세션 타임존을 따로 지정할 수도 있으므로, 실제 연결에서 아래 세 값을 확인합니다.
[MySQL 시간대 지원](https://dev.mysql.com/doc/refman/8.4/en/time-zone-support.html), [MariaDB 시간대](https://mariadb.com/docs/server/server-management/variables-and-modes/time-zones)

```sql
SELECT
    @@system_time_zone  AS system_time_zone,
    @@GLOBAL.time_zone  AS global_time_zone,
    @@SESSION.time_zone AS session_time_zone;
```

예를 들어 세션 타임존을 `+09:00`으로 바꾸면 `NOW()` 결과와 `TIMESTAMP` 값을 읽을 때의 시간 표현에 영향을 줍니다.
`DATETIME` 값은 읽고 쓸 때 `TIMESTAMP`와 같은 자동 시간대 변환을 거치지 않습니다.
[MySQL `DATE`, `DATETIME`, `TIMESTAMP`](https://dev.mysql.com/doc/refman/8.4/en/datetime.html), [MariaDB `TIMESTAMP`](https://mariadb.com/docs/server/reference/data-types/date-and-time-data-types/timestamp)

## 테이블명 대소문자는 초기화 전에 정하기

`lower_case_table_names`는 `orders`와 `Orders` 같은 **DB와 테이블 이름**에 적용됩니다.
문자열 컬럼에서 `'ACTIVE'`와 `'active'`를 어떻게 비교할지는 해당 비교에 적용되는 콜레이션이 결정합니다.
[MySQL 식별자 대소문자 구분](https://dev.mysql.com/doc/refman/8.4/en/identifier-case-sensitivity.html), [MariaDB 식별자 대소문자 구분](https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-case-sensitivity)

| 값 | 이름 저장 | 이름 비교 |
|---|---|---|
| `0` | 선언한 이름 유지 | 대소문자 구분 |
| `1` | 소문자로 저장 | 대소문자 구분 없이 비교 |

Docker에서 컨테이너를 다시 만들어도 기존 데이터 볼륨을 붙이면 같은 데이터 디렉터리를 사용합니다.
이미 운영 중인 서버는 현재 값을 먼저 확인하고, 새로 설치하는 서버는 최초 초기화 전에 값을 정합니다.
[MySQL 서버 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

```sql
SHOW GLOBAL VARIABLES LIKE 'lower_case_table_names';
```

## `.cnf` 설정 예제

다음은 **새 데이터 디렉터리를 초기화하는 서버**에 적용하는 예입니다.
새 객체에는 `utf8mb4` 기본값을 사용하고, 새 DB 연결의 기본 시간대는 `+09:00`으로 설정합니다.
테이블명은 소문자로 저장합니다.

```ini
[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
default-time-zone = +09:00
lower-case-table-names = 1
```

서버 시작 후에는 `SHOW GLOBAL VARIABLES`로 설정이 반영됐는지 확인합니다.
애플리케이션 동작에 직접 영향을 주는 값은 실제 JDBC 연결의 세션 타임존과 대상 컬럼의 콜레이션까지 확인합니다.

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change)
- [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)
