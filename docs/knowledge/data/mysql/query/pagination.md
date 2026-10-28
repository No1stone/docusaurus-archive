---
format: "md"
id: "mysql-pagination"
title: "MySQL 페이지 조회와 대량 데이터 읽기"
description: "OFFSET과 키 기반 페이지 조회를 비교하고 동일 시각의 정렬, 배치 순회와 체크포인트를 예제 SQL로 설명합니다."
sidebar_label: "페이지 조회와 대량 데이터 읽기"
slug: "/knowledge/data/mysql/query/pagination"
sidebar_position: 3
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL 페이지 조회"
  - "OFFSET"
  - "키셋 페이지네이션"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/limit-optimization.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html"
---
# MySQL 페이지 조회와 대량 데이터 읽기

페이지 조회는 정렬 기준과 다음 시작 위치를 함께 설계해야 합니다.
화면의 페이지 번호 이동과 배치의 전체 순회는 요구가 다르므로 같은 방식을 강제하지 않습니다.
아래 SQL은 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 사용합니다.

이 글의 기준 자료는 [LIMIT과 정렬의 공식 동작](https://dev.mysql.com/doc/refman/8.0/en/limit-optimization.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## LIMIT과 OFFSET으로 페이지 번호 조회하기

```sql
SELECT id, status, created_at FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 2 OFFSET 0;

SELECT id, status, created_at FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 2 OFFSET 2;
```

초기 데이터에서 첫 페이지는 104와 103, 다음 페이지는 102와 101입니다.
생성 시각이 같은 행도 있으므로 고유한 ID를 보조 정렬로 둡니다.
정렬이 결정적이어도 페이지 사이에 데이터가 추가되거나 삭제되면 OFFSET 결과가 밀릴 수 있습니다.
큰 OFFSET에서는 앞선 결과를 건너뛰는 비용도 확인해야 합니다.

## 키 기반 페이지 조회로 다음 행 찾기

```sql
SELECT id, status, created_at FROM orders
WHERE created_at < '2026-01-01 10:00:00'
   OR (created_at = '2026-01-01 10:00:00' AND id < 103)
ORDER BY created_at DESC, id DESC
LIMIT 2;
```

첫 페이지의 마지막 행인 103을 기준으로 102와 101을 조회합니다.
API 커서에는 시각과 ID를 모두 담고, 조회 조건도 다음 요청에서 유지합니다.
임의의 페이지 번호로 바로 이동하기보다 순서대로 탐색하는 화면에 적합합니다.
인덱스는 필터와 정렬에 맞게 검토하며, 모든 키 기반 조회가 자동으로 빠른 것은 아닙니다.

## 배치는 처리 중 바뀌지 않는 키로 순회합니다

```sql
SELECT id, status FROM orders
WHERE id > 0 AND id <= 104
ORDER BY id
LIMIT 2;

SELECT id, status FROM orders
WHERE id > 102 AND id <= 104
ORDER BY id
LIMIT 2;
```

예제의 104는 시작 시 잡은 상한 ID, 102는 직전 청크의 마지막 ID입니다.
처리 성공과 체크포인트 저장이 어긋나도 재실행할 수 있도록 갱신은 멱등하게 설계합니다.
상한 ID만으로 실행 중인 데이터 집합 전체가 스냅샷이 되는 것은 아닙니다.
조건 컬럼이 바뀌거나 늦게 커밋된 행이 있다면 누락 여부를 별도로 검토해야 합니다.

## 이어서 읽기

- [MySQL 인덱스와 실행 계획 읽기](/docs/knowledge/k-mysql-optimization)
- [MySQL 벌크 INSERT와 UPDATE, 청크 처리](/docs/knowledge/data/mysql/operations/bulk-and-chunks)

<details>
<summary>공식 참고 자료</summary>

- [LIMIT 최적화](https://dev.mysql.com/doc/refman/8.0/en/limit-optimization.html)
- [복합 인덱스](https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html)

</details>
