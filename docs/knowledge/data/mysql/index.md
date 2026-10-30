---
format: md
id: data-mysql
title: "MySQL & MariaDB: 관계형 DB 설계와 운영 가이드"
sidebar_label: "MySQL & MariaDB"
description: "MySQL과 MariaDB의 관계와 차이부터 데이터 타입, 키 설계, 인덱스, 트랜잭션, Docker 실행과 백업까지 SQL 예제로 설명하는 관계형 DB 가이드입니다."
tags:
  - MySQL
  - MariaDB
  - Database
status: active
slug: /knowledge/data/mysql
sidebar_position: 0

keywords:
  - "MySQL"
  - "MariaDB"
  - "MySQL MariaDB 설계 운영"
  - "관계형 데이터베이스"
  - "MariaDB 차이"
  - "MySQL 8.0"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-introduction.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/json.html"
  - "https://mariadb.org/en/"
  - "https://mariadb.com/docs/server/security/user-account-management/authentication-from-mariadb-10-4"
---
# MySQL & MariaDB

MySQL과 MariaDB의 개념, 테이블 설계와 운영 방법을 정리합니다.
공통된 SQL 개념은 함께 살펴보되, 서버 옵션과 백업 도구 등 제품에 따라 달라지는 부분은 별도 예제로 설명합니다.
MySQL 예제는 8.0, [MariaDB 실행과 운영 예제](/docs/knowledge/data/mariadb)는 11.4를 기준으로 합니다.

## MySQL이란?

MySQL은 SQL로 데이터를 저장하고 조회하는 관계형 데이터베이스 관리 시스템(RDBMS)입니다.
데이터를 행과 열로 이루어진 테이블에 저장하고, 키를 통해 테이블 사이의 관계를 표현합니다.
회원, 주문, 권한, 공통코드처럼 서로 연결된 정보를 관리할 때 사용할 수 있습니다.

