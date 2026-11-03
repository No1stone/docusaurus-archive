---
sidebar_position: 9
title: 파티셔닝
description: 이력 created_at과 통계 stat_* 파티션 키, DB 복합 PK와 JPA id만 @Id를 정리합니다.
---

# 파티셔닝

> **필수 경계:** 통계 테이블은 `id`와 `stat_*` 집계 시각으로 PK·파티션을 맞춥니다.
> **필수 경계:** 이력·로그는 `created_at`을 파티션 키로 둡니다.
> **필수 경계:** JPA에서는 `id`만 `@Id`로 두고 `IdClass`·`EmbeddedId`는 쓰지 않습니다.

| 테이블 성격 | 파티션 기준 | DB PK | 강도 |
|-------------|-------------|-------|------|
| 일반 이력·로그 | `created_at` | `(id, created_at)` | 필수 경계 |
| 통계 `st_…` | `stat_…` 집계 시각 | `(id, stat_…)` | 필수 경계 |

추가 관례:

- 기본 월 단위 RANGE 파티션
- 미래 범위를 받는 마지막 파티션으로 `pmax`
- 전체 파티션에서 `id`가 유일하다는 전제를 둡니다
- 통계의 업무 UNIQUE는 파티션 키와 함께 의도한 중복을 막는지 확인합니다

## 이상적 스케치 (통계)

```sql
-- 이름은 예시입니다. 타입·길이는 업무에 맞게 정합니다.
CREATE TABLE st_example_slot_daily (
  id BIGINT NOT NULL AUTO_INCREMENT,
  farm_id BIGINT NOT NULL,
  metric_code VARCHAR(10) NOT NULL,
  stat_10min_at DATETIME NOT NULL,
  measure_value DECIMAL(18, 4) NULL,
  created_at DATETIME NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  PRIMARY KEY (id, stat_10min_at)
) PARTITION BY RANGE (TO_DAYS(stat_10min_at)) (
  -- 월 파티션 …
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

JPA 엔티티는 `id`만 `@Id`로 매핑합니다.
`stat_10min_at`은 일반 컬럼이면서 파티션·DB PK 구성에 들어갑니다.

운영 배치·스케줄: [파티션 운영](./partition-ops)

일반론: [파티셔닝](/docs/knowledge/data/mysql/operations/partitioning), [Spring JPA와 파티션 테이블](/docs/knowledge/data/mysql/operations/spring-jpa-partitioned-tables)
