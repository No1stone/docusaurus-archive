---
format: md
id: mysql-partitioning
title: "MySQL 파티셔닝: 날짜와 ID 기준, pmax와 파티션 삭제"
sidebar_label: "파티셔닝과 pmax 관리"
description: "MySQL RANGE 파티셔닝의 기본 원리와 날짜 및 ID 기준의 선택, PK와 유니크 키 제약, pmax 분리와 DROP PARTITION을 예제 SQL로 설명합니다."
slug: /knowledge/data/mysql/operations/partitioning
sidebar_position: 4
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 파티셔닝"
  - "RANGE COLUMNS"
  - "pmax MAXVALUE"
  - "파티셔닝 단일 PK"
  - "DROP PARTITION"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-types.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-columns-range.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-partitioning-keys-unique-keys.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-management-range-list.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-pruning.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-storage-engines.html"
---
# MySQL 파티셔닝: 날짜와 ID 기준, pmax와 파티션 삭제

파티셔닝은 애플리케이션에서 하나의 테이블로 다루는 데이터를 DB 내부의 여러 파티션으로 나누는 기능입니다.
날짜나 ID 범위로 데이터를 구분하고, 조건에 맞는 파티션만 조회하거나 오래된 파티션을 통째로 제거할 때 사용합니다.
모든 테이블에 필요한 기본 설정은 아니며, 조회와 보존 정책에 분할 기준이 맞을 때 검토합니다.

