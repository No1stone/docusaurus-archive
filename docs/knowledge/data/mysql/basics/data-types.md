---
format: "md"
id: "mysql-data-types"
title: "MySQL 데이터 타입과 문자셋 선택"
description: "SIGNED와 UNSIGNED의 정수 범위와 PK 선택 기준, DECIMAL, DATETIME과 TIMESTAMP 및 문자셋과 Collation의 역할을 예제 SQL로 설명합니다."
sidebar_label: "데이터 타입과 문자셋 선택"
slug: "/knowledge/data/mysql/basics/data-types"
sidebar_position: 1
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 데이터 타입"
  - "SIGNED UNSIGNED 차이"
  - "BIGINT UNSIGNED PK"
  - "DATETIME TIMESTAMP 차이"
  - "utf8mb4 Collation"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/integer-types.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html"
  - "https://dev.mysql.com/doc/connector-j/en/connector-j-reference-type-conversions.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/datetime.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/data-types.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-utf8mb4.html"
---
# MySQL 데이터 타입과 문자셋 선택

컬럼 타입은 저장 공간뿐 아니라 값의 범위와 비교 방식에도 영향을 줍니다.
식별자, 금액, 시각과 문자열을 구분해 타입을 선택하고, 연결 드라이버에서도 같은 의미로 다루도록 맞춥니다.

