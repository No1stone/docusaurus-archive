---
format: "md"
id: "spring-settings-index"
title: "설정과 환경"
description: "application 설정, 프로필, Environment 우선순위, 바인딩과 검증을 다루는 입구입니다."
slug: "/knowledge/backend/spring/settings"
sidebar_position: 0
status: "active"
tags:
  - "Spring"
keywords:
  - "설정과 환경"
  - "Spring"
  - "application.yml"
  - "Profile"
  - "ConfigurationProperties"
  - "@Value"
  - "Environment"
  - "Spring 설정"
---
# 설정과 환경

파일, 환경 변수와 실행 인수를 코드의 설정 객체로 연결하는 과정을 다룹니다.
설정의 형식, 출처와 검증을 구분하면 환경마다 다른 동작을 추적하기 쉽습니다.

## 읽는 순서

형식을 고른 뒤 프로필과 우선순위를 확인하고, 관련 값은 설정 객체로 묶습니다.
필수값 누락과 범위 오류는 가능한 한 시작할 때 발견하되, 민감 값을 진단 로그에 노출하지 않습니다.

| 글 | 다루는 내용 |
|---|---|
| [application.yml과 properties](./application-yml-and-properties.md) | YAML과 properties의 계층 표현, 리스트, 문서 분리와 설정 파일 선택 시 주의점을 설명합니다. |
| [Environment와 설정 우선순위](./environment-and-precedence.md) | 설정 우선순위를 파일, 환경 변수, JVM 속성과 실행 인수로 비교하고 값의 출처를 추적하는 방법을 설명합니다. |
| [Value와 ConfigurationProperties](./value-and-configuration-properties.md) | Value와 ConfigurationProperties의 책임을 비교하고 타입 바인딩, 등록 방법과 설정 검증을 설명합니다. |
| [설정값 바인딩과 검증](./binding-and-validation.md) | 설정 바인딩의 타입 변환, 중첩 검증과 잘못된 설정을 기동 시 차단하는 테스트를 설명합니다. |
| [Profile과 환경별 설정](./profiles.md) | Profile을 통한 환경별 설정과 빈 선택, 프로필 그룹 및 운영 환경 오선택 방지 방법을 설명합니다. |
| [외부 설정과 리소스 로딩](./external-config-and-resources.md) | Config Import와 외부 파일 및 classpath Resource를 구분하고 실행 jar의 리소스 접근과 비밀 설정 분리를 설명합니다. |

## 예제의 기준

기본 설명은 Spring Boot 3.5와 Framework 6.2입니다.
다른 버전이 필요한 기능은 해당 글에서 구분합니다.
별도 언급이 없는 코드 조각은 import와 프로젝트 설정을 생략한 설명용이며, 필요한 협력 객체와 전제는 본문에 적었습니다.

이전 메모는 [Legacy](../legacy/index.md)에 보존합니다.
새 글에서 재사용한 예제는 현재 API와 주의점을 함께 설명합니다.

## 자주 묻는 질문

### profile과 외부 설정 중 무엇이 우선하나요?

Spring Environment의 우선순위 규칙을 따릅니다. 로컬 파일과 환경 변수, 커맨드라인 인자를 함께 봅니다.

### @Value와 ConfigurationProperties는 언제 쓰나요?

단일 값은 @Value, 묶음 설정과 검증은 ConfigurationProperties가 읽기 쉽습니다.

