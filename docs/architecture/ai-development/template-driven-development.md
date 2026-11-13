---
id: architecture-template-driven-development
title: "Template-Driven Development"
description: "검증된 구현과 테스트를 원셋으로 묶어, AI가 새 기능을 같은 Controller, Port, Adapter 구조로 시작하게 하는 Template-Driven Development를 설명합니다."
keywords:
  - Template-Driven Development
  - oneset
  - harness engineering
  - Port and Adapter
  - AI coding
  - 원셋
sidebar_position: 2
slug: "/architecture/ai-development/template-driven-development"
---

# Template-Driven Development로 구현 시작하기

목록 API를 하나 추가할 때도 결정할 일이 많습니다.<br />
검색 조건은 어디서 받고, 조회 쿼리는 어디서 만들며, 페이지 응답은 어떤 형식으로 반환할까요?<br />
AI에게 매번 기능만 설명하면 같은 저장소에서도 비슷한 API가 서로 다른 구조로 만들어질 수 있습니다.

제 하네스에서는 **실제로 동작하는 코드와 테스트를 한 벌로 묶어 원셋**으로 둡니다.<br />
새 목록 API를 만들 때 AI는 요청 DTO가 검색 조건을 받는 방식, 유즈케이스가 조회 Port를 호출하는 방식, Adapter가 조건과 페이징을 적용하는 방식을 같은 예제에서 확인합니다.

## 새 기능에서 바뀌는 부분

예를 들어 회원 목록 원셋을 주문 목록에 적용하면 호출 흐름은 익숙합니다.<br />
Controller는 검색 조건을 받고, 유즈케이스는 조회 범위를 정하며, Adapter는 실제 쿼리를 실행합니다.<br />
주문에서 달라지는 것은 조회 권한, 검색 가능한 상태, 반환할 필드입니다.<br />
이 차이가 명확하면 리뷰에서도 주문에 필요한 동작이 제대로 반영됐는지 바로 볼 수 있습니다.

| 원셋에서 가져오는 것 | 기능에 맞춰 정하는 것 |
|---|---|
| 진입점에서 유즈케이스, Port, Adapter로 이어지는 호출 구조 | 조회 조건과 업무 규칙 |
| 성공 응답과 업무 오류를 처리하는 방식 | 반환할 필드와 호출자가 구분해야 할 오류 |
| 단위 테스트와 API 검증의 기본 구조 | 주문에만 해당하는 경계 조건과 실패 사례 |

## 원셋을 고르는 기준

기존 코드와 구조가 맞으면 원셋에서 시작합니다.<br />
화면에서 여러 공개 유즈케이스를 조합해야 할 때는 BFF 예제를 참고할 수 있고, 도메인 유즈케이스 하나로 처리할 수 있으면 Controller에서 바로 호출합니다.<br />
프로젝트마다 필요한 구성이 다르므로, 어떤 예제를 적용할지는 실제 요청 흐름을 보고 결정합니다.

새 기능을 만들며 같은 수정이 여러 번 반복되면 그때 원셋을 보강합니다.<br />
다음 작업에서는 그 결정을 다시 설명하는 대신, 갱신한 코드와 테스트를 함께 보여줄 수 있습니다.

## 관련

- [AI 개발 아키텍처](/docs/architecture/ai-development)
- [Harness Templates](/docs/harness/templates/)
- [Spring ONESET](/docs/harness/templates/backend/spring/ONESET)
- [Specification-Driven Development](/docs/architecture/ai-development/specification-driven-development)
