---
format: "md"
id: "spring-data-access-sql-mapping"
title: "SQL 매핑"
description: "iBATIS와 MyBatis를 SQL 매핑 계열로 묶고 기존 MyBatis 설정 메모로 연결합니다."
slug: "/knowledge/backend/spring/data-access/sql-mapping"
sidebar_position: 0
tags: ["Spring", "JDBC"]
status: "active"
---
# SQL 매핑

SQL 매핑 계열은 개발자가 작성한 SQL을 메서드 호출 및 객체와 연결합니다.
iBATIS에서 이어진 MyBatis도 SQL 자체를 중심에 두는 방식입니다.

## 살펴볼 내용

| 주제 | 중심 내용 |
|---|---|
| iBATIS와 MyBatis | 사용 방식의 변화와 기존 SQL 매핑 구조를 비교합니다. |
| Mapper | 인터페이스와 SQL을 연결합니다. |
| 파라미터와 결과 매핑 | 입력값을 바인딩하고 조회 결과를 객체로 변환합니다. |
| 동적 SQL | 조건에 따라 WHERE와 조인 등의 구성을 바꿉니다. |

MyBatis를 사용해도 JDBC 드라이버와 연결 관리가 필요합니다.
SQL이 작성된 위치가 바뀌는 것과 업무 규칙의 책임이 바뀌는 것은 별개입니다.

## 관련 글

- [MyBatis](/docs/knowledge/k-mybatis)
- [MyBatis 공식 문서](https://mybatis.org/mybatis-3/)
