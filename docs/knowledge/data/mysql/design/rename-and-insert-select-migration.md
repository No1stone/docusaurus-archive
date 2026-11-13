---
format: md
id: mysql-rename-and-insert-select-migration
title: "RENAME TABLE과 INSERT ... SELECT로 테이블 이관하기"
sidebar_label: "RENAME TABLE과 INSERT SELECT로 테이블 이관하기"
description: "RENAME TABLE로 원본을 보관한 뒤 새 테이블을 만들고 INSERT ... SELECT로 데이터를 옮기는 절차와 건수, 값 검증, 암시적 커밋 주의점을 정리합니다."
slug: /knowledge/data/mysql/design/rename-and-insert-select-migration
sidebar_position: 5
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "RENAME TABLE"
  - "INSERT SELECT"
  - "MySQL 테이블 이관"
  - "MariaDB 테이블 마이그레이션"
  - "암시적 커밋"
references:
  - "https://mariadb.com/docs/server/reference/sql-statements/data-manipulation/inserting-loading-data/insert-select"
  - "https://dev.mysql.com/doc/refman/8.4/en/rename-table.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/data-definition/rename-table"
  - "https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/transactions/sql-statements-that-cause-an-implicit-commit"
---

# `RENAME TABLE`과 `INSERT ... SELECT`로 테이블 이관하기

테이블 구조를 여러 군데 바꿔야 할 때 자주 썼던 방법입니다.
기존 테이블의 이름을 바꿔 이관 원본으로 남겨 두고, 바뀐 구조로 테이블을 다시 만든 뒤 `INSERT ... SELECT`로 데이터를 옮깁니다.

## 이름 변경부터 데이터 검증까지

기존 주문 테이블 `orders`를 `orders_backup`으로 바꿉니다.
새 `orders`에서는 기존 `order_status`의 값을 `status`에 저장합니다.
예제는 외래 키와 트리거가 없는 테이블을 기준으로 합니다.

```sql
-- 1. 기존 테이블을 이관 원본으로 남깁니다.
RENAME TABLE orders TO orders_backup;

-- 2. 기존 이름으로 새 테이블을 만듭니다.
CREATE TABLE orders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_orders_customer_id (customer_id)
) ENGINE = InnoDB;

-- 3. 기존 데이터를 새 테이블로 옮깁니다.
INSERT INTO orders (id, customer_id, status, created_at)
SELECT id, customer_id, order_status, created_at
FROM orders_backup;

-- 4. 이관 전후 건수를 비교합니다.
SELECT
    (SELECT COUNT(*) FROM orders_backup) AS source_count,
    (SELECT COUNT(*) FROM orders) AS target_count;

-- 5. 빠진 주문과 상태 값이 달라진 주문을 확인합니다.
SELECT
    src.id,
    src.order_status AS source_status,
    dst.status AS target_status
FROM orders_backup AS src
LEFT JOIN orders AS dst ON dst.id = src.id
WHERE dst.id IS NULL
   OR NOT (src.order_status <=> dst.status);
```

`INSERT ... SELECT`는 대상 컬럼과 조회 결과를 **순서대로** 대응시킵니다.
위 예제에서는 `SELECT`의 세 번째 값인 `order_status`가 `INSERT`의 세 번째 컬럼인 `status`에 들어갑니다.
건수가 같고 마지막 쿼리의 결과가 0건이면, 원본의 주문 ID가 모두 이관됐고 각 주문의 상태 값도 일치합니다.
[MariaDB `INSERT ... SELECT`](https://mariadb.com/docs/server/reference/sql-statements/data-manipulation/inserting-loading-data/insert-select)

## 운영에서 실행할 때

이름을 변경한 직후에는 `orders`가 없고, 새 테이블을 만든 직후에는 비어 있습니다.
이 순서로 이관할 때는 작업 전에 애플리케이션과 배치의 테이블 접근을 멈추고, 검증을 마친 뒤 다시 엽니다.
실제 테이블에 적용하기 전에는 `SHOW CREATE TABLE orders`로 기존 정의를 확인하고, 새 테이블에 필요한 인덱스, 기본값, 제약조건을 반영합니다.
[MySQL `RENAME TABLE`](https://dev.mysql.com/doc/refman/8.4/en/rename-table.html), [MariaDB `RENAME TABLE`](https://mariadb.com/docs/server/reference/sql-statements/data-definition/rename-table)

`RENAME TABLE`과 일반 `CREATE TABLE`은 암시적 커밋을 일으킵니다.
적재 중 오류가 나면 앞에서 바꾼 테이블 이름과 새 테이블 생성은 적용된 상태로 남습니다.
이때는 `orders_backup`과 `orders`의 상태를 확인한 뒤 실패한 단계부터 이어서 진행합니다.
[MySQL 암시적 커밋](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html), [MariaDB 암시적 커밋](https://mariadb.com/docs/server/reference/sql-statements/transactions/sql-statements-that-cause-an-implicit-commit)

## 관련

- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)
- [임시 테이블](/docs/knowledge/data/mysql/design/temporary-tables)
