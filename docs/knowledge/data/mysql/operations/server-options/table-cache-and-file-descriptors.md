---
format: md
id: mysql-server-options-table-cache-and-file-descriptors
title: "MySQL과 MariaDB의 테이블 캐시와 파일 디스크립터"
sidebar_label: "테이블 캐시와 파일 디스크립터"
description: "table_open_cache, table_definition_cache, open_files_limit과 Opened_tables 상태 값으로 테이블 열기와 파일 디스크립터 한도를 확인하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/table-cache-and-file-descriptors
sidebar_position: 10
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "table_open_cache"
  - "table_definition_cache"
  - "open_files_limit"
  - "Opened_tables"
  - "MySQL 테이블 캐시"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/table-cache.html"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_open_files_limit"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html"
  - "https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/system-variables/server-status-variables"
  - "https://docs.docker.com/reference/compose-file/services/#ulimits"
---

# MySQL과 MariaDB의 테이블 캐시와 파일 디스크립터

테이블 샤딩으로 데이터를 여러 물리 테이블에 나누면, 조회할 때 접근하는 테이블 이름도 달라집니다.
배치가 여러 테이블을 순회하거나 동시에 여러 요청이 들어오면 DB 서버가 테이블을 여는 작업도 늘 수 있습니다.
이때 보는 옵션이 `table_open_cache`, `table_definition_cache`, `open_files_limit`입니다.
[MySQL이 테이블을 열고 닫는 방식](https://dev.mysql.com/doc/refman/8.4/en/table-cache.html), [MariaDB 서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)

## 테이블을 여는 캐시와 테이블 정의 캐시

| 옵션 | 관리하는 대상 | 확인할 상황 |
|---|---|---|
| `table_open_cache` | 이미 열린 테이블을 재사용하기 위한 캐시 항목 | 비슷한 작업을 반복해도 테이블을 계속 새로 여는 경우 |
| `table_definition_cache` | 컬럼과 인덱스 등 테이블 정의를 캐시하는 항목 | 많은 테이블을 순회하며 정의를 반복해서 불러오는 경우 |
| `open_files_limit` | DB 프로세스가 사용할 수 있는 열린 파일 디스크립터 한도 | 서버 로그에 `Too many open files`가 나타나는 경우 |

동시 요청이 같은 테이블을 사용하더라도 열린 테이블 캐시에 여러 항목이 필요할 수 있습니다.
예를 들어 샤딩 테이블이 200개라면, 테이블 개수와 함께 **한 번의 쿼리가 여는 테이블 수와 동시에 실행되는 요청 수**를 봅니다.
파일 디스크립터는 DB 파일 외에 로그 파일과 네트워크 소켓에도 사용됩니다.
[MySQL 테이블 캐시](https://dev.mysql.com/doc/refman/8.4/en/table-cache.html), [MySQL `open_files_limit`](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html#sysvar_open_files_limit)

## 현재 값과 테이블 열기 횟수 확인하기

```sql
SHOW GLOBAL VARIABLES
WHERE Variable_name IN (
    'table_open_cache',
    'table_definition_cache',
    'open_files_limit'
);

SHOW GLOBAL STATUS
WHERE Variable_name IN (
    'Open_tables',
    'Opened_tables',
    'Open_table_definitions',
    'Opened_table_definitions',
    'Table_open_cache_hits',
    'Table_open_cache_misses'
);
```

`Open_tables`는 현재 열린 테이블 수이고, `Opened_tables`는 테이블을 연 누적 횟수입니다.
예를 들어 같은 배치를 두 번 실행한다면 **실행 전후의 `Opened_tables`와 캐시 미스 증가량**을 비교합니다.
서버 시작 직후나 `FLUSH TABLES` 이후에는 테이블을 다시 여는 횟수가 늘 수 있으므로, 평소 트래픽에서도 같은 패턴이 반복되는지 확인합니다.
[MySQL 서버 상태 변수](https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html), [MariaDB 서버 상태 변수](https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/system-variables/server-status-variables)

## Docker Compose에서 파일 한도 확인하기

DB의 `open_files_limit`은 운영체제가 프로세스에 허용한 한도의 영향을 받습니다.
Docker Compose에서는 서비스의 `ulimits.nofile`로 파일 디스크립터 한도를 지정할 수 있습니다.
아래 숫자는 설정 형식을 보여주는 예시입니다.
[Docker Compose `ulimits`](https://docs.docker.com/reference/compose-file/services/#ulimits)

```yaml
services:
  mysql:
    ulimits:
      nofile:
        soft: 16384
        hard: 32768
```

`soft`는 프로세스에 적용되는 현재 한도이고, `hard`는 일반 권한으로 `soft`를 올릴 수 있는 상한입니다.
변경한 Compose 설정으로 컨테이너를 재생성한 뒤에는 `SHOW GLOBAL VARIABLES LIKE 'open_files_limit';`로 DB가 실제로 확보한 값을 확인합니다.
설정값과 실제 값이 다르다면 서버 시작 로그와 컨테이너의 파일 디스크립터 한도를 함께 확인합니다.

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [샤딩과 파티셔닝 비교](/docs/knowledge/data/mysql/design/sharding-and-partitioning)
- [서버 로그](/docs/knowledge/data/mysql/operations/server-options/server-logs)
- [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)
