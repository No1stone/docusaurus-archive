---
format: md
id: k-spring-bean-scope
title: "Spring Bean Scope"
description: "Spring 빈 스코프 Singleton, Prototype, Request, Session, GlobalSession 요약입니다."
tags:
  - HTTP
  - Spring
status: active
slug: /knowledge/k-spring-bean-scope
---
# Spring Bean Scope

## 개요

스프링 빈이 얼마나 오래, 몇 개 만들어지는지를 나타내는 스코프 요약입니다.
웹 전용 스코프는 웹 애플리케이션 컨텍스트에서만 의미가 있습니다.

## 스코프

- Singleton: IoC 컨테이너당 빈 인스턴스 하나를 생성합니다.
- Prototype: 요청할 때마다 빈 인스턴스를 새로 생성합니다.
- Request: HTTP 요청당 하나의 빈 인스턴스를 생성합니다. 웹 애플리케이션 컨텍스트에만 해당합니다.
- Session: HTTP 세션당 빈 인스턴스 하나를 생성합니다. 웹 애플리케이션 컨텍스트에만 해당합니다.
- GlobalSession: 포털 애플리케이션 컨텍스트에서 HTTP 세션당 빈 인스턴스 하나를 생성합니다.
