---
format: md
id: mysql-string-types-and-storage
title: "MySQL CHAR, VARCHAR, TEXT와 BLOB의 차이와 저장 공간"
sidebar_label: "문자열과 바이너리 저장 공간"
description: "CHAR와 VARCHAR의 고정 및 가변 길이, TEXT와 BLOB의 차이, 문자 수와 바이트 수, InnoDB 행 크기와 외부 페이지를 예제 SQL로 설명하고 Oracle VARCHAR2와 구분합니다."
slug: /knowledge/data/mysql/basics/string-types-and-storage
sidebar_position: 4
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL CHAR VARCHAR 차이"
  - "VARCHAR 선언 길이 저장 공간"
  - "TEXT BLOB 차이"
  - "VARCHAR2 MySQL"
  - "InnoDB 행 크기"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/char.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/blob.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-row-format.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/column-count-limit.html"
  - "https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/Data-Types.html"
---
# MySQL CHAR, VARCHAR, TEXT와 BLOB의 차이와 저장 공간

문자열 컬럼을 크게 선언하면 그만큼 공간을 항상 미리 차지할까요?
고정 길이인지 가변 길이인지, 실제 문자열의 바이트 수와 InnoDB의 저장 방식을 나누어 보아야 합니다.
특히 `VARCHAR(1000)`을 선언했다고 모든 행이 1000자분의 공간을 미리 예약하는 것은 아닙니다.

## 타입별로 무엇이 다른가요?

| 타입 | 담는 값과 길이 | 주로 검토하는 용도 |
|---|---|---|
| `CHAR(M)` | 고정 길이 문자열이며 M은 문자 수입니다. | 고정된 길이의 국가 코드나 식별자 |
| `VARCHAR(M)` | M자까지 허용하는 가변 길이 문자열입니다. | 이름, 이메일과 제목 |
| `TEXT` 계열 | 문자셋과 Collation을 사용하는 긴 문자열입니다. | 본문이나 긴 설명 |
| `BINARY(M)` | 고정 길이 바이너리 값이며 M은 바이트 수입니다. | BINARY(16) UUID 등 고정 크기 값 |
| `VARBINARY(M)` | M바이트까지 허용하는 가변 길이 바이너리 값입니다. | 짧은 바이너리 토큰이나 암호화 결과 |
| `BLOB` 계열 | 긴 바이너리 데이터입니다. | 파일 내용 등 문자로 해석하지 않을 데이터 |

