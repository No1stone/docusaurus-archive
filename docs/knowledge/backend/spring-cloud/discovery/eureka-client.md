---
id: spring-cloud-discovery-eureka-client
title: Eureka Client 등록과 주소 조회
description: 클라이언트의 등록, heartbeat와 주소 조회를 정리합니다.
slug: /knowledge/backend/spring-cloud/discovery/eureka-client
sidebar_position: 3
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Eureka Client 등록과 주소 조회"
  - "Spring"
  - "Spring Cloud"
  - "Eureka"
  - "DiscoveryClient"
  - "LoadBalancer"
  - "Service Discovery"
  - "Client"
---
# Eureka Client 등록과 주소 조회

Eureka Client는 자기 주소를 등록하는 기능과 다른 서비스의 주소를 조회하는 기능을 제공합니다.
일반적인 업무 앱은 두 기능을 함께 사용하지만, 호출만 하는 앱은 등록 정책을 다르게 둘 수 있습니다.
서버용 Starter와 클라이언트용 Starter를 구분합니다.

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
```

```yaml
spring:
  application:
    name: catalog-service
server:
  port: 8081
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

Cloud Netflix 4.3 계열의 로컬 예제입니다.
`defaultZone`은 Map 키이므로 일반적인 kebab-case 변환과 달리 대소문자를 그대로 맞춥니다.
컨테이너에서 localhost는 해당 컨테이너 자신이므로 실제 서버 주소로 바꿔야 합니다.

## 등록과 조회를 독립적으로 봅니다

| 속성 | 의미 |
|---|---|
| register-with-eureka | 자신의 인스턴스 정보를 등록합니다. |
| fetch-registry | 다른 인스턴스 목록을 가져옵니다. |
| spring.application.name | 기본 서비스 ID의 출발점입니다. |
| eureka.instance.instance-id | 인스턴스를 구분하는 식별자입니다. |

```java
List<ServiceInstance> instances = discoveryClient.getInstances("catalog-service");
```

주입한 Spring Cloud DiscoveryClient로 목록을 확인하는 부분 예제입니다.
실제 업무 코드에서 첫 번째 주소만 골라 계속 호출하기보다 LoadBalancer와 클라이언트 통합을 검토합니다.
이 조회가 성공해도 HTTP 요청은 아직 실행되지 않았습니다.

## 상태와 주소를 확인합니다

로컬에서는 앱을 두 개 실행하고 서로 다른 인스턴스로 등록되는지 봅니다.
같은 ID가 겹치면 의도한 수만큼 보이지 않을 수 있습니다.
프록시 뒤에서 동작한다면 공개해야 할 포트와 hostname, health URL도 실제 접근 경로와 맞춥니다.

정상 종료 시 등록 해제와 비정상 종료 후 만료는 같은 속도로 일어나지 않습니다.
등록 직후 다른 클라이언트가 목록을 보기까지도 캐시와 갱신 주기에 따른 시간이 필요할 수 있습니다.
이 지연을 등록 실패와 혼동하지 않습니다.

확인은 서버 대시보드, DiscoveryClient 목록과 실제 API 호출의 세 단계로 나눕니다.
등록 지연과 종료 동작은 [heartbeat와 캐시](./eureka-failure-and-cache.md)에서 이어서 설명합니다.
등록 속성은 [Eureka Client 공식 안내](https://docs.spring.io/spring-cloud-netflix/reference/4.3/spring-cloud-netflix.html)를 참고합니다.

## 자주 묻는 질문

### 등록과 조회를 독립적으로 봅니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### 상태와 주소를 확인합니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.
