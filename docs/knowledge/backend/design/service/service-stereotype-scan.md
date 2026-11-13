---
id: service-stereotype-scan
title: Service — 스테레오타입과 스캔
description: "Service Component Repository Controller 스테레오타입 차이와 컴포넌트 스캔, Adapter에 무엇을 붙이는지 정리합니다."
keywords:
  - "@Service"
  - 컴포넌트 스캔
  - 스테레오타입
tags:
  - backend
  - spring
status: active
slug: "/knowledge/backend/service/service-stereotype-scan"
---

# Spring의 Service, Repository, Controller는 어디서 빈이 될까

새로 만든 예약 서비스가 코드에 있는데도 Controller를 띄우면 빈을 찾지 못할 수 있습니다.<br />
이때 먼저 볼 것은 클래스 이름보다 등록 방식과 스캔 범위입니다.

| 애노테이션 | 역할을 표시하는 대상 |
|---|---|
| `@Component` | 컴포넌트 스캔으로 찾을 일반 빈 |
| `@Service` | 서비스 책임을 가진 컴포넌트 |
| `@Repository` | 영속성 접근 컴포넌트, 구성에 따라 예외 변환 적용 |
| `@Controller`, `@RestController` | HTTP 요청을 처리하는 컴포넌트 |

## 다른 모듈에 있는 Adapter를 연결할 때

`@SpringBootApplication`이 있는 패키지를 기준으로 컴포넌트를 찾는 기본 구성을 생각해 봅니다.<br />
예약 Port의 구현을 그 범위 밖에 두면, 구현 클래스에 애노테이션이 있어도 검색되지 않을 수 있습니다.

이 경우 패키지 배치를 확인하고, 외부 모듈의 구성이 의도된 경우에는 설정에서 빈을 등록하거나 필요한 설정을 가져옵니다.<br />
같은 Port의 구현이 여러 개라면 어느 구현을 쓸지 선택 기준도 정합니다.

원셋에서 Facade나 Adapter라는 이름은 설계상 책임을 설명합니다.<br />
Spring에서 빈으로 동작하는지는 스테레오타입, 스캔, 명시적 빈 설정이 결정합니다.
[주입 위치](/docs/knowledge/backend/service/service-di-injection-points) / [Port와 Adapter 책임](/docs/knowledge/backend/service/service-port-adapter-role)

## 라이브러리의 구현을 가져왔는데 빈이 두 개라면

호스트가 기본 예약 저장 구현과 테스트용 구현을 함께 등록하면, 두 빈이 모두 같은 Port 타입을 만족할 수 있습니다.<br />
`@Service`나 `@Repository`는 역할을 표시하지만 어느 구현을 고를지까지 결정하지는 않습니다.

기본 구현을 하나로 정해야 한다면 프로파일, 조건부 빈 구성, `@Primary` 또는 명시적인 `@Qualifier` 중 호스트 구성에 맞는 방법을 선택합니다.<br />
테스트 환경과 운영 환경에서 각각 어떤 구현이 연결되는지 컨텍스트를 띄워 확인합니다.

## 참고 자료

- [Spring Framework의 클래스패스 스캔과 컴포넌트](https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html)
