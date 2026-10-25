---
format: md
id: k-exame-bootsecurityjwtrestapi
title: "Exame Boot,Security,Jwt,RestAPI"
description: "Spring Boot Security와 JWT를 쓰는 REST API의 필터 체인·무상태 세션 구성 메모입니다."
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-exame-bootsecurityjwtrestapi
---
# Exame Boot,Security,Jwt,RestAPI

## 개요

Spring Boot에 Security를 넣으면 기본적으로 모든 요청에 인증이 걸리고, 폼 로그인·HTTP Basic·기본 사용자가 활성화됩니다.
REST API에서는 세션 대신 JWT(Bearer)를 쓰고, CSRF를 끄며, 로그인·스웨거·액추에이터 등만 `permitAll`로 엽니다.
토큰 발급·파싱의 세부 메모는 [JWT](/docs/knowledge/k-jwt)를 봅니다.

## SecurityFilterChain 골격

Boot 3 / Security 6에서는 `WebSecurityConfigurerAdapter` 대신 `SecurityFilterChain` 빈을 등록합니다.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtTokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/error",
                                "/actuator/**",
                                "/v3/**",
                                "/swagger-ui/**",
                                "/auth/**",
                                "/oauth/login"
                        ).permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}
```

필터 순서: 예외 변환 필터 → JWT 인증 필터 → UsernamePassword 자리.
게이트웨이에서 이미 JWT를 검증한다면, 뒤쪽 서비스의 `permitAll` 범위를  Narrow 하게 다시 맞춥니다.

## 기본 Security만 켰을 때

- 인증 없는 요청은 막힙니다.
- 기본 로그인 페이지와 `user` / 랜덤 비밀번호가 생깁니다.
- `spring.security.user.name` / `password`로 개발용 계정을 고정할 수 있습니다.

API만 제공할 때는 위 체인의 무상태·JWT 필터 구성으로 바꿉니다.
CORS는 `CorsConfigurationSource` 또는 MVC `addCorsMappings`로 도메인·메서드를 제한합니다.

<details>
<summary>참고 자료</summary>

- [스프링 시큐리티 기본 API 및 Filter 이해](https://catsbi.oopy.io/c0a4f395-24b2-44e5-8eeb-275d19e2a536) — Security 의존성 추가 시 기본 동작, 필터·인가 API
- [Java-spring-boot-security-jwt 예제 저장소](https://github.com/alalstjr/Java-spring-boot-security-jwt)
- [jjwt 사용방법](https://bamdule.tistory.com/123) — 토큰 생성·검증 예
- [samtao JWT 메모](https://samtao.tistory.com/65)
</details>
