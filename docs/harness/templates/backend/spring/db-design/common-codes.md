---
sidebar_position: 7
title: 공통코드
description: 원자성·업무성 코드, 자연키, parent–child, BizEnum 연동을 정리합니다.
---

# 공통코드

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

업무성 10자 논리 구성 예: `[TYPE 2][SCOPE 2][VALUE 6]` (저장소 공통코드 하네스와 동일 계열).

## 관리 테이블

| 테이블 | 역할 |
|--------|------|
| `co_common_code_type` | 코드 그룹 |
| `co_common_code` | 코드, 이름, 표시 순서, 상태, 설명 |
| `co_common_code_name` | 이름 확장(선택) |

type과 code 사이 물리 FK는 두지 않는 것이 프로젝트 기본입니다.

## 부모·자식 코드

> **기본 관례:** 조회 요구가 있는 업무 테이블에는 부모·자식 코드를 함께 저장합니다.
> 카탈로그(`co_common_code`)에도 parent–child를 같은 테이블에 둡니다(예: `external_code1`에 상위 코드).

- 부모 코드로 넓은 범위를 조회합니다.
- 자식 코드로 세부 대상을 조회합니다.
- 저장·변경 시 부모와 자식 조합을 검증합니다.
- 업무 `*_code`는 목록·필터 WHERE에 자주 쓰이므로 [인덱스](./indexes)와 맞물립니다.

활성 조회는 `status = 'A'`를 기본으로 합니다.

## 기존 구현 SSOT

FarmPro `be-v1` 지침(저장소 로컬):

- `docs/guidelines/development/common-code-system-harness.md`
- `docs/guidelines/development/biz-enum-pattern.md`
- `docs/guidelines/development/common-code-domain-catalog.md`

아카이브 템플릿: [enum README](/docs/harness/templates/backend/spring/enum/), [support](/docs/harness/templates/backend/spring/support/).

일반론(프로젝트 10자·자연키 규칙은 아님): [공통코드와 상태](/docs/knowledge/data/mysql/design/common-codes-and-status)
