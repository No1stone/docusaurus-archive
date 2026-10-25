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

> **개요:** CQRS(Command Query Responsibility Segregation)는 상태를 바꾸는 Command와 상태를 읽는 Query의 책임·모델을 나눕니다.
> 처음부터 읽기 DB와 쓰기 DB를 물리적으로 나누라는 뜻이 아닙니다.

## 적용 상황

- 조회 형태와 변경 규칙이 서로 다른 속도로 복잡해질 때
- 읽기 모델을 비정규화하거나 별도 저장소로 빼기 전에, 코드 경계부터 나누고 싶을 때

필요 없을 수 있는 경우:

- 단순 CRUD로 조회·변경 모델이 거의 같을 때
- 팀 규모와 트래픽이 분리 비용을 감당하기 어려울 때

## 분리 가능한 설계와 실제 분리

이 아카이브 Backend Knowledge의 Service 계약은 조회와 Command를 메서드·트랜잭션 경계로 나눌 수 있게 둡니다.
같은 배포 단위·같은 DB 안에서도 논리적으로 구분할 수 있습니다.

물리 분리(읽기 전용 복제본, 별도 조회 스토어)는 그다음 단계입니다.
논리 경계 없이 DB만 나누면 결합이 그대로 남습니다.

```text
업무 Facade
  ├─ 조회 계약 → 조회 구현 → (지금은 같은 DB, 나중엔 읽기 모델)
  └─ Command 계약 → Command 구현 → 쓰기 DB
```

## 정해진 Service 인터페이스를 사례로

채택된 Service 모양은 “고정된 데이터 접근 계약”입니다.
조회(`search`, `findById` 등)와 변경(`save`, `saveById`, `delete…`)을 한 타입에 두더라도, 클래스 수준 `@Transactional(readOnly = true)`와 변경 메서드의 `@Transactional`로 쓰기 경계를 나눕니다.

설명용 스케치입니다.
예제 가정: Spring Boot 3.x, Java 17.

```java
public interface CardService {

    CardView findById(Long id);

    Page<CardView> search(CardFilter filter, Pageable pageable);

    CardId create(CardCreate command);

    CardId update(Long id, CardUpdate command);
}
```

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CardServiceImpl implements CardService {

    private final CardRepository repository;

    @Override
    public CardView findById(Long id) {
        return CardView.from(repository.findById(id).orElseThrow());
    }

    @Override
    @Transactional
    public CardId create(CardCreate command) {
        Card saved = repository.save(Card.create(command));
        return new CardId(saved.getId());
    }
}
```

Facade는 조회 계약과 Command 계약을 조합만 하고, Service 밖으로 JPA `Specification` 같은 영속성 세부 사항을 새어 나가지 않게 유지하는 것이 목표입니다.
현재 일부 코드베이스에는 아직 `Specification`이 인자로 드러나는 결합이 남아 있을 수 있습니다. 그것은 개선 대상이지 CQRS 완료를 뜻하지 않습니다.

## 실패 처리와 주의점

- 읽기 모델을 비동기로 맞추면 조회 지연이 생깁니다. “방금 쓴 값이 당장 읽힌다”를 기본으로 두지 않습니다.
- Command 쪽에 화면용 조합·마스킹을 넣지 않습니다. 조합은 Facade 쪽입니다.
- CQRS만으로 분산 트랜잭션 문제가 풀리지 않습니다. 여러 서비스 변경은 [Saga](/docs/patterns/architecture-patterns/saga)를 검토합니다.

## 관련 글

- [Service 설계](../../knowledge/backend/service/service-design.md)
- [Facade Design](../../knowledge/backend/facade/facade-design.md)
- [CDC](/docs/patterns/architecture-patterns/cdc) — 읽기 모델 반영에 쓰이기도 함

## 참고

- [Microsoft Learn — CQRS pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
