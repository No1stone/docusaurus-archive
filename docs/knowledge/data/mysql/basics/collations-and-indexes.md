---
format: md
id: mysql-collations-and-indexes
title: "MySQL Collation 선택과 문자열 인덱스"
sidebar_label: "Collation과 문자열 인덱스"
description: "utf8mb4_general_ci, unicode_ci와 0900 계열의 비교 규칙을 설명하고 대소문자, 유니크 중복과 문자열 인덱스에 미치는 영향을 SQL로 확인합니다."
slug: /knowledge/data/mysql/basics/collations-and-indexes
sidebar_position: 2
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL Collation"
  - "general_ci unicode_ci 차이"
  - "utf8mb4_0900_ai_ci"
  - "COLLATE 인덱스"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-sets.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/charset-collation-coercibility.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/charset-binary-collations.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html"
---
# MySQL Collation 선택과 문자열 인덱스

Collation은 문자열의 같음과 정렬 순서를 결정하는 규칙입니다.
WHERE 조건뿐 아니라 JOIN, GROUP BY, ORDER BY와 유니크 인덱스의 중복 판정에도 영향을 줍니다.
단순히 어떤 규칙이 더 빠른지보다 업무에서 어떤 문자열을 같다고 볼 것인지 먼저 정해야 합니다.

[MySQL Unicode Collation 공식 설명](https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-sets.html)을 기준으로 비교 예제를 구성했습니다.
SQL은 MySQL 8.0.46에서 실행을 확인했으며, 별도 실습용 mysql_notes DB를 사용합니다.

## 문자셋과 Collation의 차이

문자셋은 어떤 문자를 어떤 인코딩으로 표현할지 정하고, Collation은 그 문자열을 어떻게 비교하고 정렬할지 정합니다.
같은 utf8mb4 문자열도 Collation에 따라 대소문자나 악센트를 같게 볼 수 있습니다.

| 이름 요소 | 의미 |
|---|---|
| utf8mb4 | 4바이트 UTF-8 문자를 지원하는 문자셋입니다. |
| ci | 대소문자를 구별하지 않는 case-insensitive 규칙입니다. |
| cs | 대소문자를 구별하는 case-sensitive 규칙입니다. |
| ai | 악센트를 구별하지 않는 accent-insensitive 규칙입니다. |
| as | 악센트를 구별하는 accent-sensitive 규칙입니다. |
| 0900 | Unicode Collation Algorithm 9.0.0 기반임을 나타냅니다. |
| bin | 언어별 정렬 가중치 대신 문자 코드값을 기준으로 비교하는 계열입니다. |

utf8mb4_bin 같은 문자 Collation과 VARBINARY 같은 바이트 타입을 동일하게 생각하지 않습니다.
문자 단위 처리와 후행 공백 규칙에 차이가 있으므로 바이트 일치가 필요한 값은 저장 타입도 함께 정합니다.

## 대표 Collation 비교

| Collation | 비교 기준 | 고려할 내용 |
|---|---|---|
| utf8mb4_general_ci | 단순한 레거시 비교 규칙입니다. 대소문자를 구별하지 않습니다. | Unicode의 확장 비교 등을 충분히 표현하지 못합니다. |
| utf8mb4_unicode_ci | UCA 4.0.0 기반으로 대소문자를 구별하지 않습니다. | 한 글자를 여러 글자와 대응시키는 비교 등을 지원합니다. |
| utf8mb4_unicode_520_ci | UCA 5.2.0 기반의 Unicode 비교입니다. | 기존 시스템의 지원 버전과 비교 규칙을 확인합니다. |
| utf8mb4_0900_ai_ci | UCA 9.0.0 기반이며 대소문자와 악센트를 구별하지 않습니다. | MySQL 8.0 기본값입니다. 기존 컬럼까지 자동 변경되지는 않습니다. |
| utf8mb4_0900_as_cs | UCA 9.0.0 기반이며 대소문자와 악센트를 구별합니다. | 문자열의 차이를 구별해야 하는 컬럼에 검토합니다. |
| utf8mb4_bin | 문자 코드값으로 비교합니다. | 대소문자를 구별하지만 PAD SPACE 후행 공백 규칙도 확인합니다. |

