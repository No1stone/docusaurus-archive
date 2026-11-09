---
id: entity-constraints
title: 엔티티 제약
description: 예약 코드 예제로 DTO 검증, JPA 컬럼 설정, 데이터베이스 제약을 비교합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-constraints"
---

# JPA 컬럼 설정과 DB 제약조건은 어디서 보장할까

방문 예약 화면에 차량번호를 필수로 넣고, 같은 세대에서 동일한 예약 코드를 두 번 만들지 않도록 한다고 가정합니다.<br />
두 규칙을 어디에서 확인하느냐에 따라 실패 시점과 운영 데이터가 달라집니다.

## 입력 검증과 저장 제약

요청 DTO는 사용자가 값을 빼먹었을 때 바로 입력 오류를 보여주는 데 적합합니다.<br />
DB 제약은 화면 외에 배치나 직접 적재 경로가 있어도 동일한 데이터 조건을 지킬 때 필요합니다.

| 기능 | 역할 |
|---|---|
| DTO 검증 | 비어 있는 값이나 허용 길이를 요청 단계에서 확인 |
| `@Column(nullable = false, length = ...)` | JPA 매핑과 스키마 생성에 필요한 컬럼 정보 |
| `@Table(uniqueConstraints = ...)` | 여러 컬럼의 유일성 제약을 매핑에 표현 |
| 마이그레이션의 `NOT NULL`, `UNIQUE` | 실제 운영 스키마에 제약을 적용 |
| `@Version` | 기존 행의 동시 변경 충돌 감지 |

운영 스키마를 Flyway 같은 도구로 관리한다면, 애노테이션을 바꾼 뒤에는 해당 마이그레이션을 확인합니다.<br />
애플리케이션 매핑을 수정하는 것만으로 기존 DB의 제약이 바뀌는 것은 아닙니다.

## 동시 요청이 있는 예약 코드

두 요청이 거의 동시에 같은 예약 코드를 생성하면, 둘 다 사전 중복 확인을 통과할 수 있습니다.<br />
중복을 허용하지 않는 업무라면 DB가 최종적으로 지킬 수 있는 유일성 제약을 둡니다.

```sql
ALTER TABLE reservation
ADD CONSTRAINT uq_reservation_household_code
UNIQUE (household_id, reservation_code);
```

이 예시는 세대 안에서 예약 코드가 유일해야 한다고 가정합니다.<br />
활성 예약에만 적용하거나 빈 코드를 허용해야 한다면 제약 설계도 달라집니다.<br />
실제 데이터를 확인한 뒤 마이그레이션을 적용하고, 충돌 시 API에 돌려줄 오류를 테스트합니다.
[엔티티 식별자](/docs/knowledge/backend/entity/entity-identifiers) / [동시 수정과 버전](/docs/knowledge/backend/repository/repository-locking)

## 화면의 중복 확인을 통과한 요청 두 건

두 사용자가 같은 세대에 동일한 예약 코드를 동시에 등록하면, 두 요청이 모두 사전 조회에서 빈 결과를 볼 수 있습니다.<br />
유일성 제약이 있다면 먼저 커밋한 요청만 성공하고, 나머지 요청은 DB 제약 위반으로 실패할 수 있습니다.

통합 테스트는 커밋 시점의 결과를 보도록 요청을 별도 트랜잭션으로 실행합니다.<br />
최종 저장 건수가 한 건인지와 실패한 요청이 약속한 업무 코드로 변환됐는지 확인합니다.<br />
반대로 예약 코드가 아직 배정되지 않은 상태를 허용한다면, 어떤 값에 제약을 적용할지 먼저 정해야 합니다.

## 참고 자료

- [Jakarta Persistence의 관계형 매핑과 스키마 생성](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
