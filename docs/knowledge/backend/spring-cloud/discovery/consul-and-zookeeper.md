---
id: spring-cloud-discovery-consul-and-zookeeper
title: Eureka, Consul과 Zookeeper 비교
description: 발견 경로로 Eureka, Consul, Zookeeper를 비교합니다.
slug: /knowledge/backend/spring-cloud/discovery/consul-and-zookeeper
sidebar_position: 6
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Eureka, Consul과 Zookeeper 비교"
  - "Spring"
  - "Spring Cloud"
  - "Eureka"
  - "DiscoveryClient"
  - "LoadBalancer"
  - "Service Discovery"
  - "Consul"
---
# Eureka, Consul과 Zookeeper 비교

Eureka, Consul과 Zookeeper는 이름만 다른 동일 제품이 아닙니다.
Spring Cloud는 각 기반 시스템의 서비스 발견 기능을 앱에서 사용하도록 통합합니다.
이미 운영하는 기반과 필요한 부가 기능을 보고 선택합니다.

| 기반 | Spring 통합에서 볼 기능 | 함께 운영할 것 |
|---|---|---|
| Eureka | 서비스 등록과 발견 | Eureka Server와 Client |
| Consul | 서비스 발견과 설정 | Consul 에이전트와 서버, health 정책 |
| Zookeeper | 서비스 발견과 설정 | Zookeeper ensemble과 연결 및 세션 정책 |

Zookeeper는 분산 조정에 사용되는 기반이고, Consul은 발견과 상태 확인 및 설정 등 다양한 기능을 제공합니다.
Spring의 공통 DiscoveryClient를 사용하더라도 기반 서버의 일관성과 장애 판단이 같아지지는 않습니다.

## 의존성을 추가한 뒤 필요한 것

```groovy
// 사용할 기반에 맞는 하나의 예시를 선택합니다.
implementation 'org.springframework.cloud:spring-cloud-starter-consul-discovery'
// 또는
implementation 'org.springframework.cloud:spring-cloud-starter-zookeeper-discovery'
```

의존성을 모두 넣어 여러 레지스트리를 조회하는 기본 구성을 만들 필요는 없습니다.
각 서버의 접속 주소, 인증과 등록 주소를 구성하고 실제 목록을 확인합니다.
복수 DiscoveryClient를 의도적으로 사용할 때는 선택 순서와 중복 이름의 의미를 정합니다.

## 기존 인프라와 운영 부담을 비교합니다

이미 Consul을 표준으로 사용하는 조직에서 주소 발견만을 위해 Eureka를 추가하면 운영 경로가 늘어납니다.
반대로 익숙한 Eureka가 있는 환경에서 Zookeeper를 도입할 이유는 필요한 기능과 운영 역량으로 설명해야 합니다.
Kubernetes의 기본 Service DNS로 충분한 경우에는 별도 레지스트리 자체가 필요하지 않을 수도 있습니다.

비교 실험에서는 등록 성공만 보지 않고 서버 장애, 클라이언트 재접속과 목록 수렴을 확인합니다.
상태 확인이 실제 업무 의존성까지 검증하는지도 따로 봅니다.

제공 범위는 [Cloud Consul](https://docs.spring.io/spring-cloud-consul/reference/), [Cloud Zookeeper](https://docs.spring.io/spring-cloud-zookeeper/reference/), [Cloud Netflix](https://docs.spring.io/spring-cloud-netflix/reference/)에서 확인합니다.

## 자주 묻는 질문

### 의존성을 추가한 뒤 필요한 것에서 무엇을 확인하나요?

앱에 넣는 라이브러리와 별도 운영 자원을 구분합니다. Boot와 Cloud BOM 조합부터 맞춥니다.

### 기존 인프라와 운영 부담을 비교합니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.
