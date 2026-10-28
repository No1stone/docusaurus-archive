---
format: md
id: mysql-enum-and-varchar
title: "MySQL ENUM 대신 VARCHAR와 애플리케이션 enum을 사용하는 이유"
sidebar_label: "ENUM과 문자열 저장"
description: "DB의 ENUM 변경에 필요한 ALTER TABLE과 권한 및 승인 절차를 살펴보고, Spring JPA에서 enum을 사용하면서 MySQL에는 VARCHAR로 저장하는 예제와 배포 기준을 설명합니다."
slug: /knowledge/data/mysql/basics/enum-and-varchar
sidebar_position: 3
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL ENUM VARCHAR 차이"
  - "Spring JPA enum 문자열 저장"
  - "EnumType.STRING VARCHAR"
  - "MySQL ENUM ALTER TABLE"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/enum.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html"
  - "https://docs.hibernate.org/orm/6.2/migration-guide/"
  - "https://docs.hibernate.org/orm/6.6/userguide/html_single/"
---
# MySQL ENUM 대신 VARCHAR와 애플리케이션 enum을 사용하는 이유

이 글에서는 업무 상태를 Java enum으로 표현하고, DB에는 VARCHAR로 저장하는 방식을 선택합니다.
허용 값을 추가할 때 애플리케이션 배포와 DB 스키마 변경이 항상 함께 움직이지 않도록 하기 위한 선택입니다.
특히 개발자에게 운영 DB의 DDL 권한이 없거나 DB 변경의 승인과 실행 담당자가 분리된 환경에서 변경 절차를 단순하게 만들 수 있습니다.

## DB ENUM과 Java enum은 다른 기능입니다

| 구분 | 책임과 변경 방식 |
|---|---|
| MySQL `ENUM` | 컬럼의 허용 값 목록을 스키마에 정의합니다. 새 값을 허용하려면 컬럼 정의를 변경합니다. |
| Java enum | 업무 코드의 허용 값과 분기 등을 타입으로 표현합니다. 값을 추가하려면 코드를 변경하고 배포합니다. |
| MySQL `VARCHAR` | 문자열을 저장합니다. 길이와 별도 제약 안에서는 새 문자열을 저장하기 위해 값 목록을 ALTER할 필요가 없습니다. |

