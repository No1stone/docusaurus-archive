---
format: "md"
id: "spring-settings-value-and-configuration-properties"
title: "Value와 ConfigurationProperties"
description: "Value와 ConfigurationProperties의 책임을 비교하고 타입 바인딩, 등록 방법과 설정 검증을 설명합니다."
slug: "/knowledge/backend/spring/settings/value-and-configuration-properties"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "Value와 ConfigurationProperties"
  - "Spring"
  - "application.yml"
  - "Profile"
  - "ConfigurationProperties"
  - "@Value"
  - "Environment"
  - "Spring 설정"
---
# Value와 ConfigurationProperties

설정을 한두 개 읽을 때와 여러 값을 한 묶음으로 관리할 때는 필요한 도구가 다릅니다.
`@Value`는 개별 값 주입에 편리하고, `@ConfigurationProperties`는 접두사가 같은 설정을 타입으로 모으는 데 적합합니다.

## 개별 값을 주입하는 경우

```java
@Component
class Greeting {
    private final String name;

    Greeting(@Value("${app.name:catalog}") String name) {
        this.name = name;
    }
}
```

기본값은 설정이 없을 때의 동작을 결정합니다.
필수 URL이나 비밀번호에 임의의 기본값을 주면 기동은 성공해도 다른 환경에 접근할 수 있으므로 신중히 정합니다.
SpEL을 사용할 수 있다는 점과 타입 안전한 설정 묶음은 별개입니다.

## 관련 값을 한 객체로 받습니다

아래는 Boot 3.5에서 검증 의존성이 포함된 경우의 예제입니다.
record는 설정 바인딩의 불변 객체 예시이며 모든 프로젝트 DTO에 record를 강제하는 규칙은 아닙니다.

```java
@Validated
@ConfigurationProperties(prefix = "app.client")
public record ClientProperties(
        @NotNull URI baseUrl,
        @NotNull Duration timeout,
        @Min(1) int maxAttempts) { }

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(ClientProperties.class)
class ClientConfiguration { }
```

```yaml
app:
  client:
    base-url: https://api.example.invalid
    timeout: 2s
    max-attempts: 2
```

등록은 `@EnableConfigurationProperties` 또는 설정 속성 스캔으로 수행합니다.
파일과 클래스 이름만 만들어 놓고 등록을 생략하면 빈으로 주입되지 않습니다.
일반 JavaBean 방식의 클래스와 getter, setter를 사용하는 바인딩도 지원합니다.

| 기준 | Value | ConfigurationProperties |
|---|---|---|
| 사용 범위 | 작은 개별 값에 적합합니다. | 관련 설정을 묶기에 적합합니다. |
| 타입과 중첩 구조 | 주입 지점별로 표현합니다. | 구조화된 바인딩을 제공합니다. |
| 검증 | 별도 처리를 검토합니다. | Validated와 제약을 결합하기 쉽습니다. |
| 테스트 | 사용자 객체를 직접 구성합니다. | 설정 묶음과 바인딩을 따로 시험할 수 있습니다. |

## 바인딩 성공과 유효한 설정은 다릅니다

URI로 변환됐다고 허용된 외부 주소라는 뜻은 아닙니다.
Duration으로 읽혔다고 양수라는 뜻도 아닙니다.
범위와 조합 검증을 추가하고, 타입 변환 오류와 업무상 허용되지 않는 설정을 구분합니다.

설정 객체의 자동 생성 `toString()`에 비밀 값이 들어갈 수 있습니다.
디버깅을 위해 객체 전체를 로그에 남기지 않고, 민감 필드는 출력에서 제외합니다.
설정은 기동 시 바인딩되는 경우가 일반적이며 파일 수정이 실행 중 객체를 즉시 갱신하지는 않습니다.

검증과 등록 방식은 [타입 안전한 설정](https://docs.spring.io/spring-boot/3.5/reference/features/external-config.html#features.external-config.typesafe-configuration-properties)을 참고합니다.

## 자주 묻는 질문

### profile과 외부 설정 중 무엇이 우선하나요?

Spring Environment의 우선순위 규칙을 따릅니다. 로컬 파일과 환경 변수, 커맨드라인 인자를 함께 봅니다.

### @Value와 ConfigurationProperties는 언제 쓰나요?

단일 값은 @Value, 묶음 설정과 검증은 ConfigurationProperties가 읽기 쉽습니다.

