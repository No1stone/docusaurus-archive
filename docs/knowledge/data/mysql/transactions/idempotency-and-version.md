---
format: "md"
id: "mysql-idempotency-and-version"
title: "MySQL 중복 요청과 동시 갱신 방지"
description: "유니크 제약, 버전 조건과 멱등 처리 기록으로 중복 생성과 갱신 충돌을 구분하고 트랜잭션 안에서 처리합니다."
sidebar_label: "중복 요청과 동시 갱신 방지"
slug: "/knowledge/data/mysql/transactions/idempotency-and-version"
sidebar_position: 3
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 멱등성"
  - "유니크 제약"
  - "낙관적 락"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/update.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/create-index.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/commit.html"
---
# MySQL 중복 요청과 동시 갱신 방지

중복 요청과 동시 갱신은 서로 다른 문제입니다.
같은 요청이 다시 도착한 경우에는 기존 결과를 돌려주고, 서로 다른 변경이 충돌하면 현재 상태를 다시 판단해야 합니다.
예제는 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 사용합니다.

이 글의 기준 자료는 [UPDATE의 조건과 변경 결과](https://dev.mysql.com/doc/refman/8.0/en/update.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 중복 생성은 DB의 유니크 제약으로 막습니다

```sql
SELECT id, request_key FROM orders WHERE request_key = 'request-101';

START TRANSACTION;
INSERT INTO orders (request_key, member_id, status, amount, created_at)
VALUES ('request-101', 1, 'READY', 30000, NOW(6));
-- 기존 request_key와 같으므로 중복 키 오류가 발생합니다.
ROLLBACK;
```

먼저 조회해서 없으면 INSERT하는 것만으로는 동시 요청을 막을 수 없습니다.
둘 다 없는 것으로 읽을 수 있으므로 최종 중복 여부는 유니크 제약으로 확인합니다.
같은 키로 다른 금액을 보내는 경우까지 정상 재시도로 인정할지는 별도 요청 비교 규칙이 필요합니다.

## 버전 조건으로 낙관적 락 구현하기

```sql
START TRANSACTION;
UPDATE orders
SET amount = 32000, version = version + 1
WHERE id = 101 AND version = 0;
SELECT ROW_COUNT() AS first_update;

UPDATE orders
SET amount = 33000, version = version + 1
WHERE id = 101 AND version = 0;
SELECT ROW_COUNT() AS stale_update;
ROLLBACK;
```

초기 데이터에서는 첫 변경은 1건, 오래된 버전으로 다시 시도한 변경은 0건입니다.
충돌 시 무조건 같은 값을 덮어쓰지 말고 다시 읽어 업무 조건을 검토합니다.
JPA의 @Version을 쓴다면 직접 작성한 벌크 SQL도 버전 관리 규칙과 맞춰야 합니다.

## 메시지 처리 기록과 업무 변경을 함께 확정합니다

```sql
CREATE TABLE IF NOT EXISTS processed_message (
  consumer_name VARCHAR(64) NOT NULL,
  message_id VARCHAR(64) NOT NULL,
  processed_at DATETIME(6) NOT NULL,
  PRIMARY KEY (consumer_name, message_id)
) ENGINE=InnoDB;

START TRANSACTION;
INSERT INTO processed_message (consumer_name, message_id, processed_at)
VALUES ('payment-result', 'event-example-101', NOW(6));
UPDATE orders SET status = 'PAID', version = version + 1
WHERE id = 101 AND status = 'READY';
ROLLBACK;
```

실제 처리기는 기록 INSERT가 중복 키로 실패하면 같은 업무를 다시 실행하지 않습니다.
이후 업무 변경이 실패하면 같은 트랜잭션 전체를 롤백하고, 성공한 경우에만 커밋합니다.
UPDATE가 0건인 경우도 이미 반영된 상태인지 허용되지 않은 상태인지 구분합니다.
외부 API 호출의 멱등성이나 메시지 ACK 시점까지 이 테이블이 자동 보장하지는 않습니다.

## 이어서 읽기

- [MySQL 공통코드와 상태 변경 관리](/docs/knowledge/data/mysql/design/common-codes-and-status)
- [MySQL 벌크 INSERT와 UPDATE, 청크 처리](/docs/knowledge/data/mysql/operations/bulk-and-chunks)

<details>
<summary>공식 참고 자료</summary>

- [CREATE INDEX와 유니크 제약](https://dev.mysql.com/doc/refman/8.0/en/create-index.html)
- [트랜잭션](https://dev.mysql.com/doc/refman/8.0/en/commit.html)
- [UPDATE](https://dev.mysql.com/doc/refman/8.0/en/update.html)

</details>
