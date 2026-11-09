---
id: service-design
title: 데이터 접근 경계 (Port와 Adapter)
description: Service Knowledge 허브입니다. Spring 서비스 빈과 Port·Adapter 구현의 이중 정체성, DI·TX 섹터로 이어집니다.
tags:
  - backend
  - service
  - port
  - adapter
status: active
slug: "/knowledge/backend/service/service-design"
---

# 데이터 접근 경계와 Spring 서비스 빈

예약 Facade를 열면 어떤 업무 흐름이 실행되는지 읽을 수 있어야 합니다.<br />
그 흐름이 필요로 하는 저장 기능은 Port에 표현하고, 실제 조회나 저장은 Adapter에서 처리합니다.

여기서는 이 구성 요소를 Spring 빈으로 연결하는 방법과 읽기, 쓰기의 트랜잭션 경계를 다룹니다.<br />
레거시 코드에서 저장을 감싸는 클래스 이름에 Service가 붙어 있다면 먼저 그 클래스가 어떤 책임을 맡는지 확인합니다.

## 하위 글

### 역할 (S0)

| 글 | 내용 |
|----|------|
| [Port와 Adapter 역할](/docs/knowledge/backend/service/service-port-adapter-role) | 계약·구현·레거시 이름 |
| [Provider와 CQRS](/docs/knowledge/backend/service/service-provider-and-cqrs) | 교체 가능한 Provider, CQRS 적용점 |

### 주입 발전사 (S1)

| 글 | 내용 |
|----|------|
| [스테레오타입과 스캔](/docs/knowledge/backend/service/service-stereotype-scan) | `@Service` 등 |
| [DI 발전사](/docs/knowledge/backend/service/service-di-evolution) | XML → Autowired → 생성자 → RequiredArgsConstructor |
| [XML·매퍼 주입](/docs/knowledge/backend/service/service-di-xml-and-mapper) | 옛 mapper·Repo 주입 |
| [생성자 주입이 기본인 이유](/docs/knowledge/backend/service/service-di-constructor-preferred) | final·테스트 |
| [어디에 무엇을 주입하나](/docs/knowledge/backend/service/service-di-injection-points) | Facade는 Port만 |

### 트랜잭션 (S2)

| 글 | 내용 |
|----|------|
| [Facade DB TX에 join](/docs/knowledge/backend/service/service-tx-join-facade) | Adapter `@Transactional` |

앱 동작 단위 정의는 [Facade — 앱 동작 단위](/docs/knowledge/backend/facade/facade-app-unit-and-transactions)입니다.

## 새 Adapter가 빈으로 등록되지 않을 때

유즈케이스가 Port만 참조하는데 Spring에서 구현을 찾지 못한다면 먼저 스캔과 빈 등록을 확인합니다.<br />
구현은 등록됐지만 일부 저장만 커밋된다면 트랜잭션 경계를 확인합니다.

| 증상 | 먼저 볼 글 |
|---|---|
| 구현 클래스는 있는데 빈이 없음 | [스테레오타입과 스캔](/docs/knowledge/backend/service/service-stereotype-scan) |
| Facade에 어떤 타입을 주입할지 모호함 | [주입 대상과 위치](/docs/knowledge/backend/service/service-di-injection-points) |
| 읽기는 되는데 쓰기가 예상과 다르게 반영됨 | [Adapter의 트랜잭션 참여](/docs/knowledge/backend/service/service-tx-join-facade) |

## 관련

- [애플리케이션 영역과 Facade](/docs/knowledge/backend/facade/facade-design)
- [CQRS](/docs/patterns/architecture-patterns/cqrs)
- 원셋: `docs/harness/templates/backend/spring/exampleitem/persistence/`
