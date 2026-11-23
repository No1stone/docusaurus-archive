---
format: "md"
id: "spring-boot-spring-application"
title: "SpringApplication과 실행 과정"
description: "SpringApplication의 기동 단계와 컨텍스트 준비, 시작 실패 분석 및 실행 모드를 설명합니다."
slug: "/knowledge/backend/spring/boot/spring-application"
sidebar_position: 1
status: "active"
tags:
  - "Spring"
keywords:
  - "SpringApplication과 실행 과정"
  - "Spring"
  - "Spring Boot"
  - "Auto-configuration"
  - "Starter"
  - "SpringApplication"
  - "Graceful shutdown"
---
# SpringApplication과 실행 과정

`SpringApplication.run()`은 main 메서드에서 HTTP 서버만 여는 함수가 아닙니다.
환경 설정을 준비하고 컨텍스트를 만들며, 빈과 실행기를 초기화하는 시작 경로입니다.
기동 오류를 읽을 때는 어느 단계까지 진행됐는지 확인하면 범위를 줄일 수 있습니다.

## 실행 진입점

```java
@SpringBootApplication
public class CatalogApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogApplication.class, args);
    }
}
```

인수는 Boot의 Environment 구성에도 참여합니다.
예를 들어 `--server.port=8090`은 웹 서버 포트 설정을 전달합니다.
JVM 옵션과 애플리케이션 인수는 위치가 다릅니다.

```bash
java -Xms64m -Xmx512m -jar app.jar --server.port=8090
```

메모리 값은 사용 예제이며 권장 용량이 아닙니다.
힙 크기 외에도 스레드, 메타스페이스와 네이티브 메모리가 사용됩니다.

## 기동 단계에서 생기는 일

```mermaid
flowchart LR
    Run[실행] --> Environment[설정 준비]
    Environment --> Context[컨텍스트 생성과 refresh]
    Context --> Started[Started 이벤트]
    Started --> Runner[Runner 실행]
    Runner --> Ready[Ready 이벤트]
```

컨텍스트 refresh 과정에서 빈 생성과 내장 웹 서버 준비가 진행됩니다.
웹 서버가 시작됐다는 로그만으로 모든 Runner가 완료됐다고 보지는 않습니다.
애플리케이션 readiness와 로드밸런서의 트래픽 전달 시점도 일치하도록 구성해야 합니다.

| 관찰 지점 | 주로 찾을 문제 |
|---|---|
| 설정 준비 | 설정 파일 위치, 프로필, placeholder |
| 빈 생성 | 의존성 누락, 순환 참조, 초기화 예외 |
| 웹 서버 시작 | 포트 충돌, 서버 설정 |
| Runner | 초기 적재, 외부 서비스 연결, 마이그레이션 |

## 웹 서버 없이 실행하기

배치나 CLI라면 웹 애플리케이션 유형을 명시할 수 있습니다.

```java
SpringApplication app = new SpringApplication(CatalogApplication.class);
app.setWebApplicationType(WebApplicationType.NONE);
app.run(args);
```

웹 의존성이 있다고 항상 외부 HTTP 서버가 필요하지는 않습니다.
반대로 컨텍스트가 종료됐는지와 JVM이 종료됐는지는 남은 비데몬 스레드에 따라서도 달라집니다.
실행 모드를 바꿀 때 스케줄러와 실행기의 종료 정책을 함께 봅니다.

실패 분석에서는 가장 바깥의 `Application run failed`만 읽지 않고 원인 예외와 의존성 경로를 확인합니다.
`--debug`는 자동 설정 조건 보고서를 볼 때 유용하지만 비밀 설정을 콘솔로 덤프하는 수단으로 사용하지 않습니다.
설정 변경 후에는 프로세스를 재시작하고 실제 포트와 활성 프로필을 확인합니다.

기동 이벤트와 실패 분석 기능은 [SpringApplication 공식 문서](https://docs.spring.io/spring-boot/3.5/reference/features/spring-application.html)를 참고합니다.

## 자주 묻는 질문

### 스타터만 넣으면 설정이 끝나나요?

스타터는 의존성과 자동 설정 후보를 가져옵니다. 조건과 오버라이드, 제외도 함께 확인합니다.

### Graceful shutdown은 언제 필요한가요?

진행 중 요청을 끊지 않고 종료하려면 종료 타임아웃과 커넥터 설정을 맞춥니다.

