---
format: "md"
id: "spring-boot-starters"
title: "Starter와 의존성 관리"
description: "Starter와 BOM의 차이, 의존성 버전 관리 및 런타임 의존성 확인 방법을 설명합니다."
slug: "/knowledge/backend/spring/boot/starters"
sidebar_position: 4
status: "active"
tags:
  - "Spring"
keywords:
  - "Starter와 의존성 관리"
  - "Spring"
  - "Spring Boot"
  - "Auto-configuration"
  - "Starter"
  - "SpringApplication"
  - "Graceful shutdown"
---
# Starter와 의존성 관리

Starter는 특정 기능을 시작하는 데 필요한 의존성을 모아 둔 출발점입니다.
직접 jar 목록을 조합하는 부담을 줄이지만, 추가되는 라이브러리와 자동 설정의 영향을 확인할 책임은 남습니다.

## Starter, BOM, 플러그인은 다른 역할입니다

| 요소 | 하는 일 | 하지 않는 일 |
|---|---|---|
| Starter | 관련 의존성을 묶습니다. | 업무 기능을 완성하지 않습니다. |
| BOM | 라이브러리 버전 조합을 관리합니다. | 라이브러리를 자동으로 전부 추가하지 않습니다. |
| Boot 빌드 플러그인 | 실행 가능한 산출물 등의 빌드를 지원합니다. | 모든 의존성 선택을 대신하지 않습니다. |

Boot 3.5 Gradle 프로젝트에서 Web Starter를 추가하는 부분 예제입니다.
플러그인과 Boot 의존성 관리는 Initializr 등으로 이미 구성돼 있다고 가정합니다.

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

관리되는 라이브러리 버전을 매번 적지 않으면 Boot가 검증하는 조합을 따르기 쉽습니다.
그러나 버전 관리를 적용하지 않은 Gradle 구성에서 버전을 생략하면 해석되지 않습니다.
Boot 플러그인 적용 여부와 BOM 적용 여부를 별도로 확인합니다.

## 실제로 들어온 의존성을 봅니다

```bash
./gradlew dependencies --configuration runtimeClasspath
./gradlew dependencyInsight --dependency spring-web --configuration runtimeClasspath
```

첫 명령은 런타임 의존성 트리를, 두 번째는 특정 라이브러리의 선택 경로와 버전을 확인합니다.
라이브러리 두 개가 서로 다른 버전을 요구할 때 최종 결과가 무엇인지 찾는 데 유용합니다.
빌드 파일 한 줄만 보고 실행 환경에 들어간 버전을 확정하지 않습니다.

보안 업데이트로 버전을 직접 덮어쓸 때는 API 호환성뿐 아니라 Boot가 사용한 조합에서 벗어나는 영향도 확인합니다.
버전을 고정했다는 사실과 해당 취약점이 수정됐다는 사실은 별도 근거가 필요합니다.

## 기능을 추가할 때 같이 생기는 것

JPA Starter는 Repository뿐 아니라 ORM, 트랜잭션과 DataSource 구성에도 영향을 줍니다.
Web과 WebFlux를 함께 추가했다고 모든 Controller가 논블로킹으로 전환되지는 않습니다.
클라이언트 전용 사용이라면 서버 실행 모델까지 필요했는지 점검합니다.

필요한 Starter를 최소로 선택하면 기동 조건과 테스트 범위를 이해하기 쉽습니다.
공통 라이브러리가 모든 Starter를 전이 의존성으로 가져오게 하면 사용하지 않는 앱까지 설정 영향을 받을 수 있습니다.
공통 계약과 기술 구현 의존성을 나누는 이유가 여기에 있습니다.

Starter 목록과 버전 관리 방식은 [Boot 빌드 시스템 안내](https://docs.spring.io/spring-boot/3.5/reference/using/build-systems.html)를 참고합니다.
Boot 4 계열에서는 모듈과 Starter 구성이 달라질 수 있으므로 해당 버전의 목록으로 다시 확인합니다.

## 자주 묻는 질문

### 스타터만 넣으면 설정이 끝나나요?

스타터는 의존성과 자동 설정 후보를 가져옵니다. 조건과 오버라이드, 제외도 함께 확인합니다.

### Graceful shutdown은 언제 필요한가요?

진행 중 요청을 끊지 않고 종료하려면 종료 타임아웃과 커넥터 설정을 맞춥니다.

