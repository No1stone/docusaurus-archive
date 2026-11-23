---
id: spring-cloud-clients-and-resilience-timeout-retry-bulkhead
title: Timeout, Retry와 Bulkhead의 차이
description: Timeout, Retry, Bulkhead의 목적 차이를 정리합니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience/timeout-retry-bulkhead
sidebar_position: 8
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Timeout, Retry와 Bulkhead의 차이"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
  - "Timeout"
---
# Timeout, Retry와 Bulkhead의 차이

Timeout, Retry, Circuit Breaker와 Bulkhead는 서로 다른 문제를 다룹니다.
모두 장애 대응 기능이라는 이유로 한꺼번에 켜면 실제 호출 횟수와 대기가 예상보다 늘 수 있습니다.
먼저 보호할 자원과 전체 요청의 시간 예산을 정합니다.

| 수단 | 질문 | 주의점 |
|---|---|---|
| Timeout | 언제까지 기다릴까요? | 원격 작업 취소와 같지 않음 |
| Retry | 어떤 실패를 다시 시도할까요? | 중복 실행과 부하 증가 |
| Circuit Breaker | 실패하는 호출을 잠시 막을까요? | 표본과 상태 판단 필요 |
| Bulkhead | 동시에 몇 개를 허용할까요? | 초과 요청 거절 또는 대기 |

```mermaid
flowchart LR
    Call[요청] --> Limit[동시성 한도]
    Limit --> Circuit[차단 여부]
    Circuit --> Attempt[시간 제한이 있는 시도]
    Attempt --> Result[결과 또는 제한된 재시도]
```

이 그림은 개념 예시이며 실제 decorator 순서를 강제하는 설정은 아닙니다.
순서에 따라 Circuit Breaker가 재시도 각각을 셀지 최종 결과를 셀지도 달라질 수 있습니다.

## 전체 시간과 횟수를 계산합니다

응답 대기 한도가 2초이고 총 세 번 시도하면 대기 간격과 연결 시간을 제외해도 최대 대기가 늘어납니다.
상위 Gateway가 두 번 시도하고 내부 클라이언트도 세 번 시도하면 상대는 최대 여섯 번 요청을 받을 수 있습니다.
수치는 실행 경로와 정책에 맞춰 실제로 계측합니다.

POST 타임아웃 뒤에는 상대가 이미 저장했을 수 있습니다.
멱등 키와 상태 재조회 없이 재시도만 늘리면 중복을 만들 수 있습니다.
권한 오류와 잘못된 입력처럼 다시 시도해도 달라지지 않는 실패는 분리합니다.

```java
Bulkhead bulkhead = Bulkhead.of("partner", BulkheadConfig.custom()
        .maxConcurrentCalls(5)
        .maxWaitDuration(Duration.ZERO)
        .build());
```

Resilience4j semaphore Bulkhead의 학습용 구성입니다.
허용 수와 대기는 실제 외부 API 용량과 호출 지연을 측정해 정합니다.
Circuit Breaker 자체가 위 동시성 한도를 자동 제공하지는 않습니다.

실패 실험에서는 요청 수, 실제 상대 호출 수, 큐와 지연을 함께 기록합니다.
재시도가 회복을 돕는지 장애를 키우는지 같은 조건에서 비교합니다.

역할과 설정은 [Resilience4j 가이드](https://resilience4j.readme.io/docs/getting-started)와 [Bulkhead](https://resilience4j.readme.io/docs/bulkhead)를 참고합니다.

## 자주 묻는 질문

### 전체 시간과 횟수를 계산합니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### Timeout, Retry와 Bulkhead의 차이 적용 시 확인할 점에서 무엇을 확인하나요?

클라이언트 선택과 장애 제어는 호출 모델과 함께 봅니다. 동기 호출이라는 이유만으로 대체 여부를 단정하지 않습니다.
