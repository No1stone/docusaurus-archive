---
sidebar_position: 5.5
title: 유스케이스와 DTO
description: Item 종류별로 나가는 연관이 다르고, 그에 맞춰 로딩·조립이 달라지는 사용 예를 정리합니다.
---

# 유스케이스와 DTO

> **기본 관례:** 응답은 `{Domain}Res`의 `Id` → `Name` → `Single` → `Item`(및 Item 변형) 사다리입니다.
> **기본 관례:** Spring 원셋에서 도메인 유스케이스 진입 이름은 **Facade**입니다. (라이트 헥사 UseCase와 같은 층, 이름만 다름)
> **핵심:** **어떤 Item을 내보내느냐에 따라** 붙는 연관과 로딩 범위가 달라집니다. 한 Item에 전 그래프를 몰아넣지 않습니다.
> ExampleItem **원셋 코드는 얇게** 둡니다. 아래는 원셋 밖 **확장 예**입니다.

물리 FK·JPA 매핑 스타일은 [관계와 조회](./relations-and-dto)에서 **열어 둔** 채입니다.
여기는 **Item 종류 → 나가는 필드 → 로딩/조립**만 고정합니다.

## 층과 반환 타입

| 층 | 하는 일 | 자주 쓰는 반환 |
|----|---------|----------------|
| Entity / 테이블 | `*_id` 스칼라, Audit, 코드 문자열 | — |
| Port·Adapter | 영속 조회·저장, 본 행 매핑 | `Single` 수준 스칼라 (연관은 비우거나 이 유스케이스에 맞게만) |
| DomainFacade (유스케이스) | **이 API가 약속한 Item**에 맞춰 연관만 로드·조립 | `Item` / `ItemFor…` / Web 확장 |
| BffFacade | 여러 DomainFacade 결과 조합 | 화면용 확장 |

생성·수정은 보통 `Res.Id`, 콤보는 `Res.Name`입니다.

## 목록 페이징 (PageQuery)

목록 Req의 `Filter`(또는 `WebListQuery`)는 [`PageQuery`](/docs/harness/templates/backend/spring/support/)를 확장합니다.

| 항목 | 값 |
|------|-----|
| 기본 size | 20 |
| 상한 | 100 (`MAX_SIZE`, 서버 `resolvedSize`로 clamp) |
| 기본 정렬 | 숫자 PK면 `id DESC` (`toPageable()`). 그 외는 Facade에서 `toPageable(Sort)` |

컨트롤러는 Spring `Pageable`을 따로 받지 않고 `filter.toPageable()`을 Facade에 넘깁니다.
원셋 목록 경로에 비제약 전체 조회를 두지 않습니다.
공통코드 인덱스 관례는 [인덱스](./indexes)를 봅니다.

## 사다리와 DB 대응

```text
테이블 행
  id, org_id, device_id, member_id, status, created_at, …

Res.Id / Name / Single     ← 본 행 스칼라 (orgId, deviceId …)
Res.Item 및 변형들          ← 유스케이스마다 다른 연관만 붙음
```

`Single`에 다른 도메인 객체 그래프를 넣지 않습니다.
연관은 **Item(또는 Item 변형·Web 확장)** 에만 둡니다.

---

## Item마다 나가는 연관이 다르다

같은 엔티티·같은 테이블이라도 **응답 Item 종류가 있으면 로딩 세트도 갈라집니다.**

```text
                    나가는 연관 (예)
Item                org: Name
ItemForList         org: Name                         (가벼움)
ItemForDetail       org: Name, device: Item, files[]  (무거움)
ItemForSafe         member: Item, device: Item, …     (마스킹·안전 조회용)
WebListItem         … + 화면 전용 필드
```

| 유스케이스 | 반환 타입 | 로드·조립하는 것 | 하지 않는 것 |
|------------|-----------|------------------|--------------|
| 목록·검색 | `Item` 또는 `ItemForList` | org Name 일괄 | device 상세, file 목록 |
| 상세 | `ItemForDetail` | org + device Item + 필요 file | 목록에 없는 관리자 전용 트리 |
| 안전·증명 | `ItemForSafe` | member·device 등 절차에 필요한 것만 | 전체 마스터 그래프 |
| 콤보 | `Name` | id·표시명만 | Item 연관 전부 |

**한 번에 전 연관을 읽어 두고 Item만 잘라 쓰지 않습니다.**
Item(변형)이 계약이고, Facade·쿼리는 그 계약을 채울 만큼만 움직입니다.

