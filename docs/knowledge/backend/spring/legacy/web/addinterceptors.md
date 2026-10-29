---
format: md
id: k-addinterceptors
title: "Addinterceptors"
description: "WebMvcConfigurer addInterceptors로 경로 포함/제외 패턴을 등록하는 예제입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-addinterceptors
---
# Addinterceptors

## 개요

`WebMvcConfigurer`의 `addInterceptors`로 인터셉터를 등록하는 패턴입니다.
검사할 경로와 제외할 경로를 나눕니다.

## 예제

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(integrationInterceptor)
            .addPathPatterns("/integration/mediopia/**")
            .excludePathPatterns("/integration/webex/**");
    }
}
```

## 패턴 의미

`addPathPatterns`: 인터셉터가 검사할 경로 패턴을 추가합니다.

`excludePathPatterns`: 인터셉터 검사 없이 통과시킬 경로를 제외합니다.
