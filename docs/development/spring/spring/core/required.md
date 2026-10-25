---
format: md
id: k-required
title: "@Required"
description: "Spring @Required로 필수 의존성 주입을 강제한다는 짧은 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-required
---
# @Required

## 개요

`@Required`는 필수라는 뜻으로 이해한 메모입니다.
이 어노테이션이 붙으면 필수로 데이터가 있어야 한다고 적혀 있습니다.

## 메모

RDB의 Not Null과 비슷하게 보면 되는지 고민해 둔 기록입니다.
구버전 Spring에서 setter 주입 필수 여부를 검사할 때 쓰이던 어노테이션으로, 현재는 권장되지 않는 경우가 많습니다.
