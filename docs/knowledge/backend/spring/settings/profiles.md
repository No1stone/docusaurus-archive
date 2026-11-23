---
format: "md"
id: "spring-settings-profiles"
title: "Profile과 환경별 설정"
description: "Profile을 통한 환경별 설정과 빈 선택, 프로필 그룹 및 운영 환경 오선택 방지 방법을 설명합니다."
slug: "/knowledge/backend/spring/settings/profiles"
sidebar_position: 5
status: "active"
tags:
  - "Spring"
keywords:
  - "Profile과 환경별 설정"
  - "Spring"
  - "application.yml"
  - "Profile"
  - "ConfigurationProperties"
  - "@Value"
  - "Environment"
  - "Spring 설정"
---
# Profile과 환경별 설정

프로필은 특정 환경이나 기능 묶음에만 설정을 적용하는 선택 도구입니다.
보통 local, test, production 같은 이름을 사용하지만 이름 자체에 특별한 보안 기능이 있는 것은 아닙니다.
운영 프로필이라는 이름만으로 테스트 API가 차단되거나 비밀번호가 보호되지는 않습니다.

## 공통과 차이를 나눕니다

```yaml
# application.yml
spring:
  application:
    name: catalog
app:
  export:
    enabled: false
```

```yaml
# application-local.yml
server:
  port: 8090
app:
  export:
    enabled: true
```

```bash
java -jar app.jar --spring.profiles.active=local
```

환경별 파일에는 달라지는 값만 둡니다.
모든 설정을 파일마다 복사하면 공통 기본값이 서로 달라지기 쉽습니다.
활성 프로필이 여러 개면 겹치는 값의 적용 순서까지 확인해야 합니다.

## 빈도 환경에 맞춰 고를 수 있습니다

```java
@Configuration(proxyBeanMethods = false)
@Profile("local")
class LocalClockConfiguration {
    @Bean
    Clock clock() {
        return Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);
    }
}
```

이 설정은 예제용 고정 시간을 local에서만 등록합니다.
다른 환경의 Clock도 정의하고, 같은 시점에 두 구현이 등록되지 않도록 조건을 맞춥니다.
인증 여부나 사용자 역할에 따라 선택해야 하는 정책을 기동 시 프로필로 대신하면 요청마다 달라지는 조건을 표현할 수 없습니다.

| 선택 대상 | 적합한 수단 |
|---|---|
| 기동 환경별 구성 | Profile |
| 배포 시 기능 활성화 | 설정 속성과 조건부 빈 |
| 요청별 사용자 권한 | 인증된 요청에 대한 권한 판단 |
| 실행 중 정책 변경 | 정책 저장소와 조회 또는 갱신 경로 |

## 프로필 그룹과 운영 확인

```yaml
spring:
  profiles:
    group:
      production:
        - database
        - messaging
```

그룹은 한 이름으로 관련 프로필을 묶는 예제입니다.
그룹 선언과 활성 프로필 설정은 프로필 전용 문서가 아닌 적절한 기본 설정에 둡니다.
환경 변수로 들어온 프로필이 로컬 기본값을 덮는 경우도 있으므로 기동 로그의 활성 프로필을 확인합니다.

운영 배포에서는 프로필을 생략했을 때 위험한 기본 구성이 선택되지 않도록 설계합니다.
더미 클라이언트나 테스트 화면은 긍정적인 허용 조건을 두고, 실제 접근 제어도 함께 적용합니다.
`@Profile("!production")` 하나만으로 모든 운영 환경 이름을 보호할 수 있다고 보지 않습니다.

테스트에서는 local과 production을 각각 활성화해 후보 빈과 대표 설정을 확인합니다.
프로필 선택 실패를 단위 테스트의 업무 오류와 섞지 않습니다.

그룹과 프로필 제한은 [Boot Profiles 문서](https://docs.spring.io/spring-boot/3.5/reference/features/profiles.html)를 참고합니다.

## 자주 묻는 질문

### profile과 외부 설정 중 무엇이 우선하나요?

Spring Environment의 우선순위 규칙을 따릅니다. 로컬 파일과 환경 변수, 커맨드라인 인자를 함께 봅니다.

### @Value와 ConfigurationProperties는 언제 쓰나요?

단일 값은 @Value, 묶음 설정과 검증은 ConfigurationProperties가 읽기 쉽습니다.

