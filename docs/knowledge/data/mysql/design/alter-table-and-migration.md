---
format: md
id: mysql-alter-table-and-migration
title: "MySQL ALTER TABLE과 테이블 마이그레이션"
sidebar_label: "테이블 수정과 마이그레이션"
description: "MySQL 컬럼 추가, 타입과 이름 변경, 기본값, 컬럼 순서와 삭제를 예제로 설명하고 RENAME TABLE과 INSERT SELECT를 활용한 데이터 이전 및 검증 절차를 정리합니다."
slug: /knowledge/data/mysql/design/alter-table-and-migration
sidebar_position: 4
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL ALTER TABLE"
  - "MySQL 컬럼 추가 수정 삭제"
  - "MODIFY CHANGE RENAME COLUMN"
  - "MySQL INSERT SELECT 마이그레이션"
  - "MySQL 테이블 백업 RENAME"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/alter-table.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/create-table-like.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/rename-table.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/insert-select.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/metadata-locking.html"
---
# MySQL ALTER TABLE과 테이블 마이그레이션

작은 스키마 변경은 `ALTER TABLE`로 처리할 수 있습니다.
데이터 변환과 검증이 함께 필요하면 기존 테이블을 보관하고 새 테이블로 옮기는 방법도 사용할 수 있습니다.
두 방식 모두 변경 구문뿐 아니라 애플리케이션 배포 순서, 작업 중 쓰기와 복구 방법까지 정해야 합니다.

아래는 MySQL 8.0과 InnoDB 기준의 실습입니다.
외래키와 트리거가 없는 별도 테이블을 사용하며, 실제 업무 테이블에는 그대로 실행하지 않습니다.

## 수정 전 테이블을 확인합니다

`SHOW CREATE TABLE`로 타입, NULL 허용 여부, 기본값, 인덱스와 제약조건을 확인합니다.
예제는 [공통 실습 DB](/docs/knowledge/data/mysql/example-schema) 안에 독립된 테이블을 생성합니다.
아래 DROP은 이 글의 실습 테이블만 초기화합니다.

```sql
USE mysql_notes;
DROP TABLE IF EXISTS member_migration_demo;
CREATE TABLE member_migration_demo (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL COMMENT '회원 이름',
  email VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uk_demo_email (email)
) ENGINE=InnoDB;

INSERT INTO member_migration_demo (display_name, email, created_at) VALUES
  (' Kim ', 'kim@example.com', '2026-10-28 09:00:00'),
  (' Lee ', 'lee@example.com', '2026-10-28 10:00:00');
SHOW CREATE TABLE member_migration_demo;
SHOW INDEX FROM member_migration_demo;
```

## 컬럼 수정 구문을 구분합니다

| 작업 | 사용하는 구문 |
|---|---|
| 컬럼 추가 | `ADD COLUMN` |
| 타입, NULL 여부와 속성 변경 | `MODIFY COLUMN` |
| 이름과 정의를 함께 변경 | `CHANGE COLUMN` |
| 이름만 변경 | `RENAME COLUMN` |
| 기본값만 변경하거나 제거 | `ALTER COLUMN ... SET DEFAULT`, `DROP DEFAULT` |
| 컬럼 위치 변경 | `MODIFY COLUMN ... FIRST`, `AFTER` |
| 컬럼 삭제 | `DROP COLUMN` |

