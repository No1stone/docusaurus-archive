---
id: entity-constraints
title: 엔티티 제약
description: Column unique UniqueConstraint Table nullability 등 스키마 힌트를 정리합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-constraints"
---

# 엔티티 제약

> **개요:** `@Column(unique)`, `@UniqueConstraint`, nullability, length는 DDL·검증 힌트입니다.
> 최종 제약은 DB·마이그레이션이 권위입니다.

| 애너테이션 | 예 |
|------------|-----|
| `@Column(nullable, length, unique)` | 단일 컬럼 |
| `@Table(uniqueConstraints=…)` | 복합 유니크 |
| `@Version` | 낙관적 락 (호스트) |

앱 검증(Bean Validation)과 DB 제약은 겹칠 수 있으나 층을 섞어 쓰지 않습니다.
Advice 검증은 [advice-validation](/docs/knowledge/backend/controller/advice-validation)입니다.

원셋 결론: [최소 사용과 CQRS](/docs/knowledge/backend/entity/entity-minimal-and-cqrs).

---

## 관련

- [어노테이션 목록](/docs/knowledge/backend/entity/entity-annotations-catalog)
