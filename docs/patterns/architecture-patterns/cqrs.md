---
id: pattern-cqrs
title: CQRS
description: 조회와 변경을 다른 모델로 나눌 수 있게 경계를 두는 패턴. 분리 가능한 설계와 실제 DB 분리를 구분합니다.
tags:
  - patterns
  - CQRS
  - Spring
status: active
slug: /patterns/architecture-patterns/cqrs
---
# CQRS

> **개요:** CQRS(Command Query Responsibility Segregation)는 상태를 바꾸는 Command와 상태를 읽는 Query의 책임, 모델을 나눕니다.
> 처음부터 읽기 DB와 쓰기 DB를 물리적으로 나누라는 뜻이 아닙니다.

## 적용 상황

- 조회 형태와 변경 규칙이 서로 다른 속도로 복잡해질 때
- 읽기 모델을 비정규화하거나 별도 저장소로 빼기 전에, 코드 경계부터 나누고 싶을 때

필요 없을 수 있는 경우:

- 단순 CRUD로 조회, 변경 모델이 거의 같을 때
- 팀 규모와 트래픽이 분리 비용을 감당하기 어려울 때

## 분리 가능한 설계와 실제 분리

이 아카이브에서 **코드 수준 CQRS의 적용점은 JPA Adapter**입니다.
Adapter가 Read Provider와 Command Provider로 Repository를 나눕니다.
애플리케이션(Facade 등)은 Port만 호출하며, 어느 데이터소스를 쓸지 고르지 않습니다.

물리 분리(읽기 전용 복제본, 별도 조회 스토어)는 그다음 단계입니다.
논리 경계 없이 DB만 나누면 결합이 그대로 남습니다.

```text
공개 애플리케이션 진입점 (Facade 등)
        ↓
Port (하나로 시작하거나 Query / Command로 분리)
        ↓
JPA Adapter                         ← CQRS 적용점
  ├─ Read Provider  → 조회용 Repository (리드 데이터소스)
  └─ Command Provider → CRUD Repository
         (JPA 수정은 조회가 필요하므로 Command 쪽에 조회 포함 CRUD를 둘 수 있음)
```

처음부터 Query와 Command Port, Provider를 나누지 않아도 됩니다.
원셋은 Port, JPA Adapter, Repository 하나로 두고, 필요가 보일 때 Adapter 아래에서 분리합니다.
템플릿 안내는 [adapter README](/docs/harness/templates/backend/spring/exampleitem/persistence/)를 봅니다.

## 한 Port로 시작하는 사례

조회(`search`, `findById` 등)와 변경(`save`, `saveById`, `delete…`)을 한 Port에 두더라도, Adapter 클래스 수준 `@Transactional(readOnly = true)`와 변경 메서드의 `@Transactional`로 쓰기 경계를 나눕니다.

설명용 스케치입니다.
예제 가정: Spring Boot 3.x, Java 17.

```java
public interface OrderPort {

    OrderView findById(Long id);

    Page<OrderView> search(OrderFilter filter, Pageable pageable);

    OrderId create(OrderCreate command);

    OrderId update(Long id, OrderUpdate command);
}
```

```java
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JpaOrderAdapter implements OrderPort {

    private final OrderRepository repository;

    @Override
    public OrderView findById(Long id) {
        return OrderView.from(repository.findById(id).orElseThrow());
    }

    @Override
    @Transactional
    public OrderId create(OrderCreate command) {
        Order saved = repository.save(Order.create(command));
        return new OrderId(saved.getId());
    }
}
```

애플리케이션은 조회 Port와 Command Port를 조합만 하고, Adapter 밖으로 JPA `Specification` 같은 영속성 세부 사항이 새어 나가지 않게 유지하는 것이 목표입니다.

## 실패 처리와 주의점

- 읽기 모델을 비동기로 맞추면 조회 지연이 생깁니다. "방금 쓴 값이 당장 읽힌다"를 기본으로 두지 않습니다.
- Command 쪽에 화면용 조합, 마스킹을 넣지 않습니다. 조합은 애플리케이션 쪽입니다.
- CQRS만으로 분산 트랜잭션 문제가 풀리지 않습니다. 여러 서비스 변경은 [Saga](/docs/patterns/architecture-patterns/saga)를 검토합니다.

## 관련 글

- [데이터 접근 경계](/docs/knowledge/backend/service/service-design)
- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [ADR-0010](/docs/decisions/adr-0010)
- [CDC](/docs/patterns/architecture-patterns/cdc) — 읽기 모델 반영에 쓰이기도 함

## 참고

- [Microsoft Learn — CQRS pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