MySQL의 utf8은 8.0에서 utf8mb3의 사용 중단 예정 별칭입니다.
새 설정은 utf8mb4를 명시하고, MariaDB와 MySQL 사이에서 동일 Collation 이름을 모두 지원한다고 가정하지 않습니다.

## general_ci와 unicode_ci의 차이를 SQL로 확인합니다

대표적으로 독일어 ß의 비교 결과가 다릅니다.
general_ci는 단순한 일대일 비교를 사용하지만 unicode_ci는 한 문자를 여러 문자와 같게 비교하는 확장을 지원합니다.

```sql
SET NAMES utf8mb4;
SELECT
  _utf8mb4'ß' COLLATE utf8mb4_general_ci = _utf8mb4'ss' AS general_result,
  _utf8mb4'ß' COLLATE utf8mb4_unicode_ci = _utf8mb4'ss' AS unicode_result;

SELECT
  _utf8mb4'A' COLLATE utf8mb4_0900_ai_ci = _utf8mb4'a' AS ignore_case,
  _utf8mb4'e' COLLATE utf8mb4_0900_ai_ci = _utf8mb4'é' AS ignore_accent,
  _utf8mb4'e' COLLATE utf8mb4_0900_as_cs = _utf8mb4'é' AS compare_accent;
```

SET NAMES는 이 세션의 통신 문자셋을 명시합니다.
테이블을 utf8mb4로 만들었어도 클라이언트가 다른 인코딩으로 문자를 보내면 잘못 저장될 수 있습니다.
첫 비교 쿼리는 0과 1, 두 번째는 1과 1과 0입니다.
영문과 한글만 몇 개 비교해 규칙 전체가 같다고 판단하지 않습니다.
실제 저장하는 이름, 코드와 다국어 문자열을 대표값으로 확인합니다.

general_ci가 단순하다는 이유만으로 항상 더 빠른 규칙으로 선택하지 않습니다.
필요한 비교 정확성, 인덱스와 데이터 분포를 함께 확인해야 합니다.

## 후행 공백의 비교도 다릅니다

```sql
SELECT COLLATION_NAME, PAD_ATTRIBUTE
FROM information_schema.COLLATIONS
WHERE COLLATION_NAME IN (
  'utf8mb4_general_ci', 'utf8mb4_unicode_ci',
  'utf8mb4_0900_ai_ci', 'utf8mb4_bin'
);

SELECT
  _utf8mb4'a' COLLATE utf8mb4_unicode_ci = _utf8mb4'a ' AS pad_space_result,
  _utf8mb4'a' COLLATE utf8mb4_0900_ai_ci = _utf8mb4'a ' AS no_pad_result;
```

마지막 쿼리는 1과 0입니다.
unicode_ci 등 PAD SPACE 규칙과 0900 계열의 NO PAD 규칙은 후행 공백을 다르게 비교합니다.
CHAR 컬럼의 공백 처리까지 모두 같다는 뜻은 아니므로, 실제 컬럼 타입도 확인합니다.

## 문자열 인덱스는 컬럼의 Collation을 기준으로 구성됩니다

같은 문자열이라도 인덱스의 비교 순서와 쿼리가 요구하는 순서가 달라지면 접근 경로가 달라질 수 있습니다.
다음은 작은 실습 테이블이며 운영 테이블과 별개입니다.

```sql
USE mysql_notes;
DROP TABLE IF EXISTS collation_example;
CREATE TABLE collation_example (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY ix_collation_word (word)
) ENGINE=InnoDB;
INSERT INTO collation_example (word)
VALUES ('Straße'), ('strasse'), ('strase'), ('alpha'), ('beta');

SELECT id, word FROM collation_example
WHERE word = _utf8mb4'strasse' ORDER BY id;

SELECT id, word FROM collation_example
WHERE word COLLATE utf8mb4_general_ci = _utf8mb4'strasse' ORDER BY id;
```

