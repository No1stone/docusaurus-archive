---
id: backend-spring
title: "Spring"
description: "Java와 Kotlin 기반 Spring 개발을 위한 시작 안내와 Core, Boot, 설정, 웹 및 데이터 접근 기술을 정리합니다."
slug: /knowledge/backend/spring
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
기존 글은 [Legacy](/docs/knowledge/backend/spring/legacy)에 유지하고, 새 글은 경험과 사용 버전을 확인하며 작성합니다.

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

- [Legacy](/docs/knowledge/backend/spring/legacy) — 이전 core·configuration·web·data-access 등 메모
