---
id: adr-0010
title: 애플리케이션, Port, Adapter로 계층 이름을 정리한다
description: 계층은 접미사가 아니라 책임으로 구분하고, 기존 Service 데이터 접근을 Port와 Adapter로 표현한다
tags:
  - adr
  - architecture
  - naming
  - harness
status: accepted
slug: "/decisions/adr-0010"
---
# 애플리케이션, Port, Adapter로 계층 이름을 정리한다

기존 문서와 템플릿은 Controller, Facade, Service, Repository 흐름을 기본으로 두었다.
여기서 Service는 업계에서 말하는 업무 서비스와 달리, 실제로는 JPA 조회와 저장에 가깝게 쓰였다.
이름이 역할과 어긋나 애플리케이션에 무엇을 둘지, Service에 무엇을 둘지 혼동이 반복되었다.

## 결정

계층은 클래스 접미사가 아니라 패키지, 책임, 의존 관계로 구분한다.

- 애플리케이션 영역: 유스케이스, 정책, 조합. 공개 진입점의 **기본 이름은 Facade**이며 Manager, Checker, Handler, Processor, Resolver 등은 **역할이 분명할 때만** 쓴다. 예시는 닫힌 허용 목록이 아니다.
- BFF 조립은 도메인 진입과 위치를 가르고, **도메인 애플리케이션 진입만** 호출한다. DomainPort를 직접 보지 않는다. 이름이 BFF임이 드러나게 둘 수 있다(기본 예 `{Feature}BffFacade`. 호스트 기존명 유지 가능).
- 모노리포에서 도메인 진입과 `DisplayNameResolver`는 model, BFF 진입과 Controller·GraphQL·gRPC는 api에 둔다.
- 진입 매핑: gRPC·HTTP 도메인 → 도메인 애플리케이션 진입, GraphQL·HTTP BFF → BFF 애플리케이션 진입 → 도메인 진입.
- Port: 저장과 외부 기능의 **능력** 계약. 제품명(Redis, Vault, Keycloak, Kafka)을 Port에 붙이지 않는다. 예: `CachePort`, `EncryptionPort`, `TokenPort`, `OAuthPort`, `MessagingPort`, `LockPort`. Port는 도메인 진입만 호출한다. BFF 전용 Port를 만들지 않는다.
- Adapter: Port 구현. Provider를 고르고 기술 응답을 계약으로 변환한다.
- Provider: Redis, Vault, KMS, Keycloak, 자체 JWT, Kafka, RabbitMQ, Redisson, STOMP, WebSocket, JPA Repository 등 제품·기술 접근. Provider 교체만으로 Port와 애플리케이션을 유지한다.
- 기존 `*Service`(JPA)는 Adapter 역할로 이해하고, 신규 템플릿은 Port와 JPA Adapter로 보여 준다.
- 코드 수준 CQRS 적용점은 JPA Adapter이다. 필요할 때 Read Provider와 Command Provider로 Repository를 나누며, 처음부터 강제하지 않는다.
- 원셋 Controller는 기동과 확인용으로 유지하고, 실무 진입의 전형은 업무 BFF(Controller 또는 GraphQL)로 설명한다.

문서와 Spring 원셋 템플릿에 반영한다.
참조 저장소의 기존 코드는 이 ADR만으로 일괄 개명하지 않는다.

## 결과

- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [데이터 접근 경계](/docs/knowledge/backend/service/service-design)
- [coding-conventions](/docs/harness/context/coding-conventions)
- Spring 원셋: `Controller → 도메인 진입(예: Facade) → Port → Adapter → Repository` (모노리포에서 도메인 진입은 model)
- BFF: `GraphQL/HTTP BFF → BFF 애플리케이션 진입 → 도메인 애플리케이션 진입…`
- 확장: `Port → Adapter → Provider` (캐시, 암호화, Token/OAuth, Lock, Messaging 포함)
