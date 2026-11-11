---
id: knowledge-backend-repository
title: Repository
description: "예약 목록 조회·잠금·페이징을 Repository에서 구현할 때, 증상별로 어느 글을 보면 되는지 안내합니다."
slug: "/knowledge/backend/repository/index"
---
# Repository

Facade는 Port만 보고, JPA Repository는 Adapter 뒤에서 호출합니다.<br />
예약 검색 조건을 Spec으로 바꿀지, Query Method로  suff할지, 잠금이 필요한지는 증상부터 고릅니다.

**하네스 필독이 아닙니다.** 구현은 원셋 persistence에 있습니다.

| 지금 겪는 문제 | 읽을 글 |
|---|---|
| Repository 시리즈 허브 | [Repository 설계](/docs/knowledge/backend/repository/repository-design) |
| Filter를 Spec으로 옮기는 방법 | [Spec과 Filter](/docs/knowledge/backend/repository/repository-spec-and-filter) |
| 메서드 이름만으로 조회가 되는지 확인 | [Query Methods](/docs/knowledge/backend/repository/repository-query-methods) |
| count가 부담되어 Slice가 필요한지 | [Page와 Slice](/docs/knowledge/backend/repository/repository-pagination-and-slice) |
| 동시 예약에서 덮어쓰기가 남 | [Locking](/docs/knowledge/backend/repository/repository-locking) |
| 생성·수정자 시각이 안 채워짐 | [Auditing](/docs/knowledge/backend/repository/repository-auditing) |
| Custom·QueryDSL·jOOQ 자리 비교 | [커스텀](/docs/knowledge/backend/repository/repository-custom), [QueryDSL](/docs/knowledge/backend/repository/repository-querydsl-dynamic), [jOOQ](/docs/knowledge/backend/repository/repository-jooq-and-sql-builders) |

원셋: `docs/harness/templates/backend/spring/exampleitem/persistence/repository/`