Java의 String을 DB에 저장한다고 DB 타입 이름도 STRING이 되는 것은 아닙니다.
문자열 저장과 비교는 [CHAR와 VARCHAR](https://dev.mysql.com/doc/refman/8.0/en/char.html), 긴 문자 및 바이너리는 [TEXT와 BLOB](https://dev.mysql.com/doc/refman/8.0/en/blob.html)을 기준으로 구분합니다.

### VARCHAR2는 MySQL 타입이 아닙니다

`VARCHAR2`는 Oracle에서 사용하는 가변 길이 문자열 타입입니다.
Oracle의 `VARCHAR2(100 BYTE)`와 `VARCHAR2(100 CHAR)`는 바이트 기준과 문자 기준을 구분합니다.
MySQL 8.0에서는 VARCHAR2 대신 VARCHAR를 사용하며, MySQL의 VARCHAR 길이는 문자 수로 지정합니다.
이름이 비슷하더라도 다른 DB의 타입과 제한을 그대로 대응시키지 않습니다.
상세한 Oracle 동작은 [Oracle 데이터 타입 문서](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/Data-Types.html)를 참고합니다.

## CHAR는 고정 길이, VARCHAR는 실제 길이를 따라갑니다

예를 들어 ASCII 문자열 `abc`를 저장한다고 가정합니다.
`CHAR(10) CHARACTER SET ascii`는 10자 고정 길이이며 저장 시 남은 부분을 공백으로 채우는 타입입니다.
`VARCHAR(1000) CHARACTER SET ascii`는 실제 3바이트 문자열과 길이 관리 정보를 저장하며, 1000바이트를 모두 채워 두지 않습니다.

| 선언 방식 | 짧은 값을 저장했을 때의 이해 |
|---|---|
| ASCII `CHAR(10)`에 abc | 10자 고정 길이로 다룹니다. 조회 시 뒤쪽 공백이 제거될 수 있습니다. |
| ASCII `VARCHAR(1000)`에 abc | 실제 문자열은 3바이트입니다. 별도의 길이 정보가 붙습니다. |
| utf8mb4 `VARCHAR(1000)`에 한글과 이모지 | 실제 인코딩된 바이트 수에 따라 데이터 크기가 달라집니다. |

VARCHAR의 길이 관리에는 타입의 최대 바이트 길이에 따라 1바이트 또는 2바이트가 필요하다고 설명합니다.
하지만 이 값만 더해서 InnoDB 행의 실제 물리 크기라고 계산하지는 않습니다.
행 헤더, NULL 정보, 길이 관리 방식과 외부 페이지 등이 추가로 영향을 주기 때문입니다.
CHAR도 멀티바이트 문자셋과 행 형식에 따라 물리 저장 방식이 달라질 수 있으므로, 모든 CHAR 컬럼이 항상 M 곱하기 최대 문자 바이트 수를 차지한다고 일반화하지 않습니다.
타입별 계산 기준은 [데이터 타입 저장 요구량](https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html)을 참고합니다.

## 문자 수와 바이트 수를 SQL로 확인합니다

다음은 [공통 실습 DB](/docs/knowledge/data/mysql/example-schema)에 독립된 실습 테이블을 생성합니다.

```sql
USE mysql_notes;
SET NAMES utf8mb4;
DROP TABLE IF EXISTS string_storage_example;
CREATE TABLE string_storage_example (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fixed_code CHAR(10) CHARACTER SET ascii NOT NULL,
  title VARCHAR(1000) NOT NULL,
  body TEXT,
  payload BLOB,
  token VARBINARY(32)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC
  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO string_storage_example (fixed_code, title, body, payload, token)
VALUES ('abc', '한글😀', REPEAT('가', 1000), X'000102FF', X'414200');

SELECT
  CHAR_LENGTH(title) AS title_characters,
  OCTET_LENGTH(title) AS title_bytes,
  OCTET_LENGTH(body) AS body_bytes,
  OCTET_LENGTH(payload) AS payload_bytes,
  HEX(token) AS token_hex
FROM string_storage_example;
```

예제 결과는 제목 3자와 10바이트, 본문 3000바이트, 바이너리 4바이트와 token의 `414200`입니다.
`CHAR_LENGTH`는 문자 수, `OCTET_LENGTH`는 값의 바이트 수입니다.
이 함수가 반환하는 값은 저장 페이지나 인덱스, 행 헤더까지 포함한 디스크 사용량이 아닙니다.

```sql
SELECT fixed_code, CHAR_LENGTH(fixed_code), OCTET_LENGTH(fixed_code)
FROM string_storage_example;
```

MySQL 8.0의 기본 SQL 모드에서는 CHAR 조회 시 끝 공백이 제거되어 여기서는 3과 3이 나옵니다.
조회된 값이 3바이트라는 이유로 CHAR(10)의 물리 저장 공간도 반드시 3바이트라고 판단하지 않습니다.

## TEXT와 BLOB은 크기보다 해석 방식이 다릅니다

TEXT는 문자셋과 Collation을 적용해 문자열로 해석하고 비교합니다.
BLOB은 바이트열이며 문자셋과 Collation을 사용한 문자열 비교를 하지 않습니다.
둘 다 가변 길이이므로 TEXT를 선언했다고 모든 행이 최대 크기를 차지하지는 않습니다.

| 문자 타입 | 바이너리 타입 | 값의 최대 길이 |
|---|---|---|
| TINYTEXT | TINYBLOB | 255바이트 |
| TEXT | BLOB | 65,535바이트 |
| MEDIUMTEXT | MEDIUMBLOB | 16,777,215바이트 |
| LONGTEXT | LONGBLOB | 4,294,967,295바이트 |

이 표의 한계는 문자 수가 아니라 바이트 수입니다.
한글과 이모지처럼 여러 바이트를 쓰는 문자가 많으면 같은 TEXT에 들어가는 문자 수는 줄어듭니다.
실제 전송과 저장은 패킷 크기 및 자원 제한도 받으므로 LONGTEXT의 한계만 보고 큰 데이터를 그대로 넣을 수 있다고 가정하지 않습니다.
사진이나 첨부 파일을 BLOB으로 보관할 수도 있지만, 파일 저장소에 두고 DB에는 위치와 메타정보를 저장하는 방식도 별도로 비교합니다.

## 큰 문자열은 행 밖에 저장될 수 있습니다

InnoDB의 `DYNAMIC` 행 형식은 긴 VARCHAR, VARBINARY, TEXT와 BLOB을 필요에 따라 외부 페이지에 보관하고, 원래 행에는 20바이트 포인터를 남길 수 있습니다.
TEXT나 BLOB이라는 이유만으로 항상 행 밖에 있고, VARCHAR라서 항상 행 안에 있는 것은 아닙니다.
선택은 실제 값과 행 크기 등에 영향을 받습니다.
자세한 조건은 [InnoDB 행 형식](https://dev.mysql.com/doc/refman/8.0/en/innodb-row-format.html)을 참고합니다.

따라서 작은 테이블의 저장 공간을 컬럼 선언 길이만 더해서 정확히 계산할 수는 없습니다.
DB는 페이지 단위로 공간을 관리하므로 데이터가 적어도 일정한 페이지 공간을 사용할 수 있습니다.
PK와 보조 인덱스, 삭제 후 남은 공간과 외부 페이지 등도 테이블 용량에 영향을 줍니다.

```sql
SELECT TABLE_NAME, ROW_FORMAT, TABLE_ROWS,
       DATA_LENGTH, INDEX_LENGTH, DATA_FREE
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'mysql_notes'
  AND TABLE_NAME = 'string_storage_example';
```

이 조회는 페이지와 통계를 바탕으로 테이블의 공간을 살펴보는 용도입니다.
InnoDB의 행 수와 크기 통계는 근삿값이며, 특정 컬럼 한 값의 정확한 크기를 보여 주지는 않습니다.

## VARCHAR 길이를 무조건 크게 잡아도 되나요?

실제 값만 저장한다고 선언 길이에 아무런 영향이 없는 것은 아닙니다.
MySQL에는 최대 행 크기 65,535바이트 제한이 있고, VARCHAR는 문자셋 기준의 선언 최대 길이가 이 검증에 영향을 줍니다.
utf8mb4는 문자당 최대 4바이트이므로 여러 VARCHAR 컬럼을 크게 선언하면 실제 데이터가 없어도 테이블 생성이 거부될 수 있습니다.
InnoDB에는 페이지 크기와 행 형식에 따른 별도 제약도 있습니다.
TEXT와 BLOB은 이 행 크기 계산에서 취급이 다르지만, 저장 비용이 없는 타입은 아닙니다.
근거는 [컬럼 수와 행 크기 제한](https://dev.mysql.com/doc/refman/8.0/en/column-count-limit.html)을 참고합니다.

큰 본문은 일반 목록에서 매번 읽지 않도록 SELECT 컬럼을 명시합니다.
필요하면 상세 테이블로 분리하고, 목록에 필요한 제목과 요약은 짧은 컬럼에 둡니다.
인덱스도 컬럼의 최대 바이트 길이 영향을 받으므로 길게 선언한 VARCHAR를 전체 인덱스로 만들 수 있는지 확인합니다.
TEXT의 일반 인덱스는 접두 길이를 지정해야 하며, 본문 전체 검색은 FULLTEXT 같은 별도 요구로 검토합니다.

```sql
CREATE INDEX ix_string_body_prefix ON string_storage_example (body(100));
SHOW INDEX FROM string_storage_example;
```

`body(100)`은 문자 타입인 TEXT의 앞 100자를 인덱싱합니다.
본문 전체가 인덱스에 담기는 것은 아니며, 접두 길이는 실제 검색 조건과 분포에 맞춰 정합니다.

## 선택 기준

| 데이터 | 먼저 검토할 타입 |
|---|---|
| 길이가 일정한 ASCII 코드 | CHAR |
| 이름, 이메일과 제목 | 업무상 최대 길이를 정한 VARCHAR |
| 긴 본문과 상세 설명 | TEXT 계열 |
| 16바이트 UUID와 고정 크기 값 | BINARY |
| 짧은 가변 바이너리 | VARBINARY |
| 긴 바이너리 내용 | BLOB 계열 또는 외부 파일 저장소 |

## 이어서 읽기

- [데이터 타입과 문자셋 선택](/docs/knowledge/data/mysql/basics/data-types)
- [Collation과 문자열 인덱스](/docs/knowledge/data/mysql/basics/collations-and-indexes)
- [PK 타입과 공개 ID](/docs/knowledge/data/mysql/design/primary-key-types-and-public-id)
- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)

<details>
<summary>공식 참고 자료</summary>

- [CHAR와 VARCHAR](https://dev.mysql.com/doc/refman/8.0/en/char.html)
- [TEXT와 BLOB](https://dev.mysql.com/doc/refman/8.0/en/blob.html)
- [타입별 저장 요구량](https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html)
- [InnoDB 행 형식](https://dev.mysql.com/doc/refman/8.0/en/innodb-row-format.html)
- [컬럼 수와 행 크기 제한](https://dev.mysql.com/doc/refman/8.0/en/column-count-limit.html)
- [Oracle VARCHAR2](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/Data-Types.html)

</details>
