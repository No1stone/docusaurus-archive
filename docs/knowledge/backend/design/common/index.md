---
id: spring-common-design
title: "Spring 기반 백엔드 공통 설계"
description: "응답 엔벨롭, 예외, 인증, 입력 검증, 공통 유틸리티를 Spring 확장 지점에 모아 기능마다 달라지지 않게 하는 상위 안내입니다."
tags:
  - backend
  - api
  - spring
status: active
slug: "/knowledge/backend/common/spring-common-design"
---

# Spring 기반 백엔드 공통 설계

새 API를 만들 때마다 인증 방식, 입력 오류 응답, JSON 변환 규칙을 다시 정하면 기능마다 동작이 달라지기 쉽습니다.<br />
예를 들어 같은 필수값 누락인데 한 API는 `400`과 오류 코드를 반환하고, 다른 API는 예외 메시지만 반환하면 프론트엔드는 API마다 실패를 다르게 처리해야 합니다.

boot-base에서는 여러 기능이 공유하는 동작을 Spring이 제공하는 확장 지점에 연결합니다.<br />
요청을 받을 때 인증과 입력 검증을 적용하고, 처리 결과를 공통 응답 형식으로 전달합니다.<br />
도메인 유즈케이스는 예약을 허용할지, 변경을 처리할지 같은 업무 판단을 담당합니다.

**하네스 필독이 아닙니다.** 구현 복사는 [Spring 원셋 support](/docs/harness/templates/backend/spring/support/)를 봅니다.

## 무엇을 어디에 공통화하나요?

| 주제 | 공통에서 맡는 일 | 기능별로 정하는 일 |
|---|---|---|
| 응답 엔벨롭 | `CommonResponse<T>`의 필드와 응답 생성 방식 | API가 반환할 데이터 |
| 예외 처리 | 공통 예외와 Advice로 HTTP 상태와 오류 응답 변환 | 실패 조건과 사용할 오류 코드 |
| 인증 필터 | 요청에서 인증 정보를 꺼내 검증을 위임하고 인증 결과를 연결 | 기능별 접근 권한과 업무상 허용 조건 |
| 입력 검증 | Bean Validation으로 필수 여부, 길이, 형식 등을 일관되게 검증 | 예약 중복이나 상태 전이처럼 업무 데이터가 필요한 판단 |
| 공통 유틸리티 | JSON 변환이나 객체 매핑에 사용하는 설정과 구현을 재사용 | 기능에 필요한 변환 대상과 필드 선택 |

## 공통화하면 무엇이 달라지나요?

예를 들어 예약 API에 날짜 필드가 추가되면, 요청 DTO에서 형식을 검증하고 유즈케이스에서 예약 가능 여부를 확인합니다.<br />
예약이 겹치면 유즈케이스가 오류 코드를 선택해 공통 예외를 던집니다.<br />
Advice는 그 코드를 HTTP 응답으로 바꿉니다.<br />
새 기능을 추가한 개발자는 **실패 조건과 응답 코드**를 정하면 되고, 프론트엔드는 기존과 같은 방식으로 결과를 읽을 수 있습니다.

공통 동작은 같은 기준으로 검증할 수 있습니다.<br />
유즈케이스 테스트에서는 어떤 조건에서 어떤 오류가 발생하는지 확인하고, API 테스트에서는 그 오류가 약속한 HTTP 상태와 본문으로 나가는지 확인합니다.<br />
JSON 변환 설정을 바꿀 때도 공통 구현을 사용하는 경로를 기준으로 영향을 확인할 수 있습니다.

## 하위 글

| 글 | 다루는 것 |
|---|---|
| [API 응답 엔벨롭 설계](/docs/knowledge/backend/common/api-response-envelope) | `CommonResponse<T>` 필드와 적용 범위 |
| [공통 응답 코드와 업무 예외](/docs/knowledge/backend/common/common-response-and-biz-exception) | `ResponseType`, Biz 예외, 모듈 이넘 확장 (boot-base 적용) |
| [인증 필터와 인증 Provider](/docs/knowledge/backend/common/auth-filter-and-provider) | 요청 진입 시 인증 흐름과 업무 허용 경계 |
| [입력 검증과 업무 검증](/docs/knowledge/backend/common/input-and-domain-validation) | Bean Validation과 유즈케이스 검증 경계 |
| [공통 유틸리티 설계](/docs/knowledge/backend/common/common-utility-design) | JSON 변환, 객체 매핑, 공통 설정 |

구현과 Advice 상세는 [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope), [검증](/docs/knowledge/backend/controller/advice-validation), [인접 경계](/docs/knowledge/backend/controller/advice-adjacent-boundaries), [JSON](/docs/knowledge/backend/java/json-utils)을 함께 봅니다.<br />
Controller Advice 시리즈 허브는 [Controller Advice와 메시지](/docs/knowledge/backend/controller/controller-advice-and-messages)입니다.
