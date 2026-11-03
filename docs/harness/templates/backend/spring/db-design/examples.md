---
sidebar_position: 14
title: 이상적 스케치 모음
description: 회원, 아웃박스, 통계, 공통코드, 스칼라 FK 등 반복 구조를 도메인명만 가린 스케치로 모읍니다.
---

# 이상적 스케치 모음

타입·길이는 예시입니다.
업무 요구에 맞게 바꾸되, **구조(역할)** 는 유지하는 것이 이 하네스의 기본입니다.
아래는 기존 서비스의 **사용 예제**(엔티티·DTO·네이밍)와 **공통코드 FM**을 **비식별**한 스케치입니다.
공통코드는 [공통코드](./common-codes) 원본 FM을 따릅니다. FarmPro 쪽은 파생·바이브 맞춤이라 비슷해 보여도 SSOT가 아닙니다.
FarmPro 슬롯 통계(`stat_*`) 등은 도메인 특성입니다.
제품명과 실식별자는 적지 않습니다.
파티션 RANGE DDL은 여기가 아니라 [파티셔닝](./partitioning)과 Partner Gateway 쪽 예를 봅니다.

## 회원형 마스터 (UpdatedEntity)

```text
me_example_account
  id                 -- 문자열 UUID 대리키 예 (앱 발급) 또는 Long
  login_password     -- SHA-512+salt 결과 (비밀번호 전용)
  login_password_salt_key
  email_sha          -- 개인정보 검색용 (비밀번호와 별개)
  email_salt
  email_aes
  status             -- A/D 논리 삭제
  created_at, created_by
  updated_at, updated_by, version
```

PII·비밀번호 분리는 [개인정보와 비밀번호](./pii-and-password)를 봅니다.

## 조직 소속 사용자 (이중 FK + PII SHA)

`UpdatedEntity`, 소프트 삭제(`A`/`D`), 참조는 DB FK 없이 ID만.
JPA에서는 스칼라 `org_id`와 `@ManyToOne`을 같은 컬럼에 둘 수 있습니다. → [관계와 조회](./relations-and-dto)

```text
pa_example_org_user
  id
  org_id             -- 스칼라 (+ 선택적으로 Org 연관)
  name_aes / name_sha
  mobile_aes / mobile_sha
  email_aes / email_sha
  cipher_key_id      -- 테이블별 암호키 레지스트리 참조(선택)
  status             -- A / D, delete()는 D로 전환
  created_at, created_by
  updated_at, updated_by, version
```

대응 DTO 사다리(비식별):

```text
OrgUserRes
  Id      { id }
  Name    extends Id { name }
  Single  extends Name { orgId, *Sha, status, audit… }
  Item    extends Single {
    org : OrgRes.Name                  // Facade가 orgId로 조회해 채움
  }
```

Facade에서 Item을 채우는 흐름: [유스케이스와 DTO](./usecase-dto)

## 창고형 행 (스칼라 FK만)

연관 그래프 없이 ID만 쌓는 경우입니다.

```text
wa_example_stock
  id
  branch_id
  device_id
  purchase_id
  collection_id
  status
  created_at, created_by
  updated_at, updated_by, version
  -- @ManyToOne 없음
```

## 공통코드 카탈로그 (자연키)

```text
co_common_code_type
  id                 -- 타입 자연키 (문자열)
  name, …
  status

co_common_code
  id                 -- 코드 자연키 (업무성이면 길이 관례 10)
  name
  common_code_type_id
  display_number
  external_code1..n  -- 상위·외부 코드 보관 등
  status             -- A / D
  description
  created_*, updated_*, version
```

→ [공통코드](./common-codes)

## 아웃박스형 (CreatedEntity, 원자 상태)

```text
ev_example_outbox
  id
  aggregate_id
  event_type         -- 업무에 따라 문자열 또는 짧은 코드
  payload_json
  process_status     -- 원자적 코드 예: READY, DONE, FAIL (단어로 완결)
  created_at, created_by
  -- updated_*, version 없음
```

보관은 이벤트성 정책(기본 3년 이하)을 따릅니다. → [삭제와 보관](./delete-retention)

## 이력·상태 로그 (CreatedEntity)

변경 스냅샷이나 상태 전이는 행을 추가만 합니다.

```text
de_example_asset_status
  id
  asset_id
  status_code        -- 업무 상태 (원자 또는 업무 코드)
  created_at, created_by
  -- updated_* / version 없음
```

```text
le_example_vendor_log
  id
  request_payload / response_payload
  created_at, created_by
```

대용량이면 파티션 후보입니다. → [파티셔닝](./partitioning)

## 통계형 (시간 버킷이 있을 때만)

`stat_*_at`은 **시간을 구간으로 뭉갤 때만** 씁니다.
FarmPro 슬롯 통계처럼 버킷이 많은 도메인에서만 자주 보이고, 그 외·일별 집계에는 보통 쓰지 않습니다.

```text
st_example_slot_daily          -- 슬롯 단위로 뭉개는 경우(드묾)
  id
  farm_id
  metric_code
  stat_10min_at                -- 버킷 시각 · 파티션·PK 구성
  measure_value
  created_at, created_by
  PRIMARY KEY (id, stat_10min_at)
```

일별 집계 테이블명 관례 예: `sa_daily_*` (저장소에 따라 접두만 다름).

## ExampleItem 템플릿

복사 가능한 영속 예: [exampleitem/persistence](/docs/harness/templates/backend/spring/exampleitem/persistence/) (`le_example_item`).
파티션·PII·아웃박스·공통코드는 위 스케치를 참고합니다.
