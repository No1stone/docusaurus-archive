---
format: "md"
id: "spring-spring-core-index"
title: "Spring Core"
description: "IoC, DI, Bean, ApplicationContext, AOP 등 Spring 컨테이너 핵심을 정리한 입구입니다."
slug: "/knowledge/backend/spring/spring-core"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "Spring Core"
  - "Spring"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# Spring Core

객체를 생성하고 연결하는 컨테이너의 기본 동작을 다룹니다.
IoC와 DI에서 시작해 빈의 등록, 수명과 프록시를 읽으면 트랜잭션과 비동기 기능이 적용되는 위치를 이해하기 쉽습니다.

## 읽는 순서

먼저 생성자에 필요한 의존성을 드러내고, 구현을 선택하는 설정과 업무 동작을 나눕니다.
그다음 컨테이너가 만드는 객체와 직접 생성한 객체의 차이를 생명주기와 AOP 관점에서 살펴봅니다.

| 글 | 다루는 내용 |
|---|---|
| [IoC와 DI](./ioc-and-di.md) | 객체 생성의 책임을 분리하는 IoC와 DI를 순수 Java와 Spring 코드로 비교하고, 테스트와 의존성 방향에 미치는 영향을 설명합니다. |
| [BeanFactory와 ApplicationContext](./bean-factory-and-application-context.md) | BeanFactory와 ApplicationContext의 관계, 빈 정의와 실제 인스턴스, 컨텍스트 계층 및 종료의 의미를 설명합니다. |
| [Bean 등록과 컴포넌트 스캔](./bean-registration-and-component-scan.md) | Component Scan과 Bean 등록의 차이, 탐색 범위, 충돌 및 외부 모듈 등록 실패를 예제로 설명합니다. |
| [의존성 주입과 주입 대상 선택](./dependency-injection.md) | 생성자, 필드, 설정 메서드 주입의 차이와 Primary, Qualifier, 컬렉션 및 Provider를 이용한 빈 선택을 설명합니다. |
| [Bean Scope와 생명주기](./bean-scope-and-lifecycle.md) | 싱글턴과 요청 스코프의 수명, prototype의 정리 책임, PostConstruct와 PreDestroy의 실행 범위를 설명합니다. |
| [Lazy 초기화](./lazy-initialization.md) | Lazy의 빈 생성 지연과 주입 프록시를 구분하고 첫 요청 지연, 실패 시점 및 DependsOn의 한계를 설명합니다. |
| [Java Config와 XML 설정](./java-config-and-xml.md) | XML과 Java Config의 조립 표현을 비교하고 proxyBeanMethods 및 ImportResource를 이용한 점진 전환을 설명합니다. |
| [AOP와 프록시](./aop-and-proxy.md) | AOP가 프록시 호출을 감싸는 원리와 JDK 및 클래스 프록시, 자기 호출과 final 메서드의 제한을 설명합니다. |
| [이벤트 발행과 리스너](./events-and-listeners.md) | ApplicationEventPublisher와 EventListener의 기본 동기 실행, 트랜잭션 이벤트 및 신뢰성 경계를 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

