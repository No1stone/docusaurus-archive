---
format: "md"
id: "spring-boot-index"
title: "Spring Boot"
description: "자동 설정, 스타터, SpringApplication, 종료 처리를 다루는 Spring Boot 입구입니다."
slug: "/knowledge/backend/spring/boot"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "Spring Boot"
  - "Spring"
  - "Auto-configuration"
  - "Starter"
  - "SpringApplication"
  - "Graceful shutdown"
---
# Spring Boot

Spring Boot가 애플리케이션을 시작하고 기본 구성을 선택하는 방법을 다룹니다.
Starter를 추가한 결과부터 조건부 빈, 시작 작업과 종료까지 연결해 읽습니다.

## 읽는 순서

기동 성공만으로 모든 준비 작업과 외부 연동이 완료된 것은 아닙니다.
자동 설정의 적용 조건, 실제 빈 선택과 준비 상태를 각각 확인합니다.

| 글 | 다루는 내용 |
|---|---|
| [SpringApplication과 실행 과정](./spring-application.md) | SpringApplication의 기동 단계와 컨텍스트 준비, 시작 실패 분석 및 실행 모드를 설명합니다. |
| [SpringBootApplication과 자동 설정](./auto-configuration.md) | SpringBootApplication의 구성과 조건부 자동 설정, 사용자 빈에 따른 후퇴 및 조건 보고서 확인을 설명합니다. |
| [조건부 Bean 등록](./conditional-beans.md) | Profile과 ConditionalOnProperty, ConditionalOnMissingBean을 사용한 기능 선택과 조건 테스트를 설명합니다. |
| [Starter와 의존성 관리](./starters.md) | Starter와 BOM의 차이, 의존성 버전 관리 및 런타임 의존성 확인 방법을 설명합니다. |
| [ApplicationRunner와 CommandLineRunner](./application-runners.md) | ApplicationRunner와 CommandLineRunner의 실행 시점, 순서, 기동 실패 및 초기 적재의 한계를 설명합니다. |
| [종료와 Graceful Shutdown](./graceful-shutdown.md) | 정상 종료의 요청 배출, 단계별 제한 시간, 컨테이너 종료 신호와 비동기 작업의 별도 정리 책임을 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### 스타터만 넣으면 설정이 끝나나요?

스타터는 의존성과 자동 설정 후보를 가져옵니다. 조건과 오버라이드, 제외도 함께 확인합니다.

### Graceful shutdown은 언제 필요한가요?

진행 중 요청을 끊지 않고 종료하려면 종료 타임아웃과 커넥터 설정을 맞춥니다.

