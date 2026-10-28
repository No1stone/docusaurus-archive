---
format: md
id: mysql-primary-key-types-and-public-id
title: "MySQL PK 선택: INT, BIGINT와 UUID, 공개 ID 분리"
sidebar_label: "PK 타입과 공개 ID"
description: "INT와 BIGINT의 크기와 범위, 문자열 및 UUID 키의 인덱스 비용을 비교하고 사용자 ID를 예측하기 어렵게 만드는 이유와 내부 PK 및 공개 ID 분리 예제를 설명합니다."
slug: /knowledge/data/mysql/design/primary-key-types-and-public-id
sidebar_position: 5
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL PK INT BIGINT UUID"
  - "INT BIGINT 크기 차이"
  - "사용자 ID UUID"
  - "내부 PK 공개 ID 분리"
  - "UUID CHAR36 BINARY16"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/integer-types.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html"
  - "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/UUID.html"
  - "https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html"
---
# MySQL PK 선택: INT, BIGINT와 UUID, 공개 ID 분리

PK는 행을 식별하는 키이며, API에 노출하는 사용자 ID와 반드시 같은 값일 필요는 없습니다.
DB 내부에서는 작은 숫자 키로 관계를 연결하고, 외부에서는 예측하기 어려운 UUID를 사용하는 방식도 가능합니다.
저장 크기, 예상 발급량, 외부 노출과 생성 방식을 나누어 선택합니다.

## INT와 BIGINT는 크기와 범위가 다릅니다

| 타입 | 값 저장 크기 | SIGNED 범위 | UNSIGNED 범위 |
|---|---|---|---|
| INT | 4바이트 | -2,147,483,648 ~ 2,147,483,647 | 0 ~ 4,294,967,295 |
| BIGINT | 8바이트 | -9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807 | 0 ~ 18,446,744,073,709,551,615 |

