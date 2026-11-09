---
sidebar_position: 13
format: md
id: architecture-restclient-vs-istio-retries
title: "RestClient와 Istio 재시도·타임아웃"
description: "앱 RestClient의 재시도·타임아웃·멱등과 서비스 메시(Istio) 정책의 차이를 구분한다."
tags:
  - Resilience
  - RestClient
  - Istio
  - Messaging
status: active
slug: /patterns/architecture-patterns/restclient-vs-istio-retries
---

# RestClient와 Istio 재시도·타임아웃

나가는 HTTP의 재시도·타임아웃·멱등은 **앱**과 **메시** 양쪽에서 다룰 수 있습니다.
둘 다 켜 두면 타임아웃이 겹치고 재시도가 제곱으로 늘어날 수 있습니다.

## 한눈에

| | 앱 (RestClient 등) | 메시 (Istio 등) |
|--|-------------------|-----------------|
| 위치 | 프로세스 안, Client 설정 | 사이드카·게이트웨이 |
| 타임아웃 | connect / read 등 호출 단위 | 라우트·클러스터 단위 |
| 재시도 | 상태 코드·예외 정책, 횟수 | VirtualService 재시도 |
| 멱등 | 앱이 키·의미를 안다 | 메시는 HTTP 메서드·조건만 |
| 도메인 오류 | 4xx·비즈니스 코드 구분 가능 | 주로 전송·5xx 중심 |

## 앱에 두는 것

- 도메인 멱등 키, “이 요청은 한 번만 적용” 의미
- 비즈니스적으로 재시도하면 안 되는 호출
- 외부 벤더별 타임아웃·헤더 ([outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/), [spring-external-contract](/docs/harness/orchestrations/spring-external-contract))

## 메시에 두는 것

- 전송 실패·일시 5xx에 대한 **공통** 재시도
- 클러스터 단위 outlier, 연결 풀
- 서비스 간 기본 deadline (앱이 더 짧은 타임아웃을 둘 수 있음)

## 충돌을 피하는 기본 관례

1. **재시도는 한 층만** 공격적으로 둔다. 보통 메시는 짧게, 앱은 멱등일 때만 재시도한다
2. 앱 타임아웃 ≤ 메시/게이트웨이 타임아웃이 되도록 맞춘다 (앱이 먼저 포기)
3. 비멱등 POST에 메시 재시도를 넓게 켜지 않는다
4. 관측은 [W3C 트레이스](/docs/patterns/architecture-patterns/trace-propagation-w3c)로 어느 층이 재시도했는지 남긴다

## 관련

- [outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/)
- [spring-external-contract](/docs/harness/orchestrations/spring-external-contract)
