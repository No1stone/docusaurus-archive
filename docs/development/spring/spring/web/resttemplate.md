---
format: md
id: k-resttemplate
title: "RestTemplate"
description: "RestTemplate으로 동기 HTTP 호출을 하는 기본 패턴과 RestClient로의 이관 메모입니다."
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-resttemplate
---
# RestTemplate

## 개요

`RestTemplate`은 Spring 3부터 쓰인 동기 HTTP 클라이언트입니다.
`getForObject`, `exchange` 등으로 호출하고, 메시지 컨버터로 JSON을 객체로 바꿉니다.
Spring Framework 6.1 / Boot 3.2부터는 같은 인프라 위에 fluent API인 `RestClient`가 있어, 신규 코드는 [RestAPI](/docs/knowledge/k-restapi-9f6eac)의 `RestClient`를 우선합니다.

![resttemplate-1.png](/img/resttemplate/resttemplate-1.png)

![resttemplate-2.png](/img/resttemplate/resttemplate-2.png)

## 최소 호출

```java
String uri = "http://localhost:8080/court/member.json";
RestTemplate restTemplate = new RestTemplate();
String result = restTemplate.getForObject(uri, String.class);
```

응답 타입을 클래스로 받으려면 `getForObject(uri, Member.class)`처럼 지정합니다.
상태 코드와 헤더가 필요하면 `getForEntity` 또는 `exchange`를 씁니다.

```java
ResponseEntity<Member> entity = restTemplate.exchange(
        uri,
        HttpMethod.GET,
        new HttpEntity<>(headers),
        Member.class
);
```

빈으로 등록할 때는 `ClientHttpRequestFactory`에 connect/read timeout을 넣고, 로깅이 필요하면 `BufferingClientHttpRequestFactory`로 감쌉니다.
기존 `RestTemplate` 설정은 `RestClient.create(restTemplate)`로 이어받을 수 있습니다.

<details>
<summary>참고 자료</summary>

- [Spring Framework Javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/) — `RestTemplate` API
- [New in Spring 6.1: RestClient](https://spring.io/blog/2023/07/13/new-in-spring-6-1-restclient) — RestTemplate 인프라를 쓰는 RestClient
</details>
