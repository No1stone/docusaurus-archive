---
id: adr-0013
title: Flyway를 하네스 기본 마이그레이션으로 두지 않는다
description: MSA에서 동일 스키마에 여러 Flyway가 돌거나 격리 DB에서 가시성이 깨지는 문제를 피하기 위해 Flyway를 기본으로 강제하지 않는다
tags:
  - adr
  - database
  - migration
  - harness
status: accepted
slug: "/decisions/adr-0013"
---
# Flyway를 하네스 기본 마이그레이션으로 두지 않는다

스키마 변경은 필요하지만, 앱마다 Flyway를 기본으로 붙이면 다음이 어색해진다.

- MSA에서 **같은 스키마**를 여러 서비스가 볼 때 Flyway가 여러 번 동작하기 어렵다
- DB 접근 규칙과 안전성(누가 DDL을 소유하는지)이 앱 배포 파이프라인에 흩어진다
- **완전 격리된 DB**에서는 마이그레이션 이력의 가시성·운영 추적이 오히려 약해질 수 있다

Knowledge에 Flyway 메모가 있어도 하네스 정본으로 승격하지 않는다.

## 결정

- Flyway를 Spring 원셋·하네스의 **기본 마이그레이션 도구로 두지 않는다**
- 스키마 변경은 **소유와 접근 규칙**을 명확히 하고, ALTER·파티션 운영 문서를 따른다
- 단일 서비스·완전 소유 DB에서 팀이 Flyway를 쓰는 것은 프로젝트 선택이다. 아카이브가 금지하는 것이 아니라 **기본 강제하지 않는다**

## 결과

- [ALTER TABLE과 마이그레이션](/docs/knowledge/data/mysql/design/alter-table-and-migration)
- [파티션 운영](/docs/harness/templates/backend/spring/db-design/partition-ops)
- [하네스 Database 입구](/docs/harness/database/)