```text
search()  → Port 목록 매핑
         → orgIds만 모아 findAllName → setOrg
         → (device·member·file 호출 없음)

findOne() → Port 단건 매핑
         → org Name
         → deviceFacade.findOne (이 상세 Item에 device가 있을 때만)
         → fileFacade … (상세 Item에 files가 있을 때만)

findOneForSafe() → member + device + certificate file …
                 → 목록용 org Name만 있는 Item과 로딩 세트가 다름
```

이름이 `Item` 하나뿐이어도, **메서드마다 채우는 필드가 다르면** 사실상 다른 계약입니다.
그때는 `ItemForList` / `ItemForDetail`처럼 타입을 나누는 편이 안전합니다.

---

## 로딩 수단은 열려 있다 (같은 개념)

연관 **범위**는 Item이 정하고, **어떻게 가져올지**는 열려 있습니다. → [관계와 조회](./relations-and-dto)

| 수단 | Item에 맞춘 로딩 |
|------|------------------|
| 스칼라 FK + Facade | 그 Item에 필요한 도메인만 `findAllName` / `findOne` |
| JPA `@ManyToOne` 등 | 그 유스케이스 쿼리만 join·entity graph·배치 로딩. 다른 Item용 연관은 건드리지 않음 |
| 혼합 | 목록은 스칼라+Name, 상세만 일부 연관 fetch |

공통점: **Item에 없는 연관은 로드하지 않는다.**

```text
목록 ItemForList
  JPA를 쓰더라도 device·files는 LAZY로 두지 말고, 애초에 select/join에 넣지 않음
  또는 스칼라만 읽고 Facade도 org만 호출

상세 ItemForDetail
  device가 계약에 있으면 그때 fetch join 또는 deviceFacade.findOne
```

---

## 사용 예 0 — Item에 Name만 붙이기

```text
AssetRes.Item extends Single {
  org : OrgRes.Name
}

Facade.search
  port → Items (org=null)
  orgIds → findAllName → setOrg
  // device·member 미호출
```

## 사용 예 1 — 목록 Item vs 상세 Item

```text
AssetRes.ItemForList extends Single {
  org : OrgRes.Name
}

AssetRes.ItemForDetail extends ItemForList {
  device : DeviceRes.Item      // 목록 Item에는 없음
  files  : List<FileRes.Name>
}
```

```text
search()    → ItemForList 만 채움 (org)
findOne()   → ItemForDetail (org + device + files)
```

## 사용 예 2 — 절차용 Item (다른 로딩 세트)

```text
RetirementRes.ItemForSafe extends Single {
  member : MemberRes.Item
  device : DeviceRes.Item
  certificateFile : FileRes.Item
  // 목록용 org Name만 있는 Item과 필드·로딩이 다름
}

Facade.findOneForSafe(id)
  retirement 스칼라
  + memberFacade.findOne
  + deviceFacade.findOne
  + fileFacade.findOne
  // 목록 search용 org Name 일괄과 경로가 다름
```

## 사용 예 3 — 요청 DTO

```text
AssetReq.Filter / Create / Update
```

Facade 수정 시그니처 관례: `(id, update)`.
관리 화면 전용은 `*ForManage` 접미로 구분해도 됩니다.

## 한눈에

| 질문 | 답 |
|------|----|
| 연관을 어디에 두나? | `Item` 및 Item 변형만 |
| 무엇을 로드하나? | **그 응답 Item에 선언된 것만** |
| 목록과 상세가 다르면? | Item 타입(또는 메서드 계약)을 나누고 로딩도 나눈다 |
| JPA vs Facade 조립? | 열려 있음. 범위만 Item을 따른다 |
| 원셋 ExampleItem? | 얇은 `Item` + 표시명 문자열. 확장은 이 문서 |

## 라이트 헥사와의 이름만 다른 점

| 라이트 헥사 | Spring 원셋 |
|-------------|-------------|
| UseCase | DomainFacade |
| Outbound Port | `*Port` + Adapter |
| DTO / View model | `{Domain}Req` / `{Domain}Res` 사다리·Item 변형 |

폴더·원셋: [ONESET](/docs/harness/templates/backend/spring/ONESET), [exampleitem](/docs/harness/templates/backend/spring/exampleitem/).
테이블 스케치: [이상적 스케치 모음](./examples).
