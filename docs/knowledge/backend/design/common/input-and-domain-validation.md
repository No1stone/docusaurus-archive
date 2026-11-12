---
id: input-and-domain-validation
title: "입력 검증과 업무 검증"
description: "Bean Validation으로 요청 형식을 검증하고, 업무 데이터가 필요한 판단은 유즈케이스에 두는 경계를 정리합니다."
tags:
  - backend
  - validation
  - spring
status: active
sidebar_position: 4
slug: "/knowledge/backend/common/input-and-domain-validation"
---

# 입력 검증과 업무 검증

예약 요청을 받으면 먼저 날짜와 차량번호를 읽을 수 있는지 확인합니다.<br />
요청이 유효하면 현재 예약 내역을 조회해 해당 시간에 새 예약을 넣을 수 있는지 판단합니다.<br />
두 검증은 필요한 정보가 다릅니다.

| 검증 | 확인하는 조건 | 적용 위치 |
|---|---|---|
| 요청 형식 | 필수값, 길이, 형식, 숫자 범위 | 요청 DTO와 Bean Validation |
| 요청 내부의 값 관계 | 종료 시간이 시작 시간 이후인지 | 요청 DTO의 교차 필드 검증 또는 해당 조건을 책임지는 유즈케이스 |
| 업무 상태 | 같은 시간에 기존 예약이 있는지, 취소할 수 있는 상태인지 | 도메인 유즈케이스 |

Spring MVC에서는 `@Valid @RequestBody`로 요청 본문을, `@Valid @ModelAttribute`로 바인딩한 검색 조건을 검증할 수 있습니다.<br />
웹 계층에서 입력 오류의 응답 형식을 공통으로 정해두면 필수값 하나를 추가할 때마다 응답을 만드는 코드를 작성할 필요가 줄어듭니다.<br />
업무 검증은 도메인 유즈케이스에 두어 REST와 메시지 수신처럼 진입 방식이 달라도 같은 판단을 적용할 수 있습니다.

참고: [Spring MVC 검증](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)

테스트에서는 필수값을 빼고 호출했을 때 약속한 입력 오류가 반환되는지 확인합니다.<br />
별도로 정상 형식의 요청을 넣고 기존 예약과 겹칠 때 업무 오류가 발생하는지도 확인합니다.

Advice와 Bean Validation의 응답 매핑은 [Advice — 검증](/docs/knowledge/backend/controller/advice-validation)을, 업무 실패 코드는 [공통 응답 코드와 업무 예외](/docs/knowledge/backend/common/common-response-and-biz-exception)를 봅니다.
