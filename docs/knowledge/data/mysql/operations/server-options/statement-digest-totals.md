---
format: md
id: mysql-server-options-statement-digest-totals
title: "MySQL과 MariaDB에서 누적 실행 시간이 큰 쿼리 찾기"
sidebar_label: "다이제스트 누적 시간"
description: "performance_schema의 events_statements_summary_by_digest로 한 번은 빠르지만 자주 호출되는 SQL까지 누적 실행 시간 기준으로 찾는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/statement-digest-totals
sidebar_position: 14
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "performance_schema"
  - "events_statements_summary_by_digest"
  - "DIGEST_TEXT"
  - "MySQL 누적 실행 시간"
  - "다이제스트 통계"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/performance-schema-statement-summary-tables.html"
  - "https://mariadb.com/docs/server/reference/system-tables/performance-schema/performance-schema-tables/performance-schema-events_statements_summary_by_digest-table"
  - "https://dev.mysql.com/doc/refman/8.4/en/performance-schema-timing.html"
  - "https://mariadb.com/docs/server/reference/system-tables/performance-schema/performance-schema-tables/performance-schema-performance_timers-table"
---

# MySQL과 MariaDB에서 누적 실행 시간이 큰 쿼리 찾기

한 번에 2초 걸리는 쿼리는 슬로우 로그에서 찾기 쉽습니다.
한 번에 5ms 걸리는 쿼리도 10만 번 실행되면 실행 시간의 합은 500초입니다.
이처럼 **한 번은 빠르지만 자주 호출되는 SQL**까지 함께 보려면 `performance_schema`에서 쿼리별 누적 통계를 확인합니다.

## 쿼리별 실행 시간 합계 조회하기

`events_statements_summary_by_digest`는 SQL을 기본 스키마와 정규화된 문장 형태인 **다이제스트(digest)**로 묶습니다.
예를 들어 `WHERE id = 1`과 `WHERE id = 2`는 같은 형태로 집계됩니다.
개별 요청을 재현할 때는 애플리케이션에서 실제로 사용한 파라미터를 확인합니다.
[MySQL 문장 요약 테이블](https://dev.mysql.com/doc/refman/8.4/en/performance-schema-statement-summary-tables.html), [MariaDB 다이제스트 요약 테이블](https://mariadb.com/docs/server/reference/system-tables/performance-schema/performance-schema-tables/performance-schema-events_statements_summary_by_digest-table)

```sql
SHOW GLOBAL VARIABLES LIKE 'performance_schema';

SELECT
    SCHEMA_NAME AS schema_name,
    DIGEST_TEXT AS query_pattern,
    COUNT_STAR AS executions,
    ROUND(SUM_TIMER_WAIT / 1000000000000, 2) AS total_seconds,
    ROUND(AVG_TIMER_WAIT / 1000000000, 2) AS avg_ms,
    ROUND(MAX_TIMER_WAIT / 1000000000, 2) AS max_ms,
    SUM_ROWS_EXAMINED AS rows_examined
FROM performance_schema.events_statements_summary_by_digest
WHERE SCHEMA_NAME = 'app'
  AND DIGEST IS NOT NULL
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;
```

타이머 값은 피코초 단위입니다.
위 쿼리는 합계를 초로, 평균과 최댓값을 밀리초로 표시합니다.
여러 연결에서 동시에 실행된 시간도 합산되므로 `total_seconds`는 **쿼리 실행 시간의 합계**로 읽습니다.
[MySQL Performance Schema 타이머](https://dev.mysql.com/doc/refman/8.4/en/performance-schema-timing.html), [MariaDB Performance Schema 타이머](https://mariadb.com/docs/server/reference/system-tables/performance-schema/performance-schema-tables/performance-schema-performance_timers-table)

## 집계 결과에서 어디부터 볼까?

| 집계에서 보이는 현상 | 확인할 내용 |
|---|---|
| 실행 시간 합계가 크고 평균은 짧음 | 같은 요청에서 반복 호출되는지, N+1 조회나 잦은 폴링이 있는지 |
| 평균 실행 시간이 길고 검사한 행도 많음 | 실행 계획, 검색 조건, 인덱스 |
| 평균은 짧고 최댓값만 큼 | 특정 파라미터에서 느렸는지, 당시 잠금 대기나 배치가 있었는지 |

이 표는 누적 통계를 보여줍니다.
특정 배치나 API의 영향을 보려면 **실행 직전과 직후의 `COUNT_STAR`, `SUM_TIMER_WAIT` 증가량**을 비교합니다.
같은 시간대의 다른 요청도 집계되므로, 해당 작업만 재현할 수 있는 환경에서 비교하면 원인을 좁히기 쉽습니다.

조회 결과가 비어 있다면 `performance_schema` 활성화 여부와 `setup_consumers`의 `statements_digest` 설정을 확인합니다.
다이제스트 요약 테이블이 가득 차면 새 형태의 SQL이 `DIGEST IS NULL`인 요약 행에 모일 수 있습니다.
예제는 읽을 수 있는 쿼리 형태만 보여 주기 위해 이 행을 제외합니다.
[MySQL 문장 요약 테이블](https://dev.mysql.com/doc/refman/8.4/en/performance-schema-statement-summary-tables.html), [MariaDB 다이제스트 요약 테이블](https://mariadb.com/docs/server/reference/system-tables/performance-schema/performance-schema-tables/performance-schema-events_statements_summary_by_digest-table)
