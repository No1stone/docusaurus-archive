---
id: spring-cloud-configuration-spring-vault-and-cloud-vault
title: Spring Vault와 Spring Cloud Vault
description: Spring Vault와 Spring Cloud Vault의 목적 차이를 정리합니다.
slug: /knowledge/backend/spring-cloud/configuration/spring-vault-and-cloud-vault
sidebar_position: 6
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Spring Vault와 Spring Cloud Vault"
  - "Spring"
  - "Spring Cloud"
  - "Config Server"
  - "Config Client"
  - "Spring Cloud Bus"
  - "RefreshScope"
  - "Vault"
---
# Spring Vault와 Spring Cloud Vault

Spring Vault와 Spring Cloud Vault는 서로 다른 비밀 서버가 아닙니다.
같은 Vault 서버에 접근하는 Java 지원이지만, 코드에서 API를 사용할지 앱 설정으로 연결할지에 초점이 다릅니다.

| 구분 | Spring Vault | Cloud Vault |
|---|---|---|
| 중심 | 비밀 API의 조회, 저장과 폐기 | 비밀의 외부 설정 통합 |
| 대표 API | VaultTemplate | Config Data와 설정 속성 |
| 예 | 업무 중 서명 키 조회 | 시작할 때 DB 자격 증명 사용 |
| 관계 | 기반 라이브러리 | 기반 위의 Cloud 통합 |

```java
VaultResponse response = vaultTemplate.read("secret/data/catalog");
```

인증과 VaultTemplate 빈이 준비된 경우의 부분 예제입니다.
이 경로는 KV v2의 HTTP 경로 예시이며 응답 데이터도 중첩 구조를 확인해야 합니다.
비밀 엔진 버전에 따라 같은 문자열이 같은 API를 뜻하지 않습니다.

```yaml
spring:
  config:
    import: vault://
  cloud:
    vault:
      uri: ${VAULT_URI}
      authentication: TOKEN
      token: ${VAULT_TOKEN}
```

Cloud Vault의 정적 토큰 인증을 보여 주는 로컬 학습 예제입니다.
운영에서는 Kubernetes나 IAM 같은 워크로드 신원 기반 인증도 비교합니다.
토큰 자체를 저장소에 넣지 않으며 접근 정책을 필요한 경로로 제한합니다.

## 두 방식을 함께 사용할 수도 있습니다

DB 설정은 Cloud Vault로 읽고, 업무 기능의 키 연산은 Spring Vault API로 처리할 수 있습니다.
단, 중복 인증과 세션 관리가 불필요하게 생기지 않도록 사용 중인 빈과 토큰 생명주기를 확인합니다.

Vault가 지원하는 동적 자격 증명의 lease와 정적 KV 비밀의 갱신을 같은 것으로 보지 않습니다.
lease 갱신 지원이 기존 DataSource의 비밀번호 교체까지 자동 완성한다는 뜻도 아닙니다.

**과거 학습 예제:** [boot-vault](https://github.com/No1stone/boot-vault)는 이전에 Vault 연동을 학습하며 작성한 코드입니다.
작성 당시의 의존성과 설정을 현재 운영 구성으로 그대로 받아들이지 않고, 연동 흐름을 살펴보는 자료로 사용합니다.
사용할 엔진과 인증 방식, Spring 버전은 예제의 작성 시점과 현재 구성을 나눠 봅니다.
비밀값은 조회 여부만 확인하고 전체 응답을 로그로 남기지 않습니다.

API와 인증은 [Spring Vault](https://spring.io/projects/spring-vault/), 설정 통합은 [Cloud Vault](https://docs.spring.io/spring-cloud-vault/reference/)를 참고합니다.

## 자주 묻는 질문

### 두 방식을 함께 사용할 수도 있습니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### Spring Vault와 Spring Cloud Vault 적용 시 확인할 점에서 무엇을 확인하나요?

설정 로딩, 이벤트 전파와 실제 빈 갱신 가능 범위를 나눠 확인합니다.
