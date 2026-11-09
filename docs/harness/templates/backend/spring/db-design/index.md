---
sidebar_position: 1
title: 프로젝트 DB 설계 하네스
description: FarmPro형 프로젝트의 테이블 설계 선택 기준, 예외, 예제를 정리합니다. 일반 MySQL·JPA 기술 글과 구분합니다.
---

# 프로젝트 DB 설계 하네스

> **개요:** 이 프로젝트(FarmPro 계열)에서 테이블을 설계할 때 따르는 선택 기준과 예외, 이상적 스케치를 둡니다.
> MySQL·MariaDB·JPA의 일반 기술 설명은 Knowledge 글을 보고, 여기는 프로젝트 규칙만 적습니다.
> 대상 저장소 규칙이 이 안내보다 우선합니다.
>
> **예제 출처:** 네이밍·JPA/DTO 사용 예는 기존 서비스 구현을 비식별해 옮깁니다.
> **공통코드 FM**은 [공통코드](./common-codes)입니다. 기존 서비스가 원본이고, FarmPro는 그걸 보고 맞춘 파생입니다.
> 파티션 DDL·운영 예는 Partner Gateway에서 정리한 흐름을 따릅니다.

## 이 문서가 하는 일

프로젝트 DB 설계의 **필수 경계**, **기본 관례**, **상황별 선택**을 나눕니다.
예제의 타입, 길이, 기술을 유일한 허용 방식으로 고정하지 않습니다.
다른 선택을 할 때는 업무 요구와 선택 이유를 함께 적습니다.

## 문서 층

| 층 | 역할 |
|----|------|
| [하네스 Database 입구](/docs/harness/database/) | AI 나침반, 링크 |
| 이 하네스 (db-design) | 프로젝트 선택 기준, 예외, 스케치 |
| [Knowledge MySQL 테이블 설계](/docs/knowledge/data/mysql/design/keys-and-relations) 등 | 제품·SQL 일반론 |
| 대상 저장소 코드 | 기존 구현 근거 |
| [PageQuery](/docs/harness/templates/backend/spring/support/) | 목록 기본 size 20, 상한 100 |

## 본문에서 구분하는 세 가지

1. **기존 구현 설명** — 지금 코드·운영에 있는 것
2. **앞으로 적용할 규칙** — 이 하네스의 규범
3. **신규 구현 항목** — 아직 없거나 이후에 만들 후보

## 규칙 강도

| 구분 | 의미 |
|------|------|
| **필수 경계** | 어기면 안 되는 선 |
| **기본 관례** | 기본으로 따르는 관례. 예외 시 이유를 적습니다 |
| **상황별 선택** | 화면, 트랜잭션, 도메인에 따라 고릅니다 |

## 목차

| 문서 | 내용 |
|------|------|
| [네이밍](./naming) | 접두사, 접미사, snake_case |
| [식별자](./identifiers) | 대리키, 자연키, UUID |
| [Audit](./audit) | CreatedEntity, UpdatedEntity |
| [관계와 조회](./relations-and-dto) | 물리 FK 없음, JPA(열림), Item DTO |
| [유스케이스와 DTO](./usecase-dto) | Facade·Res 사다리·Item 채우기 사용 예 |
| [NULL과 UNIQUE](./null-unique) | 화면 단계, 통계 정합성 |
| [공통코드](./common-codes) | **FM** — 자연키, 업무성 10자, parent–child, BizEnum |
| [인덱스](./indexes) | 공통코드 축, 카디널리티 |
| [파티셔닝](./partitioning) | created_at, (드묾) stat_* 버킷, PK |
| [파티션 운영](./partition-ops) | 스케줄러 기준, 신규 항목 |
| [삭제와 보관](./delete-retention) | 논리 삭제, 보관 기간 |
| [개인정보와 비밀번호](./pii-and-password) | SHA·Salt·AES와 로그인 해시 구분 |
| [후속 작업](./follow-ups) | 대조, 신규 구현 |
| [스케치 모음](./examples) | 회원, 아웃박스, 통계 이상형 |

## 관련 템플릿

- [ExampleItem 원셋](/docs/harness/templates/backend/spring/ONESET)
- [Support CreatedEntity / UpdatedEntity](/docs/harness/templates/backend/spring/support/)
- [ExampleItem persistence](/docs/harness/templates/backend/spring/exampleitem/persistence/)
