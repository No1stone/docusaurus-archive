---
sidebar_position: 14
title: 이상적 스케치 모음
description: 회원, 아웃박스, 통계 등 반복되는 테이블 구조를 도메인명만 가린 스케치로 모읍니다.
---

# 이상적 스케치 모음

타입·길이는 예시입니다.
업무 요구에 맞게 바꾸되, **구조(역할)** 는 유지하는 것이 이 하네스의 기본입니다.

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

## 통계형 (필수 구조)

```text
st_example_slot_daily
  id
  farm_id
  metric_code        -- 업무 공통코드면 10자 관례
  stat_10min_at      -- 파티션 키 · PK 구성
  measure_value
  created_at, created_by
  PRIMARY KEY (id, stat_10min_at)
```

→ [파티셔닝](./partitioning)

## ExampleItem 템플릿

복사 가능한 영속 예: [exampleitem/persistence](/docs/harness/templates/backend/spring/exampleitem/persistence/) (`le_example_item`).
파티션·PII·아웃박스는 위 스케치를 참고합니다.
