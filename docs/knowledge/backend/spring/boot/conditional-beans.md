---
format: "md"
id: "spring-boot-conditional-beans"
title: "조건부 Bean 등록"
description: "Profile과 ConditionalOnProperty, ConditionalOnMissingBean을 사용한 기능 선택과 조건 테스트를 설명합니다."
slug: "/knowledge/backend/spring/boot/conditional-beans"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "조건부 Bean 등록"
  - "Spring"
  - "Spring Boot"
  - "Auto-configuration"
  - "Starter"
  - "SpringApplication"
  - "Graceful shutdown"
---
# 조건부 Bean 등록

기능을 켜거나 구현을 교체하려고 호출부마다 if문을 넣으면 설정 책임이 업무 코드로 퍼집니다.
빈 등록 단계에서 어떤 구현을 제공할지 결정하면 호출부는 같은 계약을 유지할 수 있습니다.
다만 잘못된 조건으로 필수 빈이 사라지지 않도록 검증해야 합니다.

## 속성으로 선택 기능을 켭니다

```java
@Configuration(proxyBeanMethods = false)
class ExportConfiguration {
    @Bean
    @ConditionalOnProperty(prefix = "feature.export", name = "enabled",
            havingValue = "true", matchIfMissing = false)
    ExportClient exportClient() {
        return new ExportClient();
    }
}
```

이 예제에서는 `feature.export.enabled=true`일 때만 빈을 등록합니다.
속성이 없거나 false이면 등록되지 않습니다.
`ExportClient`는 예제용 구현이며 해당 기능을 사용하지 않는 경로가 빈 누락을 어떻게 처리할지도 정해야 합니다.

| 조건 | 의미 | 흔한 오해 |
|---|---|---|
| Profile | 환경 또는 기능 묶음으로 설정을 선택합니다. | 보안 권한 검증이 아닙니다. |
| ConditionalOnProperty | 설정값으로 등록 여부를 결정합니다. | 런타임 값 변경이 빈을 즉시 다시 만들지는 않습니다. |
| ConditionalOnClass | 특정 클래스 존재를 확인합니다. | 외부 서버가 정상이라는 뜻은 아닙니다. |
| ConditionalOnMissingBean | 후보 빈 부재 시 기본값을 제공합니다. | 아무 설정 위치에서도 순서와 무관하게 동작하지는 않습니다. |

`@ConditionalOnMissingBean`은 먼저 처리된 정의를 기준으로 판단하므로 자동 설정에서 사용자 빈이 우선하도록 설계할 때 특히 유용합니다.
일반 설정 클래스 사이의 순서 문제를 해결하는 범용 도구로 쓰지는 않습니다.

## 기본 구현을 제공하는 경우

기능을 껐을 때도 같은 인터페이스가 필요하면 명시적인 비활성 구현을 선택할 수 있습니다.
비활성 구현이 성공한 척 데이터를 버리게 만들면 운영자가 오해할 수 있습니다.
호출을 거절할지, 건너뛰고 기록할지 업무 계약으로 정합니다.

## 조건 자체를 테스트합니다

```java
new ApplicationContextRunner()
    .withUserConfiguration(ExportConfiguration.class)
    .withPropertyValues("feature.export.enabled=false")
    .run(context -> assertThat(context).doesNotHaveBean(ExportClient.class));
```

이 코드는 Boot 테스트와 AssertJ가 있는 테스트의 부분 예제입니다.
true, false, 속성 없음의 세 경우를 검증하고 필요한 경우 사용자 구현이 우선되는지도 확인합니다.

스위치가 설정 파일에 있다는 이유로 운영 중 즉시 변경된다고 가정하지 않습니다.
Environment 갱신과 빈 재생성, 요청별 정책 조회는 서로 다른 기능입니다.
정말 동적 제어가 필요하면 설정 읽기 시점과 캐시 정책을 별도로 정합니다.

조건의 처리 순서는 [자동 설정 작성 문서](https://docs.spring.io/spring-boot/3.5/reference/features/developing-auto-configuration.html)를 참고합니다.

## 자주 묻는 질문

### 스타터만 넣으면 설정이 끝나나요?

스타터는 의존성과 자동 설정 후보를 가져옵니다. 조건과 오버라이드, 제외도 함께 확인합니다.

### Graceful shutdown은 언제 필요한가요?

진행 중 요청을 끊지 않고 종료하려면 종료 타임아웃과 커넥터 설정을 맞춥니다.

