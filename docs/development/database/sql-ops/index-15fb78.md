---
format: md
id: k-index-15fb78
title: "index"
description: "MySQL 인덱스 확인, 생성, 삭제, 복합 SQL 메모"
tags:
  - notes
status: active
slug: /knowledge/k-index-15fb78
---
# index

> **개요:** MySQL에서 인덱스를 확인하고 만들고 지우는 SQL을 모아 둔 메모입니다.

## 인덱스 확인

```sql
show index from table_name;
```

## 인덱스 생성

```sql
create index index_name on table_name (column_name);
```

## 인덱스 삭제

```sql
drop index index_name on table_name;
```

## 복합 인덱스 생성

```sql
create index index_name on table_name (column_name1, column_name2);
```

## 인덱스 중지

원 노트:

```sql
alter table table_name DISABLE index_name;
```

MySQL에서는 엔진, 버전에 따라 `ALTER TABLE ... DISABLE KEYS` 형태가 쓰이기도 합니다.
실제 문법과 권한은 환경에 맞게 확인합니다.
