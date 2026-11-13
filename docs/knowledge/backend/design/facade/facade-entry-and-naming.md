---
id: facade-entry-and-naming
title: Facade — 진입과 이름
description: "관리 화면이 예약 도메인 Facade만 부르게 두는 이유를 설명합니다. 화면 조합·DTO 교환과 인프라 직접 호출을 구분합니다."
keywords:
  - Facade 진입점
  - 네이밍
  - 도메인 Facade
tags:
  - backend
  - facade
  - hexagonal
status: active
slug: "/knowledge/backend/facade/facade-entry-and-naming"
---
# 도메인 Facade를 공개 진입점으로 둔 이유

방문 예약 조회를 HTTP API와 관리자 화면에서 함께 쓴다고 가정합니다.<br />
HTTP API는 예약 목록을 반환하고, 관리자 화면은 그 목록과 세대 정보를 합쳐 보여줍니다.

두 호출부가 저장 Port를 직접 사용하면 예약 조회 정책과 결과를 만드는 방식이 호출부마다 달라질 수 있습니다.<br />
이 아카이브에서는 도메인이 공개한 Facade를 통해 같은 조회 동작을 호출합니다.

![관리자 화면에서 예약 도메인의 공개 진입점을 사용하는 흐름](/img/backend-design/domain-facade-entry.svg)

## 화면 조립과 예약 조회를 나눕니다

도메인 Facade는 예약 범위를 확인하고 필요한 Port를 호출합니다.<br />
REST Controller, gRPC 진입부, BFF는 그 공개 메서드를 호출할 수 있습니다.

BFF Facade는 여러 공개 메서드를 조합해 화면이 필요로 하는 결과를 만듭니다.<br />
예약 상태를 조회하는 요청과 세대 상세를 조회하는 요청을 묶을 수 있지만, 예약의 조회 조건은 예약 도메인이 관리합니다.

| 진입점 | 맡는 범위 | 원셋의 배치 |
|---|---|---|
| 도메인 Facade | 도메인의 유즈케이스와 정책 | 모노리포의 `model`, 단일 앱에서는 도메인 `facade/` |
| BFF Facade | 여러 공개 유즈케이스로 화면이나 시나리오 구성 | 모노리포의 `api`, 단일 앱에서는 BFF 기능 영역 |
| 저장 Port | 도메인 내부에서 요구하는 조회와 변경 기능 | 도메인의 영속성 영역 |

BFF에서 도메인의 저장 Port를 직접 호출하지 않으므로 예약 정책을 거치는 경로가 일정합니다.
[Facade의 작업 단위와 트랜잭션](/docs/knowledge/backend/facade/facade-app-unit-and-transactions)

## 화면에 필요한 정보만 결과로 돌려줍니다

예를 들어 예약 목록의 기본 결과에 `createdBy`가 있다면, 관리자 화면은 ID 대신 이름을 보여주고 싶을 수 있습니다.<br />
조회 결과에 있는 사용자 ID를 모아 `DisplayNameResolver`에 전달하면 이름을 한 번에 가져와 결과를 조립할 수 있습니다.

```text
예약 조회 결과 (예약 ID, 방문 시간, 생성자 ID)
    → 생성자 ID를 모아 표시 이름 조회
    → 예약 목록 Item에 표시 이름 추가
```

원셋의 `Item` 변형은 이처럼 유즈케이스에 필요한 데이터를 담습니다.<br />
조회 시 필요한 연관 정보만 읽으므로, 예약 목록을 반환하기 위해 모든 연관 엔티티를 읽을 필요가 줄어듭니다.

HTTP 요청과 도메인 호출에 쓰는 모델이 다르면 진입 경계에서 변환합니다.<br />
저장 Adapter는 HTTP의 필드 이름이나 응답 형식을 알 필요 없이 자신이 받은 입력을 저장소 호출에 사용합니다.
[유즈케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto)

## Facade라는 이름이 가리키는 책임

Facade는 호출부에 간단한 공개 인터페이스를 제공하는 GoF 구조 패턴에서 가져온 이름입니다.<br />
이 원셋의 도메인 Facade는 공개 진입점으로서 여러 내부 협력자를 조율하고, 헥사고날 아키텍처에서 말하는 애플리케이션 유즈케이스와 역할이 겹칩니다.

| 이름 | 맡은 일을 드러내는 경우 |
|---|---|
| Facade | 도메인이나 기능의 공개 진입점 |
| Manager | 상태나 수명주기 관리 |
| Checker | 조건을 확인하고 통과 여부 결정 |
| Handler, Processor | 이벤트 처리 또는 여러 단계를 거치는 처리 흐름 |
| Resolver | 식별자를 표시 이름 같은 값으로 해석 |

이름은 예시입니다.<br />
공개 여부는 호출부가 참조해도 되는 진입점인지, 어떤 책임을 갖는지로 판단합니다.
[공개 진입점에 대한 ADR](/docs/decisions/adr-0010) / [Spring 원셋](/docs/harness/templates/backend/spring/ONESET) / [Facade 설계](/docs/knowledge/backend/facade/facade-design)

## 같은 예약 조회를 REST와 화면에서 재사용하기

예를 들어 REST API는 특정 세대의 예약 목록을 반환하고, 관리자 화면은 같은 목록에 세대 표시 이름과 화면 전용 필드를 붙인다고 가정합니다.<br />
두 경로는 예약을 조회할 수 있는 범위를 같은 도메인 Facade에 맡깁니다.

```text
예약 REST API ────────────────→ 예약 도메인 Facade
관리자 화면 → 예약 화면 BFF ──→ 예약 도메인 Facade
                           └─→ 세대 도메인의 공개 조회
```

화면에서 표시 형식이 바뀌면 BFF와 화면 응답 타입을 확인합니다.<br />
예약 조회의 권한이 바뀌면 도메인 Facade의 정책과 두 호출부의 기대 결과를 확인합니다.<br />
새 호출부에서도 같은 공개 메서드를 사용할 수 있는지 보면 경계가 재사용되는지 판단하기 쉽습니다.
