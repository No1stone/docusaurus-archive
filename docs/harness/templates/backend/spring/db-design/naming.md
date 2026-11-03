---
sidebar_position: 2
title: 테이블·컬럼 네이밍
description: 도메인 접두사 필수, 성격 접미사, snake_case 컬럼 규칙을 정리합니다.
---

# 테이블·컬럼 네이밍

> **필수 경계:** 테이블명에 도메인 접두사를 둡니다.
> **기본 관례:** 컬럼은 snake_case입니다. 접미사로 이력·통계 성격을 드러냅니다.

이름순 정렬만으로 같은 도메인 테이블이 모이도록 구성합니다.

```text
도메인접두사_대상명_성격접미사
```

사용 예제와 접두·접미사 목록의 근거는 기존 서비스 구현을 비식별한 것입니다.
파티션 DDL 예는 이 문서가 아니라 [파티셔닝](./partitioning), [파티션 운영](./partition-ops)과 Partner Gateway에서 정리한 쪽을 봅니다.

접두 목록·통계 접두(`st_` / `sa_daily_*` 등)·단수 테이블명은 **저장소별로 열고**, 이 하네스는 “도메인 접두 필수 + 성격 접미사 + snake_case”만 고정합니다.
대상 저장소에 카탈로그가 있으면 그쪽이 우선합니다.
인덱스·UNIQUE(이름·컬럼 조합·부여 여부)는 **화면·트랜잭션 요구에 따라 연다**. 전 테이블 일괄 규칙은 두지 않습니다. → [NULL과 UNIQUE](./null-unique), [인덱스](./indexes)

| 구분 | 기준 | 강도 |
|------|------|------|
| 접두사 | 도메인 구분 (보통 영문 2자 + `_`) | 필수 경계 |
| 대상명 | 저장하는 업무 대상 (단수 관례가 흔함) | 기본 관례 |
| 접미사 | `history`, `log`, `status`, `statistics`, `daily` 등 성격·집계 단위 | 기본 관례 |
| 컬럼명 | snake_case (`farm_id`, `created_at`) | 기본 관례 |
| 시각 컬럼 | 시점·타임스탬프는 `*_at` (`created_at`, `scheduled_at`) | 기본 관례 |
| 타입·길이·기본값 | 도메인 요구와 기존 예제 | 상황별 선택 |

## 접두사 카탈로그 (기존 구현 비식별)

프로젝트마다 도메인 약어는 달라질 수 있습니다.
새 도메인을 열 때는 **접두사를 먼저 정하고** 테이블에 붙입니다.

| 접두 | 역할(비식별) | 테이블 예 |
|------|--------------|-----------|
| `co_` | 공통, 코드, 암호키 | `co_common_code`, `co_cipher_key` |
| `me_` | 회원 | `me_member` |
| `pa_` | 파트너, 조직 | `pa_partner` |
| `de_` | 디바이스, 자산 | `de_device` |
| `wa_` | 창고, 재고 | `wa_inventory` |
| `at_` | 단말, ATM형 | `at_atm` |
| `ad_` | 관리자 | `ad_administrator` |
| `cu_` | 고객 | `cu_marketing_agreement` |
| `in_` | 검수, 점검 | `in_inspection` |
| `pu_` | 매입, 구매 | `pu_purchase` |
| `re_` | 리퍼, 정책 | `re_refurbish_policy` |
| `le_` | 레거시, 외부 연동 | `le_*_log` |
| `sa_` | 매출 **또는** 일별 통계·정산 (한 접두에 두 성격) | `sa_sales`, `sa_daily_*_statistics` |
| `fa_`, `st_`, `pn_` 등 | FarmPro형 농장·통계·파트너 접두 | 대상 저장소 규칙 우선 |
| `s3_`, `QRTZ_` | 인프라·스케줄러 예외 | `s3_log`, `QRTZ_*` |

FarmPro 하네스를 따를 때는 농장 도메인 접두(`fa_` 등)를 저장소 규칙에 맞게 씁니다.
위 표는 **접두를 빠뜨리지 않는 습관**과 성격 접미사 패턴을 옮기기 위한 참고입니다.

## 접미사·중간 토큰

| 패턴 | 역할 | 예 |
|------|------|----|
| `_log` | 외부·연동·요청 로그 | `le_example_vendor_log` |
| `_history` | 변경 이력 | `*_changed_history`, `*_login_history` |
| `_status` | 상태 전이 행 또는 상태 자식 | `de_example_asset_status` |
| `_statistics` | 집계 | `sa_daily_*_statistics` |
| `_settlement` | 정산 추출 | `sa_daily_*_settlement` |
| `_daily_` (중간) | 일 단위 배치 테이블 | `sa_daily_*` |
| `_file` | 첨부 자식 | `*_file` |
| `_queue` | 작업 큐 | `*_request_queue` |

벌크·쿼리 중심 테이블(`_log`, `_history`, `_statistics`, 일부 `_status`)에는 [Audit](./audit)에서 `CreatedEntity`만 쓰는 것을 **앞으로의 규칙**으로 둡니다.
기존 코드에 `UpdatedEntity` drift가 있을 수 있습니다. → [후속 작업](./follow-ups)

## 컬럼 관례 (기존 구현 비식별)

| 계열 | 관례 |
|------|------|
| 참조 | `{대상}_id` (`device_id`, `org_id`) |
| 공통코드 값 | `*_code`, 길이 관례 10 (업무성) |
| 예/아니오 | `*_yn`, `CHAR(1)` (`Y`/`N`) |
| 소프트 상태 | `status`, `CHAR(1)` (`A`/`D` 등). 다값 업무 상태는 도메인 enum·코드 |
| 시각 | **`*_at`**. Audit·업무 시점·예약 시각 |
| 통계 버킷 시각 | `stat_*_at` — **시간을 구간으로 뭉갤 때만**. 일반·다른 서비스에서는 거의 안 씀. FarmPro만 슬롯 통계가 많아 자주 보임 |
| PII 검색 | `*_sha` (암호문 컬럼과 쌍) |
| 암호키 | `cipher_key_id` → `co_cipher_key` |
| Audit | `created_at`, `created_by` (± `updated_at`, `updated_by`, `version`) |

기존 배치·정산 스키마에는 `purchase_date`, `statistics_date`처럼 `*_date`가 남아 있는 경우가 있습니다.
달력일·외부 파일 컬럼 잔재로 보고, **앞으로의 규칙**은 시점을 `*_at`(필요하면 `DATE` 타입이어도 이름만 `*_at`)으로 맞춥니다.

인덱스를 둘 때 이름 형태 예는 `ix_{table}_{columns…}`입니다.
`uk_` 등도 저장소 관례에 맡기고, 필수 접두로 고정하지 않습니다.

템플릿 맛보기: ExampleItem 테이블명 `le_example_item`, 인덱스 `ix_le_example_item_…` ([persistence](/docs/harness/templates/backend/spring/exampleitem/persistence/)).

일반론: [MySQL 테이블 설계](/docs/knowledge/data/mysql/design/keys-and-relations) (프로젝트 접두사 규칙은 이 하네스에만 둡니다).
