---
format: "md"
id: "mysql-keys-and-relations"
title: "MySQL 기본키와 관계 설계"
description: "자연키와 대리키, 유니크 제약과 외래키를 구분하고 회원과 주문 관계를 예제 SQL로 설계합니다."
sidebar_label: "기본키와 관계 설계"
slug: "/knowledge/data/mysql/design/keys-and-relations"
sidebar_position: 1
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 기본키"
  - "자연키 대리키"
  - "외래키"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/innodb-auto-increment-handling.html"
---
# MySQL 기본키와 관계 설계

테이블의 기본키는 행을 안정적으로 식별하는 값입니다.
외부에서 받은 번호나 업무상 고유한 값이 있어도, 그 값의 변경 가능성과 사용 범위를 먼저 확인합니다.
아래 SQL은 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 준비한 뒤 실행합니다.

이 글의 기준 자료는 [외래키 제약의 공식 동작](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

PK의 INT, BIGINT와 UUID 선택 및 사용자에게 노출하는 ID는 [PK 타입과 공개 ID](/docs/knowledge/data/mysql/design/primary-key-types-and-public-id)에서 크기와 예제로 비교합니다.

## 자연키와 대리키를 구분합니다

자연키는 이메일이나 업무 번호처럼 업무에서 의미를 가진 값입니다.
대리키는 행 식별을 위해 별도로 부여한 값입니다.
예제는 `member.id`를 대리키로 사용하고, 이메일에는 별도의 유니크 제약을 둡니다.

```sql
SHOW CREATE TABLE member;
SHOW INDEX FROM member;
```

| 컬럼 | 역할 | 설계 판단 |
|---|---|---|
| member.id | 기본키 | 이메일 변경과 무관하게 회원을 식별합니다. |
| member.email | 업무 고유값 | 중복을 막되 문자열 비교 규칙도 확인합니다. |
| orders.request_key | 요청 고유값 | 재전송된 주문 요청을 구분합니다. |
| orders.member_id | 외래키 | 주문이 참조하는 회원을 식별합니다. |

AUTO_INCREMENT에는 롤백 등으로 빈 번호가 생길 수 있습니다.
연속된 업무 번호가 필요하다면 기본키와 다른 요구사항으로 다룹니다.

## 관계는 키로 연결합니다

```sql
SELECT o.id AS order_id, m.id AS member_id, m.name, o.amount
FROM orders AS o
JOIN member AS m ON m.id = o.member_id
ORDER BY o.id;
```

회원 이름을 모든 주문에 복사하지 않고 현재 회원 정보를 연결한 예제입니다.
반대로 주문 당시의 배송지나 상품명처럼 과거 값을 보존해야 한다면 주문에 스냅샷으로 저장할 수 있습니다.
현재 정보와 당시 정보를 구분하는 것이 단순히 중복을 없애는 것보다 중요합니다.

## 외래키가 보장하는 범위

```sql
START TRANSACTION;
INSERT INTO orders
  (request_key, member_id, status, amount, created_at)
VALUES ('missing-member', 999, 'READY', 1000, NOW(6));
-- 회원 999가 없으므로 외래키 오류가 발생합니다.
ROLLBACK;
```

외래키는 참조 대상의 존재를 검사하지만, 탈퇴한 회원인지 같은 업무 규칙까지 검사하지는 않습니다.
삭제 시 RESTRICT, CASCADE 또는 다른 정책을 선택하는 것도 관계의 수명주기에 따른 결정입니다.
예제는 기본 참조 제한을 사용하므로 자식 주문이 있는 회원을 바로 삭제할 수 없습니다.
외래키를 사용하지 않는 구조라면 고아 데이터 확인과 정리 책임을 별도로 정해야 합니다.

## 이어서 읽기

- [MySQL 테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)

- [파티셔닝과 PK 구성](/docs/knowledge/data/mysql/operations/partitioning): 날짜 파티셔닝의 복합 키 제약과 ID 파티셔닝의 단일 키 구성을 비교합니다.

- [MySQL 공통코드와 상태 변경 관리](/docs/knowledge/data/mysql/design/common-codes-and-status)
- [MySQL JOIN과 집계 쿼리](/docs/knowledge/data/mysql/query/joins-and-aggregation)

<details>
<summary>공식 참고 자료</summary>

- [외래키 제약](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)
- [AUTO_INCREMENT](https://dev.mysql.com/doc/refman/8.0/en/innodb-auto-increment-handling.html)

</details>
