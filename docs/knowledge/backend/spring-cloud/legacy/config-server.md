---
id: "k-config-server"
title: "Config Server"
description: "Spring Cloud Config Server로 설정을 중앙에서 제공하는 개념과 적용 시 주의점"
slug: "/knowledge/k-config-server"
status: "active"
tags:
  - "Spring"
  - "Spring Cloud"
keywords:
  - "Config Server"
  - "Spring"
  - "Spring Cloud"
  - "API Gateway"
  - "MSA"
  - "Gateway"
---
# Config Server

> 이전에 작성한 개념 및 적용 메모입니다.
> 현재 프로젝트의 역할과 선택 기준은 [Spring Cloud 안내](../index.md)에서 확인합니다.

## 개요

Config Server는 애플리케이션 설정을 Git 등 저장소에 두고, 서비스가 기동, 갱신 시 받아 가게 합니다.
여러 인스턴스가 같은 설정을 공유하거나, 권한, 감사, 롤백이 필요할 때 맞습니다.
로컬 단독 개발만 할 때는 파일 설정으로도 충분할 수 있습니다.

## 하는 일

- 환경별 `application.yml` 등을 중앙에서 보관합니다.
- 클라이언트는 기동 시 Config Server에서 설정을 읽습니다.
- 운영 중 갱신은 Spring Cloud Bus 등과 함께 쓰는 경우가 있으나 필수는 아닙니다.

## 주의점

- Config Server 자체가 SPOF가 되지 않게 가용성을 봅니다.
- 비밀 값을 평문 Git에 두지 않습니다. 암호화, 볼트 연동을 검토합니다.
- Gateway 허용 경로처럼 보안에 민감한 목록을 옮길 때는 배포, 캐시 무효화 순서를 정합니다.

## 사례, 관련

- [애플리케이션 서비스 — ConfigServer](/docs/postmortems/msa-iam-portfolio/application-services)
- [설계 개요와 비용](/docs/postmortems/msa-iam-portfolio/design-and-runtime)
- [Eureka](/docs/knowledge/k-eureka)
- [API GATEWAY](/docs/knowledge/k-api-gateway)

<details>
<summary>참고 자료</summary>

- [Spring Cloud Config](https://docs.spring.io/spring-cloud-config/reference/server.html)
</details>

## 자주 묻는 질문

### API Gateway는 어디에 두나요?

클라이언트와 서비스 사이에서 라우팅, 인증, 공통 필터를 담당하는 진입점으로 둡니다.

### Spring Cloud와 Boot 버전은 어떻게 맞추나요?

릴리스 트레인과 Boot 호환표를 보고 한 세트로 올립니다.

