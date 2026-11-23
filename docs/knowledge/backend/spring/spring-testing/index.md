---
format: "md"
id: "spring-spring-testing-index"
title: "테스트"
description: "단위 테스트, 슬라이스, Spring 컨텍스트 테스트와 Testcontainers를 다루는 입구입니다."
slug: "/knowledge/backend/spring/spring-testing"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "테스트"
  - "Spring"
  - "Spring Test"
  - "@SpringBootTest"
  - "Testcontainers"
  - "@WebMvcTest"
  - "단위 테스트"
---
# 테스트

업무 로직, Spring 조립, 기술 슬라이스와 실제 연결의 검증 범위를 나눕니다.
테스트 애너테이션 이름보다 무엇을 실제로 실행했는지 드러내는 데 초점을 둡니다.

## 읽는 순서

작은 로직은 컨텍스트 없이 시험하고, 연결 규칙은 필요한 컨텍스트로 확인합니다.
실제 서버와 DB를 사용하는 테스트에서는 데이터 정리와 커밋, 외부 더미의 범위를 명시합니다.

| 글 | 다루는 내용 |
|---|---|
| [단위 테스트](./unit-tests.md) | Spring 컨텍스트 없는 단위 테스트로 입력, 분기와 협력 계약을 검증하고 Mock과 fake의 선택 기준을 설명합니다. |
| [Spring Context 테스트](./spring-context-tests.md) | SpringBootTest와 작은 컨텍스트 테스트의 목적, 빈 연결과 설정 검증 및 캐시와 테스트 격리를 설명합니다. |
| [테스트 슬라이스](./test-slices.md) | WebMvcTest와 DataJpaTest의 선택 범위, MockitoBean과 필터 및 자동 롤백의 한계를 설명합니다. |
| [통합 테스트와 Testcontainers](./integration-and-testcontainers.md) | 실제 포트와 DB를 사용하는 통합 테스트 및 Testcontainers의 서비스 연결, 데이터 정리와 시나리오 경계를 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### 슬라이스 테스트는 언제 쓰나요?

웹이나 JPA 등 계층만 빠르게 검증할 때 씁니다. 전체 맥락이 필요하면 @SpringBootTest로 올립니다.

### Testcontainers는 무엇에 쓰나요?

실제 DB나 브로커에 가까운 통합 검증에 사용합니다.

