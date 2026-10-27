# persistence (ExampleItem)

> **개요:** 도메인 영속 outbound입니다. `Port` + `Adapter` + `entity` / `repository` / `spec` 을 둡니다.
> Inbound Port는 없습니다.

실무 패키지 예: `application.{domain}.persistence`.
모노리포에서는 persistence·dto·`{Domain}Facade`·`DisplayNameResolver`가 함께 **model**에 갑니다.
api에는 진입과 `{Feature}BffFacade`만 둡니다.

```text
exampleitem/
  facade/          # DomainFacade — 모노리포: model
  dto/             # 모노리포: model
  persistence/     # 모노리포: model
    ExampleItemPort.java
    ExampleItemAdapter.java
    entity/
    repository/
    spec/
```

## Port → Adapter → Provider

```text
ExampleItemPort → ExampleItemAdapter → (선택) Read/Command Provider → Repository
```

| 이름 | 역할 |
|---|---|
| Port | 영속 능력 계약. 제품명을 붙이지 않는다 |
| Adapter | Port 구현. Repository·Spec 사용 |
| Provider | 필요할 때 Adapter 아래에서 Repository 분리 (CQRS) |

## CQRS

원셋은 Repository 하나를 Adapter가 직접 씁니다.
조회/변경을 나눌 때는 **Adapter 아래** Provider로 분리합니다.

```text
ExampleItemPort
        ↓
ExampleItemAdapter          ← CQRS 적용점
   ├─ ExampleItemReadProvider
   └─ ExampleItemCommandProvider
```

## Files

- [`ExampleItemPort.java`](./ExampleItemPort.java)
- [`ExampleItemAdapter.java`](./ExampleItemAdapter.java)
- [`entity/ExampleItem.java`](./entity/ExampleItem.java)
- [`repository/ExampleItemRepository.java`](./repository/ExampleItemRepository.java)
- [`spec/ExampleItemSpecs.java`](./spec/ExampleItemSpecs.java)
