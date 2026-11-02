---
format: md
id: mysql-spring-jpa-partitioned-tables
title: "Spring JPA와 시계열 파티션 테이블"
sidebar_label: "Spring JPA와 파티션 테이블"
description: "created_at 기준 RANGE 파티션과 DB 복합 PK, Spring JPA에서 id만 @Id로 두는 시계열 이력 패턴을 정리합니다."
slug: /knowledge/data/mysql/operations/spring-jpa-partitioned-tables
sidebar_position: 5
tags:
  - MySQL
  - MariaDB
  - JPA
  - Spring
status: active
keywords:
  - "Spring JPA 파티셔닝"
  - "TO_DAYS created_at"
  - "복합 PK id created_at"
  - "시계열 파티션 테이블"
  - "pfuture MAXVALUE"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-partitioning-keys-unique-keys.html"
  - "https://mariadb.com/kb/en/partitioning-types-overview/"
  - "https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html"
---
# Spring JPA와 시계열 파티션 테이블

대량 이력·통계처럼 생성 시각으로 쌓이는 테이블은 DB에서 월 단위 RANGE 파티션을 쓰고, 애플리케이션은 단일 `id`로 다루는 경우가 많습니다.

이 글은 MariaDB/MySQL 파티션 제약과 Spring JPA 매핑을 맞춘 **적용 패턴**입니다.

RANGE·pmax·DROP 등 운영 SQL의 일반 설명은 [파티셔닝과 pmax 관리](/docs/knowledge/data/mysql/operations/partitioning)를 봅니다.

## 설계 원칙

| 항목 | 선택 |
|---|---|
| 식별자 | 업무 의미 없는 `BIGINT` `id` (AUTO_INCREMENT) |
| 파티션 키 | 생성 시각 `created_at` (`DATETIME`) |
| DB PK | `(id, created_at)` 복합키 |
| JPA 식별자 | 엔티티의 `id`에만 `@Id` |

파티션 표현식에 쓰는 컬럼은 모든 유니크 키에 포함되어야 합니다.

그래서 날짜 RANGE를 쓰면 DB PK를 `id` 단독으로 둘 수 없습니다.

애플리케이션 API와 엔티티는 여전히 `id` 하나를 식별자로 쓰고, DB 제약은 복합 PK로 맞춥니다.

## 운영 실습 예제와의 차이

[파티셔닝과 pmax 관리](/docs/knowledge/data/mysql/operations/partitioning)의 실습은 `RANGE COLUMNS (created_at)`과 날짜 리터럴 경계를 씁니다.

시계열 운영 패턴에서는 `PARTITION BY RANGE (TO_DAYS(created_at))`와 `TO_DAYS('YYYY-MM-01')` 경계를 쓰는 경우가 많습니다.

끝단 파티션 이름은 프로젝트에 따라 `pmax` 또는 `pfuture`입니다.

역할은 같습니다.

미리 정의한 월 상한을 넘는 행을 `MAXVALUE` 파티션으로 받는 안전망입니다.

## DDL 축약 예제

월 파티션을 여러 해 분량으로 미리 두는 형태입니다.

실제 운영에서는 필요한 구간만 두고 REORGANIZE로 월을 추가합니다.

```sql
CREATE TABLE timeseries_stat (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'PK',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  created_by VARCHAR(255) NOT NULL COMMENT '생성자',
  device_key VARCHAR(255) NOT NULL COMMENT '디바이스 식별자',
  -- 통계·이력 컬럼...
  PRIMARY KEY (id, created_at),
  KEY ix_created_device (created_at, device_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY RANGE (TO_DAYS(created_at)) (
  PARTITION p202601 VALUES LESS THAN (TO_DAYS('2026-02-01')),
  PARTITION p202602 VALUES LESS THAN (TO_DAYS('2026-03-01')),
  PARTITION p202603 VALUES LESS THAN (TO_DAYS('2026-04-01')),
  PARTITION pfuture VALUES LESS THAN MAXVALUE
);
```

VALUES LESS THAN 상한은 포함하지 않습니다.

`p202601`에는 2026-02-01 00:00:00 미만이 들어갑니다.

오래된 달 제거는 행 DELETE 대신 `DROP PARTITION`을 검토합니다.

절차와 주의는 [파티셔닝과 pmax 관리](/docs/knowledge/data/mysql/operations/partitioning)를 따릅니다.

## Spring JPA 매핑

DB는 `(id, created_at)` PK이지만, 엔티티는 `id`만 `@Id`로 둡니다.

복합 PK를 EmbeddedId로 맞추지 않는 선택입니다.

이력만 쌓이고 수정이 없으면 생성 감사 필드만 두는 상위 타입을 쓰고, 수정·낙관적 락이 있으면 수정 감사 필드를 포함한 상위 타입을 씁니다.

```java
@Entity
@Table(name = "timeseries_stat")
public class TimeseriesStat extends CreatedEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 업무·통계 필드
}
```

`created_at`은 파티션 키이므로 NOT NULL과 기본값 정책을 엔티티·DDL에서 같이 맞춥니다.

INSERT 시 파티션 키가 비면 분할 대상이 애매해집니다.

## 적용 사례 형태 (통계 테이블)

축산·센서 통계처럼 디바이스 단위로 쌓이는 테이블에 같은 패턴을 씁니다.

| 역할 | 테이블 이름 예 | 파티션 키 |
|---|---|---|
| 체온 일·시·월 통계 | `st_temperature_daily` 등 | `TO_DAYS(created_at)` |
| 움직임(가속도) 통계 | `st_accelerometer_*` | `TO_DAYS(created_at)` |
| 베이스라인 체온·가속도 | `st_baseline_temperature_*` 등 | `TO_DAYS(created_at)` |
| 게이트웨이·RSSI 시간 통계 | `st_gateway_hourly` 등 | `TO_DAYS(created_at)` |

슬롯 단위 통계 일부는 파티션 키를 `stat_10min_at`처럼 **통계 기준 시각**으로 둡니다.

조회·보존 정책이 `created_at`이 아니라 슬롯 시각을 따를 때의 예외입니다.

PK는 여전히 `(id, 파티션키컬럼)` 형태를 유지합니다.

## 함께 확인할 제약

- InnoDB 사용자 파티션 테이블은 외래키를 두거나 다른 테이블의 외래키 대상이 되기 어렵습니다.
- 복합 PK는 `id` 단독 전역 유일성을 DB가 보장하지 않습니다. ID 발급은 애플리케이션·AUTO_INCREMENT 정책으로 맞춥니다.
- `created_at` 범위 조건이 있어야 파티션 프루닝이 잘 동작합니다. ID만으로 전 구간을 훑는 조회는 이득이 작을 수 있습니다.

## 함께 읽기

- [파티셔닝과 pmax 관리](/docs/knowledge/data/mysql/operations/partitioning)
- [샤딩과 파티셔닝 비교](/docs/knowledge/data/mysql/design/sharding-and-partitioning)
- [PK 타입과 공개 ID](/docs/knowledge/data/mysql/design/primary-key-types-and-public-id)
