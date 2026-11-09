---
sidebar_position: 12
format: md
id: architecture-trace-propagation-w3c
title: "트레이스 전파 (W3C)"
description: "MSA 디폴트는 W3C Trace Context. B3는 레거시 연동용. Actuator·Micrometer Tracing 설정과 HTTP 헤더 예."
tags:
  - Observability
  - Tracing
  - W3C
status: active
slug: /patterns/architecture-patterns/trace-propagation-w3c
---

# 트레이스 전파 (W3C)

MSA 서비스 간 상관 ID는 **W3C Trace Context** (`traceparent` / `tracestate`)를 디폴트로 씁니다.
결정은 [ADR-0014](/docs/decisions/adr-0014)입니다.

## 왜 필요한가

한 사용자 요청이 게이트웨이 → API → 다른 서비스를 거치면, 로그만으로는 같은 흐름을 잇기 어렵습니다.
표준 헤더로 trace id를 넘기면 로그·스팬·메시 프록시를 한 줄로 묶을 수 있습니다.
요즘 관측 스택과 Istio·OpenTelemetry도 W3C를 기본 결로 둡니다.

## 설정 (Actuator + Micrometer Tracing)

```yaml
management:
  tracing:
    enabled: true
    sampling:
      probability: 1.0   # 운영은 낮춤
    propagation:
      type: w3c
```

B3만 쓰는 레거시와 맞춰야 하면:

```yaml
management:
  tracing:
    propagation:
      type: b3
# 또는 양쪽 consume이 필요하면 제품 문서의 복합 설정(예: w3c,b3)을 따릅니다.
```

- **Boot 샘플 참고:** `api-auth`, `gateway`, `batch-realtime` (호스트 저장소)
- OpenTelemetry / Istio와도 W3C가 기본 결입니다
- **B3** (`X-B3-*`)는 레거시 Zipkin·구 Sleuth 연동이 있을 때만

## HTTP로 나가는 예

요청에 실리는 W3C 헤더 예:

```http
traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
tracestate: congo=t61rcWkgMzE
```

- `version`-`trace-id`-`parent-id`-`flags` 형식입니다
- 다운스트림은 같은 `trace-id`를 유지하고 `parent-id`만 바꿉니다

레거시 B3 예:

```http
X-B3-TraceId: 0af7651916cd43dd8448eb211c80319c
X-B3-SpanId: b7ad6b7169203331
X-B3-Sampled: 1
```

## 클라이언트

`RestClient.builder()`를 직접 생성하면 W3C `traceparent`·스팬이 안 붙을 수 있습니다.
계측이 되는 빌더·빈을 씁니다. 예: [outbound-rest](/docs/harness/templates/backend/spring/outbound-rest/).

## 시크릿 (예정)

설정(ConfigMap / Spring Cloud Config)과 시크릿(Vault 등)은 분리합니다.
Vault 연동은 예정입니다.
