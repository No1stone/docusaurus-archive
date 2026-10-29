---
format: md
id: spring-overview-index
title: "Spring 개요"
sidebar_label: "개요"
description: "Spring의 JVM 기반과 Java 및 Kotlin, Framework와 Boot의 관계, Maven과 Gradle, Initializr와 IntelliJ 프로젝트 생성 및 주요 변화의 적용 버전을 설명합니다."
slug: /knowledge/backend/spring/overview
sidebar_position: 0
status: active
tags:
  - Spring
  - Java
  - Kotlin
---
# Spring 개요

Spring은 JVM에서 사용하는 애플리케이션 프레임워크입니다.\
Java와 Kotlin을 대표적으로 사용하며, 웹 서버뿐 아니라 배치와 연동 프로그램 등에도 활용할 수 있습니다.

프로젝트를 시작할 때는 사용할 언어, 빌드 도구, Spring Boot와 JDK 버전을 선택합니다.\
언어와 빌드 설정 형식은 서로 다른 선택이므로 구분해 두면 구성을 이해하기 쉽습니다.

## Spring Framework와 Spring Boot

| 구분 | 역할 |
|---|---|
| Spring Framework | IoC와 DI, AOP, 웹, 데이터 접근과 트랜잭션 등의 기반 기능 |
| Spring Boot | 자동 설정, Starter와 의존성 버전 관리 등을 통한 애플리케이션 구성 지원 |
| JDK와 JVM | 컴파일과 개발 도구, 애플리케이션 실행 환경 |

Spring Boot는 Spring Framework를 바탕으로 프로젝트를 쉽게 구성하도록 돕습니다.\
Boot를 사용한다고 Framework의 Bean과 Context 개념이 없어지는 것은 아닙니다.\
전체 기능의 범위는 [Spring Framework 개요](https://docs.spring.io/spring-framework/reference/overview.html)를 참고합니다.

## 애플리케이션 언어와 빌드 설정 언어

| 선택 대상 | 선택지 | 주요 파일 |
|---|---|---|
| 애플리케이션 코드 | Java | `.java` |
| 애플리케이션 코드 | Kotlin | `.kt` |
| Maven 빌드 설정 | XML | `pom.xml` |
| Gradle 빌드 설정 | Groovy DSL | `build.gradle`, `settings.gradle` |
| Gradle 빌드 설정 | Kotlin DSL | `build.gradle.kts`, `settings.gradle.kts` |

Java 프로젝트에서도 Gradle Kotlin DSL을 사용할 수 있습니다.\
반대로 Kotlin 프로젝트의 빌드 설정을 Groovy DSL로 작성할 수도 있습니다.\
Groovy와 Kotlin DSL은 빌드 구성을 표현하는 방식이며, 애플리케이션 소스 언어를 강제하지 않습니다.\
설정 형식의 차이는 [Gradle 빌드 스크립트 문서](https://docs.gradle.org/current/userguide/writing_build_scripts.html)에서 확인할 수 있습니다.

## Spring Initializr로 프로젝트 생성

[Spring Initializr](https://start.spring.io/)에서 언어, 빌드 도구, Boot 버전과 의존성을 선택해 프로젝트 기본 구조를 생성할 수 있습니다.\
생성한 프로젝트를 내려받아 IDE에서 열고 필요한 설정과 코드를 추가합니다.

| 생성 항목 | 선택하거나 입력할 내용 |
|---|---|
| 빌드 도구 | Maven, Gradle |
| 언어 | Java, Kotlin 등 지원 언어 |
| 버전 | Spring Boot와 Java 버전 |
| 프로젝트 정보 | Group, Artifact, 패키지 이름 |
| 의존성 | Web, 데이터 접근 등 필요한 기능의 Starter |

Initializr는 기본 프로젝트 생성 도구이며, 업무 코드와 설계를 대신 완성하지는 않습니다.\
사용 가능한 버전과 의존성은 서비스에서 제공하는 현재 목록을 기준으로 선택합니다.\
IDE에서도 이 서비스를 이용해 생성할 수 있으며, 생성 API의 역할은 [Initializr 공식 문서](https://docs.spring.io/initializr/docs/current/reference/html/)에서 설명합니다.

## IntelliJ IDEA에서 시작하기

IntelliJ IDEA의 Spring Boot 프로젝트 생성 마법사는 IDE 안에서 Initializr 기반 프로젝트를 만들도록 돕습니다.\
웹사이트에서 생성한 프로젝트를 IDE로 가져오는 방식도 사용할 수 있습니다.

IntelliJ IDEA는 2025.3부터 통합 배포판으로 전환되었으며, Spring Boot 생성 마법사는 무료 기능에 포함됩니다.\
고급 Spring 개발 지원은 Ultimate 구독 기능과 구분합니다.\
따라서 과거의 Community와 Ultimate 구분만으로 현재 생성 기능이 유료라고 설명하지 않습니다.\
무료 범위는 [JetBrains 통합 배포판 안내](https://lp.jetbrains.com/intellij-idea-unified-faq/)를 기준으로 확인합니다.

## 프로젝트를 구성하는 방식의 변화

XML, Java Config와 자동 설정은 모든 프로젝트에서 같은 시점에 일괄 교체된 방식은 아닙니다.\
현재도 기존 설정과 새 설정을 함께 사용하는 프로젝트가 있으므로, 적용 버전과 프로젝트의 구성 방식을 구분해 살펴봅니다.

| 변화 | 적용 시점 | 공식 근거 |
|---|---|---|
| Java Config의 주요 기능을 Framework에 통합 | Spring Framework 3.0 | [3.0 변경 사항](https://docs.spring.io/spring-framework/docs/3.0.x/spring-framework-reference/html/new-in-3.html) |
| Gradle Kotlin DSL 1.0의 프로덕션 사용 지원 | Gradle 5.0 | [5.0 릴리스 노트](https://docs.gradle.org/5.0/release-notes.html#kotlin-dsl-10) |
| JdbcClient 추가 | Spring Framework 6.1 | [JdbcClient API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/simple/JdbcClient.html) |
| JdbcClient 자동 설정 추가 | Spring Boot 3.2 | [3.2 릴리스 노트](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes#support-for-jdbcclient) |
| 통합 배포판과 무료 Spring Boot 생성 마법사 | IntelliJ IDEA 2025.3 | [통합 배포판 FAQ](https://lp.jetbrains.com/intellij-idea-unified-faq/) |

Gradle 5.0은 Kotlin DSL이 처음 등장한 버전이 아니라 1.0으로 안정화된 시점입니다.\
Spring의 API 도입 버전과 Boot의 자동 설정 도입 버전도 같은 뜻으로 쓰지 않습니다.

## 생성한 프로젝트에서 먼저 볼 파일

| 파일과 경로 | 확인할 내용 |
|---|---|
| `pom.xml` 또는 `build.gradle(.kts)` | 플러그인, 의존성과 빌드 설정 |
| `mvnw` 또는 `gradlew` | 프로젝트에 맞는 빌드 도구 실행 |
| `src/main/java` 또는 `src/main/kotlin` | 실행 진입점과 애플리케이션 코드 |
| `src/main/resources` | application 설정과 리소스 |
| `src/test` | 테스트 코드와 테스트용 구성 |

지원 JDK와 빌드 도구 버전은 선택한 Boot 버전의 요구사항에 맞춥니다.\
이후에는 [Spring Core](/docs/knowledge/backend/spring/spring-core)에서 Bean과 Context를, [Spring Boot](/docs/knowledge/backend/spring/boot)에서 실행과 자동 설정을 살펴봅니다.
