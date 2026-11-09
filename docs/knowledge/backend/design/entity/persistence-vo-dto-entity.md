---
id: persistence-vo-dto-entity
title: VO·DTO·Entity
description: VO DTO Entity Port DTO 용어를 구분하고 Facade 연관 끊기와 맞춥니다.
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

## 목록과 상세가 서로 다른 결과를 쓰는 경우

목록은 예약 ID와 시간만 반환할 수 있습니다.<br />
상세에서는 세대 표시 이름과 추가 이력이 필요할 수 있습니다.<br />
같은 JPA 엔티티를 쓰더라도 각 유즈케이스가 읽고 반환하는 형태는 다를 수 있습니다.

원셋은 Adapter에서 영속 모델을 필요한 결과로 바꾸고, 공개 Facade에서는 호출 목적에 맞는 Item을 조립합니다.<br />
HTTP나 GraphQL의 필드 이름이 달라지면 진입 경계에서 변환합니다.
[유즈케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto) / [Facade의 공개 진입점](/docs/knowledge/backend/facade/facade-entry-and-naming)
