---
format: "md"
id: "mysql-common-codes-and-status"
title: "MySQL 공통코드와 상태 변경 관리"
description: "공통코드 테이블, 애플리케이션 Enum과 MySQL ENUM의 역할을 구분하고 조건부 상태 변경과 이력을 SQL로 관리합니다."
sidebar_label: "공통코드와 상태 변경 관리"
slug: "/knowledge/data/mysql/design/common-codes-and-status"
sidebar_position: 2
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 공통코드"
  - "상태 전이"
  - "조건부 UPDATE"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/enum.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/information-functions.html"
---
# MySQL 공통코드와 상태 변경 관리

공통코드는 여러 화면과 처리에서 같은 의미로 사용하는 값과 표시 이름을 관리합니다.
코드가 존재하는지 검사하는 것과 그 상태로 바뀌어도 되는지 판단하는 것은 다른 책임입니다.
예제는 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)의 ORDER_STATUS 그룹을 사용합니다.

이 글의 기준 자료는 [외래키의 참조 검사와 제약 범위](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 코드 테이블과 Enum의 역할

| 방식 | 주로 맡기는 책임 |
|---|---|
| 공통코드 테이블 | 표시 이름, 정렬 순서와 사용 여부를 데이터로 관리합니다. |
| Java 또는 Kotlin Enum | 코드 분기와 허용된 상태 전이를 애플리케이션에서 표현합니다. |
| MySQL ENUM 컬럼 | 컬럼에 허용할 문자열 집합을 스키마로 제한합니다. |

애플리케이션 Enum과 코드 테이블을 함께 사용한다면 같은 코드의 의미와 변경 절차를 맞춥니다.
운영자가 코드 한 건을 추가했다고 새 업무 동작이 자동으로 구현되는 것은 아닙니다.

```sql
SELECT o.id, o.status, c.name AS status_name
FROM orders AS o
JOIN common_code AS c
  ON c.code_group = o.status_group AND c.code = o.status
ORDER BY o.id;

SELECT code, name
FROM common_code
WHERE code_group = 'ORDER_STATUS' AND enabled = TRUE
ORDER BY sort_order, code;
```

코드 그룹과 코드를 함께 연결해야 다른 그룹의 동일 코드와 섞이지 않습니다.
비활성 코드는 새 입력에서 제외하되, 과거 주문을 조회할 때 이름까지 사라져야 하는지는 별도 정책입니다.
예제의 복합 외래키는 코드 존재만 검사하며 `enabled`까지 검사하지 않습니다.

## 허용된 이전 상태에서만 변경합니다

```sql
START TRANSACTION;
UPDATE orders
SET status = 'PAID', version = version + 1
WHERE id = 101 AND status = 'READY';
SELECT ROW_COUNT() AS changed_rows;
ROLLBACK;
```

초기 데이터에서는 변경 건수가 1입니다.
0이면 주문이 없거나 이미 다른 상태라는 뜻이므로 성공으로 단정하지 않습니다.
외래키는 CANCELLED에서 PAID로 바꾸는 작업도 코드가 유효하면 허용합니다.
이전 상태 조건은 DB 제약과 별도로 업무 상태 전이를 보호합니다.

## 상태 이력이 필요한 경우

```sql
CREATE TABLE IF NOT EXISTS order_status_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  from_status VARCHAR(32) NOT NULL,
  to_status VARCHAR(32) NOT NULL,
  changed_at DATETIME(6) NOT NULL,
  KEY ix_order_history (order_id, id)
) ENGINE=InnoDB;

START TRANSACTION;
UPDATE orders SET status = 'PAID', version = version + 1
WHERE id = 101 AND status = 'READY';
SET @changed = ROW_COUNT();
INSERT INTO order_status_history (order_id, from_status, to_status, changed_at)
SELECT 101, 'READY', 'PAID', NOW(6) WHERE @changed = 1;
ROLLBACK;
```

状態와 이력은 같은 트랜잭션에서 기록합니다.
실제 애플리케이션에서는 변경 건수를 확인한 뒤 이력을 저장하고, 예제의 세션 변수를 공유 상태로 사용하지 않습니다.

## 이어서 읽기

- [MySQL 중복 요청과 동시 갱신 방지](/docs/knowledge/data/mysql/transactions/idempotency-and-version)
- [MySQL 벌크 INSERT와 UPDATE, 청크 처리](/docs/knowledge/data/mysql/operations/bulk-and-chunks)

<details>
<summary>공식 참고 자료</summary>

- [외래키 제약](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)
- [ENUM](https://dev.mysql.com/doc/refman/8.0/en/enum.html)
- [ROW_COUNT](https://dev.mysql.com/doc/refman/8.0/en/information-functions.html)

</details>
