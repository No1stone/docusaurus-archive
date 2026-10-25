---
format: md
id: k-handlerintercepter
title: "HandlerIntercepter"
description: "HandlerInterceptor의 preHandle, postHandle, afterCompletion과 인증 연동 메모입니다."
tags:
  - HTTP
  - Spring
status: active
slug: /knowledge/k-handlerintercepter
---
# HandlerIntercepter

## 개요

스프링 MVC HandlerInterceptor 생명주기와 인증 연동 메모입니다.
컨트롤러 진입 전에 세션이나 토큰을 검사하는 용도로 씁니다.

## 흐름

![handlerintercepter-1.png](/img/handlerintercepter/handlerintercepter-1.png)

- `preHandle()`: 처리 전
- `postHandle()`: 처리 후
- `afterCompletion()`: 메소드가 끝난 후

```java
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws Exception {
}
```

컨트롤러 진입 전에 인터셉터가 정보를 가져갑니다.
이 부분에 세션, 토큰 인증을 실행합니다.
`HttpServletRequest`가 끝날 때까지 해당 정보를 들고 있습니다.

## 관련 메모

- [AuthTokenInterceptor](../../../security/authtokeninterceptor.md)
- [Addinterceptors](/docs/knowledge/k-addinterceptors)
- [CorsRegistry](../../../networking/http-stack/corsregistry.md)
