---
sidebar_position: 5
title: 관계와 조회
description: DB 물리 FK 비사용, JPA 관계, Item DTO 확장을 정리합니다.
---

# 관계와 조회

> **필수 경계:** DB에는 참조 ID 컬럼만 두고 물리 FOREIGN KEY 제약은 사용하지 않습니다.
> **기본 관례:** JPA에는 필요한 Entity 관계를 둡니다. API는 `Item` DTO를 확장해 유스케이스별 데이터를 조립합니다.

| 영역 | 기준 | 강도 |
|------|------|------|
| DB | `{ref}_id` 저장, 물리 FK 없음 | 필수 경계 |
| JPA | `@ManyToOne` 등 필요한 매핑 | 기본 관례 |
| DTO | `Id` → `Name` → `Single` → `Item`, Web용으로 확장 | 기본 관례 |
| 애플리케이션 | 참조 검증, 연결·해제, 업무 정합성 | 필수 경계 |

온보딩처럼 매핑이 아직 없는 중간 상태는 [NULL과 UNIQUE](./null-unique)와 맞물립니다.

## 이상적 스케치 (Item 계층)

```text
ExampleThingRes
  Id
  Name
  Single     // 본 엔티티 스칼라 + farm_id 등
  Item       // 연관 객체는 여기만
  WebListItem extends Item
  WebDetail extends WebListItem
```

엔티티 그래프 전체를 응답에 실지 않습니다.
화면에 필요한 연관만 Facade에서 조회해 `Item`에 붙입니다.

기존 구현 설명: FarmPro `lib-model`의 `{Domain}Res` inner class, console BFF association 지침.
아카이브 ExampleItem은 영속 템플릿 중심이라 DTO 계층 예는 저장소 가이드를 링크합니다.

일반론: [기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations) (물리 FK 실습과 프로젝트 선택은 다릅니다. 프로젝트는 FK 제약을 쓰지 않습니다).
