---
id: facade-design
title: 애플리케이션 영역과 Facade
description: 애플리케이션 영역의 책임, 공개 진입점, 이름 선택, Port 호출 경계를 정합니다
tags:
  - backend
  - facade
  - application
status: active
slug: "/knowledge/backend/facade/facade-design"
---
# 애플리케이션 영역과 Facade

> **개요:** 애플리케이션 영역은 유스케이스 진행, 정책, 계산, 검증, 상태 관리, 기능 조합을 담당합니다.
> Facade는 그 안의 역할 중 하나로, 공개 진입점으로 자주 쓰입니다.
> 계층은 클래스 접미사가 아니라 패키지, 책임, 의존 관계로 구분합니다.

## 적용 상태

공통 구현 기준으로 채택되었습니다.
Backend Knowledge의 Controller, 데이터 접근(Port와 Adapter), 테스트 구조와 함께 현재 기준입니다.
테이블 입구의 코드 모양은 Spring 템플릿을 따릅니다.
관련 결정은 [ADR-0010](/docs/decisions/adr-0010)을 봅니다.

## 계층 구분

| 영역 | 책임 | 이름 예시 |
|---|---|---|
| 애플리케이션 | 업무 규칙, 계산, 검증, 상태 관리, 유즈케이스 진행과 기능 조합 | Facade, Handler, Manager, Checker, Processor |
| Port | 도메인이 요구하는 저장소, 외부 기능의 계약 | UserPort, UserQueryPort, ExampleItemPort |
| Adapter | Port를 구현하여 저장소, 외부 시스템에 접근하고 기술별 데이터를 변환 | ExampleItemAdapter, RestClient 구현체, Provider |

위 예시는 닫힌 허용 목록이 아닙니다.
특정 접미사를 일률적으로 강제하지 않습니다.
이름은 역할을 가장 잘 설명하도록 고릅니다.

Manager나 Processor도 애플리케이션 영역에 속할 수 있습니다.
Provider나 Client도 Port를 구현하면 Adapter 역할입니다.

## 호출 경계

```text
REST Controller / gRPC 수신부 / GraphQL Resolver / 메시지 Listener
                              ↓
               도메인이 공개한 애플리케이션 진입점
                              ↓
                     해당 도메인의 Port
                              ↓
                       기술별 Adapter
                              ↓
                   DB / Redis / Vault / Keycloak / 외부 HTTP
```

- 외부 진입부와 다른 도메인은 지정된 공개 애플리케이션 진입점만 참조합니다.
- 공개 여부를 Facade라는 이름만으로 판단하지 않습니다.
- Port는 소유 도메인의 애플리케이션 영역에서만 사용합니다.
- 다른 도메인의 Port, Adapter, Repository를 직접 참조하지 않습니다.
- 애플리케이션 영역은 Adapter 구현체를 직접 참조하지 않고 Port에 의존합니다.
- Adapter는 기술 접근을 담당하며 여러 외부 기능을 묶는 업무 흐름을 소유하지 않습니다.
- 도메인 간 공개 호출은 가능하지만 순환 의존은 만들지 않습니다.

예를 들어 주문 도메인은 인증 도메인의 공개 기능을 호출합니다.
인증 도메인 내부의 Vault, Keycloak Port나 Adapter를 직접 사용하지 않습니다.

## 애플리케이션 이름 선택

같은 애플리케이션 영역 안에서도 역할이 다르면 이름을 나눌 수 있습니다.
기본값은 Facade입니다.
이름만 보고 Facade를 Manager, Handler로 일괄 변경하지 않습니다.
실제 책임이 분명할 때만 바꿉니다.

| 이름 | 고를 때 | 이 레포·템플릿에서의 예 |
|---|---|---|
| Facade | 도메인 또는 BFF의 공개 진입점. Port 조합, DTO 교환, 유즈케이스 순서 | 원셋 `ExampleItemFacade`, 업무 BFF 진입점 |
| Manager | 토큰, 세션처럼 수명주기와 상태 갱신을 소유 | TokenManager |
| Checker | 통과 또는 거절만 담당하고 흐름을 소유하지 않음 | TokenChecker |
| Handler | 이벤트, 메시지, 단일 유스케이스 처리에 가깝을 때 | (필요 시) |
| Processor | 단계적 변환, 파이프라인 성격이 강할 때 | (필요 시) |

### 원셋 Facade와 BFF Facade

원셋(Controller와 Facade와 Port와 Adapter)은 기동, 동작 확인, 패턴 학습용 기본 골격입니다.
실무에서는 테이블 CRUD Controller보다 업무 치중 BFF Controller가 주로 쓰입니다.
원셋 Controller는 없어도 애플리케이션은 동작하지만, 최초 확인이 어려워 템플릿에 남겨 둡니다.

단순 원셋에서는 외부 계약과 Port DTO가 같거나 거의 같아 Port DTO를 그대로 써도 됩니다.
받는 인터페이스(와이어 DTO)와 Port DTO가 다르면 **유즈케이스 Facade**에서 교환합니다.
Adapter는 와이어 DTO를 몰라도 됩니다.

예를 들어 모바일 BFF가 `BookingRequest`(화면 필드명, 파트너 코드)를 받고, 예약 Port는 `ReservationCommand`(입주 단위 ID, 기간)만 받는다고 가정합니다.
Controller는 `BookingRequest`만 넘기고, Facade가 `ReservationCommand`로 바꾼 뒤 Port를 호출합니다.
응답도 Facade가 Port 결과를 BFF 응답 DTO로 맞춥니다.

## 애플리케이션이 맡을 수 있는 책임

한 요청이 아래를 모두 통과해야 하는 것은 아닙니다.

