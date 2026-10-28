---
format: md
id: mysql-sharding-and-partitioning
title: "DB 샤딩, 테이블 샤딩과 파티셔닝의 차이"
sidebar_label: "샤딩과 파티셔닝 비교"
description: "DB 샤딩과 테이블 샤딩, MySQL 파티셔닝의 분할 대상과 라우팅 책임을 비교하고 테이블별 조회, 전체 집계, 스키마 변경과 재분배의 운영 부담을 SQL 예제로 설명합니다."
slug: /knowledge/data/mysql/design/sharding-and-partitioning
sidebar_position: 6
tags:
  - MySQL
  - Database
status: active
keywords:
  - "DB 샤딩 테이블 샤딩 차이"
  - "샤딩 파티셔닝 차이"
  - "월별 테이블 분리"
  - "샤딩 전체 집계"
  - "MySQL 파티셔닝"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-overview.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-pruning.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-partitioning-keys-unique-keys.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-storage-engines.html"
  - "https://shardingsphere.apache.org/document/5.4.1/en/features/sharding/concept/"
  - "https://vitess.io/docs/archive/22.0/user-guides/configuration-advanced/resharding/"
---
# DB 샤딩, 테이블 샤딩과 파티셔닝의 차이

셋 다 데이터를 나누는 방법이지만, 나뉜 데이터를 누가 찾아가고 합치는지가 다릅니다.
테이블 크기만 보고 나누면 처음 저장은 쉬워도 전체 조회, 집계와 스키마 변경에서 부담이 커질 수 있습니다.
분할 기준은 데이터가 얼마나 많은지와 함께 실제 조회 및 운영 작업을 기준으로 정합니다.

## 나누는 대상과 라우팅 책임

이 글에서 샤딩은 같은 구조의 데이터를 행 단위로 나누는 수평 분할을 뜻합니다.
컬럼을 별도 테이블로 나누는 수직 분할이나 기능별 DB 분리와는 구분합니다.
테이블 샤딩이라는 용어는 프로젝트마다 쓰임이 달라, 여기서는 월별 또는 해시별 독립 테이블을 만들고 애플리케이션이나 미들웨어가 선택하는 방식을 설명합니다.

| 구분 | 분리되는 대상 | 요청을 어디로 보낼지 정하는 주체 | 부하 분산의 범위 |
|---|---|---|---|
| DB 샤딩 | 여러 DB 대상에 행을 나눕니다. | 애플리케이션, 라우터 또는 샤딩 미들웨어 | 서로 다른 인스턴스와 장비에 배치해야 CPU와 I/O도 나눌 수 있습니다. |
| 테이블 샤딩 | orders_0, orders_1 또는 월별 테이블처럼 독립 테이블을 만듭니다. | 애플리케이션이나 샤딩 미들웨어 | 같은 인스턴스라면 테이블이 늘어도 CPU, 메모리와 디스크 자원은 공유합니다. |
| MySQL 네이티브 파티셔닝 | 하나의 논리 테이블 내부를 여러 파티션으로 나눕니다. | DB가 파티션 규칙과 쿼리 조건으로 처리합니다. | 일반 InnoDB 구성에서 서버 한 대의 자원을 여러 장비로 자동 확장하지는 않습니다. |

