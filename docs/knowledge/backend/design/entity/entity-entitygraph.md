---
id: entity-entitygraph
title: EntityGraph
description: EntityGraph로 조회 단위 연관 로딩을 고르는 시도와 원셋 최소 사용을 정리합니다.
tags:
  - backend
  - jpa
status: active
slug: "/knowledge/backend/entity/entity-entitygraph"
---

# EntityGraph

> **개요:** `@EntityGraph` / NamedEntityGraph는 연관 fetch를 **엔티티 필드 기본값에 박지 않고** 조회 메서드 단위로 고릅니다.
> 유용하지만, 원셋은 Spec·스칼라·Facade 조립을 기본으로 두고 그래프 ORM에 기대지 않습니다.

```mermaid
flowchart LR
  repo[Repository_메서드]
  graph[EntityGraph]
  ent[Entity_부분_그래프]
  repo --> graph
  graph --> ent
```

상세 화면에만 깊은 그래프가 필요하면 EntityGraph·fetch join을 검토할 수 있습니다.
목록 기본 경로에 NamedEntityGraph를 잔뜩 올리면 다시 “한 엔티티에 모든 조회”가 됩니다.
원셋 결론: [최소 사용과 CQRS](/docs/knowledge/backend/entity/entity-minimal-and-cqrs).

---

## 관련

- [LAZY와 EAGER](/docs/knowledge/backend/entity/entity-fetch-lazy-eager)