숫자 값 자체는 BIGINT가 INT의 두 배 공간을 사용합니다.
예를 들어 1천만 행의 한 컬럼만 단순 계산하면 각각 약 40MB와 80MB입니다.
이는 실제 테이블이나 인덱스 전체 크기 계산은 아니며 행 관리 정보 등은 제외한 값입니다.
정확한 범위는 [MySQL 정수 타입](https://dev.mysql.com/doc/refman/8.0/en/integer-types.html)을 기준으로 합니다.

회원 수가 적고 발급 범위도 명확하면 INT로 충분할 수 있습니다.
장기간 누적되는 이벤트나 대규모 서비스에서는 BIGINT의 여유가 필요할 수 있습니다.
AUTO_INCREMENT의 삭제와 롤백 등으로 번호가 비므로 현재 행 수만 보고 남은 발급 범위를 판단하지 않습니다.
Java의 Long을 사용한다면 BIGINT SIGNED와 범위를 맞추기 쉽습니다.
UNSIGNED 선택과 Java 타입의 차이는 [데이터 타입 글](/docs/knowledge/data/mysql/basics/data-types)에 정리했습니다.

## 문자열과 UUID는 얼마나 다른가요?

SQL에는 일반적인 `STRING` 타입 대신 CHAR와 VARCHAR 등이 있습니다.
문자열 키를 쓴다는 말만으로 길이나 저장 비용이 정해지는 것은 아닙니다.

| 키 표현 | 값의 크기 기준 | 특징 |
|---|---|---|
| `INT` | 4바이트 | 범위가 맞으면 작은 숫자 키로 사용할 수 있습니다. |
| `BIGINT` | 8바이트 | 더 큰 숫자 발급 범위를 가집니다. |
| `CHAR(36) CHARACTER SET ascii` | 36바이트의 고정 길이 문자 데이터 | 하이픈을 포함한 UUID를 사람이 읽기 쉽습니다. |
| `VARCHAR(36) CHARACTER SET ascii` | 실제 문자 바이트 수와 길이 정보 | 36자 UUID라면 문자 데이터 36바이트에 길이 정보가 추가됩니다. |
| `BINARY(16)` | 16바이트 | 128비트 UUID를 이진 값으로 보관합니다. 조회 표시와 변환이 필요합니다. |

표는 값의 표현 크기를 비교하며, InnoDB 페이지와 행 전체 크기를 뜻하지 않습니다.
문자열은 문자셋과 비교 규칙도 확인합니다.
UUID는 식별자 생성 방식이고 CHAR나 BINARY는 저장 방식이므로, UUID를 쓴다고 반드시 문자열 컬럼이어야 하는 것은 아닙니다.

## PK 크기는 보조 인덱스와 FK에도 영향을 줍니다

InnoDB는 PK를 클러스터형 인덱스로 사용하고 보조 인덱스 레코드에도 해당 행의 PK를 포함합니다.
따라서 긴 PK의 비용은 PK 컬럼 한 곳에서 끝나지 않습니다.
이를 참조하는 다른 테이블의 FK 크기와 비교 비용도 함께 고려합니다.
근거는 [InnoDB 클러스터형 인덱스와 보조 인덱스](https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html)에서 확인할 수 있습니다.

증가하는 정수와 달리 무작위 UUID를 PK로 쓰면 키 순서가 넓게 흩어진 위치에 삽입될 수 있습니다.
이 차이는 페이지 분할과 캐시 효율 등에 영향을 줄 수 있지만, 실제 비용은 데이터와 부하를 기준으로 판단합니다.
UUID가 항상 느리거나 BIGINT로 바꾸면 반드시 빨라진다는 의미는 아닙니다.

## 사용자에게 노출하는 ID에 UUID를 쓰는 이유

`/users/1001`처럼 증가하는 숫자를 노출하면 다른 번호를 바꾸어 시도하기 쉽습니다.
사용자 생성 순서나 대략적인 발급 규모를 추측하는 단서도 될 수 있습니다.
무작위 UUID는 이런 순차 추측과 단순 열거를 어렵게 만들 수 있습니다.

다만 UUID라는 이름만으로 예측 불가능성이 보장되지는 않습니다.
MySQL 8.0의 `UUID()`는 버전 1 기반이며, 공식 문서도 예측 불가능성이 필요한 용도로 그대로 사용하지 않도록 설명합니다.
이 글의 공개 ID 예시는 Java에서 생성하는 무작위 버전 4 UUID를 사용합니다.

```java
import java.util.UUID;

String publicId = UUID.randomUUID().toString();
```

Java 17의 `UUID.randomUUID()`는 암호학적으로 강한 의사난수 생성기를 사용하는 버전 4 UUID를 반환합니다.
[Java UUID 문서](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/UUID.html)와 [MySQL UUID 함수](https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html#function_uuid)는 생성 특성이 다르므로 구분합니다.

### UUID도 권한 검사를 대신하지 않습니다

다른 사용자의 UUID를 알게 되더라도 해당 정보에 접근할 수 없어야 합니다.
요청한 사용자가 대상 데이터를 조회하거나 수정할 권한이 있는지 서버에서 검사합니다.
URL의 ID를 숨기는 것과 접근 권한을 제한하는 것은 다른 문제입니다.
이 기준은 [OWASP의 IDOR 방지 안내](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)를 참고합니다.

## UUID 문자열 자체를 PK로 사용하는 예제

다음 SQL은 [공통 실습 DB](/docs/knowledge/data/mysql/example-schema)에 독립된 실습 테이블을 생성합니다.
고정 UUID는 결과 확인을 위한 샘플이며 실제 서비스에서는 요청에 따라 생성합니다.

```sql
USE mysql_notes;
DROP TABLE IF EXISTS user_uuid_pk_example;
CREATE TABLE user_uuid_pk_example (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO user_uuid_pk_example (id, name)
VALUES ('550e8400-e29b-41d4-a716-446655440000', '김회원');
SELECT id, name FROM user_uuid_pk_example
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

애플리케이션에서 DB 연결 없이 ID를 먼저 생성할 수 있고, 별도 공개 ID 컬럼이 없어 단순합니다.
반면 이 키를 참조하는 테이블까지 UUID를 저장하며, 무작위 PK의 삽입 특성과 인덱스 크기를 고려해야 합니다.
로그인 이름이나 이메일은 변경될 수 있는 업무 값이므로 UUID와 같은 대리 식별자와 구분합니다.

## 내부 BIGINT PK와 공개 UUID를 분리하는 예제

내부 관계는 BIGINT로 연결하고, API에는 public_id만 노출하는 선택입니다.
아래는 UUID 저장 크기를 줄이기 위해 BINARY(16)을 사용합니다.

```sql
DROP TABLE IF EXISTS user_public_id_example;
CREATE TABLE user_public_id_example (
  id BIGINT NOT NULL AUTO_INCREMENT,
  public_id BINARY(16) NOT NULL,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_public_id (public_id)
) ENGINE=InnoDB;

SET @public_id = '550e8400-e29b-41d4-a716-446655440000';
INSERT INTO user_public_id_example (public_id, name)
VALUES (UUID_TO_BIN(@public_id), '김회원');

SELECT id, BIN_TO_UUID(public_id) AS public_id, name
FROM user_public_id_example
WHERE public_id = UUID_TO_BIN(@public_id);

SELECT OCTET_LENGTH(@public_id) AS text_bytes,
       OCTET_LENGTH(UUID_TO_BIN(@public_id)) AS binary_bytes;
```

크기 확인 결과는 36바이트와 16바이트입니다.
`UUID_TO_BIN`과 `BIN_TO_UUID`는 MySQL 8.0의 변환 함수입니다.
이 예제는 기본 변환을 사용하며, 버전 1의 시간 부분 재배치를 위한 swap 옵션을 무작위 버전 4에 최적화 옵션처럼 붙이지 않습니다.

별도 public_id 유니크 인덱스의 공간과 무작위 삽입 비용까지 없어지는 것은 아닙니다.
대신 내부 PK와 FK는 숫자로 유지하고 외부 노출 형식은 독립적으로 관리할 수 있습니다.
JPA에서는 내부 숫자 ID를 `@Id`로 사용하고 public_id 필드에 UUID 저장 매핑을 별도로 정합니다.
DB 함수 예제만으로 애플리케이션의 UUID 매핑까지 자동 완성되는 것은 아닙니다.
문자열 조회 편의가 더 중요하면 public_id를 앞 예제처럼 CHAR(36)으로 저장할 수도 있습니다.

## 어떤 기준으로 선택하나요?

| 조건 | 검토할 선택 |
|---|---|
| 발급 범위가 작고 명확함 | INT를 먼저 검토합니다. |
| 장기 누적과 큰 발급 범위가 필요함 | BIGINT를 검토합니다. |
| 외부 ID의 순차 추측을 줄이고 싶음 | 무작위 UUID 등 공개 ID의 생성 방식을 검토합니다. |
| 내부 관계는 숫자로 유지하고 싶음 | 숫자 PK와 별도 UUID 공개 ID를 조합합니다. |
| DB 연결 전에 ID가 필요함 | 애플리케이션에서 UUID를 생성하는 방식을 검토합니다. |

사용자 ID라서 반드시 UUID PK를 써야 하는 것은 아닙니다.
이 글에서는 저장과 관계 연결의 편의가 필요하면 숫자 PK를 두고, 공개 ID에는 무작위 UUID를 두는 방법을 하나의 선택지로 제시합니다.

## 이어서 읽기

- [기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations)
- [SIGNED와 UNSIGNED](/docs/knowledge/data/mysql/basics/data-types)
- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)

<details>
<summary>공식 참고 자료</summary>

- [MySQL 정수 크기와 범위](https://dev.mysql.com/doc/refman/8.0/en/integer-types.html)
- [InnoDB 클러스터형 인덱스와 보조 인덱스](https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html)
- [MySQL UUID 생성과 변환](https://dev.mysql.com/doc/refman/8.0/en/miscellaneous-functions.html)
- [Java 17 UUID](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/UUID.html)
- [OWASP IDOR 방지](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)

</details>
