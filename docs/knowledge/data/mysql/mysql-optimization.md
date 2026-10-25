---
format: md
id: k-mysql-optimization
title: "MySQL Optimization"
description: "MySQL 쿼리·스키마·서버 설정을 최적화할 때 공식 문서 진입점 메모입니다."
tags:
  - MySQL
status: active
slug: /knowledge/k-mysql-optimization
---
# MySQL Optimization

## 개요

MySQL 최적화는 쿼리 실행 계획, 인덱스, 스키마, 버퍼·캐시 설정이 겹칩니다.
먼저 `EXPLAIN`으로 접근 방식을 보고, 그다음 인덱스·SQL 모드·서버 변수를 조정합니다.
SQL Mode는 잘못된 날짜·그룹바이 등을 얼마나 엄격히 막을지 정합니다.

## 보는 순서

1. 느린 쿼리를 로그로 잡고 `EXPLAIN` / `EXPLAIN ANALYZE`를 봅니다.
2. 선택도가 맞는 인덱스가 있는지, 함수로 컬럼을 감싸 인덱스를 버리지는 않는지 확인합니다.
3. 스키마 타입·정규화가 목적에 맞는지 봅니다.
4. 마지막으로 innodb buffer pool 등 서버 설정을 검토합니다.

버전은 8.x 문서를 기준으로 두고, 인스턴스 메이저 버전과 맞춥니다.

<details>
<summary>참고 자료</summary>

- [MySQL 8.0 Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [MySQL 8.0 Server SQL Modes](https://dev.mysql.com/doc/refman/8.0/en/sql-mode.html)
</details>
