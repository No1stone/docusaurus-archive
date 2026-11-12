---
id: auth-filter-and-provider
title: "인증 필터와 인증 Provider"
description: "요청 진입 시 인증 필터와 AuthenticationProvider로 인증을 공통화하고, 업무 허용 판단은 유즈케이스에 두는 경계를 정리합니다."
tags:
  - backend
  - security
  - spring
status: active
sidebar_position: 3
slug: "/knowledge/backend/common/auth-filter-and-provider"
---

# 인증 필터와 인증 Provider

여러 API가 같은 인증 방식을 사용한다면 요청마다 인증 코드를 반복할 이유가 줄어듭니다.<br />
Spring Security에서는 필터가 요청에서 인증 정보를 꺼내고, `AuthenticationManager`에 인증을 위임할 수 있습니다.<br />
`AuthenticationProvider`는 자신이 지원하는 인증 유형을 처리하고 인증 결과를 만듭니다.

```text
HTTP 요청 → 인증 필터 → AuthenticationManager → AuthenticationProvider
                                                         ↓
                                               인증된 사용자와 권한
```

예를 들어 필터가 Bearer 토큰을 읽으면 Provider는 서명과 만료를 검증합니다.<br />
토큰 검증에 외부 시스템 접근이 필요한 프로젝트라면 그 호출을 Port와 Adapter로 분리할 수 있습니다.<br />
이렇게 하면 HTTP 헤더를 읽는 방식과 자격을 검증하는 방식이 각각 바뀔 수 있습니다.

인증을 마치면 요청을 보낸 사용자가 누구인지 알 수 있습니다.<br />
그 사용자가 특정 예약을 취소할 수 있는지는 예약의 소유자와 현재 상태를 보고 도메인 유즈케이스에서 판단합니다.

참고: [Spring Security의 서블릿 인증 구조](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html)

Filter와 Security가 Advice와 맞닿는 지점은 [Advice — 인접 경계](/docs/knowledge/backend/controller/advice-adjacent-boundaries)를 봅니다.
