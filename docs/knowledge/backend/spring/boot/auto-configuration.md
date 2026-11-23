---
format: "md"
id: "spring-boot-auto-configuration"
title: "SpringBootApplication과 자동 설정"
description: "SpringBootApplication의 구성과 조건부 자동 설정, 사용자 빈에 따른 후퇴 및 조건 보고서 확인을 설명합니다."
slug: "/knowledge/backend/spring/boot/auto-configuration"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "SpringBootApplication과 자동 설정"
  - "Spring"
  - "Spring Boot"
  - "Auto-configuration"
  - "Starter"
  - "SpringApplication"
  - "Graceful shutdown"
---
# SpringBootApplication과 자동 설정

Boot의 자동 설정은 프로젝트에 어떤 라이브러리와 빈이 있는지 보고 기본 구성을 제안합니다.
모든 설정을 무조건 등록하는 기능은 아닙니다.
따라서 의존성을 하나 추가했을 때 동작이 달라지면 어떤 조건이 새로 충족됐는지 찾아봅니다.

## SpringBootApplication의 세 역할

| 구성 | 역할 |
|---|---|
| SpringBootConfiguration | Boot 애플리케이션의 설정 클래스임을 나타냅니다. |
| EnableAutoConfiguration | 자동 설정 후보를 가져옵니다. |
| ComponentScan | 애플리케이션 컴포넌트를 탐색합니다. |

사용자 코드 스캔과 자동 설정 후보 탐색은 같은 경로가 아닙니다.
공통 라이브러리의 자동 설정이 실행 클래스의 하위 패키지에 없어도 적용될 수 있는 이유입니다.
Boot 3 계열의 자동 설정 라이브러리는 `AutoConfiguration.imports` 등록 방식도 확인합니다.

## 조건이 맞을 때 기본 빈을 제공합니다

```mermaid
flowchart LR
    Classpath[클래스 존재] --> Property[설정 조건]
    Property --> Existing[기존 빈 확인]
    Existing --> Configure[기본 구성 등록]
```

예를 들어 DataSource 자동 설정은 관련 클래스와 환경, 사용자가 제공한 빈 등을 보고 결정됩니다.
DataSource를 직접 정의하면 관련 기본 구성 일부가 물러날 수 있습니다.
이를 자동 설정의 back-off라고 부릅니다.
모든 자동 설정이 같은 조건을 갖는 것은 아니므로 실제 조건 보고서를 확인합니다.

```bash
java -jar app.jar --debug
```

출력의 positive matches와 negative matches에서 조건이 맞거나 맞지 않은 이유를 찾습니다.
Actuator의 conditions 엔드포인트도 사용할 수 있지만 공개 노출 범위와 접근 권한을 제한해야 합니다.

## 제외는 원인을 확인한 뒤 적용합니다

```java
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class ClientOnlyApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClientOnlyApplication.class, args);
    }
}
```

DB를 사용하지 않는 클라이언트 서버의 의도적인 제외 예제입니다.
먼저 불필요한 JDBC 또는 JPA 의존성을 제거할 수 있는지도 검토합니다.
오류를 없애기 위해 설정을 제외했는데 실제 업무에 DB가 필요하다면 문제를 뒤로 미룬 것에 불과합니다.

## 변경 결과를 검증합니다

기본 빈을 사용자 빈으로 바꾼 뒤에는 예상한 타입과 설정값이 사용되는지 확인합니다.
조건부 빈 테스트에는 `ApplicationContextRunner`를 사용해 속성과 클래스 유무에 따른 결과를 작게 검증할 수 있습니다.
전체 서버가 켜졌다는 사실만으로 자동 설정 교체가 의도대로 됐다고 판단하지 않습니다.

자동 설정은 시작 비용을 줄여 주지만 설정 책임을 없애지는 않습니다.
특히 다중 DataSource, 여러 실행기와 복수 HTTP 클라이언트는 이름과 기본 후보를 명시하는 편이 안전합니다.

후퇴와 조건 보고서는 [자동 설정 공식 안내](https://docs.spring.io/spring-boot/3.5/reference/using/auto-configuration.html), 라이브러리 제작은 [자동 설정 작성](https://docs.spring.io/spring-boot/3.5/reference/features/developing-auto-configuration.html)을 참고합니다.

## 자주 묻는 질문

### 스타터만 넣으면 설정이 끝나나요?

스타터는 의존성과 자동 설정 후보를 가져옵니다. 조건과 오버라이드, 제외도 함께 확인합니다.

### Graceful shutdown은 언제 필요한가요?

진행 중 요청을 끊지 않고 종료하려면 종료 타임아웃과 커넥터 설정을 맞춥니다.

