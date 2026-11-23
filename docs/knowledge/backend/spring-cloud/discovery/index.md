---
id: spring-cloud-discovery-index
title: 서비스 발견과 Eureka
description: 등록과 발견, Eureka Server와 Client, 다중화와 장애 반영, Consul과 Kubernetes DNS를 다루는 묶음입니다.
slug: /knowledge/backend/spring-cloud/discovery
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "서비스 발견과 Eureka"
  - "Spring"
  - "Spring Cloud"
  - "Eureka"
  - "DiscoveryClient"
  - "LoadBalancer"
  - "Service Discovery"
  - "서비스"
---
# 서비스 발견과 Eureka

등록과 발견, Eureka Server와 Client, 다중화와 장애 반영, Consul과 Kubernetes DNS를 다루는 묶음입니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [등록, 발견과 로드밸런싱](./discovery-and-balancing.md) | Eureka와 DiscoveryClient, LoadBalancer, Kubernetes DNS의 차이를 설명합니다. |
| [Eureka Server 의존성과 기본 구성](./eureka-server.md) | Eureka Server를 별도 앱으로 구성하는 의존성과 기본 설정을 정리합니다. |
| [Eureka Client 등록과 주소 조회](./eureka-client.md) | 클라이언트의 등록, heartbeat와 주소 조회를 정리합니다. |
| [Eureka 다중화와 서버 간 연결](./eureka-high-availability.md) | Eureka Server 다중화와 서버 간 복제 연결을 정리합니다. |
| [Heartbeat, 캐시와 장애 반영](./eureka-failure-and-cache.md) | heartbeat와 캐시 때문에 장애가 반영되는 과정을 정리합니다. |
| [Eureka, Consul과 Zookeeper 비교](./consul-and-zookeeper.md) | 발견 경로로 Eureka, Consul, Zookeeper를 비교합니다. |
| [Kubernetes Service와 DNS가 맡는 역할](./kubernetes-service-dns.md) | Kubernetes Service와 DNS가 Eureka 역할을 대신할 수 있는 조건을 정리합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [Legacy Eureka 메모](../legacy/eureka.md)
- [Legacy](../legacy/index.md)

## 자주 묻는 질문

### 서비스 발견과 Eureka 묶음에서는 무엇을 다루나요?

서비스 발견과 Eureka의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### 서비스 발견과 Eureka부터 읽어야 하나요?

입구 글에서 하위 글의 역할만 확인한 뒤 필요한 주제로 들어가면 됩니다.
