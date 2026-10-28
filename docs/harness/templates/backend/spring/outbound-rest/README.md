---
sidebar_position: 1
format: md
id: t-spring-outbound-rest
title: "outbound RestClient 적용 예 (ExampleItem)"
description: "타임아웃·로그 + ExampleItem 원셋 API 서버투서버 Client. 공유 라이브러리 아님. 인증 헤더 없음."
tags:
  - Spring
  - RestClient
  - ExampleItem
status: active
---

# outbound RestClient 적용 예

**공유 라이브러리가 아니라** 호스트에 복사하는 예제다.  
원셋 [ExampleItem](../exampleitem/) Controller를 서버투서버로 친다. 토큰·인증 헤더 없음.

```text
outbound-rest/example/
  OutboundRestClientCustomizer      ← 타임아웃 · 한 줄 로그
  ExampleItemClientPort / Adapter   ← GET/POST /example-items…
        │
        └─ 원셋 Controller (같은 계약 DTO)
```

## 복사할 때

1. [example/](./example/) 를 앱 패키지로 옮긴다
2. yml에 타임아웃·`base-url`을 맞춘다
3. Facade/유스케이스에는 **Port만** 주입

## 설정 예

```yaml
origemite:
  rest:
    outbound:
      connect-timeout: 5s
      read-timeout: 3s
      logging-enabled: true
  example-item:
    client:
      base-url: http://localhost:8080

management:
  tracing:
    enabled: true
    propagation:
      type: w3c

logging:
  pattern:
    level: "%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]"
```

**트레이스:** `RestClient.Builder` 빈(Boot 자동구성)을 주입해 클라이언트를 만든다.  
`RestClient.builder()` 직접 생성하면 W3C `traceparent`·스팬이 안 붙는다.  
한 줄 로그의 `traceId=`는 MDC에서 읽는다.

## 파일

| 파일 | 역할 |
|------|------|
| `OutboundRestClientCustomizer` 등 | 타임아웃 · `outbound METHOD uri → status (ms)` 한 줄 로그 |
| `ExampleItemClientPort` | outbound 계약 |
| `ExampleItemClientAdapter` | RestClient · `CommonResponse` unwrap |
| `ExampleItemClientConfig` | Customizer + RestClient 빈 |

DTO는 [exampleitem/dto](../exampleitem/dto/)를 그대로 쓴다.  
나중에 여러 앱이 동일 정책을 강제하면 그때 라이브러리 승격을 검토한다.

## boot-base 구현체

`api-auth`에 **MemberController** 기준 동일 패턴이 있다.

- `infrastructure/rest/` — Customizer · 한 줄 로그
- `member/client/` — `MemberClientPort` / `MemberClientAdapter` / `MemberClientConfig`
- 켜기: `origemite.member.client.enabled=true` · `base-url` (기본 `http://localhost:3031/auth`)
