---
sidebar_position: 7
title: 공통코드
description: 공통코드 FM — 원자성·업무성, 자연키, parent–child, BizEnum 연동.
---

# 공통코드

> **이 문서가 FM입니다.** 아래 테이블·자연키·BizEnum 형태가 프로젝트 공통코드의 **원본** 기준입니다.
> 기존 서비스 구현을 비식별해 옮긴 것입니다.
> FarmPro 공통코드는 이 원본을 보고 맞춘 **파생**이라 겉모습이 비슷해 헷갈릴 수 있으나, SSOT는 원본(이 문서)입니다.

> **필수 경계:** 공통코드 type·code는 자연키입니다. 그룹은 `common_code_type_id`로만 식별합니다.
> **필수 경계:** 코드 문자열 접두사로 그룹을 추정하지 않습니다.
> DB에는 문자열을 저장하고, Java에서는 `@BizEnum`·`CodeValue`로 다룹니다.

## 코드 성격

| 코드 성격 | 표현 기준 | 강도 |
|-----------|-----------|------|
| 업무성 코드 | 업무 범주·하위 도메인을 조합한 10자리 코드 | 필수 경계(업무성) |
| 원자적 코드 | 단어나 짧은 값으로 의미가 완결되면 길이 예외 | 상황별 선택 |
| 원자적 코드 예 | `Y`/`N`, `A`/`D`, 이벤트 처리 상태 단어 | — |

원자적 코드는 특정 도메인에 한정하지 않습니다.
Outbox 등에서도 단어 하나로 의미가 명확한 상태는 원자적 코드로 둘 수 있습니다.

업무성 10자 논리 구성 예: `[TYPE 2][SCOPE 2][VALUE 6]`.

## 관리 테이블 (FM)

| 테이블 | 역할 | id 형태(관례) |
|--------|------|----------------|
| `co_common_code_type` | 코드 그룹 | 문자열 자연키 (길이 여유, 예: 32) |
| `co_common_code` | 코드, 이름, 표시 순서, 상태, 설명 | 코드 문자열 자연키 (업무성 10) |
| `co_common_code_name` | 이름 확장(선택) | 보통 `common_code_id` |

type과 code 사이 물리 FK는 두지 않습니다.
JPA에서는 type id 스칼라와 `@ManyToOne`을 같은 컬럼에 이중으로 둘 수 있습니다.
→ [관계와 조회](./relations-and-dto)

```text
co_common_code_type
  id                   -- 타입 자연키
  name, …
  status               -- A / D
  audit (UpdatedEntity)

co_common_code
  id                   -- PK = 코드 문자열 (업무성이면 길이 10)
  name
  common_code_type_id  -- 그룹 자연키 참조 (물리 FK 없음)
  display_number
  external_code1..n    -- 상위·외부 코드 등
  status               -- A / D (원자적)
  description
  audit (UpdatedEntity)
```

업무 테이블의 코드 컬럼은 `*_code`, 길이 관례 10입니다.

Java에서는 `@BizEnum` + `CodeValue`로 다루고, DB에는 **코드 문자열**을 저장합니다(ordinal 금지).
소프트 비활성은 `status = 'D'`이며, 물리 삭제 어노테이션에 의존하지 않습니다.
활성 조회는 `status = 'A'`를 기본으로 합니다.

## 부모·자식 코드

> **기본 관례:** 조회 요구가 있는 업무 테이블에는 부모·자식 코드를 함께 저장합니다.
> 카탈로그(`co_common_code`)에도 parent–child를 같은 테이블에 둡니다(예: `external_code1`에 상위 코드).

- 부모 코드로 넓은 범위를 조회합니다.
- 자식 코드로 세부 대상을 조회합니다.
- 저장·변경 시 부모와 자식 조합을 검증합니다.
- 업무 `*_code`는 목록·필터 WHERE에 자주 쓰이므로 [인덱스](./indexes)와 맞물립니다.

## 구현 템플릿

아카이브: [enum README](/docs/harness/templates/backend/spring/enum/), [support](/docs/harness/templates/backend/spring/support/).

일반론(프로젝트 10자·자연키 FM은 아님): [공통코드와 상태](/docs/knowledge/data/mysql/design/common-codes-and-status)
