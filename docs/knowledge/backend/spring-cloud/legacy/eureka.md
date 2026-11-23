---
id: "k-eureka"
title: "Eureka"
description: "Spring Cloud Netflix Eureka로 서비스 등록과 클라이언트 사이드 발견을 하는 개념"
slug: "/knowledge/k-eureka"
status: "active"
tags:
  - "Spring"
  - "Spring Cloud"
keywords:
  - "Eureka"
  - "Spring"
  - "Spring Cloud"
  - "API Gateway"
  - "MSA"
  - "Gateway"
---
# Eureka

> 이전에 작성한 개념 및 적용 메모입니다.
> 현재 프로젝트의 역할과 선택 기준은 [Spring Cloud 안내](../index.md)에서 확인합니다.

## 개요

Eureka는 서비스 인스턴스가 주소를 등록하고, 호출자가 이름(`lb://service-id`)으로 인스턴스를 찾아가게 하는 서비스 발견 구성 요소입니다.
권한 검사 자체는 Eureka의 역할이 아닙니다.
Gateway가 `lb://api-auth`처럼 논리 이름으로 라우팅할 때 함께 씁니다.

## 적용 조건

- 인스턴스 주소가 자주 바뀌거나 개수가 변할 때
- API Gateway가 하류를 이름으로 호출할 때

고정 VIP, 단일 인스턴스만 있으면 당장 필요하지 않을 수 있습니다.

## 주의점

- 레지스트리 지연, 캐시 때문에 죽은 인스턴스로 잠시 붙을 수 있습니다.
- 보안망에서 Eureka를 노출하지 않습니다.
- Gateway 권한 정책 저장소(Redis 등)와 혼동하지 않습니다.

## 사례, 관련

- [애플리케이션 서비스 — EurekaServer](/docs/postmortems/msa-iam-portfolio/application-services)
- [boot-base Gateway 라우팅 설명](/docs/patterns/architecture-patterns/gateway-authorization-routing)
- [Config Server](/docs/knowledge/k-config-server)
- [API GATEWAY](/docs/knowledge/k-api-gateway)

<details>
<summary>참고 자료</summary>

- [Spring Cloud Netflix Eureka](https://docs.spring.io/spring-cloud-netflix/reference/spring-cloud-netflix-eureka-server.html)
</details>

## 자주 묻는 질문

### API Gateway는 어디에 두나요?

클라이언트와 서비스 사이에서 라우팅, 인증, 공통 필터를 담당하는 진입점으로 둡니다.

### Spring Cloud와 Boot 버전은 어떻게 맞추나요?

릴리스 트레인과 Boot 호환표를 보고 한 세트로 올립니다.

