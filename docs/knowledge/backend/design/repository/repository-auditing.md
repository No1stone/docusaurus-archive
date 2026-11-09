---
id: repository-auditing
title: Repository — Auditing
description: 현재 사용자가 생성자와 수정자로 기록되는 과정을 따라가고 원셋의 감사 상속을 설명합니다.
tags:
  - backend
  - jpa
  - auditing
status: active
slug: "/knowledge/backend/repository/repository-auditing"
---

# JPA Auditing으로 생성자와 수정자 기록하기

방문 예약을 등록한 사람과, 나중에 방문 시간을 바꾼 사람이 다를 수 있습니다.

이 정보를 남기려면 등록 메서드마다 생성자를 넣고, 수정 메서드마다 수정자를 넣는 방법도 있습니다.<br />
하지만 등록 경로가 화면, 엑셀, 배치로 늘어나면 한 곳에서만 누락돼도 데이터가 다르게 남습니다.

Spring Data JPA Auditing은 엔티티의 저장과 수정 시점에 공통 필드를 채울 수 있게 해줍니다.<br />
애플리케이션은 **현재 작업의 주체를 어떻게 알아낼지** 정합니다.

## 로그인 계정에서 감사 컬럼까지

![로그인 계정이 감사 컬럼에 기록되는 흐름](/img/backend-design/jpa-audit-actor.svg)

| 필드 | 애노테이션 | 의미 |
|---|---|---|
| `created_at` | `@CreatedDate` | 처음 저장한 시각 |
| `created_by` | `@CreatedBy` | 처음 저장한 주체 |
| `updated_at` | `@LastModifiedDate` | 마지막으로 수정한 시각 |
| `updated_by` | `@LastModifiedBy` | 마지막으로 수정한 주체 |

시각 필드만 쓸 때는 `AuditorAware` 없이 구성할 수 있습니다.<br />
사용자도 기록하려면 감사 필드의 타입에 맞는 `AuditorAware<T>`를 등록합니다.<br />
아래 예제는 감사 컬럼에 로그인 ID 문자열을 저장하는 경우입니다.

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "requestAuditor")
class AuditConfiguration {

    @Bean
    AuditorAware<String> requestAuditor() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .filter(Authentication::isAuthenticated)
            .filter(auth -> !(auth instanceof AnonymousAuthenticationToken))
            .map(Authentication::getName);
    }
}
```

엔티티나 상위 타입에 `@EntityListeners(AuditingEntityListener.class)`를 등록합니다.<br />
예제에서 인증 정보가 없다면 작성자를 제공하지 않습니다.<br />
배치에서도 작성자 컬럼이 필수라면 배치가 사용하는 감사 주체를 따로 정해야 합니다.

## 생성 기록과 수정 기록을 나눈 이유

원셋은 모든 테이블에 같은 감사 필드를 붙이는 대신, 테이블을 어떻게 사용하는지에 따라 상위 타입을 고릅니다.

```text
BaseEntity
└── CreatedEntity    created_at, created_by
    └── UpdatedEntity    updated_at, updated_by, version 추가
```

변경 이력을 한 줄씩 쌓는 테이블은 누가 언제 기록했는지가 중요합니다.<br />
이런 경로에는 `CreatedEntity`를 사용합니다.

반면 방문 예약처럼 기존 행을 고치는 데이터는 마지막 수정 주체와 시각이 필요할 수 있습니다.<br />
원셋의 `UpdatedEntity`는 여기에 `@Version`도 포함합니다.<br />
버전 필드는 수정 충돌을 감지하는 JPA 기능이고, 감사 필드와 함께 배치한 것은 원셋의 설계 선택입니다.
[엔티티 버전과 잠금](/docs/knowledge/backend/repository/repository-locking) / [원셋 감사 상위 타입](/docs/harness/templates/backend/spring/support/) / [테이블별 감사 필드 설계](/docs/harness/templates/backend/spring/db-design/audit)

## 벌크 쿼리에서 감사 필드를 확인해야 하는 이유

예약 엔티티를 조회해 상태를 바꾸면, 관리 중인 엔티티의 변경을 DB에 반영하는 과정에서 수정 감사가 적용됩니다.<br />
JPQL 벌크 UPDATE나 직접 실행한 SQL은 개별 엔티티의 변경을 거치지 않으므로 감사 리스너도 호출하지 않습니다.

예를 들어 만료 예약을 일괄 변경한다면, 다음 중 어떤 기록이 필요한지 먼저 정합니다.

- 개별 수정자와 수정 시각이 필요하면 엔티티를 변경하는 방식과 일괄 쿼리에서 감사 필드를 명시하는 방식을 비교합니다.
- 배치가 한 번 수행됐다는 사실만 필요하다면 배치 실행 기록에 작업 시각과 변경 건수를 남깁니다.

테스트에서는 사용자 A로 예약을 생성한 뒤 사용자 B로 수정합니다.<br />
트랜잭션을 반영하고 다시 조회해 생성자는 A로 유지되고 수정자는 B로 바뀌었는지 확인합니다.<br />
벌크 경로가 따로 있다면 그 경로에 합의한 감사 정책도 같은 방식으로 검증합니다.

## 사용자 요청과 배치가 같은 컬럼을 채울 때

관리자가 예약을 변경한 경우에는 로그인 ID를 수정자로 남길 수 있습니다.<br />
자동 만료 배치에는 로그인 정보가 없으므로, 배치 이름이나 시스템 계정을 감사 주체로 쓰는 정책을 따로 정합니다.

| 경로 | 확인할 값 |
|---|---|
| 사용자 A가 생성, 사용자 B가 변경 | 생성자는 A로 유지, 수정자는 B |
| 로그인 정보가 없는 자동 만료 | 지정한 배치 주체로 기록되거나, 합의한 대로 값 생략 |
| 직접 SQL로 만료 처리 | 쿼리가 갱신한 감사 컬럼 또는 별도 배치 실행 기록 |

감사 필드가 실제로 반영됐는지 보려면 변경 후 다시 조회합니다.<br />
특히 벌크 작업은 엔티티 리스너를 거치지 않으므로 일반 수정 테스트와 실행 경로를 분리합니다.

## 참고 자료

- [Spring Data JPA Auditing 설정과 감사 주체](https://docs.spring.io/spring-data/jpa/reference/auditing.html)
- [Jakarta Persistence의 엔티티 생명주기와 벌크 변경](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2)
