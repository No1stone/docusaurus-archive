# Facade template

> **개요:** 도메인 유스케이스(`{Domain}Facade`)입니다.
> 모노리포에서는 **model**에 둡니다. api의 HTTP·gRPC 진입이 이 클래스를 호출합니다.
> 자기 도메인 Port와 `DisplayNameResolver`만 주입합니다.
> Adapter, Repository, Spec, 엔티티를 직접 다루지 않습니다.

화면·시나리오 조립은 api의 `{Feature}BffFacade`입니다 (GraphQL·HTTP BFF).
BffFacade는 DomainPort만 보고, BFF 전용 Port는 만들지 않습니다.
이름·위치 표는 [coding-conventions](/docs/harness/context/coding-conventions)와 [ONESET](../../ONESET)입니다.

클래스 기본은 `@Transactional(readOnly = true, transactionManager = "transactionManager")` 이고, 쓰기만 `@Transactional` 입니다.
목록·단건 조회 뒤에는 `DisplayNameResolver.applyCreatedByDisplayNames`로 감사 PK를 표시명으로 바꿉니다.
Resolver의 Name 맵은 Port `findAllName` + `Filter.ids`(또는 동등한 ids Name 조회)로 채웁니다.
열거형 코드 재설정은 이 파일이 아니라 [enum 템플릿](../../enum/) 입니다.

## Files

- [`ExampleItemFacade.java`](./ExampleItemFacade.java)
- [`../support/display/DisplayNameResolver.java`](../support/display/DisplayNameResolver.java)
