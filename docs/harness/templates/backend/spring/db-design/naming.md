---
sidebar_position: 2
title: 테이블·컬럼 네이밍
description: 도메인 접두사 필수, 성격 접미사, snake_case 컬럼 규칙을 정리합니다.
---

# 테이블·컬럼 네이밍

> **필수 경계:** 테이블명에 도메인 접두사를 둡니다.
> **기본 관례:** 컬럼은 snake_case입니다. 접미사로 이력·통계 성격을 드러냅니다.

이름순 정렬만으로 같은 도메인 테이블이 모이도록 구성합니다.

```text
도메인접두사_대상명_성격접미사
```

| 구분 | 기준 | 강도 |
|------|------|------|
| 접두사 | 도메인 구분. 예: `fa_`, `de_`, `co_`, `me_`, `pn_`, `st_`, `ad_`, `le_` | 필수 경계 |
| 대상명 | 저장하는 업무 대상 | 기본 관례 |
| 접미사 | `history`, `log`, `hourly`, `daily`, `monthly` 등 성격·집계 단위 | 기본 관례 |
| 컬럼명 | snake_case (`farm_id`, `created_at`) | 기본 관례 |
| 타입·길이·기본값 | 도메인 요구와 기존 예제 | 상황별 선택 |

벌크·쿼리 중심 테이블에는 `_log`, `_history`, 통계성 이름(`st_…`, `*_daily` 등)이 붙는 경우가 많습니다.
그런 테이블은 [Audit](./audit)에서 `CreatedEntity`만 쓰는 경우가 많습니다.

템플릿 맛보기: ExampleItem 테이블명 `le_example_item`, 인덱스 `ix_le_example_item_…` ([persistence](/docs/harness/templates/backend/spring/exampleitem/persistence/)).

일반론: [MySQL 테이블 설계](/docs/knowledge/data/mysql/design/keys-and-relations) (프로젝트 접두사 규칙은 이 하네스에만 둡니다).