| 책임 | 하는 일 | 호출 |
|---|---|---|
| 테이블 기능 제공 | 한 데이터의 입구를 연다 | 해당 Port 하나 |
| 업무 조합 | 여러 Port를 한 유스케이스 순서로 묶는다 | 필요한 Port |
| 화면 / BFF | 클라이언트 계약에 맞게 결과를 조합하고 DTO를 교환한다 | 필요한 Port 또는 다른 공개 진입점 |
| 도메인 공개 경계 | 그 도메인 밖이 호출할 기능을 공개한다 | 도메인 안의 애플리케이션 구성 |

없는 계층을 사이에 넣지 않습니다.

## Port와 Adapter와 Provider

Port는 유스케이스가 필요한 기능을 요청하기 위한 내부 계약입니다.
인터페이스는 제품 이름보다 **필요한 능력**을 중심으로 정의합니다.

```text
애플리케이션 (Facade 등)
        ↓
Port                         ← 계약 (능력). Redis, Vault 이름을 붙이지 않는다
        ↓
Adapter                      ← Port 구현. 어떤 Provider를 쓸지 고른다
        ↓
Provider                     ← 제품·기술 접근 (Redis, Vault, JPA Repository 등)
```

Provider만 바꾸면 Port와 애플리케이션 코드는 그대로 둡니다.

| Port 예시 (능력) | Adapter | Provider 예 (교체 가능) |
|---|---|---|
| 데이터 접근 Port | ExampleItemAdapter | Read / Command Provider → Repository |
| CachePort | CacheAdapter | RedisProvider, 로컬 캐시 Provider |
| EncryptionPort | EncryptionAdapter | VaultProvider, KMS Provider |
| TokenPort / OAuthPort | TokenAdapter / OAuthAdapter | KeycloakProvider, 자체 JWT Provider, 기타 IdP Provider |
| MessagingPort | MessagingAdapter | KafkaProvider, RabbitMqProvider, RedisPubSubProvider, StompProvider, WebSocketProvider |
| 사용자 조회 Port | UserLookupAdapter | 로컬, REST, gRPC Provider |
| 계정 관리 Port | AccountAdapter | KeycloakProvider |

토큰 발급·검증, OAuth, 메시징도 제품명을 Port에 두지 않습니다.
`KeycloakPort`, `KafkaPort`가 아니라 `TokenPort`, `OAuthPort`, `MessagingPort`처럼 능력을 쓰고, Keycloak, Kafka, RabbitMQ, Redis, STOMP, WebSocket 등은 Provider로 둡니다.

암호화는 Port 이름을 `VaultPort`로 두지 않습니다.
능력은 암호화·복호화이므로 `EncryptionPort`(또는 프로젝트에서 쓰는 동등한 능력명)가 낫습니다.
Vault는 Provider입니다.

캐시도 같습니다.
`CachePort` → `CacheAdapter` → `RedisProvider`로 두고, Redis를 다른 캐시 구현으로 바꿀 때 Port는 유지합니다.
데이터 조회 Port를 캐시로 감싸는 경우에도 애플리케이션이 보는 계약은 Port이고, 캐시 적재·무효화는 Adapter와 Provider 쪽에 둡니다.

RestClient 구현체, JPA 구현체(과거 템플릿의 Service)도 Adapter입니다.
그 아래 HTTP 클라이언트나 Repository 접근을 Provider로 두면 같은 교체 규칙을 씁니다.

조회와 변경을 나눌 때의 **적용점은 JPA Adapter**입니다.
Adapter가 Read Provider와 Command Provider로 Repository를 나눕니다.
자세한 내용은 [CQRS](/docs/patterns/architecture-patterns/cqrs)와 [데이터 접근 경계](/docs/knowledge/backend/service/service-design)를 봅니다.

## 트랜잭션과 실패 정책

같은 프로세스에서는 공개 애플리케이션 진입점이 로컬 트랜잭션 범위를 정하고, JPA Adapter가 그 트랜잭션에 참여합니다.
다른 모듈 조회가 실패하면 전체 실패인지 일부 결과 반환인지는 애플리케이션이 정합니다.

원격으로 나눈 뒤의 여러 서비스 변경 완수는 Saga 대상입니다.
조회 조합에는 Saga를 쓰지 않습니다.
일반 설명은 [Saga 패턴](/docs/patterns/architecture-patterns/saga)을 봅니다.

## 예시: ID를 이름으로 변환하여 제공

```text
REST Controller 또는 수신 Adapter
              ↓
       주문 조회 Facade (애플리케이션 진입점)
         ├─ 주문 Port → JPA Adapter → 주문 정보와 고객 ID
         ├─ 고객 조회 Port → Adapter → 고객 이름
         └─ 마스킹 정책 → 권한에 맞는 결과
```

주문 Adapter는 고객 이름 조회 위치와 마스킹 정책을 알지 않습니다.

## 테스트 경계

애플리케이션 단위 테스트에서는 Port를 대체하여 조합, 마스킹, 실패 정책을 검증합니다.
JPA Adapter 검증은 Repository와 DB 접근을 대상으로 합니다.
Port 구현체(외부 HTTP 등)의 통합 테스트에서는 요청, 응답 변환과 통신 실패 처리를 검증합니다.

## Related

- [데이터 접근 경계 (Port와 Adapter)](/docs/knowledge/backend/service/service-design)
- [Controller Design](/docs/knowledge/backend/controller/controller-design)
- [CQRS](/docs/patterns/architecture-patterns/cqrs)
- [ADR-0010](/docs/decisions/adr-0010)
- 원셋 템플릿: `docs/harness/templates/backend/spring/`
