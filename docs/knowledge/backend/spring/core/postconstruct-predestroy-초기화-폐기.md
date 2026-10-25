---
format: md
id: k-postconstruct-predestroy-초기화-폐기
title: "@PostConstruct Predestroy 초기화 폐기"
description: "@PostConstruct와 @PreDestroy로 빈 초기화와 폐기 시점을 다루는 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-postconstruct-predestroy-초기화-폐기
---
# @PostConstruct Predestroy 초기화 폐기

## 개요

IoC 컨테이너가 빈을 관리할 때, 의존성 주입 이후 초기화와 폐기 직전에 호출되는 콜백 메모입니다.
`@PostConstruct`와 `@PreDestroy`를 구분합니다.

## PostConstruct

IoC 컨테이너가 실행되고 컨테이너가 빈 관리를 시작합니다.
빈은 자동으로 생성되고 삭제됩니다.
`@PostConstruct`를 사용하면 빈 생성과 별개로, 의존성을 주입한 뒤 초기화를 할 수 있습니다.
스프링이 기동되면 빈은 초기화된 상태가 됩니다.
객체를 가져오기 전에 수행해야 할 작업에 사용합니다.

## PreDestroy

객체를 가져온 뒤에 수행해야 할 정리 작업에 사용합니다.
메모리 해제 전에 실행되고, 이후 메모리가 해제됩니다.
