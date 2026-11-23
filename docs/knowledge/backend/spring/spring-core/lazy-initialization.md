---
format: "md"
id: "spring-spring-core-lazy-initialization"
title: "Lazy 초기화"
description: "Lazy의 빈 생성 지연과 주입 프록시를 구분하고 첫 요청 지연, 실패 시점 및 DependsOn의 한계를 설명합니다."
slug: "/knowledge/backend/spring/spring-core/lazy-initialization"
sidebar_position: 6
status: "active"
tags:
  - "Spring"
keywords:
  - "Lazy 초기화"
  - "Spring"
  - "Spring Core"
  - "IoC"
  - "DI"
  - "Bean"
  - "ApplicationContext"
  - "AOP"
  - "의존성 주입"
---
# Lazy 초기화

지연 초기화는 필요할 때까지 객체 생성을 미루는 기능입니다.
기동 시간이 짧아질 수 있지만, 원래 시작할 때 발견하던 문제를 첫 사용 시점으로 옮길 수도 있습니다.
따라서 빨리 기동했다는 결과만으로 적용 효과를 판단하지 않습니다.

## 빈 정의와 주입 지점의 Lazy

```java
@Configuration(proxyBeanMethods = false)
class ExportConfiguration {
    @Bean
    @Lazy
    ReportExporter reportExporter() {
        return new ReportExporter();
    }
}
```

빈 정의에 붙인 `@Lazy`는 그 빈을 미리 생성하지 않도록 합니다.
그러나 eager 싱글턴이 생성자에서 그 빈을 직접 요구하면 의존성을 충족하려고 생성할 수 있습니다.
주입 지점에 `@Lazy`를 붙이면 실제 대상 접근을 늦추는 프록시를 받을 수 있습니다.

```java
@Service
class ExportService {
    private final ReportExporter exporter;

    ExportService(@Lazy ReportExporter exporter) {
        this.exporter = exporter;
    }
}
```

Boot에서는 `spring.main.lazy-initialization=true`로 애플리케이션 범위의 지연 초기화를 설정할 수 있습니다.
이 경우에도 라이프사이클 빈과 프레임워크 처리 과정까지 모두 첫 요청으로 미뤄진다는 의미는 아닙니다.

## 실패 시점이 바뀝니다

```mermaid
flowchart LR
    Start[기동] --> Ready[서버 준비]
    Ready --> Request[첫 기능 호출]
    Request --> Create[대상 빈 생성]
    Create --> Result[성공 또는 초기화 실패]
```

외부 SDK 로딩이나 큰 로컬 데이터 준비가 첫 요청에 몰릴 수 있습니다.
readiness가 통과한 뒤 특정 기능만 실패할 수도 있습니다.
핵심 기능은 워밍업하거나 시작 시 검증을 남기는 방법을 검토합니다.

| 이점 | 함께 측정할 비용 |
|---|---|
| 시작할 때 만들 객체가 줄어듭니다. | 첫 요청 응답 시간이 늘 수 있습니다. |
| 사용하지 않는 기능의 초기화를 피합니다. | 설정 오류 발견이 늦어질 수 있습니다. |
| 개발 중 기동을 줄일 수 있습니다. | 운영에서는 실제 사용 시 메모리가 늘어납니다. |

## DependsOn은 락이 아닙니다

Legacy의 [Lazy 메모](/docs/knowledge/k-lazy)에는 생성 순서와 경합에 대한 내용이 함께 있습니다.
`@DependsOn({"schemaLoader", "codeLoader"})`는 지정한 빈을 먼저 초기화하게 하지만, 실행 중 여러 요청의 동시 접근을 직렬화하지는 않습니다.
문자열 하나에 쉼표를 넣어 두 이름을 표현하는 방식도 피합니다.
동시성 문제는 락, 원자적 상태 변경, 데이터베이스 제약 등 실제 공유 자원의 경계에서 해결합니다.

확인할 때는 기동 시간과 첫 호출 시간을 나눠 기록합니다.
대상 빈의 생성 로그를 남겨 실제 생성 시점을 보고, 필수 설정 누락이 기동과 첫 호출 중 어디서 실패하는지도 확인합니다.

생성 시점은 [Lazy-initialized Beans](https://docs.spring.io/spring-framework/reference/6.2/core/beans/dependencies/factory-lazy-init.html), 순서는 [Depends-on](https://docs.spring.io/spring-framework/reference/6.2/core/beans/dependencies/factory-dependson.html)을 참고합니다.

## 자주 묻는 질문

### 생성자 주입을 기본으로 두는 이유는 무엇인가요?

필수 의존성이 생성 시점에 드러나고, 테스트에서 동일 생성자로 객체를 만들기 쉽기 때문입니다.

### 같은 타입 빈이 여러 개면 어떻게 고르나요?

@Primary, @Qualifier, 이름, 컬렉션 주입으로 선택 범위를 좁힙니다.

