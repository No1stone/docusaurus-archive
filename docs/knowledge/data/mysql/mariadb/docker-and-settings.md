---
format: "md"
id: "mariadb-docker-and-settings"
title: "MariaDB Docker 실행과 서버 설정"
sidebar_label: "Docker 실행과 서버 설정"
description: "Docker Compose로 MariaDB 11.4를 실행하고 데이터 볼륨, 접속 포트, utf8mb4, lower_case_table_names와 타임존 옵션을 설명합니다."
slug: "/knowledge/data/mariadb/docker-and-settings"
sidebar_position: 1
tags:
  - "MariaDB"
  - "Database"
status: "active"
keywords:
  - "MariaDB Docker Compose"
  - "MariaDB 볼륨"
  - "lower_case_table_names"
  - "MariaDB 타임존"
  - "utf8mb4_general_ci"
references:
  - "https://hub.docker.com/_/mariadb"
  - "https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/mariadb-server-docker-official-image-environment-variables"
  - "https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables"
  - "https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-case-sensitivity"
  - "https://mariadb.com/docs/server/reference/data-types/string-data-types/character-sets/internationalization-and-localization/time-zones"
  - "https://docs.docker.com/reference/cli/docker/compose/down/"
---
# MariaDB Docker 실행과 서버 설정

Docker Compose에서 이미지와 접속 포트, 저장 위치를 정하고 `command`로 DB 서버 옵션을 전달할 수 있습니다.
다음 비밀번호는 실제 시스템에서 사용하지 않는 공개 실습용 값입니다.

## 바로 실행하는 Compose 예제

`compose.yaml`을 작성합니다.
`mysql-data` 같은 기존 MySQL 디렉터리를 재사용하지 않고 MariaDB 전용 경로를 사용합니다.

```yaml
services:
  mariadb:
    image: mariadb:11.4
    container_name: mariadb
    restart: always
    ports:
      - "3306:3306"
    command:
      - mariadbd
      - --bind-address=0.0.0.0
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_general_ci
      - --skip-name-resolve=ON
      - --lower-case-table-names=1
      - --default-time-zone=+09:00
    environment:
      TZ: Asia/Seoul
      MARIADB_ROOT_PASSWORD: pass1234
      MARIADB_DATABASE: appdb
      MARIADB_USER: appuser
      MARIADB_PASSWORD: apppass
    volumes:
      - ./mariadb-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
```

```bash
docker compose config
docker compose up -d
docker compose ps
docker compose logs --tail=100 mariadb
docker compose exec mariadb mariadb --default-character-set=utf8mb4 -u appuser -p appdb
```

비밀번호 입력에는 `apppass`를 사용합니다.
`healthcheck`는 DB 준비 여부를 표시하며, unhealthy 상태만으로 Docker가 컨테이너를 자동 재시작하지는 않습니다.
`restart`는 프로세스 종료 시의 재시작 정책입니다.

## Compose 설정은 무엇을 의미하나요?

| 설정 | 의미 |
|---|---|
| `image: mariadb:11.4` | MariaDB 11.4 계열의 공식 이미지를 사용합니다. |
| `container_name` | 컨테이너 이름을 고정합니다. 같은 이름으로 여러 컨테이너를 만들 수는 없습니다. |
| `restart: always` | 프로세스 종료 시 재시작합니다. 수동 중지 후에는 수동 시작 또는 Docker 데몬 재시작 시 다시 실행됩니다. |
| `3306:3306` | 왼쪽은 호스트의 공개 포트이고 오른쪽은 컨테이너 DB 포트입니다. |
| `command` | 이미지의 초기화 진입점을 유지하면서 `mariadbd`에 시작 옵션을 전달합니다. |
| `MARIADB_DATABASE` | 최초 초기화 때 생성할 DB 이름입니다. |
| `MARIADB_USER`, `MARIADB_PASSWORD` | 최초 초기화 때 생성할 사용자와 비밀번호입니다. 이 사용자에게 예제 DB의 권한이 부여됩니다. |
| `./mariadb-data:/var/lib/mysql` | 호스트 디렉터리에 DB 데이터 파일을 보관합니다. |

MySQL 예제의 `MYSQL_*` 대신 MariaDB용 `MARIADB_*`를 사용했습니다.
공식 이미지의 [초기화 환경변수](https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/mariadb-server-docker-official-image-environment-variables)를 기준으로 합니다.

