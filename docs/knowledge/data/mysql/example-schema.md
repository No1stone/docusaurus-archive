---
format: "md"
id: "mysql-example-schema"
title: "MySQL 실습용 주문 테이블과 데이터"
description: "MySQL 8.0의 설계, 조회와 배치 예제에서 함께 사용하는 회원, 주문, 주문 항목과 공통코드 테이블을 준비합니다."
sidebar_label: "공통 실습 데이터"
slug: "/knowledge/data/mysql/example-schema"
sidebar_position: 1
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 실습 SQL"
  - "주문 테이블 설계"
  - "InnoDB"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/explain.html"
---
# MySQL 실습용 주문 테이블과 데이터

이 영역의 예제는 회원, 주문, 주문 항목과 공통코드 테이블을 함께 사용합니다.
각 글에서 필요한 조건과 처리 방법을 비교할 수 있도록 데이터 이름을 통일했습니다.
CHECK 제약이 적용되는 MySQL 8.0.16과 EXPLAIN ANALYZE가 추가된 8.0.18을 고려해, 실습 기준은 **MySQL 8.0.18 이상**으로 둡니다.
MySQL 8.4나 MariaDB에서 그대로 동작한다고 가정하지 않습니다.

## 실행 전 준비

[예제 SQL 파일](/examples/mysql/mysql-notes.sql)을 내려받아 개인 실습용 서버에서 실행합니다.
DB 생성과 테이블 생성 권한이 있는 계정이 필요합니다.
스크립트를 다시 실행하면 `mysql_notes`의 예제 네 테이블이 초기화되므로 다른 데이터를 넣어 두지 않습니다.

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p < mysql-notes.sql
```

| 테이블 | 설명 |
|---|---|
| member | 회원의 식별자, 이메일과 이름을 저장합니다. |
| orders | 주문 상태, 금액, 처리 버전과 JSON 부가정보를 저장합니다. |
| order_item | 주문별 상품과 수량을 저장합니다. |
| common_code | 주문 상태의 코드와 표시 이름을 관리합니다. |

## 테이블 생성과 초기 데이터

```sql
-- MySQL 8.0.18 이상, 개인 실습용 데이터입니다.
SET NAMES utf8mb4;
-- 다시 실행하면 mysql_notes 안의 아래 네 테이블을 초기화합니다.
CREATE DATABASE IF NOT EXISTS mysql_notes
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE mysql_notes;

DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS common_code;

CREATE TABLE common_code (
  code_group VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  code VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(100) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (code_group, code)
) ENGINE=InnoDB;

CREATE TABLE member (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_member_email (email)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  request_key VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  member_id BIGINT NOT NULL,
  status_group VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin
    NOT NULL DEFAULT 'ORDER_STATUS',
  status VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  version BIGINT NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL,
  expires_at DATETIME(6),
  attributes JSON,
  PRIMARY KEY (id),
  UNIQUE KEY uk_orders_request_key (request_key),
  KEY ix_orders_member (member_id),
  KEY ix_orders_status_created_id (status, created_at, id),
  CONSTRAINT fk_orders_member FOREIGN KEY (member_id) REFERENCES member(id),
  CONSTRAINT fk_orders_status FOREIGN KEY (status_group, status)
    REFERENCES common_code(code_group, code),
  CONSTRAINT ck_orders_status_group CHECK (status_group = 'ORDER_STATUS'),
  CONSTRAINT ck_orders_amount CHECK (amount >= 0)
) ENGINE=InnoDB;

CREATE TABLE order_item (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_code VARCHAR(32) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_order_item_order (order_id),
  CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT ck_item_quantity CHECK (quantity > 0)
) ENGINE=InnoDB;

INSERT INTO common_code (code_group, code, name, sort_order) VALUES
  ('ORDER_STATUS', 'READY', '결제 대기', 1),
  ('ORDER_STATUS', 'PAID', '결제 완료', 2),
  ('ORDER_STATUS', 'CANCELLED', '취소', 3),
  ('ORDER_STATUS', 'EXPIRED', '기간 만료', 4);

INSERT INTO member (id, email, name) VALUES
  (1, 'kim@example.com', '김회원'),
  (2, 'lee@example.com', '이회원'),
  (3, 'park@example.com', '박회원');

INSERT INTO orders
  (id, request_key, member_id, status, amount, created_at, expires_at, attributes)
VALUES
  (101, 'request-101', 1, 'READY', 30000,
   '2026-01-01 09:00:00', '2026-01-02 09:00:00',
   JSON_OBJECT('channel', 'mobile', 'gift', TRUE)),
  (102, 'request-102', 1, 'PAID', 12000,
   '2026-01-01 10:00:00', NULL, JSON_OBJECT('channel', 'web')),
  (103, 'request-103', 2, 'READY', 5000,
   '2026-01-01 10:00:00', '2026-01-02 10:00:00',
   JSON_OBJECT('channel', 'mobile')),
  (104, 'request-104', 2, 'CANCELLED', 8000,
   '2026-01-02 08:00:00', NULL, JSON_OBJECT('channel', 'web'));

INSERT INTO order_item (order_id, product_code, quantity, unit_price) VALUES
  (101, 'P001', 1, 20000), (101, 'P002', 1, 10000),
  (102, 'P003', 1, 12000), (103, 'P004', 1, 5000);
```

## 준비 결과 확인

```sql
USE mysql_notes;
SELECT COUNT(*) AS member_count FROM member;
SELECT COUNT(*) AS order_count FROM orders;
SELECT id, status, version FROM orders ORDER BY id;
```

초기 데이터는 회원 3건, 주문 4건입니다.
주문 101과 103은 READY, 102는 PAID, 104는 CANCELLED이며 버전은 모두 0입니다.
변경 예제를 여러 번 실행하면 결과가 달라질 수 있으므로, 각 글은 이 초기 상태를 기준으로 읽습니다.
잠금과 격리 수준 예제는 두 개의 DB 세션이 필요합니다.

공통 테이블 외에 글에서 새로 만드는 실습용 테이블은 해당 글의 생성 SQL을 먼저 실행합니다.

## 이어서 읽기

- [MySQL 기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations)
- [MySQL JOIN과 집계 쿼리](/docs/knowledge/data/mysql/query/joins-and-aggregation)

<details>
<summary>공식 참고 자료</summary>

- [MySQL CHECK 제약](https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html)
- [EXPLAIN ANALYZE](https://dev.mysql.com/doc/refman/8.0/en/explain.html)

</details>
