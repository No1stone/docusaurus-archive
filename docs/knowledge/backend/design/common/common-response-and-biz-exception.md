---
id: common-response-and-biz-exception
title: "공통 응답 코드와 업무 예외"
description: "공통 ResponseType과 BizError/BizWarn, 모듈 이넘 확장 방식을 boot-base 적용 기준으로 정리합니다."
tags:
  - backend
  - api
  - exception
status: active
sidebar_position: 2
slug: "/knowledge/backend/common/common-response-and-biz-exception"
---

# 공통 응답 코드와 업무 예외

API가 실패할 때 호출부는 HTTP 상태와 `code`, `message`를 같은 방식으로 읽어야 합니다.<br />
이 글은 **공통 `ResponseType`을 먼저 쓰고**, 앱 특화 사유가 있을 때만 이넘을 확장하는 방식을 정리합니다.<br />
boot-base `lib-common`과 원셋 [support](/docs/harness/templates/backend/spring/support/)가 같은 축을 따릅니다.

## 역할 나누기

| 구분 | 역할 |
|---|---|
| `ResponseType` | 시스템이 지원하는 HTTP status와 공통 세부 코드 |
| `ResponseTypeInterface` | 공통, 모듈 이넘이 지키는 계약 (`code`, `desc`, `httpStatus`) |
| `BizErrorException` / `BizWarnException` | 업무 실패를 던질 때 쓰는 예외. 인터페이스 구현체만 받음 |
| `@RestControllerAdvice` | 예외를 `CommonResponse`와 HTTP status로 변환 |

Biz는 **무엇을 실패로 볼지**를 표현하고, Advice는 **그걸 HTTP 응답으로 바꿉니다.**

## 공통을 먼저 씁니다

`ResponseType`에는 지원하기로 한 HTTP 상태(2xx, 4xx, 5xx)의 대표 항목이 있습니다.<br />
잘못된 파라미터, 열거형 오류처럼 여러 API가 같이 쓰는 사유도 공통 세부 코드로 둡니다.

```java
throw new BizWarnException(ResponseType.NOT_FOUND_RESOURCE);  // 404
throw new BizErrorException(ResponseType.INVALID_PARAMETER); // 400
```

문자열만 넣어 던지거나, 공통에 이미 있는 404를 모듈마다 다시 만들지 않습니다.

## 필요할 때만 이넘을 확장합니다

앱 특화 메시지 변환이나, 공통에 없는 특별한 사유가 있을 때만 모듈에서 이넘을 추가합니다.<br />
그 이넘은 `ResponseTypeInterface`를 구현하고, 같은 Biz 생성자로 넘깁니다.

```java
// 모듈 이넘 개념
public enum AuthResponseType implements ResponseTypeInterface {
    TOKEN_REVOKED(HttpStatus.UNAUTHORIZED, "AU0001", "토큰이 폐기되었습니다.");
    // getCode, getDesc, getHttpStatus
}

throw new BizErrorException(AuthResponseType.TOKEN_REVOKED);
```

Advice는 이미 인터페이스만 보므로, 모듈 이넘마다 핸들러를 새로 두지 않습니다.

## 일상 작업에서 하는 일

1. 공통 `ResponseType`에 맞는 값이 있는지 봅니다.
2. 있으면 그대로 throw 합니다.
3. 없을 때만 모듈 이넘에 값을 **추가**합니다.
4. 새 예외 클래스나 Advice 핸들러를 기본으로 늘리지 않습니다.

정리하면, 확장은 **이넘을 늘리는 일**이고, 예외 계층과 전역 처리는 공통에 그대로 둡니다.

## 관련

- [Spring 기반 백엔드 공통 설계](/docs/knowledge/backend/common/spring-common-design)
- [예외 전파와 try/catch](/docs/knowledge/backend/controller/advice-exception-propagation)
- [HTTP 상태와 엔벨로프](/docs/knowledge/backend/controller/advice-http-status-and-envelope)
- [support 템플릿](/docs/harness/templates/backend/spring/support/)
