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