정수의 범위는 [MySQL 정수 타입](https://dev.mysql.com/doc/refman/8.0/en/integer-types.html), 시각의 의미는 [날짜와 시각 타입](https://dev.mysql.com/doc/refman/8.0/en/datetime.html)을 기준으로 설명합니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 업무 값에 맞는 타입 선택

| 값 | 예시 타입 | 선택할 때 확인할 내용 |
|---|---|---|
| 식별자 | BIGINT | 증가 범위와 애플리케이션 정수 타입을 확인합니다. |
| 금액 | DECIMAL(12,2) | 전체 12자리 중 소수 2자리를 허용합니다. 반올림과 통화 단위는 별도 정책입니다. |
| 짧은 문자열 | VARCHAR(100) | 문자 수와 문자셋을 정합니다. |
| 날짜 | DATE | 시각 없이 날짜만 보관합니다. |
| 업무 시각 | DATETIME(6) | 마이크로초까지 보관하며 시간대 규칙을 애플리케이션과 맞춥니다. |
| 유연한 부가 속성 | JSON | 자주 검색하는 값은 별도 인덱스나 컬럼도 검토합니다. |

```sql
USE mysql_notes;
SHOW CREATE TABLE orders;
SELECT id, amount, created_at FROM orders ORDER BY id;
```

금액의 정확한 소수 표현에는 DECIMAL을 고려합니다.
FLOAT와 DOUBLE은 근사값 타입이므로 금액을 그대로 저장할 때 같은 성질이라고 생각하지 않습니다.
SQL 모드에 따라 잘못된 값의 처리도 달라지므로 `SELECT @@SESSION.sql_mode;`로 확인합니다.

## SIGNED와 UNSIGNED는 음수 허용과 양수 범위가 다릅니다

SIGNED는 부호 있는 정수로 음수와 0, 양수를 표현합니다.
UNSIGNED는 부호 없는 정수로 0과 양수를 표현합니다.
같은 정수 타입에서는 저장 바이트 수가 같고, UNSIGNED는 음수 영역을 사용하지 않는 만큼 양수 최댓값이 커집니다.
정수 컬럼은 UNSIGNED를 지정하지 않으면 기본적으로 SIGNED입니다.

| 정수 타입 | 저장 크기 | SIGNED 범위 | UNSIGNED 범위 |
|---|---|---|---|
| TINYINT | 1바이트 | -128 ~ 127 | 0 ~ 255 |
| INT | 4바이트 | -2,147,483,648 ~ 2,147,483,647 | 0 ~ 4,294,967,295 |
| BIGINT | 8바이트 | -9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807 | 0 ~ 18,446,744,073,709,551,615 |

예를 들어 증감량은 음수가 필요할 수 있고, 누적 건수나 자체 생성 ID는 음수가 필요하지 않을 수 있습니다.

```sql
USE mysql_notes;
DROP TABLE IF EXISTS numeric_type_example;
CREATE TABLE numeric_type_example (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  delta INT SIGNED NOT NULL,
  item_count INT UNSIGNED NOT NULL
) ENGINE=InnoDB;

INSERT INTO numeric_type_example (delta, item_count) VALUES (-3, 10);
SELECT id, delta, item_count FROM numeric_type_example;
```

ID는 1부터 생성되고 delta에는 -3, item_count에는 10이 저장됩니다.
음수가 올 수 없다는 조건을 DB에도 표현한 예제입니다.
범위를 벗어난 값을 거부하는지는 SQL 모드의 영향도 받습니다.
strict 모드에서는 item_count에 -1을 저장하면 오류가 발생하며, 비 strict 모드에서는 경고와 함께 보정될 수 있으므로 단순한 입력 검증 대체로만 생각하지 않습니다.

## PK에 UNSIGNED를 사용하면 좋은가요?

외부에서 음수 식별자를 받지 않고 자체 발급하는 PK라면 UNSIGNED를 선택할 수 있습니다.
다만 양수만 사용한다는 이유로 모든 PK를 반드시 UNSIGNED로 만들 필요는 없습니다.
애플리케이션 타입, 참조 FK와 연동 시스템에서 같은 범위를 다룰 수 있는지도 확인합니다.

```sql
DROP TABLE IF EXISTS unsigned_child;
DROP TABLE IF EXISTS unsigned_parent;
CREATE TABLE unsigned_parent (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
) ENGINE=InnoDB;
CREATE TABLE unsigned_child (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parent_id BIGINT UNSIGNED NOT NULL,
  CONSTRAINT fk_unsigned_example FOREIGN KEY (parent_id)
    REFERENCES unsigned_parent(id)
) ENGINE=InnoDB;

INSERT INTO unsigned_parent VALUES (NULL);
INSERT INTO unsigned_child (parent_id) VALUES (1);
SELECT c.id, c.parent_id FROM unsigned_child AS c;
```

정수 외래키는 참조하는 컬럼과 크기 및 부호를 맞춥니다.
부모가 BIGINT UNSIGNED인데 자식이 BIGINT이면 같은 타입으로 취급하지 않습니다.

Java와 Kotlin의 Long은 부호 있는 64비트 정수이므로 BIGINT UNSIGNED의 전체 범위를 표현할 수 없습니다.
Connector/J의 BIGINT UNSIGNED 기본 객체 매핑은 BigInteger이며, 실제 ORM과 DTO 매핑도 확인해야 합니다.
이 글들의 공통 주문 테이블은 Long 기반 예제를 위해 기존 BIGINT를 유지합니다.
양수 제한만 필요하면 SIGNED 컬럼에 CHECK 제약을 두는 설계도 가능하며, 기존 PK 변경은 연결된 FK까지 포함한 별도 마이그레이션 작업입니다.

## DATETIME과 TIMESTAMP

TIMESTAMP는 저장과 조회 시 세션 시간대에 따른 변환을 수행합니다.
DATETIME은 입력한 날짜와 시각을 보관하며 그 자체에 시간대가 들어 있지 않습니다.
UTC 시각인지 현장 시각인지와 드라이버의 변환 정책을 함께 정해야 합니다.

```sql
SELECT @@SESSION.time_zone, @@GLOBAL.time_zone;
SET SESSION time_zone = '+00:00';
SELECT NOW(6), UTC_TIMESTAMP(6);
```

위 SET은 현재 세션에만 적용됩니다.
DATETIME 컬럼이 자동으로 UTC로 바뀌는 설정은 아닙니다.

## 문자셋과 Collation

문자셋은 표현할 수 있는 문자와 인코딩을, Collation은 문자열 비교와 정렬 규칙을 정합니다.
MySQL 8.0의 `utf8mb4`는 4바이트 UTF-8 문자를 지원합니다.

```sql
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';

SELECT
  _utf8mb4'A' COLLATE utf8mb4_0900_ai_ci = _utf8mb4'a' AS case_insensitive,
  _utf8mb4'A' COLLATE utf8mb4_0900_as_cs = _utf8mb4'a' AS case_sensitive;
```

첫 비교는 1, 두 번째는 0입니다.
대소문자를 구별하지 않는 Collation은 유니크 인덱스의 중복 판단에도 영향을 줍니다.
이메일, 상품 코드와 외부 식별자를 같은 규칙으로 비교할지는 업무 기준에 따라 결정합니다.
공통 예제의 코드 컬럼은 `ascii_bin`으로 대소문자를 구별합니다.
대표 Collation의 비교 규칙과 문자열 인덱스 활용은 [Collation 선택과 인덱스](/docs/knowledge/data/mysql/basics/collations-and-indexes)에서 예제로 이어갑니다.

## 이어서 읽기

- [MySQL Collation 선택과 문자열 인덱스](/docs/knowledge/data/mysql/basics/collations-and-indexes)
- [MySQL 기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations)
- [MySQL 일반 컬럼과 JSON 컬럼을 나누는 기준](/docs/knowledge/data/mysql/design/json-columns)

<details>
<summary>공식 참고 자료</summary>

- [정수 타입과 부호별 범위](https://dev.mysql.com/doc/refman/8.0/en/integer-types.html)
- [외래키 타입과 부호 조건](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)
- [Connector/J 타입 매핑](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-type-conversions.html)

- [데이터 타입](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)
- [날짜와 시각 타입](https://dev.mysql.com/doc/refman/8.0/en/datetime.html)
- [utf8mb4](https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-utf8mb4.html)

</details>
