---
format: md
id: k-webfluxsecurity
title: "WebfluxSecurity"
description: "Spring Security WebFlux의 SecurityWebFilterChain 최소·명시 설정 메모입니다."
tags:
  - Spring
  - Security
status: active
slug: /knowledge/k-webfluxsecurity
---
# WebfluxSecurity

## 개요

WebFlux 스택에서는 서블릿의 `SecurityFilterChain` 대신 `SecurityWebFilterChain`을 씁니다.
`@EnableWebFluxSecurity`와 사용자 정보 빈만 두어도 폼 로그인, HTTP Basic, 인증 필수, 기본 로그인/로그아웃, 보안 헤더, CSRF가 켜집니다.
JWT·무상태 API는 `ServerHttpSecurity`에서 exchange 규칙과 인증 방식을 명시합니다.

## 최소 설정

```java
@Configuration
@EnableWebFluxSecurity
public class HelloWebfluxSecurityConfig {

    @Bean
    public MapReactiveUserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
                .username("user")
                .password("user")
                .roles("USER")
                .build();
        return new MapReactiveUserDetailsService(user);
    }
}
```

## 명시 설정

```java
@Bean
public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    http
            .authorizeExchange(ex -> ex.anyExchange().authenticated())
            .httpBasic(withDefaults())
            .formLogin(withDefaults());
    return http.build();
}
```

경로별로 체인을 나누려면 `@Order`와 `securityMatcher`로 여러 `SecurityWebFilterChain`을 등록합니다.
예: `/api/**`는 JWT 리소스 서버, 나머지는 HTTP Basic.
서블릿 JWT 구성은 [Exame Boot,Security,Jwt,RestAPI](/docs/knowledge/k-exame-bootsecurityjwtrestapi)와 [JWT](/docs/knowledge/k-jwt)를 봅니다.

<details>
<summary>참고 자료</summary>

- [WebFlux Security (현재 문서)](https://docs.spring.io/spring-security/reference/reactive/configuration/webflux.html)
- [WebFlux Security 5.6.0-RC1 (원본 URL, 404)](https://docs.spring.io/spring-security/reference/5.6.0-RC1/reactive/configuration/webflux.html)
</details>