이 글은 [MySQL RANGE COLUMNS](https://dev.mysql.com/doc/refman/8.0/en/partitioning-columns-range.html)와 [파티션 관리](https://dev.mysql.com/doc/refman/8.0/en/partitioning-management-range-list.html)를 바탕으로 날짜별 이력 테이블을 구성했습니다.
예제는 MySQL 8.0.46, InnoDB에서 확인했으며 운영 데이터와 분리된 mysql_notes 실습 DB를 사용합니다.

## 파티션은 인덱스나 샤딩과 다릅니다

| 구분 | 역할 |
|---|---|
| 파티셔닝 | 같은 논리 테이블의 데이터를 지정한 기준으로 분리합니다. |
| 인덱스 | 파티션 내부에서도 필요한 행을 효율적으로 찾는 경로를 제공합니다. |
| 샤딩 | 여러 DB나 서버에 데이터를 나누고 요청을 분배하는 구성입니다. |

파티션을 추가했다고 자동으로 다른 장비에 부하가 분산되지는 않습니다.
또한 파티션을 나눈 것만으로 모든 조회가 빨라지지는 않습니다.
필요한 파티션을 제외하는 프루닝과 각 파티션 안의 인덱스 탐색을 구분합니다.

## 날짜와 대리키 중 무엇으로 나누나요?

| 기준 | 장점 | 함께 확인할 내용 |
|---|---|---|
| 날짜 RANGE | 월별 조회와 보존 기간별 제거를 표현하기 쉽습니다. | PK와 유니크 키에 날짜가 포함되어야 하며, ID만 조회하면 프루닝이 어려울 수 있습니다. |
| 숫자 ID RANGE | PK를 ID 하나로 유지하면서 ID 범위를 나눌 수 있습니다. | ID 범위가 정확한 날짜 범위는 아니므로 날짜 보존 정책을 그대로 대체하지 않습니다. |
| HASH 또는 KEY | 지정한 값으로 여러 파티션에 나누는 방식을 제공합니다. | 월 단위 보관과 오래된 범위의 DROP을 위한 구조와는 다릅니다. |

대리키라는 이유만으로 생성 시각 순서를 보장하지 않습니다.
AUTO_INCREMENT도 할당과 커밋 순서, 지연 입력과 재처리를 고려해야 하며, 임의 UUID는 증가형 숫자 범위와 성질이 다릅니다.
ID 기준은 애플리케이션의 단일 식별자 유지가 중요한 경우 검토할 수 있는 선택지입니다.

## 날짜별 RANGE 파티션을 만듭니다

아래 테이블은 시각을 UTC 규칙으로 저장한다고 가정합니다.
현장 시각을 사용한다면 파티션 경계도 같은 규칙으로 맞춥니다.

```sql
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS mysql_notes CHARACTER SET utf8mb4;
USE mysql_notes;
DROP TABLE IF EXISTS audit_event_by_date;

CREATE TABLE audit_event_by_date (
  id BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  payload JSON,
  PRIMARY KEY (id, created_at),
  KEY ix_audit_created (created_at, id)
) ENGINE=InnoDB
PARTITION BY RANGE COLUMNS (created_at) (
  PARTITION p202601 VALUES LESS THAN ('2026-02-01'),
  PARTITION p202602 VALUES LESS THAN ('2026-03-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);

INSERT INTO audit_event_by_date (id, created_at, payload) VALUES
  (1, '2026-01-15 12:00:00', JSON_OBJECT('event', 'received')),
  (2, '2026-02-15 12:00:00', JSON_OBJECT('event', 'received')),
  (3, '2026-03-15 12:00:00', JSON_OBJECT('event', 'received')),
  (4, '2026-04-15 12:00:00', JSON_OBJECT('event', 'received'));

SELECT id, created_at FROM audit_event_by_date ORDER BY id;
```

VALUES LESS THAN의 상한은 포함하지 않습니다.
2월 1일은 p202601이 아니라 p202602에 들어갑니다.
첫 파티션에는 상한 이전의 모든 값이 들어가므로 p202601이라는 이름만으로 1월 이전 값이 차단되지는 않습니다.
created_at을 NOT NULL로 둔 이유도 분할 기준이 없는 데이터를 별도 정책 없이 섞지 않기 위해서입니다.

## 날짜 파티셔닝에서 단일 PK를 그대로 사용할 수 있나요?

MySQL에서는 파티셔닝 표현식에 사용하는 모든 컬럼이 모든 유니크 키에 포함되어야 합니다.
PK도 유니크 키이므로 날짜 기준 테이블의 PK는 위 예제처럼 `(id, created_at)`으로 구성합니다.
날짜로 나누면서 `PRIMARY KEY(id)`만 두거나 `UNIQUE(id)`를 추가하는 방식은 허용되지 않습니다.
다른 업무 번호에 유니크 키가 있어도 같은 제약을 확인해야 합니다.

```sql
START TRANSACTION;
INSERT INTO audit_event_by_date (id, created_at, payload)
VALUES (2, '2026-02-16 12:00:00', JSON_OBJECT('event', 'another'));
SELECT COUNT(*) AS same_id_rows FROM audit_event_by_date WHERE id = 2;
ROLLBACK;
```

날짜가 다르므로 같은 ID 2를 한 번 더 넣을 수 있고, 이 트랜잭션 안에서는 2건이 조회됩니다.
복합 PK는 조합의 유일성만 보장하며 ID 단독의 전역 유일성을 보장하지 않습니다.

| 계층 | 구분할 내용 |
|---|---|
| API와 업무 식별자 | 외부에 ID 하나만 전달하는 인터페이스는 유지할 수 있습니다. |
| DB의 기본키 | 날짜 파티셔닝에서는 날짜를 포함한 복합 키 제약을 따라야 합니다. |
| ORM의 식별자 | 실제 복합 PK를 정확히 매핑하려면 JPA의 EmbeddedId나 IdClass 등도 검토합니다. |
| ID 단독 유일성 | 애플리케이션의 ID 발급 정책과 중복 방지 책임을 별도로 확인합니다. |

애플리케이션에서 ID 하나를 쓴다고 DB의 키 제약이 사라지는 것은 아닙니다.
엔티티도 단일 PK로 유지하는 것이 우선이면 아래 ID 파티셔닝이나 비파티션 테이블을 비교합니다.
InnoDB의 사용자 파티션 테이블은 외래키를 정의하거나 다른 외래키의 참조 대상이 될 수 없다는 제한도 있습니다.
따라서 관계가 많은 공통 주문 테이블을 그대로 변경하지 않고 독립된 이력 예제로 설명합니다.

## pmax는 미래 범위를 받는 안전망입니다

pmax는 특별한 테이블이 아니라 관례적으로 사용하는 파티션 이름입니다.
실제 역할은 RANGE의 마지막 상한을 MAXVALUE로 둔 데서 나옵니다.

```sql
SELECT id, created_at
FROM audit_event_by_date PARTITION (pmax)
ORDER BY id;
```

3월과 4월의 ID 3과 4가 조회됩니다.
이 파티션이 없으면 미리 정의한 마지막 상한을 넘는 입력은 대상 파티션이 없어 실패할 수 있습니다.
pmax는 반드시 있어야 하는 문법 요소는 아니지만, 미래 파티션 생성 작업이 늦었을 때 입력 실패를 줄이는 선택지입니다.

pmax만 믿고 월별 파티션 관리를 중단하지 않습니다.
데이터가 계속 몰리면 분할의 목적이 약해지고, 잘못된 미래 시각도 그대로 들어올 수 있습니다.
미래 파티션을 미리 만들고 pmax 적재 여부를 점검하는 운영 기준이 필요합니다.

## pmax에서 다음 월을 분리합니다

마지막 파티션이 MAXVALUE를 이미 포함하므로 뒤에 범위를 단순 추가하는 대신 REORGANIZE PARTITION으로 나눕니다.

```sql
ALTER TABLE audit_event_by_date
REORGANIZE PARTITION pmax INTO (
  PARTITION p202603 VALUES LESS THAN ('2026-04-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);

SELECT id FROM audit_event_by_date PARTITION (p202603);
SELECT id FROM audit_event_by_date PARTITION (pmax);
SELECT COUNT(*) AS total_rows FROM audit_event_by_date;
```

p202603에는 ID 3, pmax에는 ID 4가 남고 전체는 4건을 유지합니다.
이미 pmax에 들어간 데이터도 새 범위에 맞춰 재배치합니다.
따라서 pmax가 크게 쌓인 뒤의 분리는 빈 미래 파티션을 준비하는 작업과 비용이 다를 수 있습니다.
DDL의 잠금과 소요 시간을 확인하고, 인스턴스가 여러 개면 생성 스케줄의 중복 실행도 제어합니다.

## 날짜 조건으로 프루닝을 확인합니다

```sql
EXPLAIN
SELECT id, created_at FROM audit_event_by_date
WHERE created_at >= '2026-02-01' AND created_at < '2026-03-01';

EXPLAIN
SELECT id, created_at FROM audit_event_by_date WHERE id = 2;
```

첫 쿼리에서는 partitions가 p202602로 제한되는지 확인합니다.
반면 ID만으로는 날짜 범위를 알 수 없어 여러 파티션이 조회 대상이 됩니다.
각 파티션의 인덱스로 ID를 찾을 수 있는 것과 조회 대상 파티션을 줄이는 것은 다른 효과입니다.
단건 API에서도 ID와 날짜를 함께 알고 있다면 날짜 조건을 붙이는 방법을 검토할 수 있습니다.

## 오래된 데이터는 파티션 단위로 제거할 수 있습니다

```sql
-- 실습 테이블의 1월 데이터를 영구 제거합니다.
ALTER TABLE audit_event_by_date DROP PARTITION p202601;
SELECT id, created_at FROM audit_event_by_date ORDER BY id;
```

ID 1이 제거되고 2, 3, 4가 남습니다.
많은 행에 DELETE를 반복하는 대신 보존 기간이 지난 범위를 제거할 수 있다는 점이 운영상의 장점입니다.
다만 DROP PARTITION은 데이터가 사라지는 DDL이며 일반적인 업무 트랜잭션의 ROLLBACK으로 되돌리지 못합니다.
삭제 전 대상 범위, 보관 정책과 필요한 백업 또는 아카이브를 확인합니다.

파티션의 개수가 줄어든 뒤 이름만으로 과거 데이터의 재입력을 막을 수는 없습니다.
늦게 들어온 이벤트를 수용할지 거절할지, 과거 범위를 어디에 둘지도 정합니다.
해당 범위의 일부 데이터만 남겨야 한다면 파티션 전체 삭제가 아니라 조건부 DELETE나 별도 보관 방식이 필요합니다.

## 대리키 ID로 나누면 단일 PK를 유지할 수 있습니다

```sql
DROP TABLE IF EXISTS audit_event_by_id;
CREATE TABLE audit_event_by_id (
  id BIGINT NOT NULL PRIMARY KEY,
  occurred_at DATETIME NOT NULL,
  payload JSON,
  KEY ix_audit_occurred (occurred_at)
) ENGINE=InnoDB
PARTITION BY RANGE (id) (
  PARTITION p_id_0001 VALUES LESS THAN (1001),
  PARTITION p_id_1001 VALUES LESS THAN (2001),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);

INSERT INTO audit_event_by_id (id, occurred_at, payload) VALUES
  (100, '2026-01-15', JSON_OBJECT('source', 'normal')),
  (900, '2026-02-15', JSON_OBJECT('source', 'normal')),
  (1001, '2026-01-10', JSON_OBJECT('source', 'late'));

EXPLAIN SELECT id, occurred_at FROM audit_event_by_id WHERE id = 900;
SELECT id, occurred_at FROM audit_event_by_id PARTITION (p_id_0001) ORDER BY id;
```

ID 900 조회는 p_id_0001로 제한할 수 있고, DB PK도 ID 하나입니다.
동일 ID의 중복은 전체 파티션에 걸쳐 키 규칙으로 막을 수 있습니다.
단일 ID를 JPA 식별자로 사용하는 모델과도 키 형식을 맞추기 쉽습니다.

하지만 p_id_0001에는 1월과 2월 데이터가 함께 있고, 늦게 입력한 1월 데이터는 다음 파티션에 있습니다.
이 범위를 DROP하는 것은 1월 데이터만 삭제하는 것과 다릅니다.
날짜 단위 보존이 우선인지, ID 기반 접근과 단일 PK 유지가 우선인지에 따라 분할 기준을 정합니다.

## 운영 전에 확인할 항목

| 항목 | 확인할 내용 |
|---|---|
| 데이터 성격 | 계속 늘어나는 이력인지, 관계와 유니크 제약이 많은 업무 테이블인지 구분합니다. |
| 조회 | 실제 필터가 파티셔닝 키를 포함하고 프루닝되는지 확인합니다. |
| 키 제약 | 모든 PK와 유니크 키가 파티셔닝 키를 포함하는지 확인합니다. |
| 미래 범위 | 파티션 선생성, pmax 유입 점검과 분리 절차를 둡니다. |
| 보관 정책 | DROP 전에 삭제 대상과 아카이브 여부를 확정합니다. |
| DDL 운영 | 재구성 비용, 메타데이터 잠금과 중복 실행을 확인합니다. |

## 이어서 읽기

- [기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations)
- [인덱스와 실행 계획](/docs/knowledge/k-mysql-optimization)
- [벌크 처리와 청크](/docs/knowledge/data/mysql/operations/bulk-and-chunks)

<details>
<summary>공식 참고 자료</summary>

- [파티셔닝 종류](https://dev.mysql.com/doc/refman/8.0/en/partitioning-types.html)
- [RANGE COLUMNS](https://dev.mysql.com/doc/refman/8.0/en/partitioning-columns-range.html)
- [파티셔닝 키와 모든 유니크 키의 제약](https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-partitioning-keys-unique-keys.html)
- [RANGE 파티션의 추가, 재구성과 제거](https://dev.mysql.com/doc/refman/8.0/en/partitioning-management-range-list.html)
- [파티션 프루닝](https://dev.mysql.com/doc/refman/8.0/en/partitioning-pruning.html)
- [InnoDB 파티셔닝과 외래키 제한](https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-storage-engines.html)

</details>