DB 샤딩과 테이블 샤딩을 함께 사용할 수도 있습니다.
DB를 여러 스키마로만 나누어 같은 인스턴스에 두었다면 서버 자원이 독립된 것은 아닙니다.
미들웨어가 논리 테이블과 실제 저장 대상을 매핑하는 개념은 [ShardingSphere의 샤딩 개념](https://shardingsphere.apache.org/document/5.4.1/en/features/sharding/concept/)에서 확인할 수 있습니다.

```text
DB 샤딩        요청 → 라우터 → DB A의 orders / DB B의 orders
테이블 샤딩    요청 → 라우터 → orders_202601 / orders_202602
파티셔닝       요청 → orders → DB 내부의 p202601 / p202602
```

## 테이블 샤딩: 나눈 만큼 운영 대상도 늘어납니다

월별 테이블은 한 달만 읽거나 오래된 월을 보관하는 작업을 이해하기 쉽습니다.
다음은 [실습 DB](/docs/knowledge/data/mysql/example-schema)에 독립된 테이블을 만드는 예제입니다.

```sql
USE mysql_notes;
DROP TABLE IF EXISTS shard_orders_202601;
DROP TABLE IF EXISTS shard_orders_202602;
CREATE TABLE shard_orders_202601 (
  id BIGINT NOT NULL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at DATETIME NOT NULL,
  KEY ix_tenant_created (tenant_id, created_at)
) ENGINE=InnoDB;
CREATE TABLE shard_orders_202602 LIKE shard_orders_202601;

INSERT INTO shard_orders_202601 VALUES
  (1, 10, 100, '2026-01-10 10:00:00'),
  (2, 20, 300, '2026-01-20 10:00:00');
INSERT INTO shard_orders_202602 VALUES
  (1, 10, 900, '2026-02-05 10:00:00');

SELECT * FROM shard_orders_202601 WHERE tenant_id = 10;
```

조회할 월을 알면 해당 테이블로 바로 갈 수 있습니다.
하지만 ID만 받았을 때 어느 월의 데이터인지 알 수 없다면 별도 위치 정보나 여러 테이블 탐색이 필요합니다.
테이블 이름에 202601이 들어 있다고 DB가 다른 달의 INSERT를 자동으로 막는 것도 아닙니다.
라우팅 규칙과 필요에 따른 제약을 따로 관리합니다.

### 전체 검색과 집계는 여러 결과를 합쳐야 합니다

```sql
SELECT source_month, id, tenant_id, amount, created_at
FROM (
  SELECT '202601' AS source_month, id, tenant_id, amount, created_at
  FROM shard_orders_202601
  UNION ALL
  SELECT '202602', id, tenant_id, amount, created_at
  FROM shard_orders_202602
) AS all_orders
ORDER BY created_at DESC, source_month DESC, id DESC
LIMIT 10;
```

전체 최신 10건은 각 테이블의 최신 10건을 단순 연결한 결과와 다릅니다.
전체 정렬과 페이지 경계의 기준을 맞춰야 합니다.
예제에서는 월과 ID까지 함께 사용해 같은 시각의 정렬 순서를 구분합니다.

합계와 건수도 모아야 합니다.
월별 평균을 단순 평균하면 월마다 건수가 다를 때 전체 평균이 되지 않습니다.

```sql
SELECT SUM(total_amount) AS total_amount,
       SUM(order_count) AS order_count,
       SUM(total_amount) / SUM(order_count) AS average_amount
FROM (
  SELECT SUM(amount) AS total_amount, COUNT(*) AS order_count
  FROM shard_orders_202601
  UNION ALL
  SELECT SUM(amount), COUNT(*)
  FROM shard_orders_202602
) AS monthly_stats;
```

합계는 1300, 건수는 3, 전체 평균은 약 433.33입니다.
월별 평균 200과 900을 단순 평균한 550과는 다릅니다.
다른 서버로 나뉜 DB 샤딩에서는 이 결합을 일반적인 단일 DB 쿼리로 처리할 수 있다고 가정하지 않고, 애플리케이션이나 지원 미들웨어의 조회 기능을 확인합니다.

### 저장 외에 관리해야 하는 것

| 작업 | 생기는 부담 |
|---|---|
| 스키마 변경 | 모든 대상에 컬럼과 인덱스를 적용하고 누락 및 버전 차이를 확인해야 합니다. |
| 새 월이나 새 샤드 생성 | 생성 시점과 실패 처리, 라우팅 반영 및 지연 도착 데이터 처리가 필요합니다. |
| ID 발급과 중복 방지 | 각 테이블의 PK만으로 전체 샤드의 유일성을 보장하지 않습니다. 예제도 ID 1이 두 테이블에 있습니다. |
| 이메일 등 전역 고유값 | 개별 테이블의 UNIQUE만으로는 전체 중복을 막지 못합니다. 전역 조회나 별도 고유값 관리가 필요합니다. |
| 테이블 선택 | 외부 입력을 테이블 이름에 그대로 붙이지 않고 내부 매핑과 허용 목록으로 대상을 선택합니다. |
| 백업과 복원 | 대상마다 다른 시점의 백업을 조합했을 때 업무 데이터가 일관되는지 확인해야 합니다. |
| 장애 확인과 배치 | 어떤 샤드가 실패했는지와 재처리 범위를 기록하고, 전부 재실행했을 때 중복이 생기지 않도록 합니다. |

같은 MySQL 인스턴스의 여러 InnoDB 테이블은 하나의 로컬 트랜잭션으로 묶을 수 있습니다.
샤딩이라는 이름만으로 모든 트랜잭션이 불가능해지는 것은 아닙니다.
서로 다른 DB 인스턴스를 함께 변경할 때는 일반적인 한 연결의 로컬 트랜잭션으로 해결되지 않으므로 별도 정합성 전략을 정합니다.

## 파티셔닝: 애플리케이션은 하나의 테이블을 사용합니다

같은 데이터를 날짜 파티션으로 구성한 예제입니다.

```sql
DROP TABLE IF EXISTS partition_orders_example;
CREATE TABLE partition_orders_example (
  id BIGINT NOT NULL,
  tenant_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id, created_at),
  KEY ix_tenant_created (tenant_id, created_at)
) ENGINE=InnoDB
PARTITION BY RANGE COLUMNS(created_at) (
  PARTITION p202601 VALUES LESS THAN ('2026-02-01'),
  PARTITION p202602 VALUES LESS THAN ('2026-03-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);

INSERT INTO partition_orders_example (id, tenant_id, amount, created_at)
SELECT id, tenant_id, amount, created_at FROM shard_orders_202601
UNION ALL
SELECT id, tenant_id, amount, created_at FROM shard_orders_202602;

SELECT SUM(amount), COUNT(*) FROM partition_orders_example;
EXPLAIN SELECT * FROM partition_orders_example
WHERE created_at >= '2026-02-01' AND created_at < '2026-03-01';
```

애플리케이션은 월별 테이블 이름을 조립하지 않고 같은 테이블에 조회합니다.

전체 합계는 1300이고 건수는 3입니다.
2월 조건의 EXPLAIN에서는 p202602만 선택되는지 확인할 수 있습니다.
필요 없는 파티션을 제외하는 동작이 [파티션 프루닝](https://dev.mysql.com/doc/refman/8.0/en/partitioning-pruning.html)이며, 파티션 내부 검색에는 인덱스도 필요합니다.

이렇게 운영 대상의 일부를 DB가 관리하지만 파티셔닝에도 제약은 있습니다.
MySQL의 [모든 유니크 키는 파티셔닝 컬럼을 포함](https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-partitioning-keys-unique-keys.html)해야 하므로 예제 PK에도 created_at이 들어갑니다.
ID 하나만의 전역 유일성은 이 PK가 보장하지 않습니다.
또한 MySQL 8.0의 사용자 파티셔닝 InnoDB 테이블은 [외래키를 사용할 수 없는 제약](https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-storage-engines.html)이 있습니다.
pmax와 파티션 삭제 및 복합 PK의 자세한 설명은 [파티셔닝 운영 글](/docs/knowledge/data/mysql/operations/partitioning)에서 이어갑니다.

## DB 샤딩: 연결 대상과 데이터 위치까지 관리합니다

서로 다른 인스턴스로 데이터를 나누면 저장 공간과 처리 부하를 분산할 수 있습니다.
하지만 요청의 샤딩 키로 연결 대상을 찾고, 같은 업무의 데이터를 어느 샤드에 함께 둘지 정해야 합니다.
테넌트 단위 요청이 대부분이면 tenant_id로 모으는 선택이 가능하지만, 대형 테넌트 하나에 요청이 집중되면 해당 샤드가 병목이 될 수 있습니다.

샤드 수를 늘리는 것도 테이블 하나 추가하는 것으로 끝나지 않습니다.
예를 들어 `tenant_id % 4`를 `% 8`로 바꾸면 tenant_id 7의 대상이 3에서 7로 달라집니다.
기존 데이터를 옮기지 않은 채 계산식만 바꾸면 잘못된 위치로 조회하게 됩니다.
이동 중 변경분 반영, 검증, 읽기와 쓰기의 전환 및 복구 방법까지 정합니다.
실제 도구의 재분배 절차는 [Vitess Resharding](https://vitess.io/docs/archive/22.0/user-guides/configuration-advanced/resharding/)처럼 데이터 이동과 트래픽 전환을 구분해 설명합니다.
이 글의 SQL은 단일 MySQL에서 비교한 것이며 실제 분산 DB 구성을 검증한 예제는 아닙니다.

## 어떤 문제를 해결하려고 나누나요?

| 현재 문제 | 먼저 검토할 방향 |
|---|---|
| 특정 쿼리만 느림 | 실행 계획과 인덱스, 읽는 행 수 및 쿼리 구조를 먼저 확인합니다. |
| 월별 이력 보관과 삭제가 부담 | 조회 및 키 제약이 맞으면 날짜 파티셔닝을 검토합니다. |
| 고객별 저장 대상과 운영 단위를 분리해야 함 | 테이블 또는 DB 분리를 검토하고 공통 스키마와 라우팅 운영을 함께 설계합니다. |
| 서버 한 대의 처리 또는 저장 한계가 확인됨 | 여러 인스턴스의 DB 샤딩을 검토합니다. |
| 전체 통계와 임의 검색이 주된 업무 | 분할 후 조회와 집계 비용을 먼저 계산하고 별도 분석용 경로도 비교합니다. |

테이블을 나누면 개별 대상은 작아질 수 있지만, 전체 데이터에 대한 책임은 사라지지 않습니다.
특히 테이블 샤딩은 작은 테이블의 편의와 함께 분산된 조회 및 운영 절차를 애플리케이션 쪽으로 가져오는 선택입니다.

## 이어서 읽기

- [파티셔닝과 pmax 관리](/docs/knowledge/data/mysql/operations/partitioning)
- [테이블 수정과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)
- [PK 타입과 공개 ID](/docs/knowledge/data/mysql/design/primary-key-types-and-public-id)
- [벌크 처리와 청크](/docs/knowledge/data/mysql/operations/bulk-and-chunks)

<details>
<summary>공식 참고 자료</summary>

- [MySQL 파티셔닝 개요](https://dev.mysql.com/doc/refman/8.0/en/partitioning-overview.html)
- [파티션 프루닝](https://dev.mysql.com/doc/refman/8.0/en/partitioning-pruning.html)
- [파티셔닝 키와 유니크 키](https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-partitioning-keys-unique-keys.html)
- [InnoDB 파티셔닝 제약](https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-storage-engines.html)
- [ShardingSphere 샤딩 개념](https://shardingsphere.apache.org/document/5.4.1/en/features/sharding/concept/)
- [Vitess 재분배](https://vitess.io/docs/archive/22.0/user-guides/configuration-advanced/resharding/)

</details>