MySQL에서 타입 변경은 `ALTER COLUMN ... TYPE`이 아니라 `MODIFY`나 `CHANGE`를 사용합니다.
세부 문법은 [ALTER TABLE 공식 문서](https://dev.mysql.com/doc/refman/8.0/en/alter-table.html)를 참고합니다.

### 컬럼 추가와 기존 데이터 채우기

```sql
ALTER TABLE member_migration_demo
  ADD COLUMN phone VARCHAR(20) NULL AFTER email,
  ADD COLUMN nickname VARCHAR(50) NULL,
  ADD COLUMN status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE';
SELECT id, phone, status FROM member_migration_demo;
```

기존 행도 status를 ACTIVE로 읽게 됩니다.
행마다 다른 값을 계산해야 한다면 nullable 컬럼 추가, 데이터 채우기, 검증, NOT NULL 적용 순서로 나눌 수 있습니다.

```sql
ALTER TABLE member_migration_demo ADD COLUMN normalized_name VARCHAR(50) NULL;
UPDATE member_migration_demo SET normalized_name = TRIM(display_name);
SELECT COUNT(*) AS missing_count
FROM member_migration_demo WHERE normalized_name IS NULL;
ALTER TABLE member_migration_demo
  MODIFY COLUMN normalized_name VARCHAR(50) NOT NULL;
```

대량 테이블은 UPDATE를 한 번에 끝내기보다 PK 범위로 나누어 처리할 수 있습니다.
애플리케이션 쓰기가 계속된다면 기존 행을 채우는 동안 새 행에도 값이 기록되도록 배포 순서를 맞춥니다.

### 타입과 이름 변경

```sql
ALTER TABLE member_migration_demo
  MODIFY COLUMN display_name VARCHAR(100) NOT NULL COMMENT '회원 이름';
ALTER TABLE member_migration_demo
  CHANGE COLUMN phone contact_number VARCHAR(30) NULL;
ALTER TABLE member_migration_demo
  RENAME COLUMN nickname TO alias_name;
```

`MODIFY`와 `CHANGE`는 유지할 컬럼 정의를 함께 작성합니다.
NOT NULL, DEFAULT, COMMENT와 문자셋 같은 속성을 빠뜨려 의도치 않게 바꾸지 않도록 기존 정의와 비교합니다.
문자열 길이를 줄이거나 숫자 타입의 범위를 좁히기 전에는 기존 값이 새 범위에 들어가는지 먼저 확인합니다.

### 기본값만 변경

```sql
ALTER TABLE member_migration_demo ALTER COLUMN status SET DEFAULT 'PENDING';
ALTER TABLE member_migration_demo ALTER COLUMN status DROP DEFAULT;
ALTER TABLE member_migration_demo ALTER COLUMN status SET DEFAULT 'ACTIVE';
```

기본값 변경은 이후 INSERT에서 값을 생략할 때 적용됩니다.
이미 저장된 status를 일괄 변경하는 작업은 아닙니다.

### 컬럼 순서 변경과 삭제

```sql
ALTER TABLE member_migration_demo
  MODIFY COLUMN contact_number VARCHAR(30) NULL AFTER display_name;
ALTER TABLE member_migration_demo
  MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT FIRST;
ALTER TABLE member_migration_demo DROP COLUMN alias_name;
SHOW CREATE TABLE member_migration_demo;
```

`FIRST`는 맨 앞, `AFTER 컬럼명`은 지정한 컬럼 뒤로 이동합니다.
표시 순서를 바꾸려고 테이블 재구성 비용을 지불할 필요가 있는지도 판단합니다.
쿼리에서 필요한 컬럼 순서를 명시하는 방법이 더 간단할 수 있습니다.
삭제 전에는 구버전 애플리케이션, 배치, 뷰와 쿼리에서 해당 컬럼을 사용하지 않는지 확인합니다.

## 원본을 백업 이름으로 바꾸고 새 테이블로 옮깁니다

이 예제는 조회와 쓰기를 중지한 점검 시간에 수행합니다.
먼저 원본을 바꾸면 새 테이블 생성과 복사가 끝날 때까지 기존 이름으로 정상 서비스할 수 없기 때문입니다.
백업 이름의 테이블은 같은 DB에 남기는 임시 보관본이며 별도 장비에 보관한 덤프 백업을 대체하지 않습니다.

### 1. 원본 테이블 이름 변경

```sql
RENAME TABLE member_migration_demo
  TO member_migration_demo_backup_20261028;
```

백업 이름이 이미 있으면 작업을 멈추고 이전 작업 상태를 확인합니다.
기존 보관본을 무조건 삭제한 뒤 다시 진행하지 않습니다.

### 2. 구조 복제와 변경 적용

```sql
CREATE TABLE member_migration_demo
  LIKE member_migration_demo_backup_20261028;
ALTER TABLE member_migration_demo
  MODIFY COLUMN created_at DATETIME(6) NOT NULL,
  ADD COLUMN migrated_at DATETIME(6) NULL;
SHOW CREATE TABLE member_migration_demo;
```

`CREATE TABLE ... LIKE`는 데이터 없이 컬럼 정의와 인덱스를 복제합니다.
외래키 정의와 트리거까지 모두 복제하는 전체 테이블 백업 기능은 아닙니다.
`CREATE TABLE ... AS SELECT`는 같은 구조 보존을 보장하지 않으므로 혼용하지 않습니다.
[LIKE의 복제 범위](https://dev.mysql.com/doc/refman/8.0/en/create-table-like.html)를 확인하고 필요한 정의를 별도로 비교합니다.

### 3. INSERT SELECT로 데이터 복사와 변환

```sql
INSERT INTO member_migration_demo
  (id, display_name, contact_number, email, created_at,
   normalized_name, status, migrated_at)
SELECT
  id, TRIM(display_name), contact_number, email, created_at,
  normalized_name, status, NOW(6)
FROM member_migration_demo_backup_20261028;
```

대상 컬럼과 SELECT 컬럼을 명시하면 순서 변경이나 새 컬럼 추가로 값이 잘못 들어가는 일을 줄일 수 있습니다.
원본 ID를 그대로 옮기고 이름 양쪽 공백을 제거한 예제입니다.
DATETIME을 DATETIME(6)으로 늘려도 과거 데이터에 없던 마이크로초가 복원되지는 않습니다.
대량 복사는 [청크 처리](/docs/knowledge/data/mysql/operations/bulk-and-chunks)를 참고해 PK 범위로 나누고, 완료 범위를 기록합니다.

### 4. 건수와 변환 결과 확인

```sql
SELECT
  (SELECT COUNT(*) FROM member_migration_demo_backup_20261028) AS before_count,
  (SELECT COUNT(*) FROM member_migration_demo) AS after_count;

SELECT COUNT(*) AS missing_or_mismatched
FROM member_migration_demo_backup_20261028 AS b
LEFT JOIN member_migration_demo AS n ON n.id = b.id
WHERE n.id IS NULL
   OR NOT (n.display_name <=> TRIM(b.display_name))
   OR NOT (n.email <=> b.email)
   OR NOT (n.contact_number <=> b.contact_number)
   OR NOT (n.created_at <=> b.created_at)
   OR NOT (n.normalized_name <=> b.normalized_name)
   OR NOT (n.status <=> b.status)
   OR n.migrated_at IS NULL;
SHOW INDEX FROM member_migration_demo;
```

예제는 이전과 이후 건수가 모두 2이고 누락 및 불일치가 0이어야 합니다.
`<=>`는 NULL도 비교할 수 있는 연산자입니다.
실제 이전에서는 핵심 컬럼, 합계와 관계 무결성도 비교하고 다음 AUTO_INCREMENT 값까지 확인합니다.
원본의 다음 번호가 삭제 등으로 현재 MAX(id)보다 훨씬 큰 경우, 새 테이블에서도 그 번호를 보존해야 하는지 판단합니다.

### 5. 실패 시 원본 복구

다음은 검증에 실패했고 아직 서비스 쓰기를 재개하지 않은 경우의 복구 예제입니다.
새 테이블도 failed 이름으로 남겨 원인을 확인합니다.

```sql
RENAME TABLE
  member_migration_demo TO member_migration_demo_failed_20261028,
  member_migration_demo_backup_20261028 TO member_migration_demo;
```

이름 변경은 복구 수단이지만, 서비스 재개 후 새 테이블에 기록한 데이터를 자동으로 원본에 합치지는 않습니다.
새 쓰기가 발생했다면 원본으로 되돌리기 전에 그 데이터의 보존과 반영 방법부터 정합니다.

## 복사 후 한 번에 이름을 교체하는 방법

정상 서비스 이름을 먼저 없애고 싶지 않다면 새 이름으로 테이블을 만들고 복사한 후 교체할 수 있습니다.
앞 예제의 복구까지 실행한 상태에서도 아래 SQL을 이어서 실습할 수 있습니다.

```sql
CREATE TABLE member_migration_demo_candidate LIKE member_migration_demo;
INSERT INTO member_migration_demo_candidate
  (id, display_name, contact_number, email, created_at, normalized_name, status)
SELECT id, display_name, contact_number, email, created_at, normalized_name, status
FROM member_migration_demo;
-- 복사 결과 검증 후 교체합니다.
RENAME TABLE
  member_migration_demo TO member_migration_demo_previous_20261028,
  member_migration_demo_candidate TO member_migration_demo;
```

MySQL에서 [한 RENAME TABLE 문장의 이름 교체](https://dev.mysql.com/doc/refman/8.0/en/rename-table.html)는 원자적으로 처리할 수 있습니다.
하지만 복사 중 원본에 추가된 쓰기를 자동 동기화하는 것은 아닙니다.
이 예제도 점검 시간 동안 쓰기를 중지하며, 무중단 이전에는 변경분 추적과 반영 절차가 별도로 필요합니다.

## 운영 마이그레이션에서 확인할 것

| 확인 항목 | 이유와 대응 |
|---|---|
| 외래키와 트리거 | 참조되는 원본을 rename하면 외래키가 백업 쪽을 계속 참조할 수 있습니다. 새 이름의 테이블로 자동 연결된다고 가정하지 않고 참조 대상과 트리거 정의를 확인합니다. |
| 타입 축소와 NOT NULL | 최대 길이, 범위 초과와 NULL을 먼저 조회하고 정리합니다. |
| 오래 열린 트랜잭션 | DDL이 메타데이터 잠금을 기다릴 수 있습니다. 실행 전 대기 상황을 확인합니다. |
| 디스크와 로그 공간 | 원본과 새 테이블 및 인덱스, 작업 중 임시 공간과 로그가 함께 필요할 수 있습니다. |
| 애플리케이션 배포 순서 | 컬럼 추가와 양쪽 버전 호환, 데이터 채우기, 새 컬럼 사용, 이전 컬럼 제거를 단계로 나눕니다. |
| 복구와 보관 기간 | 검증 직후 원본을 삭제하지 않고 복구 가능 기간과 삭제 기준을 정합니다. |

`ALTER TABLE`과 `RENAME TABLE` 같은 DDL은 [암묵적 커밋](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)을 일으킵니다.
여러 DDL을 START TRANSACTION으로 감싸도 전체 작업을 ROLLBACK할 수 있는 것은 아닙니다.

작업에 따라 `ALGORITHM=INSTANT` 또는 `INPLACE`, `LOCK=NONE`을 지정해 지원하지 않는 방식으로 진행되는 것을 막을 수 있습니다.
아무 ALTER에나 같은 조합을 붙이지 않고 [버전과 작업별 Online DDL 지원 범위](https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html)를 확인합니다.
Online DDL도 [메타데이터 잠금](https://dev.mysql.com/doc/refman/8.0/en/metadata-locking.html)이 완전히 없는 작업은 아닙니다.

<details>
<summary>공식 참고 자료</summary>

- [ALTER TABLE](https://dev.mysql.com/doc/refman/8.0/en/alter-table.html)
- [CREATE TABLE LIKE](https://dev.mysql.com/doc/refman/8.0/en/create-table-like.html)
- [RENAME TABLE](https://dev.mysql.com/doc/refman/8.0/en/rename-table.html)
- [INSERT SELECT](https://dev.mysql.com/doc/refman/8.0/en/insert-select.html)
- [InnoDB Online DDL](https://dev.mysql.com/doc/refman/8.0/en/innodb-online-ddl-operations.html)
- [암묵적 커밋](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)
- [메타데이터 잠금](https://dev.mysql.com/doc/refman/8.0/en/metadata-locking.html)

</details>
