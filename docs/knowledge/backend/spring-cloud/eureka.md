---
id: k-eureka
title: Eureka
description: Spring Cloud Netflix Eureka로 서비스 등록과 클라이언트 사이드 발견을 하는 개념
tags:
  - Spring
  - Spring Cloud
status: active
slug: /knowledge/k-eureka
---
# Eureka

## 개요

Eureka는 서비스 인스턴스가 주소를 등록하고, 호출자가 이름(`lb://service-id`)으로 인스턴스를 찾아가게 하는 서비스 발견 구성 요소입니다.
권한 검사 자체는 Eureka의 역할이 아닙니다.
Gateway가 `lb://api-auth`처럼 논리 이름으로 라우팅할 때 함께 씁니다.

## 적용 조건

- 인스턴스 주소가 자주 바뀌거나 개수가 변할 때
- API Gateway가 하류를 이름으로 호출할 때

고정 VIP·단일 인스턴스만 있으면 당장 필요하지 않을 수 있습니다.

## 주의점

- 레지스트리 지연·캐시 때문에 죽은 인스턴스로 잠시 붙을 수 있습니다.
- 보안망에서 Eureka를 노출하지 않습니다.
- Gateway 권한 정책 저장소(Redis 등)와 혼동하지 않습니다.

## 사례·관련

- [애플리케이션 서비스 — EurekaServer](../../../postmortems/icomsys-msa-iam-portfolio/application-services.md)
- [boot-base Gateway 라우팅 설명](../../../patterns/architecture-patterns/gateway-authorization-routing.md)
- [Config Server](./config-server.md)
- [API GATEWAY](./api-gateway.md)

<details>
<summary>참고 자료</summary>

- [Spring Cloud Netflix Eureka](https://docs.spring.io/spring-cloud-netflix/reference/spring-cloud-netflix-eureka-server.html)
</details>
