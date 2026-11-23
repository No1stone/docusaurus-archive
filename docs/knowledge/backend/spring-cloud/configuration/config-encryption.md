---
id: spring-cloud-configuration-config-encryption
title: Config 암호화와 키 관리
description: Config의 암호화 값과 키 관리 책임을 정리합니다.
slug: /knowledge/backend/spring-cloud/configuration/config-encryption
sidebar_position: 3
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Config 암호화와 키 관리"
  - "Spring"
  - "Spring Cloud"
  - "Config Server"
  - "Config Client"
  - "Spring Cloud Bus"
  - "RefreshScope"
  - "Config"
---
# Config 암호화와 키 관리

Config Server의 암호화는 저장소에 비밀 값을 평문으로 두지 않도록 돕습니다.
앱이 사용할 때까지 값을 영원히 숨기는 기능은 아닙니다.
일반적인 구성에서는 서버가 복호화한 값을 권한 있는 클라이언트에 제공합니다.

```yaml
spring:
  datasource:
    password: '{cipher}ENCRYPTED_VALUE'
```

이 블록은 설정 저장소 안의 형식 예시입니다.
ENCRYPTED_VALUE는 실제 암호문이 아니며 그대로 실행할 수 없습니다.
암호화 키나 keystore는 이 값과 다른 접근 경로로 관리합니다.

```mermaid
flowchart LR
    Encrypted[Git의 암호문] --> Server[키를 가진 Config Server]
    Server -->|복호화된 설정| Client[권한 있는 앱]
```

## 무엇을 보호할까요

| 경계 | 필요한 관리 |
|---|---|
| 저장소 | 암호문과 변경 권한 |
| 복호화 키 | 별도 보관과 접근 제한 |
| Config API | 인증과 허용 앱 범위 |
| 전송 | TLS와 내부 통신 정책 |
| 앱 런타임 | 로그, 진단 API와 메모리 노출 범위 |

키와 암호문을 같은 저장소에 두면 분리의 이점이 줄어듭니다.
암호화된 문자열이 있다는 이유로 Config API를 공개하지 않습니다.
서버의 encrypt 및 decrypt 기능도 관리 권한이 필요한 API입니다.

## 암호화가 비밀 수명 관리를 대신하지 않습니다

Config는 값을 제공할 수 있지만 사용자별 DB 계정의 동적 발급과 만료를 모두 같은 방식으로 관리하는 제품은 아닙니다.
그런 요구가 있으면 Vault 등의 비밀 관리와 비교합니다.
정적 DB 비밀번호를 바꿀 때도 DB와 앱의 변경 순서, 기존 연결 수명을 확인해야 합니다.

검증은 정상 복호화, 잘못된 키와 잘못된 암호문을 나눕니다.
복호화 실패가 그대로 비밀번호 문자열로 사용되거나 원문이 로그에 남지 않는지 확인합니다.
키 회전은 기존 암호문이 어느 키로 처리되는지와 복구할 방법까지 준비합니다.

암호화 형식과 실패 처리는 [공식 Encryption and Decryption](https://docs.spring.io/spring-cloud-config/reference/server/encryption-and-decryption.html)을 참고합니다.

## 자주 묻는 질문

### 무엇을 보호할까요에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### 암호화가 비밀 수명 관리를 대신하지 않습니다에서 무엇을 확인하나요?

설정 로딩, 이벤트 전파와 실제 빈 갱신 가능 범위를 나눠 확인합니다.
