---
sidebar_position: 5
title: 관계와 조회
description: DB 물리 FK 비사용, JPA FK 매핑 선택, Item DTO 확장을 정리합니다.
---

# 관계와 조회

> **필수 경계:** DB에는 참조 ID 컬럼만 두고 물리 FOREIGN KEY 제약은 사용하지 않습니다.
> **기본 관례:** API는 `Id` → `Name` → `Single` → `Item` DTO로 유스케이스별 데이터를 조립합니다.
> **열림:** JPA 연관 매핑(스칼라만 / 이중 / 연관 중심)은 화면·트랜잭션·조회 패턴에 맡기고 한 가지로 고정하지 않습니다.

| 영역 | 기준 | 강도 |
|------|------|------|
| DB | `{ref}_id` 저장, 물리 FK 없음 | 필수 경계 |
| JPA | 매핑 스타일 열림 (아래 참고) | 상황별 선택 |
| DTO | `Id` → `Name` → `Single` → `Item`, Web용으로 확장 | 기본 관례 |
| 애플리케이션 | 참조 검증, 연결·해제, 업무 정합성 | 필수 경계 |

온보딩처럼 매핑이 아직 없는 중간 상태는 [NULL과 UNIQUE](./null-unique)와 맞물립니다.

## JPA 매핑 (열림)

`@ManyToOne`을 기본값으로 두지 않습니다.
아래는 **가능한 형태**일 뿐, 저장소·유스케이스마다 열고 고릅니다.

| 스타일 | 참고(강제 아님) | 스케치 |
|--------|-----------------|--------|
| 스칼라 FK만 | ID만으로 충분할 때 | `branch_id`, `device_id`, `purchase_id` 컬럼만 |
| 스칼라 + 연관 이중 | ID와 연관 로드를 같이 쓸 때 | 스칼라 `insertable=false, updatable=false` + `@ManyToOne` `@JoinColumn` |
| 연관 중심 | 컬렉션·활성 자식 필터 등이 엔티티에 붙을 때 | `@OneToMany` + 활성만 보는 제한(`status = 'A'`) 등 |

이중 매핑 스케치(비식별):

```text
org_user
  org_id          -- 컬럼 (스칼라, insertable/updatable false 가능)
  @ManyToOne LAZY
    @JoinColumn(org_id)
    Org org
```

스칼라만 스케치(비식별):

```text
wa_stock_item
  branch_id
  device_id
  purchase_id
  -- @ManyToOne 없음. 필요 시 Repository·Facade에서 ID로 조회
```

## 이상적 스케치 (Item 계층)

```text
ExampleThingRes
  Id
  Name
  Single     // 본 엔티티 스칼라 + farm_id, org_id 등
  Item       // 연관 객체는 여기만
  WebListItem extends Item
  WebDetail extends WebListItem
```

엔티티 그래프 전체를 응답에 실지 않습니다.
`Single`까지는 본 행 스칼라이고, 연관은 `Item`(변형)에만 둡니다.

**Item 종류마다 나가는 연관·로딩 범위가 다릅니다.**
목록 Item과 상세 Item이 다르면 JPA fetch든 Facade 조립이든 **그 Item에 있는 것만** 로드합니다.
표현·사용 예: [유스케이스와 DTO](./usecase-dto)

원셋 ExampleItem `Item`은 얇게 유지하고, 확장은 위 링크로 갑니다.

일반론: [기본키와 관계 설계](/docs/knowledge/data/mysql/design/keys-and-relations) (물리 FK 실습과 프로젝트 선택은 다릅니다. 프로젝트는 FK 제약을 쓰지 않습니다).
