---
format: md
id: k-croess-domain-cors
title: "Croess domain (CORS)"
description: "브라우저 CORS와 Spring에서 preflight(OPTIONS)·허용 Origin을 다루는 메모입니다."
tags:
  - HTTP
  - Spring
status: active
slug: /knowledge/k-croess-domain-cors
---
# Croess domain (CORS)

## 개요

CORS(Cross-Origin Resource Sharing)는 브라우저가 다른 Origin의 AJAX 응답을 읽을지 서버 헤더로 허용하는 정책입니다.
단순 요청이 아니면 브라우저가 먼저 `OPTIONS` preflight를 보내고, 허용되지 않으면 본 요청이 실패합니다.
파일명 Croess는 원본 표기를 유지합니다.

## Spring MVC 설정

부트베이스 api-auth는 `WebMvcConfigurer.addCorsMappings`로 허용 Origin·메서드·헤더를 엽니다.
운영에서는 `*` 대신 환경별 도메인 목록으로 좁힙니다.

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("*")
            .allowedHeaders("*");
}
```

Security를 쓰면 `CorsConfigurationSource`와 필터 체인 쪽 CORS도 같이 맞춰야 preflight가 401로 막히지 않습니다.

## 인터셉터에서 OPTIONS 통과

커스텀 인터셉터가 모든 메서드를 가로채면 preflight가 막힐 수 있습니다.
`OPTIONS`는 인증 검사 전에 통과시키는 우회가 있습니다.

```java
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        return true;
    }
    // 이후 인증·권한 검사
    return true;
}
```

근본 해결은 CORS 설정을 올바르게 두는 것이고, 인터셉터 통과는 보조 수단입니다.

<details>
<summary>참고 자료</summary>

- [지긋지긋한 CORS 파헤쳐보자](https://velog.io/@jmkim87/지긋지긋한-CORS-파헤쳐보자)
</details>
