---
sidebar_position: 4
title: 공통 Audit
description: CreatedEntity와 UpdatedEntity 상속, 벌크·쿼리 테이블의 version 제외를 정리합니다.
---

# 공통 Audit

> **필수 경계:** 모든 테이블은 생성 전용 또는 생성·수정형 Audit 구조를 따릅니다.
> DB 컬럼과 JPA `@MappedSuperclass` 매핑은 같은 모양입니다.

```text
BaseEntity
└── CreatedEntity      created_at, created_by
    └── UpdatedEntity  + updated_at, updated_by, version
```

| 구분 | 공통 컬럼 | 주된 용도 | 강도 |
|------|-----------|-----------|------|
| `CreatedEntity` | `created_at`, `created_by` | 이력·로그·통계 등 벌크·쿼리 중심 | 필수 경계(해당 역할) |
| `UpdatedEntity` | 생성 정보 + `updated_at`, `updated_by`, `version` | 변경·낙관적 락이 필요한 마스터 | 필수 경계(해당 역할) |

생성 전용 테이블에는 `version`을 두지 않아 벌크, 배치, 직접 SQL을 단순하게 유지합니다.
JPA 밖에서 입력하는 경우 생성 Audit 값도 그 처리에서 채웁니다.

시간 기준은 **기본 관례**로 KST를 두고, 국제화·다국가 요구가 있으면 **상황별 선택**으로 따로 정합니다.
전 테이블에 TZ 컬럼을 강제하지 않습니다.

템플릿: [support](/docs/harness/templates/backend/spring/support/)의 `CreatedEntity`, `UpdatedEntity`.

기존 구현 참고: 일부 `_log` 엔티티가 `UpdatedEntity`를 쓰는 **drift**가 있을 수 있습니다.
문서는 Created-only 규범을 기준으로 하고, 코드 정리는 [후속 작업](./follow-ups)으로 둡니다.
