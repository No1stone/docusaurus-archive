---
id: "backend-spring"
title: "Spring"
description: "Java와 Kotlin 기반 Spring 개발을 위한 시작 안내와 Core, Boot, 설정, 웹, 데이터 접근, 트랜잭션, 배치, 테스트를 정리합니다."
slug: "/knowledge/backend/spring"
status: "active"
tags:
  - "Spring"
keywords:
  - "Spring"
  - "Spring Boot"
  - "Spring Framework"
  - "IoC"
  - "DI"
  - "@Transactional"
  - "Spring MVC"
  - "JPA"
  - "Spring Batch"
---
# Spring

Spring은 JVM 환경에서 애플리케이션을 개발하는 프레임워크입니다.\
대표적으로 Java와 Kotlin을 사용하며, 객체 관리와 의존성 주입부터 웹, 데이터 접근과 트랜잭션까지 필요한 기능을 제공합니다.

이 영역에서는 직접 사용한 Spring 기술을 시작 방법부터 구성과 구현 순서로 정리합니다.\
먼저 [Spring 개요](/docs/knowledge/backend/spring/overview)에서 Framework와 Boot의 관계, 빌드 도구와 프로젝트 생성 방법을 살펴볼 수 있습니다.

| 시작할 때 구분할 것 | 주요 선택지 |
|---|---|
| 애플리케이션 언어 | Java, Kotlin |
| 빌드 도구 | Maven, Gradle |
| 빌드 설정 형식 | Maven XML, Gradle Groovy DSL, Gradle Kotlin DSL |
| 프로젝트 생성 | Spring Initializr, IDE의 생성 마법사 |

프로젝트의 계층과 구현 규칙은 Backend Design에서, 각 기술의 사용법은 이 영역에서 다룹니다.\
기존 글은 [Legacy](/docs/knowledge/backend/spring/legacy)에 유지하고, 새 글에서는 재사용할 코드와 캡처를 현재 설명에 연결합니다.

## 목차

- [개요](/docs/knowledge/backend/spring/overview)
- [Spring Core](/docs/knowledge/backend/spring/spring-core)
- [Spring Boot](/docs/knowledge/backend/spring/boot)
- [설정과 환경](/docs/knowledge/backend/spring/settings)
- [Web](/docs/knowledge/backend/spring/spring-web)
- [JDBC와 데이터 접근](/docs/knowledge/backend/spring/jdbc)
- [트랜잭션](/docs/knowledge/backend/spring/transaction)
- [비동기와 스케줄링](/docs/knowledge/backend/spring/async-scheduling)
- [Spring Batch](/docs/knowledge/backend/spring/batch)
- [테스트](/docs/knowledge/backend/spring/spring-testing)

## Legacy

- [Legacy](/docs/knowledge/backend/spring/legacy) — 이전 Core, Configuration, Web, Data Access 등 메모

## 이 문서들의 버전과 사용 범위

| 기준 | 적용 범위 |
|---|---|
| Spring Boot 3.5, Framework 6.2 | 일반적인 예제와 설정의 기준입니다. |
| Java 17 이상 | 기본 Java 문법과 Boot 3 계열의 실행 기준입니다. |
| Java 21 이상 | 가상 스레드 예제에 필요합니다. |
| Spring Batch 5.2 | 배치 빌더와 실행 모델 예제의 기준입니다. |

이 기준은 학습 예제의 API 범위이며 운영에 사용할 보안 패치 버전을 고정하는 표는 아닙니다.
실제 배포에서는 선택한 배포판과 지원 버전, 보안 공지를 별도로 확인합니다.

본문은 Spring의 개념과 실행 원리를 설명합니다.
Facade와 BFF의 배치, DTO 구성과 감사 상속 같은 프로젝트 설계 선택을 Spring의 필수 규칙으로 설명하지 않습니다.
예제의 생략 범위와 전제를 확인한 뒤 해당 저장소의 구조와 통과 기준에 맞춰 적용합니다.

## 자주 묻는 질문

### 새 Spring 글과 Legacy는 어떻게 나누나요?

새 목차의 글을 먼저 보고, 이전 메모는 Legacy에서 참고합니다. 공개 slug가 있는 Legacy는 유지합니다.

### 이 영역의 예제 버전 기준은 무엇인가요?

Spring Boot 3.5와 Framework 6.2, Java 17 이상을 일반 기준으로 두고, 가상 스레드는 Java 21 이상을 전제로 합니다.

