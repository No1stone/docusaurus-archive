---
format: md
id: k-corsregistry
title: "CorsRegistry"
description: "Spring CorsRegistry로 허용 Origin·메서드·헤더를 등록하는 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-corsregistry
---
# CorsRegistry

## 개요

CORS(Cross-Origin Resource Sharing)는 다른 Origin의 브라우저 요청이 응답을 읽도록 서버가 허용하는 정책입니다.
Spring MVC에서는 `WebMvcConfigurer.addCorsMappings`로 `CorsRegistry`에 규칙을 등록합니다.
브라우저 CORS 개념과 OPTIONS 우회는 [Croess domain (CORS)](./croess-domain-cors.md)를 봅니다.

## 설정 예

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**/*")
            .allowedOrigins(this.allowOrigins)
            .allowedMethods("*")
            .allowedHeaders("*")
            .exposedHeaders(
                    "Access-Control-Allow-Origin",
                    "Access-Control-Allow-Credentials",
                    "authToken"
            )
            .allowCredentials(false)
            .maxAge(3600);
}
```

`authToken`을 `exposedHeaders`에 넣은 것은 Axios 등 클라이언트가 커스텀 응답 헤더를 읽게 하기 위함입니다.
자격 증명 쿠키를 쓸 때는 `allowCredentials(true)`와 구체적인 Origin 목록이 함께 필요합니다.
부트베이스 api-auth는 `allowedOrigins("*")` 형태로 열어 둔 예가 있습니다.

<details>
<summary>참고 자료</summary>

- [Spring CorsRegistry](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/config/annotation/CorsRegistry.html)
</details>
