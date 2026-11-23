---
id: spring-cloud-clients-and-resilience-circuit-breaker-and-istio
title: 앱의 장애 제어와 Istio 비교
description: 앱 내부 Circuit Breaker와 Istio 통신 제어를 비교합니다.
slug: /knowledge/backend/spring-cloud/clients-and-resilience/circuit-breaker-and-istio
sidebar_position: 9
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "앱의 장애 제어와 Istio 비교"
  - "Spring"
  - "Spring Cloud"
  - "OpenFeign"
  - "Circuit Breaker"
  - "Resilience4j"
  - "LoadBalancer"
  - "Istio"
---
# 앱의 장애 제어와 Istio 비교

Istio가 통신 실패를 제어할 수 있어도 앱 내부 Circuit Breaker가 사라진 것은 아닙니다.
기능이 겹치는 부분과 서로 볼 수 없는 정보를 나눠 판단합니다.
Istio는 프록시 통신 경로를, 앱 라이브러리는 특정 함수와 예외의 경계를 제어합니다.

| 기준 | 앱의 Circuit Breaker | Istio 트래픽 정책 |
|---|---|---|
| 판단 정보 | 예외와 결과, 업무별 설정 | 연결, 응답과 endpoint 오류 |
| 대표 기능 | 상태 전이와 앱 fallback | 연결 한도와 outlier detection 등 |
| 적용 범위 | 선택한 메서드나 클라이언트 | 메시가 처리하는 통신 경로 |
| 업무 대체 결과 | 앱에서 정의 가능 | 내부 업무 의미를 자동으로 알지 못함 |

```mermaid
flowchart LR
    App[업무 판단과 fallback] --> Local[앱 호출 제어]
    Local --> Proxy[메시의 통신 정책]
    Proxy --> Remote[상대 서비스]
```

HTTP 200이지만 본문에 업무상 이용 불가가 들어 있다면 프록시의 일반 통신 성공과 앱의 업무 결과는 다를 수 있습니다.
반대로 연결 수와 장애 endpoint 제외는 여러 언어의 서비스에 공통 적용하기 좋은 관심사입니다.

## 같은 circuit breaking이라는 이름도 구분합니다

Istio에서 설명하는 connection pool과 outlier detection을 Resilience4j의 CLOSED, OPEN, HALF_OPEN 상태 모델과 동일하게 가정하지 않습니다.
제외 대상이 endpoint인지 특정 기능 호출인지도 다릅니다.
ambient와 sidecar 등 배치 모드에 따라 L7 처리가 어디서 수행되는지도 확인합니다.

함께 쓴다면 각 계층의 재시도, timeout과 오류 응답을 문서화합니다.
상대에 도달하기 전에 프록시가 거절한 요청도 앱에서는 실패로 관측될 수 있습니다.
원인이 같은 오류를 서로 다른 상태 전이로 해석하는지 확인합니다.

테스트는 앱의 예외, 상대 5xx와 연결 장애를 나눠 수행합니다.
앱 fallback 결과와 메시의 endpoint 제외가 실제로 각각 일어나는지 지표로 확인합니다.
Istio가 있다는 이유로 업무 fallback을 지우거나 앱 라이브러리가 있다는 이유로 공통 통신 정책을 중복 적용하지 않습니다.

기준은 [Istio Circuit Breaking](https://istio.io/latest/docs/tasks/traffic-management/circuit-breaking/), [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/)과 [Cloud Circuit Breaker](https://docs.spring.io/spring-cloud-circuitbreaker/reference/)를 참고합니다.

## 자주 묻는 질문

### 같은 circuit breaking이라는 이름도 구분합니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### 앱의 장애 제어와 Istio 비교 적용 시 확인할 점에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.
