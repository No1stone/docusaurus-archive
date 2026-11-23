---
format: "md"
id: "spring-settings-binding-and-validation"
title: "설정값 바인딩과 검증"
description: "설정 바인딩의 타입 변환, 중첩 검증과 잘못된 설정을 기동 시 차단하는 테스트를 설명합니다."
slug: "/knowledge/backend/spring/settings/binding-and-validation"
sidebar_position: 4
status: "active"
tags:
  - "Spring"
keywords:
  - "설정값 바인딩과 검증"
  - "Spring"
  - "application.yml"
  - "Profile"
  - "ConfigurationProperties"
  - "@Value"
  - "Environment"
  - "Spring 설정"
---
# 설정값 바인딩과 검증

설정은 문자열로 들어와도 코드에서는 Duration, URI, 숫자와 목록으로 사용합니다.
바인딩은 이 변환을 수행하고, 검증은 변환된 값이 서비스에서 허용되는지 판단합니다.
두 단계를 구분하면 실패 메시지를 읽기 쉽습니다.

## 중첩 객체까지 검증합니다

```java
@Validated
@ConfigurationProperties(prefix = "app.export")
public record ExportProperties(
        @Min(1) @Max(1000) int batchSize,
        @NotNull @Valid Retry retry) {
    public record Retry(@Min(1) @Max(5) int attempts) { }
}
```

이 예제는 `jakarta.validation` 제약과 검증 구현이 classpath에 있다고 가정합니다.
`@EnableConfigurationProperties(ExportProperties.class)` 등으로 등록해야 합니다.
중첩 검증에는 `@Valid`를, 중첩 객체 자체가 필수이면 `@NotNull`도 사용합니다.

```yaml
app:
  export:
    batch-size: 100
    retry:
      attempts: 3
```

기본값이 없는 primitive는 설정이 빠졌을 때 0처럼 들어올 수 있으므로 최소값 검증이 누락을 드러내는 역할도 합니다.
누락과 명시적 0을 다르게 취급해야 한다면 wrapper 타입과 기본값 정책을 선택합니다.

| 실패 단계 | 예시 | 확인 대상 |
|---|---|---|
| 파일 해석 | 잘못된 YAML | 들여쓰기와 키 |
| 타입 변환 | 숫자 필드에 abc | 대상 타입과 입력 형식 |
| 단일 값 검증 | batch-size가 0 | Min, Max 등의 제약 |
| 조합 검증 | 최소 시간이 최대 시간보다 큼 | 별도 검증기나 생성 시 검사 |

## 잘못된 설정을 테스트합니다

```java
new ApplicationContextRunner()
    .withUserConfiguration(ExportConfiguration.class)
    .withPropertyValues("app.export.batch-size=0",
                        "app.export.retry.attempts=3")
    .run(context -> assertThat(context).hasFailed());
```

`ExportConfiguration`은 설정 속성을 등록하는 테스트 구성입니다.
실제 테스트에는 정상 바인딩, 필수값 누락, 잘못된 단위와 범위 초과를 나눠 둡니다.
실패했다는 사실만 확인하기보다 원인 메시지와 대상 속성이 예상과 같은지도 확인합니다.

## 허용 범위는 설정 사용처와 연결합니다

배치 크기가 양수라고 운영 DB에 적절한 크기인 것은 아닙니다.
검증 범위는 잘못된 입력을 차단하는 기준이고, 실제 최적값은 측정과 운영 정책으로 정합니다.
요청 DTO 검증과 기동 설정 검증도 같은 이름의 애너테이션을 쓰더라도 실행 시점이 다릅니다.

알 수 없는 키를 무조건 무시하지 않으려면 `ignoreUnknownFields` 정책도 검토합니다.
다만 공유 접두사에 여러 설정 클래스가 있는 구조에서는 의도한 속성까지 거부할 수 있으므로 범위를 먼저 정리합니다.
민감 값은 실패 메시지에도 출력될 수 있어 진단 로그의 보관과 접근 권한을 확인합니다.

바인딩과 검증 기준은 [Boot Configuration Properties 문서](https://docs.spring.io/spring-boot/3.5/reference/features/external-config.html#features.external-config.typesafe-configuration-properties.validation)를 참고합니다.

## 자주 묻는 질문

### profile과 외부 설정 중 무엇이 우선하나요?

Spring Environment의 우선순위 규칙을 따릅니다. 로컬 파일과 환경 변수, 커맨드라인 인자를 함께 봅니다.

### @Value와 ConfigurationProperties는 언제 쓰나요?

단일 값은 @Value, 묶음 설정과 검증은 ConfigurationProperties가 읽기 쉽습니다.

