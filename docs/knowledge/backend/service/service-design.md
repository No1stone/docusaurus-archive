---
id: service-design
title: 데이터 접근 경계 (Port와 Adapter)
description: 기존 Service의 데이터 접근 책임이 Port와 JPA Adapter로 어떻게 이어지는지 설명합니다
tags:
  - backend
  - service
  - port
  - adapter
status: active
slug: "/knowledge/backend/service/service-design"
---
# 데이터 접근 경계 (Port와 Adapter)

> **개요:** 현재 템플릿과 많은 저장소에서 `*Service`로 부르던 계층은 업무 로직 전체가 아니라 JPA 데이터 접근 영역입니다.
> 이 책임을 Port(계약)와 Adapter(기술 구현)로 표현합니다.
> DB 제약과 영속성 구현을 애플리케이션 영역으로 옮기라는 뜻은 아닙니다.

## 적용 상태

공통 구현 기준으로 채택되었습니다.
과거 문서의 "Service가 업무 규칙까지 담당한다"는 표현은 이 기준으로 정리합니다.
관련 결정은 [ADR-0010](/docs/decisions/adr-0010)을 봅니다.
코드 모양은 Spring 템플릿의 `port/`, `adapter/`를 따릅니다.

## 책임 재정의

| 구성 | 책임 |
|---|---|
| Port | 저장, 조회 기능의 계약. 애플리케이션이 의존하는 인터페이스 |
| JPA Adapter | Repository 호출, 조회 조건 구성, 영속성 모델 변환, 저장, 수정, 삭제 구현 |
| 애플리케이션 영역 | 업무상 허용 여부, 계산, 정책, 처리 순서와 상태 전이 결정, 이종 DTO 교환 |

Adapter에 남기는 그 데이터 자신의 규칙:

- 존재 여부와 없을 때의 오류
- 그 데이터 자신의 상태 전이와 삭제 의미
- 그 데이터 집합 안의 저장 제약과 정합성
- 엔티티와 Port가 주고받는 DTO 사이 변환

애플리케이션이 조율하는 정책:

- 어떤 Port를 어떤 순서로 호출하는지
- 화면이나 BFF 계약에 맞게 결과를 조합하고 노출 범위를 맞추는지
- 다른 모듈 조회 실패 시 전체 실패인지 일부만 반환할지
- 한 프로세스 안에서 로컬 트랜잭션에 어떤 변경을 포함할지

상태 변경을 허용하는 권한은 그 데이터를 소유한 백엔드 업무 경계에 둡니다.

## 이름과 하위 호환

기존 코드의 `*Service` 클래스는 대부분 JPA Adapter 역할입니다.
새 템플릿과 문서는 `ExampleItemPort`와 `ExampleItemAdapter`처럼 역할을 이름에 드러냅니다.
이미 `Service`인 저장소를 일괄 개명할 의무는 없습니다.
역할을 Adapter로 이해하고, 신규, 리팩터 시 Port와 Adapter로 맞춥니다.

RestClient 구현체도 동일합니다.
계약이 Port이고 HTTP 호출 구현이 Adapter입니다.

## Provider 교체 (캐시, 암호화 등)

JPA뿐 아니라 캐시, 암호화, 외부 IdP도 같은 층을 씁니다.

```text
CachePort     EncryptionPort    TokenPort / OAuthPort    MessagingPort
    ↓               ↓                   ↓                      ↓
CacheAdapter  EncryptionAdapter Token/OAuthAdapter     MessagingAdapter
    ↓               ↓                   ↓                      ↓
RedisProvider VaultProvider     KeycloakProvider       KafkaProvider
(다른 캐시)      (KMS)              자체 JWT Provider      RabbitMqProvider
                                                       RedisPubSubProvider
                                                       StompProvider
                                                       WebSocketProvider
```

- Port: 능력 계약. `CachePort`, `EncryptionPort`, `TokenPort`, `OAuthPort`, `MessagingPort`. 제품명(Redis, Vault, Keycloak, Kafka)을 Port에 넣지 않습니다.
- Adapter: Port 구현. 직렬화, 키 규칙, 실패를 Port 의미로 변환하고 Provider를 고릅니다.
- Provider: Redis, Vault, KMS, Keycloak, 자체 JWT, Kafka, RabbitMQ, STOMP, WebSocket 등 실제 호출.

애플리케이션과 Port는 Provider 교체만으로 유지합니다.
Vault, Keycloak, Kafka를 Port 이름으로 쓰지 않는 이유는 나중에 KMS, 자체 JWT, 다른 브로커로 바꿔도 계약을 바꾸지 않기 위함입니다.

## 조회와 변경 (코드 수준 CQRS)

**CQRS의 코드 수준 적용점은 JPA Adapter입니다.**
애플리케이션(Facade 등)이 읽기 DB와 쓰기 DB를 고르지 않습니다.
Adapter가 Provider로 Repository 접근을 나눕니다.

처음부터 Query와 Command를 나누지 않아도 됩니다.
하나의 Port와 Adapter, Repository로 시작하고 필요하면 분리합니다.

분리할 때 예:

```text
Port
  ↓
JPA Adapter                         ← CQRS 적용점
  ├─ Read Provider  → 조회용 Repository (리드 데이터소스)
  └─ Command Provider → CRUD Repository
       (JPA 수정은 조회가 필요하므로 Command 쪽에 조회 포함 CRUD를 둘 수 있음)
```

Port를 `UserQueryPort`와 `UserCommandPort`로 나누는 것도 같은 단계에서 허용합니다.
애플리케이션은 여전히 Port만 호출합니다.
물리적인 읽기 DB 분리는 그다음 단계입니다.
자세한 내용은 [CQRS](/docs/patterns/architecture-patterns/cqrs)와 원셋 [adapter README](/docs/harness/templates/backend/spring/exampleitem/persistence/)를 봅니다.

## 호출 관계

```text
Controller / gRPC / GraphQL
        ↓
{Domain}Facade 또는 {Feature}BffFacade
        ↓
Port                         ← BffFacade도 DomainPort만 본다
        ↓
JPA Adapter  ← CQRS 적용점 (Provider로 Repository 분리)
   ├─ Read Provider
   └─ Command Provider
        ↓
Repository / 외부 시스템
```

애플리케이션(DomainFacade·BffFacade)은 Repository와 Adapter 구현체를 직접 참조하지 않습니다.
Adapter는 Facade·BffFacade를 참조하지 않습니다.

## 현재 구현에 남은 결합

공유 모듈에 Service, 엔티티, Repository, DTO가 있고 여러 애플리케이션이 직접 의존하는 형태가 남아 있을 수 있습니다.
조회가 JPA `Specification`을 인자로 받아 영속성 조건이 밖으로 드러나는 호출도 있습니다.
MSA로 가려면 이런 결합을 먼저 줄입니다.

## 테스트

| 대상 | 대체 | 확인 |
|---|---|---|
| DomainFacade / BffFacade | Port | 조합, 정책, 분기, 실패 처리, 표시명 |
| JPA Adapter | Repository | 매핑, 스펙, 없는 자원, 부분 수정 |
| 시나리오 | 실제 스택 | 유스케이스 결과 |

## Related

- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [CQRS](/docs/patterns/architecture-patterns/cqrs)
- [ADR-0010](/docs/decisions/adr-0010)
- 템플릿: `docs/harness/templates/backend/spring/exampleitem/persistence/`
