# Service template (이관됨)

> **개요:** 과거 `ExampleItemService`는 JPA 데이터 접근 역할이었습니다.
> 현재 원셋에서는 Port와 JPA Adapter로 나눕니다.

- 계약: [`../port/`](../port/)
- 구현: [`../adapter/`](../adapter/)

설명은 [데이터 접근 경계](/docs/knowledge/backend/service/service-design)와 [ADR-0010](/docs/decisions/adr-0010)을 봅니다.
