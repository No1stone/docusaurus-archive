---
sidebar_position: 9
title: 파티셔닝
description: 이력 created_at 파티션과, 드물게 쓰는 통계 시간 버킷(stat_*) 파티션을 정리합니다.
---

# 파티셔닝

> **필수 경계:** 이력·로그 파티션 키는 `created_at`입니다.
> **필수 경계:** JPA에서는 `id`만 `@Id`로 두고 `IdClass`·`EmbeddedId`는 쓰지 않습니다.
> **상황별 선택:** 통계에서 **시간을 구간으로 뭉갠 컬럼**이 있을 때만 `stat_*_at`을 PK·파티션에 넣습니다.
> FarmPro는 슬롯 통계가 많아 `stat_*`가 자주 보이지만, 다른 기존 서비스·일반 일별 집계에서는 드뭅니다.

| 테이블 성격 | 파티션 기준 | DB PK | 강도 |
|-------------|-------------|-------|------|
| 일반 이력·로그 | `created_at` | `(id, created_at)` | 필수 경계 |
| 통계 + 시간 버킷 | `stat_*_at` (10분·시간 등 뭉갠 시각) | `(id, stat_*_at)` | 상황별 선택 (드묾) |
| 그 외 통계·일별 집계 | 저장소 정책 (`created_at` 등) | 업무에 맞게 | 상황별 선택 |

추가 관례:

- 기본 월 단위 RANGE 파티션
- 미래 범위를 받는 마지막 파티션으로 `pmax`
- 전체 파티션에서 `id`가 유일하다는 전제를 둡니다
- 통계의 업무 UNIQUE는 파티션 키와 함께 의도한 중복을 막는지 확인합니다

## 이상적 스케치 (시간 버킷 통계, 드묾)

시간을 10분 등으로 뭉개 슬롯 단위로 쌓을 때만 이 형태입니다.

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
