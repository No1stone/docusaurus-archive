---
format: md
id: k-java-e63b2b
title: "java"
description: "@PropertySource와 @Value로 discounts.properties를 읽는 Spring 설정 예시입니다."
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-java-e63b2b
---
# java

## 개요

`discounts.properties`를 `@PropertySource`로 읽고 `@Value`로 주입하는 설정 메모입니다.
패키지 스캔 경로와 기본값을 함께 적어 두었습니다.

## 예제

```java
@Configuration
@PropertySource("classpath:discounts.properties")
@ComponentScan("packageadress")
public class DiscountConfig {
    @Value("${endofyear.discount:0}")
    private double specialEndofyearDiscountField;
}
```

원문의 `@Configration`은 `@Configuration`의 오타로 보고 정리했습니다.
