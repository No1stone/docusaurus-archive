---
format: md
id: k-postgresql-datatype
title: "PostgreSQL DataType"
description: "PostgreSQL 데이터 타입을 고를 때 공식 문서와 실무 메모를 묶은 글입니다."
tags:
  - PostgreSQL
status: active
slug: /knowledge/k-postgresql-datatype
---
# PostgreSQL DataType

## 개요

PostgreSQL은 숫자·문자·시간·JSON·배열·UUID 등 타입이 넓습니다.
컬럼 타입은 저장 크기, 인덱스, 비교 연산, 드라이버 매핑(JPA·R2DBC)에 영향을 줍니다.
버전마다 추가·변경된 타입이 있어, 사용 중인 메이저 버전 문서를 기준으로 봅니다.

자주 쓰는 축만 먼저 정리합니다.

| 계열 | 예 | 메모 |
|---|---|---|
| 문자 | `text`, `varchar(n)` | 길이 제한이 없으면 `text`도 흔함 |
| 숫자 | `integer`, `bigint`, `numeric` | 금액은 `numeric` |
| 시간 | `timestamptz`, `date` | 타임존이 있으면 `timestamptz` |
| 문서 | `jsonb` | 검색·인덱스는 `jsonb` 쪽이 유리한 경우가 많음 |
| 식별 | `uuid` | 앱에서 UUID를 쓸 때 |

JPA 매핑은 방언·컬럼 정의와 맞춰 확인하고, 운영 메모는 [작업 postgresql](./작업-postgresql.md) 글을 봅니다.

<details>
<summary>참고 자료</summary>

- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [kimseungjae — 타입 메모](https://kimseungjae.tistory.com/8)
- [wwwi — 타입 메모](https://wwwi.tistory.com/347)
</details>
