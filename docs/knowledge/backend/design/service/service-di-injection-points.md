---
id: service-di-injection-points
title: Service — 어디에 무엇을 주입하나
description: Facade·Adapter·Repository 주입 위치와 RequiredArgsConstructor final 필드 관례를 정리합니다.
tags:
  - backend
  - spring
  - di
status: active
slug: "/knowledge/backend/service/service-di-injection-points"
---

# Controller, Facade, Adapter에 각각 무엇을 주입할까

방문 예약 API를 추가할 때 한 메서드 안에서 요청 검사부터 Repository 호출까지 모두 처리할 수 있습니다.<br />
기능을 여러 경로에서 재사용하려면, 요청을 받는 코드와 예약 규칙을 판단하는 코드를 각자의 협력자와 연결합니다.

| 클래스 | 원셋에서 주입받는 협력자 | 맡는 일 |
|---|---|---|
| Controller | 도메인 Facade 또는 BFF Facade | HTTP 입력을 해석하고 응답 반환 |
| BFF Facade | 도메인이 공개한 Facade | 여러 공개 기능을 호출해 화면 결과 조립 |
| 도메인 Facade | 자기 Port, 필요할 때 DisplayNameResolver | 조건 검사와 업무 처리 순서 |
| JPA Adapter | Repository | 조건에 맞는 조회 실행과 결과 변환 |

```text
예약 Controller → 예약 Facade → 예약 Port
                                    ↑ 구현
                               JPA Adapter → Repository
```

세대 이름이 함께 필요한 화면은 세대 도메인의 공개 진입점을 호출해 조합할 수 있습니다.<br />
BFF가 예약 Repository에 직접 접근하면 예약 도메인이 사용하는 조회 범위나 정책을 건너뛸 수 있습니다.

테스트에서 무엇을 대체할지 결정할 때도 같은 화살표를 따릅니다.<br />
Facade에는 Port를, Controller에는 공개 Facade를 테스트 대역으로 넣습니다.
[Facade 공개 진입점](/docs/knowledge/backend/facade/facade-entry-and-naming) / [Port와 Adapter](/docs/knowledge/backend/service/service-port-adapter-role)
