---
sidebar_position: 12
format: md
id: architecture-trace-propagation-w3c
title: "트레이스 전파 (W3C)"
description: "MSA 디폴트는 W3C Trace Context. B3는 레거시 연동용."
tags:
  - Observability
  - Tracing
  - W3C
status: active
---

# 트레이스 전파 (W3C)

MSA 서비스 간 상관 ID는 **W3C Trace Context** (`traceparent` / `tracestate`)를 디폴트로 쓴다.

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

- **Boot 샘플:** `api-auth` · `gateway` · `batch-realtime`
- OpenTelemetry / Istio와도 W3C가 기본 결이다.
- **B3** (`X-B3-*`)는 레거시 Zipkin·구 Sleuth 연동이 있을 때만 `type: b3` 또는 consume 호환.

## 시크릿 (예정)

설정(ConfigMap / Spring Cloud Config)과 시크릿(Vault 등)은 분리한다. Vault 연동은 **예정**.
