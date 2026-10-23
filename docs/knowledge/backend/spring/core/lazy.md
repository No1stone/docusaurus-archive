---
format: md
id: k-lazy
title: "@Lazy"
description: "Spring @Lazy 느긋한 초기화와 @DependsOn으로 경합 조건을 막는 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-lazy
---
# @Lazy

## 개요

스프링 빈의 느긋한 초기화(`@Lazy`) 메모입니다.
시동 시점에 필요 없는 빈을 늦게 만들면 기동을 짧게 가져갈 수 있습니다.
다만 경합 조건이 나면 `@DependsOn`으로 순서를 맞춥니다.

## 설명

느긋한 초기화입니다.
스프링 POJO는 시동 시점에 리소스를 집중해서 사용합니다.
시동 시점에 필요하지 않은 빈에 붙여 주면 시동이 빨라질 수 있습니다.
다른 POJO가 참조하기 전까지 초기화하지 않습니다.

## 주의사항

경합 조건이 일어나면 에러가 발생합니다.
이때 `@DependsOn("dataPrefixGenerator")` 어노테이션을 사용합니다.
경합 조건 발생 시 먼저 `dataPrefixGenerator` 빈을 실행시켜 에러 발생을 막을 수 있습니다.
여러 개면 콤마로 구분해 여러 개를 먼저 실행시킬 수 있습니다.

```text
"dataPrefixGenerator,dataPrefixGenerator1,dataPrefixGenerator2"
```