컬럼의 unicode_ci로 검색하면 1과 2, general_ci로 비교를 바꾸면 2만 조회됩니다.
이 차이는 성능뿐 아니라 검색 결과 자체의 차이입니다.

```sql
EXPLAIN
SELECT id, word FROM collation_example FORCE INDEX (ix_collation_word)
WHERE word = _utf8mb4'strasse';

EXPLAIN
SELECT id, word FROM collation_example FORCE INDEX (ix_collation_word)
WHERE word COLLATE utf8mb4_general_ci = _utf8mb4'strasse';

EXPLAIN
SELECT id, word FROM collation_example FORCE INDEX (ix_collation_word)
ORDER BY word COLLATE utf8mb4_general_ci;
```

MySQL 8.0.46의 위 실습에서는 다음 계획을 확인했습니다.

| 비교 방식 | type | Extra | 의미 |
|---|---|---|---|
| 컬럼의 unicode_ci 그대로 검색 | ref | Using index | 일치하는 키를 탐색합니다. |
| general_ci로 변경해 검색 | index | Using where; Using index | 전체 인덱스를 읽으면서 조건을 검사합니다. |
| general_ci로 변경해 정렬 | index | Using index; Using filesort | 인덱스를 읽고 추가 정렬합니다. |

FORCE INDEX는 작은 데이터에서도 비교 경로를 관찰하기 위한 실습용입니다.
운영 쿼리에 그대로 넣으라는 권장 설정이 아닙니다.
기본 비교에서는 ref 탐색, 비교 규칙을 바꾼 조건에서는 전체 인덱스 스캔으로 달라지는 모습을 확인할 수 있습니다.
정렬 규칙을 바꾼 마지막 쿼리에서는 추가 정렬 여부도 봅니다.

EXPLAIN의 key에 인덱스가 표시된다고 필요한 값만 좁혀 찾는다는 뜻은 아닙니다.
type, 예상 행 수와 Extra를 함께 확인합니다.
Collation이 다르면 무조건 인덱스를 전혀 못 쓴다고 단정하지도 않습니다.
변환되는 쪽, 비교 규칙과 최종 실행 계획에 따라 달라집니다.

## Collation을 바꾸기 전에 확인할 내용

```sql
SHOW FULL COLUMNS FROM collation_example;

SELECT word COLLATE utf8mb4_unicode_ci AS comparison_value, COUNT(*) AS row_count
FROM collation_example
GROUP BY word COLLATE utf8mb4_unicode_ci
HAVING COUNT(*) > 1;
```

새 규칙에서 같은 값으로 취급될 후보를 먼저 확인합니다.
기존에 서로 달랐던 문자열이 같아지면 유니크 인덱스를 다시 만드는 과정에서 충돌할 수 있습니다.
이미 유니크한 컬럼이라도 현재 규칙과 변경할 규칙의 중복 기준이 같다고 보장하지 않습니다.

DB나 테이블의 기본 Collation을 변경하는 것과 기존 컬럼을 변환하는 작업도 다릅니다.
조인하는 문자열 키와 외래키의 문자셋 및 Collation, 인덱스 재구성 비용을 함께 확인합니다.
계정명, 이메일과 식별자에 대소문자 구별이 필요한지도 업무 규칙으로 정합니다.

## 이어서 읽기

- [데이터 타입과 문자셋 선택](/docs/knowledge/data/mysql/basics/data-types)
- [인덱스와 실행 계획](/docs/knowledge/k-mysql-optimization)
- [기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations)

<details>
<summary>공식 참고 자료</summary>

- [Unicode Collation과 general_ci, unicode_ci 비교](https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-sets.html)
- [표현식의 Collation 결정 규칙](https://dev.mysql.com/doc/refman/8.0/en/charset-collation-coercibility.html)
- [binary와 bin Collation](https://dev.mysql.com/doc/refman/8.0/en/charset-binary-collations.html)
- [ORDER BY 최적화](https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html)

</details>
