---
id: persistence-vo-dto-entity
title: VO·DTO·Entity
description: "원셋 ExampleItem 검색으로 VO·DTO·엔티티·Port 결과 타입을 구분합니다. 표시 이름 조회와 화면별 Item 분리 기준을 이어서 봅니다."
keywords:
  - VO
  - DTO
  - Entity
  - Port 결과
tags:
  - backend
  - dto
status: active
slug: "/knowledge/backend/entity/persistence-vo-dto-entity"
---
# VO, DTO, 엔티티를 예약 한 건으로 구분하기

예약을 등록하는 API는 차량번호 문자열을 받습니다.<br />
업무 로직에서는 정규화 규칙을 가진 차량번호 값으로 다룰 수 있고, DB에 저장할 때는 다시 컬럼에 맞는 값이 필요합니다.<br />
모두 같은 번호를 담더라도 역할은 다릅니다.

| 타입 | 예약 예시에서 맡는 일 |
|---|---|
| HTTP 요청 DTO | 차량번호 문자열과 방문 시간 수신 |
| 값 객체 | 차량번호 형식과 정규화 규칙 표현 |
| 엔티티 | 예약의 ID와 저장할 상태를 관리 |
| Port의 결과 모델 | 저장 접근 경계에서 필요한 필드 반환 |
| 응답 Item | 목록이나 상세에 필요한 데이터를 조립해 제공 |

예전 프로젝트에서 VO를 단순한 값 묶음이나 조회 결과 이름으로 쓰기도 했습니다.<br />
도메인 설계에서 값 객체라고 하면 값 자체가 의미와 규칙을 가지는 타입을 가리킬 수 있으므로, 용어보다 해당 객체의 역할을 먼저 봅니다.

## 요청부터 응답까지, 실제 ExampleItem 원셋 따라가기

원셋은 HTTP 호출 이력을 `ExampleItem`으로 저장합니다.<br />
관리 화면에서 `GET` 호출만 검색하면, Controller는 요청값을 `ExampleItemReq.Filter`로 받고 Facade에 넘깁니다.<br />
Facade가 호출한 Port의 JPA 구현은 Filter를 Specification으로 바꿔 Repository를 조회합니다.

| 타입 | 원셋에서 맡는 역할 |
|---|---|
| `Name` | ID와 URL을 담아 표시 이름 목록에 사용 |
| `Single` | `Name`을 확장해 HTTP 메서드, 요청과 응답처럼 행에 있는 값 추가 |
| `Item` | `Single`을 확장한 공개 결과. 원셋에서는 목록과 단건에 같은 타입 사용 |

![원셋의 검색 입력과 조회 결과가 지나가는 경계](/img/backend-design/example-item-result-flow.svg)

Facade는 Adapter가 반환한 결과에서 생성자 ID를 모읍니다.<br />
원셋의 `DisplayNameResolver`는 숫자로 해석할 수 있는 ID를 대상으로 `Filter.ids`를 만들고 `findAllName`을 한 번 호출합니다.<br />
이 템플릿은 URL을 표시 이름으로 쓰는 예시입니다.<br />
실제 서비스에서 사용자 이름이 필요하면 같은 자리에 회원의 이름 조회를 연결합니다.

예를 들어 조회 결과 세 건의 생성자 값이 `["7", "7", "12"]`라면, 이름 조회에는 중복을 제거한 ID `[7, 12]`를 넘깁니다.<br />
그 결과를 ID로 찾을 수 있는 맵으로 만든 뒤 각 Item을 조립합니다.<br />
여기서 한 번이라는 것은 **이름 조회 Port 호출 횟수**입니다. 페이지 조회가 별도 count를 실행하는지와는 구분합니다.

템플릿의 `findAllName`은 엔티티를 조회한 뒤 `Name`으로 매핑합니다.<br />
`Name`을 반환한다는 사실만으로 SELECT 컬럼까지 줄어들지는 않습니다.<br />
표시 이름 조회의 SQL 비용이 중요하다면 실제 쿼리를 확인하고, ID와 이름만 선택하는 프로젝션을 검토합니다.
[Spring Data JPA 프로젝션](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html)

### 화면별 Item을 나누는 기준

원셋의 `Item`에는 화면별 연관을 미리 붙여 놓지 않았습니다.<br />
아래는 이 구조를 예약 화면에 적용하는 설명용 예제입니다.

| 요청 | 결과 타입 예시 | 추가로 읽는 값 |
|---|---|---|
| 예약 검색 | `ReservationListItem` | 조회 페이지에 포함된 세대의 표시 이름 |
| 예약 상세 | `ReservationDetailItem` | 선택한 예약의 출입 이력과 상세 정보 |
| 세대 선택 | `HouseholdName` | 세대 ID와 이름 |

목록과 상세의 필드가 같다면 타입 하나로 시작해도 됩니다.<br />
목록에서 사용하지 않는 연관을 상세만 읽기 시작하면 결과 타입과 조회 경로를 함께 나눕니다.<br />
테스트에서는 목록의 표시 이름이 맞는지와 함께 상세 전용 조회가 호출되지 않았는지도 확인합니다.

## 목록과 상세가 서로 다른 결과를 쓰는 경우

목록은 예약 ID와 시간만 반환할 수 있습니다.<br />
상세에서는 세대 표시 이름과 추가 이력이 필요할 수 있습니다.<br />
같은 JPA 엔티티를 쓰더라도 각 유즈케이스가 읽고 반환하는 형태는 다를 수 있습니다.

원셋은 Adapter에서 영속 모델을 필요한 결과로 바꾸고, 공개 Facade에서는 호출 목적에 맞는 Item을 조립합니다.<br />
HTTP나 GraphQL의 필드 이름이 달라지면 진입 경계에서 변환합니다.
[유즈케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto) / [Facade의 공개 진입점](/docs/knowledge/backend/facade/facade-entry-and-naming)
