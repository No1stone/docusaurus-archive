---
id: service-provider-and-cqrs
title: Service — Provider와 CQRS
description: "조회와 변경 구현을 Adapter·Provider로 나누는 이유를 설명합니다. 목록과 상세가 다른 로딩을 쓸 때 코드 수준 CQRS 자리를 둡니다."
keywords:
  - CQRS
  - Provider
  - 조회 Adapter
  - 변경 Adapter
tags:
  - backend
  - cqrs
  - port
status: active
slug: "/knowledge/backend/service/service-provider-and-cqrs"
---
# 조회 구현과 변경 구현을 따로 키우는 방법

예약 등록은 JPA로 충분하지만, 예약 조회 화면이 커지면서 여러 테이블의 집계를 같은 응답에 보여줘야 할 수 있습니다.<br />
이때 한 Port에서 출발한 조회와 변경 중 조회 쪽만 별도로 발전시킬 수 있습니다.

```text
예약 유즈케이스 → ReservationQueryPort   → 조회 구현
                → ReservationCommandPort → JPA 변경 구현
```

같은 DB를 사용하면서 Port만 나누는 것도 가능합니다.<br />
읽기 모델이나 데이터베이스를 실제로 분리할지는 쿼리 비용, 갱신 지연, 운영 요구를 보고 결정합니다.

## Provider가 들어가는 경우

Adapter가 Redis나 Vault처럼 기술별 호출을 여러 곳에서 재사용한다면, 연결과 직렬화의 일부를 Provider로 분리할 수 있습니다.<br />
예를 들어 캐시 Adapter는 어떤 키로 값을 저장하고 실패를 어떻게 표현할지 정하고, Redis Provider는 실제 Redis 명령을 수행합니다.

| 이름 | 이 예에서의 책임 |
|---|---|
| Port | 애플리케이션이 필요한 기능 표현 |
| Adapter | Port를 구현하고 입출력과 실패를 변환 |
| Provider | 내부에서 재사용할 기술별 호출 수행 |

기술 구현 자체가 Port를 만족한다면 별도 Provider를 만들 필요가 없습니다.<br />
조회 책임을 나눌 때도 파일 수보다 조회 구현을 독립적으로 바꿀 이유가 있는지 먼저 확인합니다.
[Port와 Adapter](/docs/knowledge/backend/service/service-port-adapter-role) / [CQRS 패턴](/docs/patterns/architecture-patterns/cqrs)

## 같은 데이터베이스를 쓰면서 조회 구현만 바꿀 때

월별 예약 통계 화면이 느려지면, 먼저 같은 DB에 집계 전용 조회를 붙일 수 있습니다.<br />
등록과 변경은 기존 JPA Adapter에서 처리하고, 통계 조회만 다른 메서드나 읽기 구현에서 수행합니다.

| 변경 범위 | 함께 정할 사항 |
|---|---|
| 같은 DB에서 조회 구현만 분리 | 결과 모델, 쿼리와 인덱스 |
| 읽기 테이블을 별도로 유지 | 갱신 시점과 갱신 실패 복구 |
| 별도 DB로 분리 | 동기화, 지연 허용 범위, 운영 책임 |

읽기와 쓰기를 나눌 수 있다는 설계와 읽기 데이터가 언제 최신이 되는지는 별도로 설명합니다.
