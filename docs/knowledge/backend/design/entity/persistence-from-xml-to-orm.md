---
id: persistence-from-xml-to-orm
title: 영속 모델 발전사 — XML에서 ORM까지
description: SQL·XML 매퍼, Map, VO, DTO, JPA Entity로 이어진 모델 발전을 정리합니다.
tags:
  - backend
  - jpa
  - history
status: active
slug: "/knowledge/backend/entity/persistence-from-xml-to-orm"
---

# SQL 매퍼부터 ORM까지, 예약 목록 코드는 무엇이 달라졌을까

예약 목록에 차량번호와 방문 시간을 표시하는 기능은 JDBC, SQL 매퍼, ORM 어디서든 만들 수 있습니다.<br />
차이는 SQL을 어디서 정의하고, 결과 행을 어떤 객체로 만들고, 변경을 어떻게 반영하느냐에 있습니다.

| 방식 | 예약 목록을 만들 때 하는 일 |
|---|---|
| JDBC | SQL과 바인딩을 정하고 결과 행을 직접 읽음 |
| XML SQL 매퍼 | SQL을 선언하고 행과 Java 결과 타입의 매핑을 연결 |
| `Map` 결과 | 컬럼명으로 바로 꺼낼 수 있으나 오타와 타입을 실행 시 확인 |
| 타입이 있는 DTO | 필요한 필드를 명시해 호출부에 전달 |
| ORM 엔티티 | 행과 객체의 상태를 연결하고 관리 중인 변경을 추적 |

SQL 매퍼에서도 타입이 있는 결과 객체를 사용할 수 있습니다.<br />
위 표는 기술이 서로를 대체한 순서보다, 개발할 때 무엇을 직접 관리하는지 보여줍니다.

## ORM을 써도 목록용 SQL을 고민합니다

예약 시간 변경은 엔티티의 상태를 바꾸고 같은 트랜잭션에서 반영하기 좋습니다.<br />
반면 운영 화면에서 월별 예약 건수를 읽을 때는 엔티티를 전부 로딩하는 것보다 집계 결과만 받는 편이 맞을 수 있습니다.

원셋에서는 기본 저장은 JPA로 처리하고, 조회는 필요한 조건과 결과 형태에 맞춰 Specification이나 커스텀 쿼리를 사용합니다.
[VO, DTO, 엔티티 구분](/docs/knowledge/backend/entity/persistence-vo-dto-entity) / [SQL 중심 조회 선택](/docs/knowledge/backend/repository/repository-jooq-and-sql-builders)
