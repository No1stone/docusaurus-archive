---
id: spring-cloud-configuration-index
title: Config, Vault와 설정 갱신
description: Config Server와 Client, 암호화, Bus, RefreshScope, Vault 조합과 갱신 실패 복구를 다루는 묶음입니다.
slug: /knowledge/backend/spring-cloud/configuration
sidebar_position: 0
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Config, Vault와 설정 갱신"
  - "Spring"
  - "Spring Cloud"
  - "Config Server"
  - "Config Client"
  - "Spring Cloud Bus"
  - "RefreshScope"
  - "Config"
---
# Config, Vault와 설정 갱신

Config Server와 Client, 암호화, Bus, RefreshScope, Vault 조합과 갱신 실패 복구를 다루는 묶음입니다.

하위 글은 제목과 다룰 범위를 먼저 고정한 골격입니다.
상세 구현은 각 글에서 이어서 채웁니다.

## 하위 글

| 글 | 다룰 범위 |
|---|---|
| [Config Server와 설정 저장소](./config-server.md) | Config Server와 Git 등 설정 저장소의 역할을 정리합니다. |
| [Config Client의 설정 로딩과 우선순위](./config-client.md) | 클라이언트가 설정을 로딩하는 순서와 우선순위를 정리합니다. |
| [Config 암호화와 키 관리](./config-encryption.md) | Config의 암호화 값과 키 관리 책임을 정리합니다. |
| [Bus와 RabbitMQ로 변경 이벤트 전파](./bus-and-rabbitmq.md) | Bus와 RabbitMQ로 설정 변경 이벤트를 전파하는 범위를 정리합니다. |
| [RefreshScope와 실제 갱신 가능 범위](./refresh-scope.md) | RefreshScope로 갱신되는 빈과 갱신되지 않는 자원을 구분합니다. |
| [Spring Vault와 Spring Cloud Vault](./spring-vault-and-cloud-vault.md) | Spring Vault와 Spring Cloud Vault의 목적 차이를 정리합니다. |
| [Config와 Vault의 역할 및 조합](./config-and-vault.md) | Config와 Vault를 함께 쓰거나 나누어 쓰는 조건을 정리합니다. |
| [다중 인스턴스 갱신 확인과 실패 복구](./refresh-failure-and-recovery.md) | 여러 인스턴스에 갱신이 적용됐는지 확인하고 실패를 복구하는 방법을 정리합니다. |

## 관련 입구

- [Spring Cloud](../index.md)
- [Legacy Config Server 메모](../legacy/config-server.md)
- [Gateway Config/Bus 갱신](../gateway/config-bus-refresh.md)
- [Legacy](../legacy/index.md)

## 자주 묻는 질문

### Config, Vault와 설정 갱신 묶음에서는 무엇을 다루나요?

Config, Vault와 설정 갱신의 목적과 하위 글 범위를 연결합니다. 상세 구현은 각 하위 글을 봅니다.

### Config, Vault와 설정 갱신부터 읽어야 하나요?

입구 글에서 하위 글의 역할만 확인한 뒤 필요한 주제로 들어가면 됩니다.