## 포트와 접속 주소를 구분합니다

같은 Compose 네트워크의 애플리케이션은 `mariadb:3306`으로 접속합니다.
호스트 포트를 `3307:3306`으로 바꾸어도 컨테이너 사이에서는 계속 3306을 사용합니다.

| 필요한 접속 | 포트 설정 |
|---|---|
| 호스트와 다른 장비에서 접속 | `"3306:3306"`으로 공개하고 네트워크 접근 범위를 별도로 정합니다. |
| 호스트에서만 접속 | `"127.0.0.1:3306:3306"`으로 바인딩합니다. |
| 같은 Compose 서비스에서만 접속 | `ports`를 생략해도 서비스 이름으로 접속할 수 있습니다. |

`--bind-address=0.0.0.0`은 컨테이너 안에서 DB가 받을 인터페이스입니다.
Docker의 포트 공개와 DB 계정의 접속 권한은 각각 별도 설정입니다.
`--skip-name-resolve=ON`은 계정 접속 판정에 호스트 이름 DNS 조회를 사용하지 않도록 하므로, 계정의 Host는 IP나 `%` 등 이 설정에 맞게 구성합니다.
Compose 서비스 이름을 DB 계정 Host에 적는 방식과는 구분합니다.

## 볼륨은 컨테이너 밖에 데이터를 남깁니다

예제의 바인드 마운트는 `compose.yaml` 옆 `mariadb-data/`에 데이터를 저장합니다.
`docker compose down` 후 다시 실행해도 그 디렉터리가 남아 있으면 데이터를 이어서 사용합니다.
기존 디렉터리를 사용할 때는 환경변수의 비밀번호를 바꾸어도 DB 계정 비밀번호가 자동 변경되지 않습니다.

Docker가 저장 위치를 관리하게 하려면 바인드 마운트를 다음 named volume으로 대체합니다.

```yaml
services:
  mariadb:
    volumes:
      - mariadb-data:/var/lib/mysql

volumes:
  mariadb-data:
```

이 조각은 앞 예제의 `volumes`를 대체하는 부분이며, 나머지 서비스 설정은 유지합니다.
Named volume은 일반 `down`에서 유지되지만 `docker compose down -v`에서는 삭제 대상입니다.
반면 앞의 바인드 마운트 디렉터리는 `down -v`로 삭제되지 않습니다.
볼륨은 저장 위치이며 백업 자체는 아닙니다.
실행 중인 데이터 파일을 그대로 복사하는 대신 [덤프와 복원](/docs/knowledge/data/mariadb/backup-and-replication) 절차를 사용합니다.

## 기본 언어 설정은 문자셋과 정렬 규칙으로 나눕니다

| 옵션 | 의미 |
|---|---|
| `--character-set-server=utf8mb4` | 새 DB의 기본 문자셋을 지정합니다. 한글과 이모지를 포함하는 유니코드를 저장할 수 있습니다. |
| `--collation-server=utf8mb4_general_ci` | 새 DB의 기본 문자열 비교와 정렬 규칙을 지정합니다. `_ci`는 대소문자를 구분하지 않는 비교를 뜻합니다. |
| `--lc-time-names=ko_KR` | 필요할 때 날짜 함수가 출력하는 요일과 월 이름을 한국어로 지정합니다. 문자 저장 인코딩을 바꾸는 옵션은 아닙니다. |

서버 기본값을 바꾸어도 기존 DB, 테이블과 컬럼 정의가 자동 변경되지는 않습니다.
접속 클라이언트의 문자셋도 별도이므로 CLI 예제에는 `--default-character-set=utf8mb4`를 명시했습니다.
기본값과 별개로 새 DB에 직접 지정할 수도 있습니다.

```sql
CREATE DATABASE IF NOT EXISTS sampledb
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
SHOW CREATE DATABASE appdb;
SELECT @@character_set_server, @@collation_server,
       @@character_set_client, @@character_set_connection;
SET lc_time_names = 'ko_KR';
SELECT DAYNAME('2026-10-28');
```

`utf8mb4_general_ci`는 이 예제에서 선택한 비교 규칙이며 모든 언어에 가장 정확한 정렬을 보장하는 기본 정답은 아닙니다.
일반 비교와 Unicode 비교의 차이는 [Collation과 문자열 인덱스](/docs/knowledge/data/mysql/basics/collations-and-indexes)를 참고합니다.
해당 글의 MySQL 전용 `0900` 예제를 MariaDB 11.4에 그대로 적용하지는 않습니다.

