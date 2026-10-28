---
format: "md"
id: "mysql-bulk-and-chunks"
title: "MySQL 벌크 INSERT와 UPDATE, 청크 처리"
description: "다중 행 INSERT, 조건부 일괄 UPDATE와 서로 다른 값의 변경을 비교하고 배치 청크와 트랜잭션 경계를 구분합니다."
sidebar_label: "벌크 INSERT와 UPDATE, 청크 처리"
slug: "/knowledge/data/mysql/operations/bulk-and-chunks"
sidebar_position: 1
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 벌크 INSERT"
  - "벌크 UPDATE"
  - "Spring Batch 청크"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/insert-optimization.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/update.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/packet-too-large.html"
  - "https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing.html"
---
# MySQL 벌크 INSERT와 UPDATE, 청크 처리

벌크 처리는 DB 왕복과 반복 실행 비용을 줄이는 방법입니다.
몇 건을 묶어 읽고 처리할지 정하는 청크와, SQL 한 문장으로 몇 행을 변경할지는 별개의 선택입니다.
아래 SQL은 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 준비한 상태에서 실행합니다.

이 글의 기준 자료는 [다중 행 INSERT를 이용한 최적화](https://dev.mysql.com/doc/refman/8.0/en/insert-optimization.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 여러 행을 한 번에 저장합니다

```sql
START TRANSACTION;
INSERT INTO orders (request_key, member_id, status, amount, created_at)
VALUES
  ('bulk-example-1', 1, 'READY', 1000, NOW(6)),
  ('bulk-example-2', 2, 'READY', 2000, NOW(6));
SELECT ROW_COUNT() AS inserted_rows;
ROLLBACK;
```

한 행씩 SQL을 보내는 방식과 다중 행 INSERT, JDBC batch는 구분해서 측정합니다.
ORM의 saveAll 호출이 자동으로 하나의 다중 행 INSERT가 된다고 가정하지 않습니다.
너무 큰 문장은 패킷 크기, 메모리와 잠금 유지 시간의 제약을 받습니다.

## 같은 상태로 바꿀 대상은 조건을 묶습니다

```sql
START TRANSACTION;
UPDATE orders
SET status = 'EXPIRED', version = version + 1
WHERE id IN (101, 103)
  AND status = 'READY'
  AND expires_at < '2026-01-03 00:00:00';
SELECT ROW_COUNT() AS expired_rows;
ROLLBACK;
```

초기 데이터에서는 2건이 변경됩니다.
청크를 읽은 뒤 다른 작업이 상태를 바꿀 수 있으므로 이전 상태 조건을 UPDATE에도 넣습니다.
읽은 건수와 바뀐 건수가 다를 때의 처리 기준도 정합니다.

## 행마다 변경값이 다르면 구분합니다

```sql
START TRANSACTION;
UPDATE orders
SET amount = CASE id WHEN 101 THEN 31000 WHEN 103 THEN 5500 END,
    version = version + 1
WHERE id IN (101, 103) AND status = 'READY';
SELECT id, amount FROM orders WHERE id IN (101, 103);
ROLLBACK;
```

CASE는 작은 묶음의 예제입니다.
규모가 커지면 JDBC batch나 대상 값을 적재한 임시 테이블과 JOIN하는 방식도 비교합니다.
동일한 상태로 바꾸는 IN 조건만으로 서로 다른 금액을 표현할 수는 없습니다.

## 배치의 실패 경계를 정합니다

| 기준 | 정할 내용 |
|---|---|
| 읽기 | 처리 중 변경될 수 있는 OFFSET보다 안정적인 키 순회를 검토합니다. |
| 트랜잭션 | 한 청크 실패 시 함께 롤백할 범위를 정합니다. |
| 재시도 | 중복 키와 일시 잠금 오류를 같은 실패로 취급하지 않습니다. |
| 재시작 | 체크포인트와 실제 변경의 정합성, 멱등성을 확인합니다. |

Spring Batch에서는 Reader, Processor, Writer와 청크 트랜잭션으로 이 경계를 구성할 수 있습니다.
기본 청크 처리에서 청크가 작을수록 커밋 횟수가 늘고, 클수록 메모리와 실패 시 재처리 범위가 늘 수 있습니다.
청크 500건을 읽었다는 이유만으로 500개 Saga나 주문의 업무 트랜잭션을 반드시 하나로 묶어야 하는 것은 아닙니다.

## 이어서 읽기

- [MySQL 페이지 조회와 대량 데이터 읽기](/docs/knowledge/data/mysql/query/pagination)
- [MySQL 잠금과 데드락 대응](/docs/knowledge/data/mysql/transactions/locks-and-deadlocks)

<details>
<summary>공식 참고 자료</summary>

- [INSERT 최적화](https://dev.mysql.com/doc/refman/8.0/en/insert-optimization.html)
- [UPDATE](https://dev.mysql.com/doc/refman/8.0/en/update.html)
- [패킷 크기](https://dev.mysql.com/doc/refman/8.0/en/packet-too-large.html)
- [Spring Batch 청크 처리](https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing.html)

</details>
