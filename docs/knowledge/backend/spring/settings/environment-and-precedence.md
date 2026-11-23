---
format: "md"
id: "spring-settings-environment-and-precedence"
title: "Environment와 설정 우선순위"
description: "설정 우선순위를 파일, 환경 변수, JVM 속성과 실행 인수로 비교하고 값의 출처를 추적하는 방법을 설명합니다."
slug: "/knowledge/backend/spring/settings/environment-and-precedence"
sidebar_position: 2
status: "active"
tags:
  - "Spring"
keywords:
  - "Environment와 설정 우선순위"
  - "Spring"
  - "application.yml"
  - "Profile"
  - "ConfigurationProperties"
  - "@Value"
  - "Environment"
  - "Spring 설정"
---
# Environment와 설정 우선순위

파일을 고쳤는데 동작이 바뀌지 않으면 설정 우선순위를 확인합니다.
같은 키가 여러 출처에 있으면 최종값은 파일의 위치뿐 아니라 실행 인수와 테스트 설정에도 영향을 받습니다.
설정이 없어서 실패한 경우와 다른 값으로 덮인 경우는 원인이 다릅니다.

## 자주 만나는 출처를 비교합니다

Boot 3.5의 전체 순서 중 일반적인 서버 실행에서 자주 사용하는 일부를 추린 표입니다.
아래쪽이 위쪽 값을 덮을 수 있으며, Servlet 전용 속성과 테스트 설정 등은 생략했습니다.

| 출처 | 예시 |
|---|---|
| jar 안의 기본 파일 | application.yml |
| jar 안의 프로필 파일 | application-local.yml |
| 외부 설정 파일 | 실행 디렉터리의 config/application.yml |
| 외부 프로필 파일 | config/application-local.yml |
| OS 환경 변수 | SERVER_PORT |
| JVM 시스템 속성 | -Dserver.port |
| 명령행 인수 | --server.port |

환경 변수 이름은 마침표를 밑줄로 바꾸고 대시를 제거한 뒤 대문자로 표현하는 규칙을 따릅니다.
예를 들어 `app.client.base-url`은 `APP_CLIENT_BASEURL` 형태로 바인딩할 수 있습니다.
운영체제와 설정 전달 도구가 이름을 어떻게 취급하는지도 확인합니다.

## 충돌을 직접 재현합니다

```bash
SERVER_PORT=8091 java -Dserver.port=8092 -jar app.jar --server.port=8093
```

기본 명령행 속성 처리가 켜진 Boot 실행에서는 최종 포트가 8093이 됩니다.
이 예제는 우선순위 확인용이며 운영 포트를 실제로 바꾸기 전에 별도 환경에서 확인합니다.
`-D`는 JVM 인수이므로 `-jar` 앞에, `--`는 애플리케이션 인수이므로 jar 이름 뒤에 둡니다.

```java
@Component
class PortCheck implements ApplicationRunner {
    private final Environment environment;

    PortCheck(Environment environment) { this.environment = environment; }

    public void run(ApplicationArguments args) {
        System.out.println(environment.getProperty("server.port"));
    }
}
```

설정값이 0인 임의 포트 사용 환경에서는 이 값과 실제 바인딩 포트가 다를 수 있습니다.
실제 서버 포트는 웹 서버 시작 정보로 확인합니다.

## 값의 출처까지 추적합니다

Actuator의 env와 configprops는 속성 출처와 바인딩 문제를 찾는 데 도움이 됩니다.
다만 엔드포인트를 인증 없이 공개하거나 비밀 값을 노출시키지 않습니다.
운영에서는 필요한 항목만 접근할 수 있게 제한하고 진단이 끝난 뒤 설정을 정리합니다.

테스트의 속성 우선순위는 일반 실행과 추가 출처가 다릅니다.
`@DynamicPropertySource`, 테스트 속성과 프로필 때문에 개발 서버에서는 성공하고 테스트에서만 실패할 수 있습니다.
또한 리스트는 환경별 설정에서 항목별 병합이 아니라 전체 대체가 일어날 수 있으므로 최종 목록을 확인합니다.

전체 PropertySource 순서와 리스트 규칙은 [Boot 외부 설정 공식 문서](https://docs.spring.io/spring-boot/3.5/reference/features/external-config.html)를 기준으로 확인합니다.

## 자주 묻는 질문

### profile과 외부 설정 중 무엇이 우선하나요?

Spring Environment의 우선순위 규칙을 따릅니다. 로컬 파일과 환경 변수, 커맨드라인 인자를 함께 봅니다.

### @Value와 ConfigurationProperties는 언제 쓰나요?

단일 값은 @Value, 묶음 설정과 검증은 ConfigurationProperties가 읽기 쉽습니다.

