---
format: md
id: k-localeresolver
title: "LocaleResolver"
description: "Spring MVC LocaleResolver와 LocaleChangeInterceptor로 다국어 로케일을 정하는 메모입니다."
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-localeresolver
---
# LocaleResolver

## 개요

i18n(국제화)은 메시지를 여러 언어로 준비하는 쪽이고, l10n(지역화)은 특정 로케일에 맞추는 쪽입니다.
Spring MVC는 `LocaleResolver`로 현재 로케일을 정하고, `LocaleChangeInterceptor`로 요청 파라미터로 바꿉니다.
세션·쿠키·Accept-Language 헤더 중 어디에 저장할지 고릅니다.

부트베이스 api-auth는 `AcceptHeaderLocaleResolver`에 기본 로케일 `Locale.KOREA`를 둡니다.

```java
@Bean
public LocaleResolver localeResolver() {
    AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
    localeResolver.setDefaultLocale(Locale.KOREA);
    return localeResolver;
}
```

## 쿠키·세션 방식

```java
@Bean
public LocaleResolver localeResolver() {
    CookieLocaleResolver resolver = new CookieLocaleResolver();
    resolver.setCookieName("language");
    resolver.setCookieMaxAge(3600);
    resolver.setDefaultLocale(Locale.ENGLISH);
    return resolver;
}

@Bean
public LocaleChangeInterceptor localeChangeInterceptor() {
    LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
    interceptor.setParamName("language");
    return interceptor;
}

@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(localeChangeInterceptor());
}
```

예: `http://localhost:8080/court/welcome?language=en_US`

메시지 본문은 `ResourceBundleMessageSource`의 basename과 프로퍼티 파일로 둡니다.

<details>
<summary>참고 자료</summary>

- [Spring MVC LocaleResolver](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/LocaleResolver.html)
</details>
