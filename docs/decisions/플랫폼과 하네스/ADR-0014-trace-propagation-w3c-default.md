---
id: adr-0014
title: 서비스 간 트레이스 전파는 W3C Trace Context를 디폴트로 둔다
description: Actuator와 Micrometer Tracing에서 W3C traceparent를 기본으로 쓰고, B3는 레거시 연동에만 쓴다
tags:
  - adr
  - observability
  - tracing
  - harness
status: accepted
slug: "/decisions/adr-0014"
---
# 서비스 간 트레이스 전파는 W3C Trace Context를 디폴트로 둔다

MSA와 게이트웨이에서 요청을 따라가려면 상관 ID가 HTTP로 전파되어야 한다.
전파 형식이 서비스마다 다르면 한 흐름을 잇기 어렵다.
OpenTelemetry와 서비스 메시도 W3C Trace Context를 기본으로 쓰는 쪽이 많다.

## 결정

- 디폴트 전파는 **W3C Trace Context** (`traceparent`, 필요 시 `tracestate`)
- 설정은 Spring Boot **Actuator + Micrometer Tracing**, `management.tracing.propagation.type: w3c`
- **B3** (`X-B3-*`)는 레거시 Zipkin·구 Sleuth 연동이 있을 때만 `b3` 또는 consume 호환으로 둔다
- 나가는 HTTP는 계측된 클라이언트를 쓴다. `RestClient.builder()`를 직접 만들면 스팬·`traceparent`가 빠질 수 있다 ([outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/))

설정·헤더 예시·이유는 [트레이스 전파 (W3C)](/docs/patterns/architecture-patterns/trace-propagation-w3c)에 둔다.

## 결과

- 패턴 문서가 설정과 예시의 정본이다
- 전파 도구 제품 선정(상용 APM 등)은 이 ADR 밖이다
