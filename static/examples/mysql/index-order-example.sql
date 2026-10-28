SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS mysql_notes CHARACTER SET utf8mb4;
USE mysql_notes;
DROP TABLE IF EXISTS index_order_example;
CREATE TABLE index_order_example (
  id BIGINT NOT NULL PRIMARY KEY,
  member_id INT NOT NULL,
  status VARCHAR(10) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  created_at DATETIME NOT NULL,
  memo VARCHAR(100) NOT NULL,
  KEY ix_member_status_time (member_id, status, created_at, id),
  KEY ix_status_member_time (status, member_id, created_at, id),
  KEY ix_status_time_member (status, created_at, member_id, id)
) ENGINE=InnoDB;

INSERT INTO index_order_example (id, member_id, status, created_at, memo)
WITH digit AS (
  SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
  UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
  UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
), seq AS (
  SELECT a.n + b.n * 10 + c.n * 100 + d.n * 1000 AS n
  FROM digit AS a CROSS JOIN digit AS b
  CROSS JOIN digit AS c CROSS JOIN digit AS d
)
SELECT n + 1, MOD(n, 1000) + 1,
       IF(MOD(n, 100) = 0, 'FAILED', 'READY'),
       TIMESTAMP('2026-01-01 00:00:00') + INTERVAL n SECOND,
       CONCAT('order-', n + 1)
FROM seq;

ANALYZE TABLE index_order_example;
