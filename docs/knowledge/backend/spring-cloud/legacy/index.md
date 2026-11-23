---
id: spring-cloud-legacy-index
title: "Spring Cloud Legacy"
description: "기존 Gateway, Config Server와 Eureka 적용 메모를 원래 URL과 함께 보존합니다."
slug: /knowledge/backend/spring-cloud/legacy
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
---
# Spring Cloud Legacy

이전 Gateway, Config Server와 Eureka 메모를 보존하는 영역입니다.
파일을 이 폴더로 묶었지만 문서 ID와 공개 URL은 유지합니다.
기존 적용 코드와 사례는 해당 글에서 이어서 확인할 수 있습니다.

| 기존 메모 | 담고 있는 내용 |
|---|---|
| [API Gateway](./api-gateway.md) | RouteLocator, JWT 필터 연결과 YAML 라우팅 예제 |
| [Config Server](./config-server.md) | 중앙 설정의 개념과 기존 적용 사례 |
| [Eureka](./eureka.md) | 서비스 등록 및 발견과 기존 Gateway 연결 메모 |

과거 메모의 구현과 설명은 작성 당시의 사용 맥락입니다.
Gateway의 Netty 중심 설명을 MVC 계열까지 일반화하거나, Eureka가 모든 서비스 발견에 필수라고 해석하지 않습니다.
설정 키와 의존성은 적용할 버전의 공식 문서를 기준으로 다시 확인합니다.

현재 역할 구분은 [Spring Cloud 입구](../index.md), 전체 기능은 [앱 라이브러리와 별도 운영 서버](../foundations/runtime-components.md), Eureka의 위치와 발견 경로는 [등록, 발견과 로드밸런싱](../discovery/discovery-and-balancing.md)에서 설명합니다.