이 영역은 MySQL 8.0을 기준으로 설명합니다.
명령과 설정의 상세한 동작은 [MySQL 8.0 공식 매뉴얼](https://dev.mysql.com/doc/refman/8.0/en/)에서 확인할 수 있습니다.
8.4 등 다른 버전에서는 인증과 지원 기능에 차이가 있으므로 설치된 버전에 맞는 문서도 함께 확인합니다.

## 관계형 데이터베이스는 무엇을 관리하나요?

예를 들어 주문 테이블은 회원 ID를 저장하고, 회원 정보는 회원 테이블에서 관리할 수 있습니다.
주문과 회원을 연결해 조회할 때는 JOIN을 사용합니다.
공유 정보를 한곳에서 관리하면서 필요한 조건에 따라 여러 테이블을 조합하는 방식입니다.

| 기능 | 역할 |
|---|---|
| 기본키와 외래키 | 행을 식별하고 테이블 사이의 참조 관계를 표현합니다. |
| 제약조건 | 중복 금지와 필수값 등 데이터 규칙을 검사합니다. |
| 트랜잭션 | 함께 처리해야 하는 변경을 커밋하거나 롤백합니다. |
| 인덱스 | 조회 경로를 제공하며, 읽기 성능과 쓰기 비용을 함께 고려해 구성합니다. |
| SQL | 조건 검색, 조인, 집계와 일괄 변경을 표현합니다. |

테이블을 나누었다고 업무 규칙까지 자동으로 보장되는 것은 아닙니다.
DB의 제약조건과 애플리케이션의 검증, 트랜잭션 경계를 함께 설계해야 합니다.

## InnoDB와 트랜잭션

MySQL은 테이블 데이터를 관리하는 저장 엔진을 사용합니다.
MySQL 8.0의 기본 저장 엔진인 InnoDB는 트랜잭션, 행 수준 잠금과 외래키를 지원합니다.
여러 변경을 하나의 업무 단위로 묶는 처리는 InnoDB의 트랜잭션 기능을 바탕으로 구성할 수 있습니다.

동시에 같은 데이터를 변경하는 상황에서는 격리 수준과 잠금 범위도 고려해야 합니다.
트랜잭션을 사용하더라도 잘못된 처리 순서나 중복 요청이 자동으로 해결되지는 않습니다.
자세한 내용은 [InnoDB 소개](https://dev.mysql.com/doc/refman/8.0/en/innodb-introduction.html)를 참고합니다.

## 가변적인 데이터는 JSON으로 저장할 수 있습니다

관계형 모델을 사용한다고 모든 속성을 고정된 컬럼으로만 표현해야 하는 것은 아닙니다.
MySQL은 JSON 타입을 지원하므로, 형태가 다양한 부가정보를 JSON 컬럼에 담을 수 있습니다.

설계할 때는 검색과 관계 연결에 중요한 ID, 공통코드, 상태를 일반 컬럼으로 두고, 가변적인 속성은 JSON으로 분리하는 방법을 고려할 수 있습니다.
JSON 내부 값이 자주 검색되기 시작하면 해당 값의 인덱스나 일반 컬럼 분리를 검토합니다.
JSON 컬럼을 추가하는 것만으로 내부 조건 검색이 최적화되는 것은 아닙니다.

JSON은 별도의 문서형 DB를 도입하지 않고도 가변 속성을 표현할 수 있는 선택지입니다.
저장 형식보다 실제 조회 조건과 변경 방식을 기준으로 사용 범위를 정합니다.
[JSON 타입 공식 문서](https://dev.mysql.com/doc/refman/8.0/en/json.html)에서 조회 함수와 인덱스 구성 방식을 확인할 수 있습니다.

## MySQL과 MariaDB는 어떤 관계인가요?

MariaDB는 2009년 MySQL에서 분기된 관계형 데이터베이스입니다.
공통된 SQL과 사용법이 많지만, 독립적으로 발전하면서 기능과 인증 설정 등에 차이가 생겼습니다.
MySQL의 버전 번호를 MariaDB의 버전 번호와 일대일로 대응시키거나, 두 제품의 설정을 그대로 바꿔 적용하지 않습니다.
분기 배경은 [MariaDB Foundation 소개](https://mariadb.org/en/)에서 확인할 수 있습니다.

운영 중에는 특히 연결 방식과 인증 방식을 구분해야 합니다.

| 구분 | 의미 |
|---|---|
| TCP 연결 | 주소와 포트로 DB 서버에 연결합니다. 원격 연결과 로컬 연결 모두에 사용할 수 있습니다. |
| Unix 소켓 연결 | 같은 장비의 소켓 파일을 통해 DB 서버에 연결합니다. |
| 소켓 인증 | 소켓으로 연결한 운영체제 사용자의 신원을 DB 계정 인증에 활용합니다. |

소켓 연결 자체가 MariaDB만의 기능인 것은 아닙니다.
또한 소켓으로 연결했다고 반드시 소켓 인증을 사용하는 것도 아닙니다.

MariaDB 10.4에서는 기본 설치 시 `root@localhost`의 인증 구성이 변경되어 `unix_socket` 인증을 활용합니다.
이 때문에 Linux에서 `sudo mariadb`로는 접속되지만 비밀번호 접속은 예상과 다르게 동작하는 상황을 만날 수 있습니다.
기존 버전이나 배포 패키지에서도 소켓 인증을 사용한 경우가 있으므로, 실제 계정 설정과 설치 환경을 확인해야 합니다.
[MariaDB 10.4 인증 변경](https://mariadb.com/docs/server/security/user-account-management/authentication-from-mariadb-10-4)에서 배경과 기본 구성을 설명합니다.

## 예제 SQL을 시작하기 전에

아래 글은 MySQL 8.0 공식 매뉴얼의 개념과 구문을 바탕으로, 회원과 주문 도메인에 맞춰 예제를 재구성했습니다.
원문의 예제를 그대로 복제하기보다 조회 조건, 결과와 설계 판단을 함께 설명합니다.
실습은 MySQL 8.0.18 이상과 InnoDB를 기준으로 작성했습니다.
[공통 실습 데이터](/docs/knowledge/data/mysql/example-schema)를 먼저 준비하면 회원, 주문과 공통코드 예제를 같은 구조로 따라갈 수 있습니다.
각 글의 변경 예제는 초기 상태를 기준으로 하며, 잠금 예제는 두 세션에서 실행합니다.

테이블 생성과 조회 및 변경 SQL, 덤프와 복원은 MySQL 8.0.46의 별도 실습 환경에서 확인했습니다.
두 세션의 스냅샷 읽기, 잠금 대기와 데드락도 재현했습니다.
이 확인은 예제 동작 검증이며 대량 데이터 성능이나 운영 환경의 설정 검증은 아닙니다.

## MariaDB 실행과 운영

| 문서 | 다루는 내용 |
|---|---|
| [MariaDB 안내](/docs/knowledge/data/mariadb) | 제품별 설정과 예제의 기준을 설명합니다. |
| [Docker 실행과 서버 설정](/docs/knowledge/data/mariadb/docker-and-settings) | 볼륨, 포트, 문자셋, 대소문자와 타임존을 설정합니다. |
| [덤프 백업과 복제 설정](/docs/knowledge/data/mariadb/backup-and-replication) | SQL 백업과 복제 준비 옵션을 구분합니다. |
| [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup) | 물리 백업, 스냅샷, 전체와 증분 및 레플리카의 관계 |
| [XtraBackup과 mariadb-backup](/docs/knowledge/data/mysql/operations/online-physical-backup) | 백업 옵션과 prepare 및 복원 과정 |

## 기본 사용

| 문서 | 다루는 내용 |
|---|---|
| [계정 생성과 권한 관리](/docs/knowledge/k-mysql-8-x) | 접속 호스트, 권한 부여와 확인, 권한 회수를 설명합니다. |
| [CLI와 백업, 복구](/docs/knowledge/k-mysql-cli) | 접속, 덤프와 복원을 실제 명령으로 확인합니다. |
| [데이터 타입과 문자셋](/docs/knowledge/data/mysql/basics/data-types) | SIGNED와 UNSIGNED, 숫자와 시각 타입 및 문자셋을 설명합니다. |
| [문자열과 바이너리 저장 공간](/docs/knowledge/data/mysql/basics/string-types-and-storage) | CHAR, VARCHAR, TEXT와 BLOB의 차이 및 실제 저장 공간을 설명합니다. |
| [Collation과 문자열 인덱스](/docs/knowledge/data/mysql/basics/collations-and-indexes) | general_ci와 unicode_ci, 문자열 비교와 인덱스의 관계를 확인합니다. |
| [ENUM과 문자열 저장](/docs/knowledge/data/mysql/basics/enum-and-varchar) | DB ENUM의 변경 절차와 Spring enum 및 VARCHAR 매핑을 비교합니다. |

## 테이블 설계

| 문서 | 다루는 내용 |
|---|---|
| [기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations) | 자연키, 대리키와 외래키의 역할을 구분합니다. |
| [PK 타입과 공개 ID](/docs/knowledge/data/mysql/design/primary-key-types-and-public-id) | INT, BIGINT와 UUID의 크기 및 내부 키와 외부 ID 분리를 비교합니다. |
| [공통코드와 상태 관리](/docs/knowledge/data/mysql/design/common-codes-and-status) | 코드 표시와 상태 전이, 변경 이력을 나누어 관리합니다. |
| [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration) | 컬럼 변경과 INSERT SELECT 이전, 원본 보관과 검증을 설명합니다. |
| [샤딩과 파티셔닝 비교](/docs/knowledge/data/mysql/design/sharding-and-partitioning) | DB와 테이블 분리의 라우팅, 전체 집계와 운영 비용을 비교합니다. |
| [일반 컬럼과 JSON 컬럼](/docs/knowledge/data/mysql/design/json-columns) | 가변 속성의 저장과 검색 인덱스 구성을 비교합니다. |

## 조회와 성능

| 문서 | 다루는 내용 |
|---|---|
| [JOIN과 집계 쿼리](/docs/knowledge/data/mysql/query/joins-and-aggregation) | 관계 조회와 존재 조건, 집계 중복을 설명합니다. |
| [인덱스와 실행 계획](/docs/knowledge/k-mysql-optimization) | 복합 인덱스와 EXPLAIN 결과를 확인합니다. |
| [카디널리티와 인덱스 순서](/docs/knowledge/data/mysql/indexes/cardinality-and-column-order) | 값의 분포와 쿼리 조건으로 컬럼 순서를 판단합니다. |
| [복합 인덱스의 왼쪽 규칙](/docs/knowledge/data/mysql/indexes/leftmost-prefix) | 선두 컬럼과 범위, WHERE 작성 순서 및 정렬을 구분합니다. |
| [페이지 조회와 대량 데이터 읽기](/docs/knowledge/data/mysql/query/pagination) | OFFSET, 키 기반 조회와 배치 순회를 비교합니다. |

## 트랜잭션과 동시성

| 문서 | 다루는 내용 |
|---|---|
| [트랜잭션과 격리 수준](/docs/knowledge/data/mysql/transactions/isolation) | 커밋과 롤백, 스냅샷 읽기를 두 세션으로 확인합니다. |
| [잠금과 데드락](/docs/knowledge/data/mysql/transactions/locks-and-deadlocks) | 잠금 대기와 접근 순서에 따른 충돌을 확인합니다. |
| [중복 요청과 동시 갱신 방지](/docs/knowledge/data/mysql/transactions/idempotency-and-version) | 유니크 제약과 버전 조건, 처리 기록을 비교합니다. |

## 배치와 운영

| 문서 | 다루는 내용 |
|---|---|
| [벌크 처리와 청크](/docs/knowledge/data/mysql/operations/bulk-and-chunks) | INSERT와 UPDATE를 묶는 방식과 실패 경계를 정리합니다. |
| [파티셔닝과 pmax 관리](/docs/knowledge/data/mysql/operations/partitioning) | 날짜와 ID 분할, 단일 PK 제약과 파티션 단위 삭제를 설명합니다. |
| [느린 쿼리와 운영 진단](/docs/knowledge/data/mysql/operations/diagnostics) | 연결 수, 누적 쿼리 비용과 잠금 대기를 확인합니다. |
| [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples) | 전체 설정 예제, 볼륨과 역할별 옵션 및 추가 설정 |
| [Docker 배포와 데이터 보존](/docs/knowledge/data/mysql/operations/docker-and-persistence) | Compose, 데이터 볼륨과 초기화 및 복구를 설명합니다. |
| [운영 백업 구성](/docs/knowledge/data/mysql/operations/backup) | 전체, 증분, 스냅샷, 로그와 레플리카 백업의 관계 |
| [XtraBackup과 mariadb-backup](/docs/knowledge/data/mysql/operations/online-physical-backup) | 파일 백업 옵션, prepare와 별도 복원 |
| [스토리지 스냅샷](/docs/knowledge/data/mysql/operations/storage-snapshots) | 볼륨과 파일시스템의 시점 상태, 트랜잭션 복구 |
| [바이너리 로그와 시점 복구](/docs/knowledge/data/mysql/operations/binary-log-recovery) | 로그 경로, 백업 이후 변경 적용과 복제 연결 |
