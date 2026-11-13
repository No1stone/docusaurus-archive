---
format: md
id: mysql-server-options-server-logs
title: "MySQL과 MariaDB의 서버 로그 설정하기"
sidebar_label: "서버 로그"
description: "log_error, slow_query_log, general_log와 log_output으로 에러 로그, 슬로우 쿼리 로그, 일반 쿼리 로그를 구분하고 켤 때 확인할 값을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/server-logs
sidebar_position: 7
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "slow_query_log"
  - "long_query_time"
  - "log_error"
  - "general_log"
  - "MySQL 슬로우 쿼리 로그"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/log-destinations.html"
  - "https://mariadb.com/docs/server/server-management/server-monitoring-logs/overview-of-mariadb-logs"
  - "https://dev.mysql.com/doc/refman/8.4/en/error-log.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/slow-query-log.html"
  - "https://mariadb.com/docs/server/server-management/server-monitoring-logs/slow-query-log/slow-query-log-overview"
  - "https://dev.mysql.com/doc/refman/8.4/en/query-log.html"
  - "https://mariadb.com/docs/server/server-management/server-monitoring-logs/general-query-log"
  - "https://mariadb.com/docs/server/server-management/server-monitoring-logs/securing-mariadb-logs"
---

# MySQL과 MariaDB의 서버 로그 설정하기

DB가 시작되지 않을 때, 특정 요청이 느릴 때, 애플리케이션이 어떤 SQL을 보냈는지 궁금할 때는 각각 보는 로그가 다릅니다.

| 확인하고 싶은 것 | 로그 | 주요 옵션 |
|---|---|---|
| DB 시작 실패, 종료, 서버 오류 | 에러 로그 | `log_error` |
| 실행 시간이 긴 SQL | 슬로우 쿼리 로그 | `slow_query_log`, `long_query_time` |
| DB가 받은 연결과 SQL | 일반 쿼리 로그 | `general_log` |

일반 쿼리 로그와 슬로우 쿼리 로그는 `log_output`으로 기록 위치를 정합니다.
`FILE`은 파일, `TABLE`은 `mysql.general_log`와 `mysql.slow_log` 테이블을 사용합니다.
`NONE`이면 로그 스위치를 켜도 해당 로그가 기록되지 않습니다.
에러 로그의 출력은 별도로 설정합니다.
[MySQL 로그 출력 위치](https://dev.mysql.com/doc/refman/8.4/en/log-destinations.html), [MariaDB 서버 로그 개요](https://mariadb.com/docs/server/server-management/server-monitoring-logs/overview-of-mariadb-logs)

## 에러 로그는 어디서 볼까?

DB 시작에 실패했다면 실행 환경에 따라 에러 로그 파일이나 표준 오류 출력을 확인합니다.
Docker에서 DB가 표준 오류로 로그를 내보내는 구성이라면, Compose 서비스 이름으로 조회할 수 있습니다.

```bash
docker compose logs --tail=100 mysql
```

서버에 접속할 수 있다면 `SHOW GLOBAL VARIABLES LIKE 'log_error';`로 에러 로그 설정을 확인합니다.
컨테이너 내부 파일에 기록하도록 설정했다면 해당 파일을 확인합니다.
[MySQL 에러 로그](https://dev.mysql.com/doc/refman/8.4/en/error-log.html), [MariaDB 서버 로그 개요](https://mariadb.com/docs/server/server-management/server-monitoring-logs/overview-of-mariadb-logs)

## 슬로우 쿼리 로그 켜기

아래는 슬로우 쿼리 로그를 켜고 **새 연결의 실행 시간 기준을 1초**로 바꾸는 예입니다.
먼저 현재 설정을 조회해 기록 위치와 변경 전 값을 확인합니다.

```sql
SHOW GLOBAL VARIABLES
WHERE Variable_name IN (
    'slow_query_log',
    'slow_query_log_file',
    'long_query_time',
    'log_output'
);

SET GLOBAL long_query_time = 1;
SET GLOBAL slow_query_log = ON;

-- 애플리케이션과 같은 조건으로 새 연결을 열어 확인
SELECT @@SESSION.long_query_time;
```

`long_query_time`의 전역 값을 바꿔도 커넥션 풀의 기존 연결은 이전 세션 값을 유지할 수 있습니다.
실제 요청을 재현했는데 로그가 없다면 연결의 세션 값, `log_output`, `min_examined_row_limit`을 함께 확인합니다.
기록된 SQL은 실행 계획과 함께 보면 조회 범위나 인덱스를 어디부터 살필지 판단하기 쉽습니다.
[MySQL 슬로우 쿼리 로그](https://dev.mysql.com/doc/refman/8.4/en/slow-query-log.html), [MariaDB 슬로우 쿼리 로그](https://mariadb.com/docs/server/server-management/server-monitoring-logs/slow-query-log/slow-query-log-overview)

## 일반 쿼리 로그로 실제 요청 확인하기

애플리케이션에서 검색 버튼을 한 번 눌렀을 때 어떤 SQL이 들어왔는지 확인하고 싶다면 일반 쿼리 로그를 사용할 수 있습니다.
DB가 **문장을 받은 시점**에 기록하므로, SQL이 도착했는지 추적하는 데 쓸 수 있습니다.
[MySQL 일반 쿼리 로그](https://dev.mysql.com/doc/refman/8.4/en/query-log.html), [MariaDB 일반 쿼리 로그](https://mariadb.com/docs/server/server-management/server-monitoring-logs/general-query-log)

```sql
SHOW GLOBAL VARIABLES
WHERE Variable_name IN ('general_log', 'general_log_file', 'log_output');

-- 기존에 OFF였다면 필요한 요청을 재현하는 동안 활성화
SET GLOBAL general_log = ON;

-- 요청 재현과 로그 확인이 끝나면 원래 상태로 복원
SET GLOBAL general_log = OFF;
```

일반 쿼리 로그는 서버 전체에서 들어오는 요청을 기록하므로 트래픽이 많으면 로그가 빠르게 늘어납니다.
SQL에 포함된 업무 데이터도 남을 수 있어, 재현할 구간에만 켜고 기록 파일의 접근 권한과 보관 기간을 확인합니다.
[MariaDB 로그 보안](https://mariadb.com/docs/server/server-management/server-monitoring-logs/securing-mariadb-logs)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change)
- [느린 쿼리와 운영 진단](/docs/knowledge/data/mysql/operations/diagnostics)
- [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)
