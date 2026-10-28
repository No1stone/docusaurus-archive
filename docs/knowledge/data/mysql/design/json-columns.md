---
format: "md"
id: "mysql-json-columns"
title: "MySQL 일반 컬럼과 JSON 컬럼을 나누는 기준"
description: "검색과 정합성에 중요한 값은 일반 컬럼으로, 가변 속성은 JSON으로 분리하고 생성 컬럼 인덱스와 JSON 갱신을 예제로 확인합니다."
sidebar_label: "일반 컬럼과 JSON 컬럼을 나누는 기준"
slug: "/knowledge/data/mysql/design/json-columns"
sidebar_position: 3
tags:
  - MySQL
  - Database
status: active
keywords:
  - "MySQL JSON 컬럼"
  - "JSON_SET"
  - "생성 컬럼 인덱스"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/json.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/create-table-generated-columns.html"
---
# MySQL 일반 컬럼과 JSON 컬럼을 나누는 기준

ID, 관계 키와 상태처럼 조회와 제약조건의 중심인 값은 일반 컬럼으로 표현하기 좋습니다.
주문 채널별 옵션처럼 모양이 달라지는 부가정보는 JSON 컬럼으로 분리할 수 있습니다.
이 구분은 정답이 아니라 조회 패턴과 변경 비용을 함께 보는 설계 기준입니다.
SQL은 [공통 예제 테이블](/docs/knowledge/data/mysql/example-schema)을 사용합니다.

이 글의 기준 자료는 [JSON 타입의 조회와 인덱스 구성](https://dev.mysql.com/doc/refman/8.0/en/json.html)입니다.
공식 문서의 동작을 이 글의 실습 테이블에 맞춰 재구성한 SQL이며, 원문의 테이블명과 데이터를 그대로 옮긴 예제는 아닙니다.

## 구조가 다른 속성을 보관하고 조회합니다

```sql
SELECT id, status,
       JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.channel')) AS channel
FROM orders
WHERE status = 'READY';

SELECT id FROM orders
WHERE attributes->>'$.channel' = 'mobile';
```

초기 데이터에서 mobile 채널 주문은 101과 103입니다.
JSON 타입은 JSON 문법을 검사하지만, 업무상 필요한 필드의 존재와 허용값을 모두 보장하지는 않습니다.
JSON의 null과 SQL NULL도 구분해서 다뤄야 합니다.

## 일부 값만 변경합니다

```sql
START TRANSACTION;
UPDATE orders
SET attributes = JSON_SET(COALESCE(attributes, JSON_OBJECT()), '$.gift', TRUE)
WHERE id = 103;
SELECT id, attributes FROM orders WHERE id = 103;
ROLLBACK;
```

문서를 읽어 애플리케이션에서 통째로 덮어쓰기보다 필요한 경로를 지정하는 예제입니다.
서로 다른 JSON 경로를 바꿔도 같은 행을 수정하는 작업이므로 잠금 경합이 없어지는 것은 아닙니다.

## 자주 검색하는 경로에는 인덱스를 검토합니다

```sql
-- 공통 테이블을 초기화한 뒤 한 번 실행합니다.
ALTER TABLE orders
  ADD COLUMN channel VARCHAR(20)
    GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(attributes, '$.channel'))) STORED,
  ADD INDEX ix_orders_channel (channel);

EXPLAIN SELECT id FROM orders WHERE channel = 'mobile';
```

채널을 생성 컬럼으로 추출해 인덱스를 구성했습니다.
원본 JSON 변경 시 생성 컬럼 값도 반영되지만, 저장 공간과 쓰기 시 인덱스 유지 비용은 늘어납니다.
채널이 핵심 업무 필드가 되었다면 JSON 대신 일반 컬럼을 원본으로 삼는 설계도 비교합니다.
조회 예제의 데이터는 적으므로 옵티마이저가 인덱스보다 전체 스캔을 선택할 수도 있습니다.

## 이어서 읽기

- [MySQL 데이터 타입과 문자셋 선택](/docs/knowledge/data/mysql/basics/data-types)
- [MySQL 인덱스와 실행 계획 읽기](/docs/knowledge/k-mysql-optimization)

<details>
<summary>공식 참고 자료</summary>

- [JSON 타입과 인덱스](https://dev.mysql.com/doc/refman/8.0/en/json.html)
- [JSON 변경 함수](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html)
- [생성 컬럼](https://dev.mysql.com/doc/refman/8.0/en/create-table-generated-columns.html)

</details>
