---
id: knowledge-backend-service
title: Service
description: "Port·Adapter·DI·트랜잭션 join 글을 모읍니다. Facade 아래 데이터·연동 경계가 어디에 남는지 역할별로 찾아갑니다."
slug: "/knowledge/backend/service/index"
---
# Service

> **개요:** 기존 Service로 부르던 데이터 접근 책임이 Port와 Adapter로 어떻게 이어지는지 정리합니다.
> 메뉴 경로와 slug는 하위 호환을 위해 유지합니다. 유스케이스는 Facade입니다.
> **하네스 필독 아님.** 구현은 원셋에 있습니다.

- [데이터 접근 경계 (Port와 Adapter)](/docs/knowledge/backend/service/service-design) — 허브. 필독 아님
  - [Port와 Adapter 역할](/docs/knowledge/backend/service/service-port-adapter-role)
  - [Provider와 CQRS](/docs/knowledge/backend/service/service-provider-and-cqrs)
  - [스테레오타입과 스캔](/docs/knowledge/backend/service/service-stereotype-scan)
  - [DI 발전사](/docs/knowledge/backend/service/service-di-evolution)
  - [XML·매퍼 주입](/docs/knowledge/backend/service/service-di-xml-and-mapper)
  - [생성자 주입이 기본인 이유](/docs/knowledge/backend/service/service-di-constructor-preferred)
  - [어디에 무엇을 주입하나](/docs/knowledge/backend/service/service-di-injection-points)
  - [Facade DB TX에 join](/docs/knowledge/backend/service/service-tx-join-facade)

원셋 코드 모양은 저장소 `docs/harness/templates/backend/spring/exampleitem/persistence/` 입니다.
