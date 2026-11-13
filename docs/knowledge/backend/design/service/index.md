---
id: knowledge-backend-service
title: Service
description: "Port·Adapter와 DI·트랜잭션 문제를 증상별로 어느 Service Knowledge 글에서 보면 되는지 안내합니다."
keywords:
  - Port
  - Adapter
  - DI
  - Service Knowledge
slug: "/knowledge/backend/service/index"
---
# Service

예약 Facade를 열면 업무 흐름이 보여야 하고, 저장이 필요하면 Port로 표현합니다.<br />
레거시에서 `Service`라는 이름이 붙은 클래스가 있다면, 이름보다 실제 책임이 Port인지 Adapter인지 먼저 봅니다.

**하네스 필독이 아닙니다.** 허브는 [데이터 접근 경계](/docs/knowledge/backend/service/service-design)입니다.

| 지금 겪는 문제 | 읽을 글 |
|---|---|
| Port와 Adapter 역할·Partner Gateway 사례 | [Port와 Adapter 역할](/docs/knowledge/backend/service/service-port-adapter-role) |
| 읽기·쓰기 Port를 나눌지 고민 | [Provider와 CQRS](/docs/knowledge/backend/service/service-provider-and-cqrs) |
| 구현 클래스는 있는데 빈이 없음 | [스테레오타입과 스캔](/docs/knowledge/backend/service/service-stereotype-scan) |
| 생성자 주입·테스트 대역이 안 맞음 | [생성자 주입](/docs/knowledge/backend/service/service-di-constructor-preferred), [주입 위치](/docs/knowledge/backend/service/service-di-injection-points) |
| Adapter 쓰기가 Facade TX에 안 묶임 | [Facade DB TX에 join](/docs/knowledge/backend/service/service-tx-join-facade) |

원셋: `docs/harness/templates/backend/spring/exampleitem/persistence/`
