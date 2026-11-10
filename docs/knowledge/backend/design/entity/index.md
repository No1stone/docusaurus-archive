---
id: knowledge-backend-entity
title: Entity
description: "예약 한 건을 Entity·DTO·VO로 나눌 때, 매핑·연관·페치 문제를 어느 글에서 보면 되는지 안내합니다."
slug: "/knowledge/backend/entity/index"
---
# Entity

예약 API는 차량번호 문자열을 받지만, 저장할 때는 엔티티의 식별자와 상태 컬럼이 필요합니다.<br />
같은 번호를 담아도 HTTP DTO, 값 객체, 엔티티의 역할은 다릅니다.

**하네스 필독이 아닙니다.** 원셋은 최소 엔티티와 CQRS 쪽으로 수렴합니다.

| 지금 겪는 문제 | 읽을 글 |
|---|---|
| 시리즈 허브와 하위 글 안내 | [엔티티 설계](/docs/knowledge/backend/entity/entity-design) |
| VO·DTO·Entity·응답 Item 경계를 잡고 싶음 | [VO·DTO·Entity](/docs/knowledge/backend/entity/persistence-vo-dto-entity) |
| XML 매퍼에서 JPA로 옮기는 맥락 | [모델 발전사](/docs/knowledge/backend/entity/persistence-from-xml-to-orm) |
| 연관·cascade가 예상보다 많이 저장됨 | [연관과 cascade](/docs/knowledge/backend/entity/entity-associations) |
| 목록에서 Lazy 예외가 남 | [LAZY·EAGER](/docs/knowledge/backend/entity/entity-fetch-lazy-eager), [EntityGraph](/docs/knowledge/backend/entity/entity-entitygraph) |
| 필드만 바꿨는데 UPDATE가 안 나감 | [더티 체킹](/docs/knowledge/backend/entity/entity-dirty-checking) |
| 원셋이 엔티티를 어디까지 쓰는지 보고 싶음 | [최소 사용과 CQRS](/docs/knowledge/backend/entity/entity-minimal-and-cqrs) |

원셋 엔티티: `docs/harness/templates/backend/spring/exampleitem/persistence/entity/`
