---
format: "md"
id: "spring-boot-application-runners"
title: "ApplicationRunner와 CommandLineRunner"
description: "ApplicationRunner와 CommandLineRunner의 실행 시점, 순서, 기동 실패 및 초기 적재의 한계를 설명합니다."
slug: "/knowledge/backend/spring/boot/application-runners"
sidebar_position: 5
status: "active"
tags:
  - "Spring"
keywords:
  - "ApplicationRunner와 CommandLineRunner"
  - "Spring"
  - "Spring Boot"
  - "Auto-configuration"
  - "Starter"
  - "SpringApplication"
  - "Graceful shutdown"
---
# ApplicationRunner와 CommandLineRunner

서버 시작 시 공통 코드를 읽거나 필수 연결을 확인하려면 실행 시점을 선택해야 합니다.
생성자에 무거운 작업을 넣으면 객체 조립과 외부 통신이 섞입니다.
Runner는 컨텍스트 초기화 뒤 시작 작업을 수행하는 경계를 제공합니다.

## 두 Runner의 차이

| 계약 | 인수 | 사용 목적 |
|---|---|---|
| CommandLineRunner | 원본 문자열 배열 | 간단한 CLI 인수 처리 |
| ApplicationRunner | ApplicationArguments | 옵션과 일반 인수를 구분 |

```java
@Component
@Order(10)
class WarmupRunner implements ApplicationRunner {
    private final CodeCache cache;

    WarmupRunner(CodeCache cache) {
        this.cache = cache;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!args.containsOption("skip-warmup")) {
            cache.load();
        }
    }
}
```

`CodeCache`는 초기 데이터를 읽는 예제 협력 객체입니다.
`--skip-warmup` 옵션을 허용할지는 배포 정책에 맞춰 정합니다.
외부에서 임의로 필수 검증을 끌 수 있는 옵션을 운영에 그대로 제공하지 않습니다.

## 준비 상태와 순서를 구분합니다

Runner는 컨텍스트 refresh 이후, ApplicationReadyEvent 이전에 실행됩니다.
Runner가 끝나기 전에 내장 웹 서버가 이미 시작돼 있을 수 있으므로, 로드밸런서가 readiness를 확인하도록 구성합니다.
시작 작업의 예외가 밖으로 전파되면 애플리케이션 기동 실패로 이어질 수 있습니다.

`@Order`는 Runner 간 실행 순서를 표현합니다.
일반 빈의 생성 순서를 모두 제어하는 설정도, 여러 서버 중 한 대만 실행하게 하는 기능도 아닙니다.
앱이 세 대면 초기 적재도 세 번 실행될 수 있습니다.

## 무엇을 시작 작업에 넣을까요

| 작업 | 판단 기준 |
|---|---|
| 필수 설정과 로컬 캐시 검증 | 실패 시 서비스하면 안 되는지 확인합니다. |
| 큰 데이터 전체 적재 | 기동 지연과 메모리 사용을 측정합니다. |
| DB 스키마 변경 | 전용 마이그레이션 도구와 실행 권한을 검토합니다. |
| 외부 통지 | 재기동 중복과 외부 실패 정책을 정합니다. |

영구적인 데이터 변경은 재기동할 때 반복돼도 결과가 안전해야 합니다.
Runner가 있다는 사실만으로 재처리와 분산 실행 문제가 해결되지는 않습니다.
외부 서비스 장애가 기동 전체를 막아야 하는지도 업무별로 정합니다.

검증할 때는 정상 실행, 필수 의존성 실패, 옵션 인수, 복수 Runner 순서를 나눠 확인합니다.
Runner에서 `@Async`로 넘긴 뒤 반환하면 Ready가 먼저 선언될 수 있으므로 준비 완료 기준과 맞는지 확인합니다.

실행 시점과 인수 처리는 [SpringApplication의 Runner 설명](https://docs.spring.io/spring-boot/3.5/reference/features/spring-application.html)을 참고합니다.

## 자주 묻는 질문

### 스타터만 넣으면 설정이 끝나나요?

스타터는 의존성과 자동 설정 후보를 가져옵니다. 조건과 오버라이드, 제외도 함께 확인합니다.

### Graceful shutdown은 언제 필요한가요?

진행 중 요청을 끊지 않고 종료하려면 종료 타임아웃과 커넥터 설정을 맞춥니다.

