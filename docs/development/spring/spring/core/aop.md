---
format: md
id: k-aop
title: "@AoP"
description: "@AoP"
tags:
  - Spring
status: active
slug: /knowledge/k-aop
---
# @AoP

관점지향 프로그래밍

Aspect Oriented Programming

IoC di는 (new) 인스턴스 의존성 주입이라고한다면

AoP는 인스턴스의 기능을 주입시킨다.

인터셉터같이 실행시킬때

중간중간 채가서 실행시킨다고 보면될거같다.

@Aspect

메소드 단위로 사용된다.

@Before

객체의 메소드 호출 전에 공통 기능을 실행

@After

익셉션 발생 여부에 상관없이 대상 객체의 메소드 실행 후 공통 기능을 실행

@After Returning

객체의 메소드가 익셉션 없이 정상적으로 실행된 이후에 공통 기능을 실행

@After Throwing

객체의 메소드를 실행하는 도중 익셉션이 발생한 경우에 공통 기능을 실행

@Around

객체의 메소드 실행 전, 후 또는 익셉션 발생 시점에 공통 기능을 실행하는데 사용

@Order(0) @Order(1)

Aspect의 순서를 오더로 정할수있음