DB ENUM도 조회할 때는 문자열처럼 보이지만 내부적으로 값에 대응하는 번호를 사용하며, 기본 정렬도 선언된 순서를 따릅니다.
단순히 문자열 컬럼과 같은 타입은 아닙니다.
값의 저장과 정렬 기준은 [MySQL ENUM 공식 문서](https://dev.mysql.com/doc/refman/8.0/en/enum.html)를 참고합니다.

## 새 상태 하나를 추가할 때 DDL이 필요할 수 있습니다

다음은 독립된 실습 테이블입니다.

```sql
USE mysql_notes;
DROP TABLE IF EXISTS db_enum_example;
CREATE TABLE db_enum_example (
  id BIGINT PRIMARY KEY,
  status ENUM('READY', 'PAID') NOT NULL
) ENGINE=InnoDB;
INSERT INTO db_enum_example VALUES (1, 'READY');

-- CANCELLED를 허용하려면 컬럼 정의를 먼저 변경합니다.
ALTER TABLE db_enum_example
  MODIFY COLUMN status ENUM('READY', 'PAID', 'CANCELLED') NOT NULL;
INSERT INTO db_enum_example VALUES (2, 'CANCELLED');
```

이미 허용된 READY를 PAID로 바꾸는 UPDATE까지 ALTER가 필요한 것은 아닙니다.
불편함은 업무에 새 상태가 생길 때 DB의 허용 목록도 바꾸어야 한다는 점입니다.

DDL 실행 권한을 분리한 조직에서는 변경 요청과 검토, DB 작업 일정 및 애플리케이션 배포 순서를 맞춰야 합니다.
코드 수정은 작아도 운영 절차는 그보다 커질 수 있습니다.
반면 DB가 여러 입력 경로에서 허용 값을 직접 제한해야 하고 값이 안정적으로 유지된다면 DB ENUM도 선택할 수 있습니다.

ENUM 변경이 항상 테이블 전체 복사를 일으키는 것은 아닙니다.
목록 끝에 값을 추가하고 저장 크기가 바뀌지 않는 경우에는 빠르게 처리할 수 있지만, 스키마 변경 자체는 여전히 필요합니다.
실행 방식은 [작업별 Online DDL 지원 범위](https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html)를 확인합니다.

## DB에는 VARCHAR로 저장합니다

```sql
DROP TABLE IF EXISTS app_enum_example;
CREATE TABLE app_enum_example (
  id BIGINT PRIMARY KEY,
  status VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL
) ENGINE=InnoDB;
INSERT INTO app_enum_example VALUES (1, 'READY'), (2, 'PAID');
-- 기존 컬럼 길이와 제약 범위 안에서는 새 상태도 DDL 없이 저장합니다.
INSERT INTO app_enum_example VALUES (3, 'CANCELLED');
SELECT id, status FROM app_enum_example ORDER BY id;
```

업무 코드가 영문 대문자로 정해져 있어 이 예제는 ascii와 대소문자를 구분하는 비교 규칙을 사용합니다.
애플리케이션에서는 enum으로 제한하되 DB는 문자열을 보관하도록 역할을 나눕니다.
VARCHAR라고 모든 변경에서 DDL이 사라지는 것은 아닙니다.
길이를 늘리거나 CHECK의 허용 목록을 바꾸면 DDL이 필요하고, 공통코드 FK를 사용한다면 코드 데이터 추가도 필요합니다.

## Spring JPA에서는 enum을 사용합니다

다음은 Hibernate ORM 6.x에서 엔티티 필드에 적용하는 예제입니다.
업무 규칙은 enum과 애플리케이션에 두고, 영속성 필드에는 문자열 매핑을 지정합니다.

```java
public enum OrderStatus {
    READY,
    PAID,
    CANCELLED
}
```

```java
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

// 엔티티 내부 필드 예제입니다.
@Enumerated(EnumType.STRING)
@JdbcTypeCode(SqlTypes.VARCHAR)
@Column(name = "status", nullable = false, length = 32)
private OrderStatus status;
```

`EnumType.STRING`은 enum 상수 이름인 READY 등을 저장하는 방식입니다.
`ORDINAL`처럼 선언 순서를 숫자로 저장하지 않으므로 중간에 상수를 추가해 기존 번호의 의미가 달라지는 문제를 피할 수 있습니다.
다만 상수 이름을 READY에서 WAITING으로 바꾸면 기존 문자열과 맞지 않게 되므로 데이터 이전이나 별도 코드 매핑이 필요합니다.

### STRING을 지정해도 DB 타입은 확인합니다

Hibernate 6.2부터 MySQL에서 enum의 기본 SQL 타입이 네이티브 ENUM으로 바뀌었습니다.
따라서 `@Enumerated(EnumType.STRING)`만으로 DB 컬럼이 반드시 VARCHAR가 된다고 가정하지 않습니다.
예제의 `@JdbcTypeCode(SqlTypes.VARCHAR)`는 Hibernate에서 JDBC 문자열 타입을 명시하려는 설정입니다.
[Hibernate 6.2 변경 사항](https://docs.hibernate.org/orm/6.2/migration-guide/#datatype-for-enums)과 [타입 매핑 가이드](https://docs.hibernate.org/orm/6.6/userguide/html_single/#basic-enums)를 기준으로 사용 버전의 생성 DDL과 실제 스키마를 확인합니다.

```sql
SHOW CREATE TABLE app_enum_example;
```

이 어노테이션은 이미 만들어진 ENUM 컬럼을 VARCHAR로 바꾸는 마이그레이션 SQL은 아닙니다.
스키마 자동 생성에서 허용 목록 CHECK가 만들어지는지도 확인합니다.
문자열 컬럼이어도 CHECK가 목록을 제한하면 상태 추가 시 그 제약을 함께 변경해야 합니다.

## 문자열 저장에서 챙겨야 하는 것

| 상황 | 확인할 내용 |
|---|---|
| 잘못된 문자열 입력 | enum 변환과 입력 검증을 수행합니다. 직접 SQL이나 다른 프로그램이 넣은 값까지 Java 타입이 막지는 못합니다. |
| 구버전과 신버전이 함께 실행 | 구버전은 새 상수 이름을 읽지 못할 수 있습니다. 새 값을 읽을 수 있는 버전을 먼저 배포하고 새 값 쓰기를 활성화합니다. |
| 상수 이름 변경과 삭제 | 저장된 과거 값과 사용 중인 다른 서비스의 호환을 먼저 확인합니다. |
| 이름과 DB 코드의 수명이 다름 | AttributeConverter 등으로 안정적인 코드와 enum을 변환할 수 있습니다. 같은 필드에 Enumerated와 함께 적용하지 않습니다. |
| 공통코드와 enum을 함께 사용 | DB 표시 정보와 애플리케이션 업무 동작의 변경 절차를 맞춥니다. |

DB의 허용 값 통제를 일부 애플리케이션으로 가져오는 만큼, 입력 검증과 배포 호환성의 책임도 함께 가져옵니다.
이 글의 선택은 DB ENUM이 나빠서라기보다 업무 상태의 변경 주기와 운영 권한 분리에 맞추기 위한 것입니다.

## 이어서 읽기

- [데이터 타입과 문자셋 선택](/docs/knowledge/data/mysql/basics/data-types)
- [공통코드와 상태 변경 관리](/docs/knowledge/data/mysql/design/common-codes-and-status)
- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)

<details>
<summary>공식 참고 자료</summary>

- [MySQL ENUM](https://dev.mysql.com/doc/refman/8.0/en/enum.html)
- [ENUM 변경의 Online DDL 지원](https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html)
- [Hibernate 6.2 마이그레이션](https://docs.hibernate.org/orm/6.2/migration-guide/)
- [Hibernate 타입 매핑](https://docs.hibernate.org/orm/6.6/userguide/html_single/)

</details>
