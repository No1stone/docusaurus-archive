---
format: md
id: mysql-server-options-connection-and-sql-mode
title: "MySQL과 MariaDB의 접속 옵션과 SQL 모드"
sidebar_label: "접속과 SQL 동작"
description: "bind_address, max_connections, wait_timeout, max_allowed_packet과 sql_mode를 확인하고, 접속 실패와 환경별 SQL 동작 차이를 구분하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/connection-and-sql-mode
sidebar_position: 3
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "max_connections"
  - "sql_mode"
  - "bind_address"
  - "wait_timeout"
  - "max_allowed_packet"
  - "MySQL 접속 옵션"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_skip_name_resolve"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/sql_mode"
---

# MySQL과 MariaDB의 접속 옵션과 SQL 모드

같은 Docker 네트워크에 있는 애플리케이션이 DB에 접속하지 못하면, 먼저 DB가 어느 주소에서 접속을 받는지 확인합니다.
접속은 되는데 일정 시간이 지나면 끊기거나 큰 데이터에서만 실패한다면, 유휴 연결 시간과 패킷 크기를 봅니다.
SQL 실행 결과가 환경마다 다를 때는 실제 연결의 `sql_mode`를 비교합니다.

## DB가 접속을 받는 주소와 포트

`bind_address`는 DB가 TCP 연결을 받을 주소입니다.
컨테이너 안에서 `127.0.0.1`로만 열면 같은 Docker 네트워크에 있는 다른 컨테이너에서도 그 주소로 접속할 수 없습니다.
`0.0.0.0`으로 설정하면 컨테이너의 모든 IPv4 인터페이스에서 접속을 받습니다.
[MySQL 서버 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

```ini
[mysqld]
bind-address = 0.0.0.0
port = 3306
```

같은 Docker 네트워크에 있는 애플리케이션은 DB 서비스 이름이 `mysql`이라면 `mysql:3306`으로 접속할 수 있습니다.
호스트에서 SQL 클라이언트로 접속해야 한다면 Compose의 `ports`에 `127.0.0.1:3307:3306`을 추가해 호스트의 `3307`로 연결할 수 있습니다.

접속 시 `Access denied`가 나온다면 DB까지 요청이 도착한 상태입니다.
이때는 사용자 이름과 비밀번호, 계정의 `Host` 조건을 확인합니다.
`skip_name_resolve`를 켠 서버에서는 원격 클라이언트 계정의 `Host`를 판정할 때 DNS 이름 조회를 생략하므로, 호스트 이름으로 등록한 계정이 있는지도 확인합니다.
[MySQL `skip_name_resolve`](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_skip_name_resolve)

## 연결 수, 유휴 시간, 패킷 크기

| 옵션 | 의미 | 확인할 상황 |
|---|---|---|
| `max_connections` | 서버가 허용하는 동시 클라이언트 연결 수 | `Too many connections` 발생 |
| `wait_timeout` | 비대화형 연결이 아무 작업 없이 유지될 수 있는 시간, 초 단위 | 커넥션 풀에서 오래 쉬었던 연결을 다시 쓸 때 실패 |
| `max_allowed_packet` | 한 패킷으로 처리할 수 있는 데이터 크기의 상한 | 큰 BLOB이나 대량 `INSERT`에서만 실패 |

```sql
SHOW GLOBAL VARIABLES
WHERE Variable_name IN (
    'bind_address',
    'port',
    'max_connections',
    'wait_timeout',
    'max_allowed_packet'
);

SHOW GLOBAL STATUS
WHERE Variable_name IN ('Threads_connected', 'Max_used_connections');
```

`Threads_connected`는 현재 열린 연결 수이고, `Max_used_connections`는 관측된 최대 동시 연결 수입니다.
Spring 앱을 여러 대 운영한다면 **인스턴스별 커넥션 풀 최대 크기**를 합산하고 배치나 운영 도구가 사용하는 연결도 고려합니다.
`wait_timeout`은 쿼리 실행 시간과 별개로 **유휴 연결**에 적용됩니다.
큰 데이터를 전송하다 패킷 한도에 걸리면 서버와 클라이언트 양쪽의 제한을 확인합니다.
[MySQL 서버 상태 변수](https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html), [MySQL 서버 시스템 변수](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

## 같은 SQL이 환경마다 다르게 동작할 때

`sql_mode`는 잘못된 값의 처리나 일부 SQL 구문의 허용 범위를 정합니다.
예를 들어 `STRICT_TRANS_TABLES`를 켠 상태에서 InnoDB의 `VARCHAR(5)` 컬럼에 너무 긴 값을 넣으면 오류가 납니다.
Strict 모드가 꺼져 있으면 값이 잘려 저장되고 경고가 남을 수 있습니다.
`ONLY_FULL_GROUP_BY`는 `GROUP BY` 쿼리에서 그룹별로 값이 정해지지 않는 컬럼을 그대로 조회하는 경우를 제한합니다.
[MySQL SQL 모드](https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html), [MariaDB SQL 모드](https://mariadb.com/docs/server/server-management/variables-and-modes/sql_mode)

```sql
SELECT
    @@GLOBAL.sql_mode AS global_sql_mode,
    @@SESSION.sql_mode AS session_sql_mode;
```

개발 환경에서는 성공했던 SQL이 운영에서 실패하면, 양쪽에서 **애플리케이션이 실제로 사용하는 연결의 `@@SESSION.sql_mode`**를 비교합니다.
`SET SESSION sql_mode = '...'`로 값을 지정하면 현재 모드 목록 전체가 교체되므로, 모드 하나만 바꾸려는 경우에도 기존 목록을 먼저 확인합니다.

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change)
- [서버 기본값](/docs/knowledge/data/mysql/operations/server-options/server-defaults)
- [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)
