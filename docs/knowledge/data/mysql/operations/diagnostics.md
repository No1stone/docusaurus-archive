---
format: "md"
id: "mysql-diagnostics"
title: "MySQL 느린 쿼리와 운영 진단"
description: "슬로우 쿼리, 연결 수와 InnoDB 잠금 대기를 SQL로 확인하고 실행 계획과 장비 자원 사용을 연결해 원인을 구분합니다."
sidebar_label: "느린 쿼리와 운영 진단"
slug: "/knowledge/data/mysql/operations/diagnostics"
sidebar_position: 2
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 슬로우 쿼리"
  - "Performance Schema"
  - "잠금 대기"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/performance-schema-statement-summary-tables.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/performance-schema-data-lock-waits-table.html"
---
# MySQL 느린 쿼리와 운영 진단

응답이 느리다는 현상만으로 CPU나 메모리가 부족하다고 판단하지 않습니다.
쿼리 실행이 긴지, 잠금을 기다리는지, DB 연결을 얻지 못하는지부터 구분합니다.
아래 조회 중 Performance Schema와 전체 프로세스 정보는 계정 권한에 따라 제한될 수 있습니다.

이 글의 기준 자료는 [Performance Schema의 문장 요약 테이블](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-statement-summary-tables.html)입니다.

## 연결과 실행 중인 작업을 봅니다

```sql
SHOW GLOBAL STATUS LIKE 'Threads_connected';
SHOW GLOBAL STATUS LIKE 'Threads_running';
SHOW GLOBAL STATUS LIKE 'Max_used_connections';
SHOW VARIABLES LIKE 'max_connections';
SHOW FULL PROCESSLIST;
```

연결 수와 현재 실행 작업 수는 다릅니다.
Sleep 연결이 많다고 모두 쿼리를 수행하는 것은 아닙니다.
반대로 애플리케이션 연결 풀 대기는 DB 안에 실행 중인 쿼리로 나타나지 않을 수 있습니다.
애플리케이션의 풀 사용량과 대기 시간도 함께 확인합니다.

## 슬로우 로그 설정을 확인합니다

```sql
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'slow_query_log_file';
SHOW VARIABLES LIKE 'long_query_time';
SHOW VARIABLES LIKE 'log_output';
```

로그를 켤지와 기준 시간은 운영 환경에서 결정합니다.
GLOBAL 설정을 바꿨을 때 기존 세션과 새 세션에 반영되는 범위도 구분합니다.
파일 로그는 저장 공간과 순환 정책을 함께 정하고, SQL 리터럴에 업무 데이터가 포함될 수 있다는 점도 고려합니다.

## 누적 비용이 큰 쿼리를 찾습니다

```sql
SELECT DIGEST_TEXT, COUNT_STAR,
       ROUND(SUM_TIMER_WAIT / 1000000000000, 3) AS total_seconds,
       ROUND(AVG_TIMER_WAIT / 1000000000000, 6) AS avg_seconds
FROM performance_schema.events_statements_summary_by_digest
WHERE DIGEST_TEXT IS NOT NULL
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;
```

이 표는 현재 설정과 수집 기간에 누적된 요약입니다.
평균이 짧아도 횟수가 많아 전체 비용이 커질 수 있으므로 호출 횟수와 합계를 같이 봅니다.
값이 비어 있다면 수집 설정과 권한부터 확인합니다.

## 잠금 대기를 확인합니다

```sql
SELECT REQUESTING_ENGINE_TRANSACTION_ID, BLOCKING_ENGINE_TRANSACTION_ID
FROM performance_schema.data_lock_waits;

SHOW ENGINE INNODB STATUS;
```

data_lock_waits는 현재 대기 관계를 보여 주며 과거 모든 장애 이력은 아닙니다.
데드락 정보와 실행 계획을 연결해 어떤 순서로 어떤 범위를 잠그는지 확인합니다.
쿼리 개선 전후에는 같은 입력과 데이터 규모에서 실행 시간, 읽은 행, 잠금 대기를 비교합니다.
그다음 호스트의 CPU, 메모리와 디스크 I/O를 함께 확인해 병목 위치를 좁힙니다.

## 이어서 읽기

- [MySQL 인덱스와 실행 계획 읽기](/docs/knowledge/k-mysql-optimization)
- [MySQL 잠금과 데드락 대응](/docs/knowledge/data/mysql/transactions/locks-and-deadlocks)

<details>
<summary>공식 참고 자료</summary>

- [슬로우 쿼리 로그](https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html)
- [문장 요약 테이블](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-statement-summary-tables.html)
- [잠금 대기 테이블](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-data-lock-waits-table.html)

</details>
