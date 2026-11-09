---
id: entity-annotations-catalog
title: 엔티티 어노테이션 목록
description: 엔티티 클래스·필드에 자주 쓰는 JPA·Hibernate 어노테이션과 원셋 사용 여부를 표로 정리합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-annotations-catalog"
---

# JPA 엔티티 애노테이션을 역할별로 읽기

엔티티 파일을 처음 열면 테이블 이름, 식별자, 연관, 변경 추적을 위한 애노테이션이 한 클래스에 나옵니다.<br />
방문 예약 엔티티를 수정한다고 가정하고, 어떤 종류의 변경인지에 따라 확인할 곳을 나눠 봅니다.

| 변경하려는 것 | 관련 애노테이션 | 확인할 항목 |
|---|---|---|
| 어떤 테이블에 저장할지 | `@Entity`, `@Table` | 테이블 이름과 실제 DDL |
| 어떤 값으로 한 행을 식별할지 | `@Id`, `@GeneratedValue`, `@IdClass`, `@EmbeddedId` | 생성 전략과 DB 유일성 |
| 컬럼 타입과 제약 | `@Column`, `@Table(uniqueConstraints = ...)` | 마이그레이션과 운영 DB의 제약 |
| 연관을 함께 읽을지 | `@ManyToOne`, `@OneToMany`, `@EntityGraph` | 로딩 시점과 실행 SQL |
| enum을 어떻게 저장할지 | `@Enumerated`, `@Convert`, `@Converter` | 저장값과 기존 코드의 호환성 |
| 어떤 컬럼을 SQL에 포함할지 | Hibernate `@DynamicInsert`, `@DynamicUpdate` | 기본값과 변경 SQL |
| 생성자, 수정자와 충돌 | `@EntityListeners`, `@Version` | 감사 기록과 버전 검사 |

예를 들어 예약 상태를 문자열 코드로 저장하고 싶다면 enum 변환만 바꾸는 것으로 충분할 수 있습니다.<br />
같은 예약을 두 사람이 바꿀 때 충돌이 필요하다면 `@Version`이 있는지도 별도로 확인합니다.

원셋은 단일 ID와 스칼라 관계 ID에서 시작합니다.<br />
연관 조회나 버전 필드는 해당 업무가 요구할 때 선택합니다.
[식별자](/docs/knowledge/backend/entity/entity-identifiers) / [관계 매핑](/docs/knowledge/backend/entity/entity-associations) / [enum 변환](/docs/knowledge/backend/entity/entity-enum-converter) / [동적 SQL](/docs/knowledge/backend/entity/entity-dynamic-insert-update) / [Auditing](/docs/knowledge/backend/repository/repository-auditing)

## 참고 자료

- [Jakarta Persistence의 매핑 애노테이션](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
