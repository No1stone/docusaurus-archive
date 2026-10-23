---
format: md
id: k-plan
title: "plan"
description: "MySQL EXPLAIN과 profiling으로 실행 계획을 보는 메모"
tags:
  - notes
status: active
slug: /knowledge/k-plan
---
# plan

> **개요:** 쿼리 실행 계획을 볼 때 EXPLAIN과 profiling을 쓰는 메모입니다.

## EXPLAIN

`EXPLAIN`으로 실행 계획을 확인합니다.
상세 컬럼 설명은 원 노트에서 생략했습니다.

## PROFILES

세션에서 profiling을 켠 뒤, 실행한 쿼리의 프로파일 목록과 상세를 봅니다.

```sql
SELECT @@profiling;

SET profiling = 1;

SET @@profiling_history_size = 100;

SELECT @@profiling_history_size;

SHOW PROFILES;

SHOW PROFILE FOR QUERY 70;
```

`SHOW PROFILE FOR QUERY`의 번호는 `SHOW PROFILES`에 나온 Query_ID로 바꿉니다.