## 테이블 이름의 대소문자는 별도 옵션입니다

`--lower-case-table-names=1`은 DB와 테이블 이름을 소문자로 저장하고 이름 비교에서 대소문자를 구분하지 않도록 합니다.
문자열 데이터의 비교를 정하는 Collation과는 다른 설정입니다.

```sql
CREATE TABLE IF NOT EXISTS appdb.CaseDemo (
  id BIGINT PRIMARY KEY,
  label VARCHAR(30)
);
SHOW TABLES FROM appdb;
SELECT * FROM appdb.casedemo;
SELECT * FROM appdb.CASEDEMO;
```

이 설정은 [데이터 디렉터리 초기화 전에 지정](https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-case-sensitivity)합니다.
기존 데이터가 있는데 시작 옵션만 바꾸지 않습니다.
변경이 필요하면 논리 덤프 후 별도 빈 데이터 디렉터리로 복원하는 절차를 검토합니다.
설정과 무관하게 SQL의 테이블 이름을 일관된 소문자로 작성하면 환경 차이로 생기는 혼동을 줄일 수 있습니다.

## 운영체제와 DB 세션의 타임존

`TZ: Asia/Seoul`은 컨테이너 운영체제의 타임존입니다.
`--default-time-zone=+09:00`은 새 DB 세션이 기본으로 사용할 타임존입니다.
UTC를 기준으로 운영하려면 각각 `TZ: UTC`, `--default-time-zone=+00:00`으로 맞춥니다.

```sql
SELECT @@system_time_zone, @@global.time_zone, @@session.time_zone;
SELECT NOW(), UTC_TIMESTAMP();
SET time_zone = '+00:00';
SELECT NOW(), UTC_TIMESTAMP();
```

세션에서 타임존을 바꿀 수 있으므로 애플리케이션과 JDBC 연결의 설정도 확인합니다.
`TIMESTAMP`는 세션 타임존에 따라 입출력 값이 변환되지만 `DATETIME`은 같은 방식으로 자동 변환되지 않습니다.
`+09:00` 같은 오프셋은 타임존 테이블 없이 사용할 수 있고, `Asia/Seoul` 같은 이름을 DB 타임존으로 사용하려면 타임존 테이블이 준비되어야 합니다.
자세한 기준은 [MariaDB 타임존 문서](https://mariadb.com/docs/server/reference/data-types/string-data-types/character-sets/internationalization-and-localization/time-zones)를 참고합니다.

## 옵션이 길어지면 설정 파일로 분리합니다

같은 옵션을 `command`와 파일 양쪽에 중복 작성하지 않고 한쪽에서 관리합니다.
앞 예제의 `command`를 제거하고 다음 마운트를 추가할 수 있습니다.

```yaml
services:
  mariadb:
    volumes:
      - ./mariadb-data:/var/lib/mysql
      - ./conf.d/server.cnf:/etc/mysql/conf.d/server.cnf:ro
```

```ini
[mariadb]
bind-address=0.0.0.0
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
skip-name-resolve=ON
lower-case-table-names=1
default-time-zone=+09:00
```

읽기 전용 마운트는 DB가 설정 파일을 수정하지 못하게 합니다.
MariaDB가 권한 때문에 무시하는 world-writable 설정 파일이 되지 않도록 파일 권한도 확인합니다.
서버 시작 옵션을 변경한 뒤에는 단순 `docker compose restart`가 아니라 `docker compose up -d`로 변경된 컨테이너 구성을 반영합니다.
마운트한 파일 내용만 변경한 경우에는 서버 재시작으로 다시 읽을 수 있습니다.

<details>
<summary>공식 참고 자료</summary>

- [MariaDB 공식 이미지](https://hub.docker.com/_/mariadb)
- [컨테이너 초기화 환경변수](https://mariadb.com/docs/server/server-management/automated-mariadb-deployment-and-administration/docker-and-mariadb/mariadb-server-docker-official-image-environment-variables)
- [서버 시스템 변수](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables)
- [식별자 대소문자](https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-case-sensitivity)
- [타임존](https://mariadb.com/docs/server/reference/data-types/string-data-types/character-sets/internationalization-and-localization/time-zones)
- [Compose down](https://docs.docker.com/reference/cli/docker/compose/down/)

</details>
