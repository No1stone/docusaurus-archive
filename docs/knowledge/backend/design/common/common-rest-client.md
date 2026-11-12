---
id: common-rest-client
title: "공통 RestClient 설계"
description: "아웃바운드 HTTP 호출과 로깅을 lib-common에 두고, HTTP status 해석과 Outbox 기록은 애플리케이션에 두는 경계를 정리합니다. (초안)"
tags:
  - backend
  - rest
  - spring
status: active
sidebar_position: 6
slug: "/knowledge/backend/common/common-rest-client"
---

# 공통 RestClient 설계

다른 서비스를 HTTP로 호출할 때도, 호출마다 타임아웃과 로그 형식을 다시 정하면 관측이 어긋나기 쉽습니다.<br />
큐나 메시징 경로에는 전송 기록이 보이는데 REST만 로그가 없다면, 장애 때 어디를 먼저 볼지 정하기 어렵습니다.

boot-base `lib-common`에서는 아웃바운드 호출의 **형식과 로깅**을 공통화합니다.<br />
HTTP status를 성공·재시도·충돌 같은 업무 결과로 바꾸는 일, Outbox에 “무엇을 보냈는지”를 남기는 일은 애플리케이션이 정합니다.

이 글은 초안입니다.<br />
구현 위치는 `com.origemite.lib.common.client`의 `CommonRestClient`입니다.

## 무엇을 어디에 두나요?

| 구분 | 맡는 일 | 두지 않는 일 |
|---|---|---|
| `lib-common` | 타임아웃, buffering, 호출 로그, method/uri/query/headers/body 호출 헬퍼, status·body를 담은 응답 | Outbox 테이블, status→업무 코드 매핑, 토큰 발급 정책 |
| 애플리케이션 | Port/Adapter, 인증 헤더, 쿼리·본문, status로 분기, Outbox 기록 | 공통 로그 포맷을 호출마다 다시 정의하는 일 |

응답 엔벨롭(`CommonResponse`)은 **우리 API가 클라이언트에게 돌려주는** 형식입니다.<br />
`CommonRestResponse`는 **우리가 다른 서버를 호출한 결과**입니다.<br />
둘 다 status와 body를 다루지만 방향이 다릅니다.

## 호출 형식

아웃바운드 REST 호출의 형태는 대체로 같습니다.

```text
method + uri(+query) + headers + body → status + body
```

`CommonRestClient`는 이 형태를 `exchange`와 get/post 등 숏컷으로 제공합니다.<br />
4xx·5xx도 기본으로 예외로 바꾸지 않고 `CommonRestResponse`에 status를 담습니다.<br />
애플리케이션이 status를 보고 판단할 수 있게 하기 위해서입니다.

```java
CommonRestClient client = CommonRestClient.from(restClientBuilder, properties);

HttpHeaders headers = new HttpHeaders();
headers.setBearerAuth(token);

CommonRestResponse<MemberRes> res =
        client.get("/members/" + memberId, headers, null, MemberRes.class);

int status = res.getStatusCodeValue();
MemberRes body = res.getBody();
```

헤더·쿼리·본문은 호출마다 넘깁니다.<br />
공통 라이브러리가 Bearer나 Partner-Key 규칙을 강제하지 않습니다.<br />
필요하면 Adapter에서 헤더를 만들고, 더 복잡한 호출은 `client.raw()`로 Spring `RestClient` fluent API를 직접 씁니다.

로깅은 `ClientHttpRequestInterceptor`로 Builder에 붙입니다.<br />
Boot가 꾸민 `RestClient.Builder`를 쓰면 트레이스 전파를 유지하기 쉽습니다.<br />
`RestClient.builder()`를 매번 새로 만들면 관측이 빠지기 쉽습니다.

참고: [Spring REST Clients](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)

## 애플리케이션에서의 사용

유즈케이스가 `CommonRestClient`를 직접 만지기보다, **Port** 뒤에 두는 편이 경계가 맑습니다.

```text
유즈케이스 → MemberClientPort → Adapter(CommonRestClient) → CommonRestResponse
```

Adapter는 HTTP를 호출하고 status·body를 그대로(또는 Port 계약에 맞게) 돌려줍니다.<br />
status를 `SUCCESS` / `RETRY` / `CONFLICT` 같은 앱 전용 결과로 바꿀지도 애플리케이션이 정합니다.<br />
공통 라이브러리는 그 매핑 이넘을 갖지 않습니다.

## Outbox와의 관계

Outbox는 **무엇을 보냈는지(또는 보낼 내용)를 남겨 두는 기록**입니다.<br />
앱마다 테이블과 릴레이가 다를 수 있으므로 `lib-common`에 두지 않습니다.

흔한 흐름은 다음과 같습니다.

1. 유즈케이스가 업무 상태를 저장하고, 필요하면 Outbox에 전달 의도를 남깁니다.
2. 릴레이가 Port를 호출합니다.
3. Adapter가 `CommonRestClient`로 HTTP를 보냅니다.
4. 릴레이 또는 유즈케이스가 status를 보고 Outbox를 완료·재시도 등으로 갱신합니다.

로깅 interceptor는 호출을 **관측**하고, Outbox는 전달을 **기록**합니다.<br />
interceptor 안에서 Outbox를 쓰지 않습니다.

DB 트랜잭션이 열린 채로 외부 HTTP를 오래 붙잡지 않는 편이 안전합니다.<br />
호출 후 짧은 트랜잭션으로 기록하거나, Outbox 적재와 릴레이 호출을 나누는 방식을 애플리케이션에서 고릅니다.

## 정리

| 질문 | 이 아카이브의 선택 |
|---|---|
| 공통에 무엇을 두나? | 호출 헬퍼, 타임아웃, 로깅, status 포함 응답 |
| 앱에 무엇을 두나? | 헤더·본문·쿼리, status 해석, Outbox |
| 왜 status를 예외로 안 바꾸나? | 호출부가 HTTP 결과를 보고 분기·기록할 수 있게 하기 위해 |

관련 글: [Spring 기반 백엔드 공통 설계](/docs/knowledge/backend/common/spring-common-design), [API 응답 엔벨롭 설계](/docs/knowledge/backend/common/api-response-envelope), [공통 유틸리티 설계](/docs/knowledge/backend/common/common-utility-design), [Advice — 인접 경계](/docs/knowledge/backend/controller/advice-adjacent-boundaries)
