---
id: spring-cloud-configuration-config-client
title: Config Client의 설정 로딩과 우선순위
description: 클라이언트가 설정을 로딩하는 순서와 우선순위를 정리합니다.
slug: /knowledge/backend/spring-cloud/configuration/config-client
sidebar_position: 2
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Config Client의 설정 로딩과 우선순위"
  - "Spring"
  - "Spring Cloud"
  - "Config Server"
  - "Config Client"
  - "Spring Cloud Bus"
  - "RefreshScope"
  - "Config"
---
# Config Client의 설정 로딩과 우선순위

Config Client는 시작할 때 Config Server의 설정을 Environment에 추가합니다.
로컬 파일을 없애는 기능이라기보다 외부 설정 출처를 하나 더 연결하는 기능입니다.
무슨 값이 최종 적용되는지는 Boot의 우선순위와 프로필까지 확인해야 합니다.

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-config'
```

```yaml
spring:
  application:
    name: catalog
  config:
    import: configserver:http://localhost:8888
  cloud:
    config:
      label: main
```

Cloud Config 4.3의 Config Data 방식입니다.
서버가 접근 불가하면 기동이 실패하는 필수 import 예제이며, `optional:configserver:`로 바꾸면 부재를 허용하는 구성이 됩니다.
필수 DB 주소까지 기본값으로 대체돼 엉뚱한 곳에 접근하지 않도록 판단합니다.

## 기동 로그의 여러 요청

Config Data는 프로필을 결정하고 추가 설정을 읽는 과정에서 서버를 여러 번 조회할 수 있습니다.
같은 기동에 조회가 두 번 있었다고 즉시 재시도 장애라고 판단하지 않습니다.
요청한 앱 이름과 프로필 및 label을 비교합니다.

| 확인할 값 | 원인 예 |
|---|---|
| spring.application.name | 다른 앱의 설정 조회 |
| 활성 프로필 | 환경별 설정 누락 |
| label | 다른 브랜치나 태그 조회 |
| 명령행과 환경 변수 | 원격 설정보다 높은 값 적용 |

## 설정이 적용됐는지 확인합니다

```java
@ConfigurationProperties(prefix = "catalog")
public record CatalogProperties(String displayName) { }
```

설정 속성을 등록한 뒤 원격의 `catalog.display-name`이 어떻게 바인딩되는지 테스트합니다.
단순 값 주입과 실제 외부 클라이언트의 생성 시점은 다르므로 객체가 새 값을 사용하는지도 확인합니다.
비밀 속성 전체를 진단 로그에 출력하지 않습니다.

구버전의 bootstrap.yml 예제를 그대로 더하면 Config Data와 두 경로가 섞일 수 있습니다.
기존 앱이 어느 로딩 모델을 쓰는지 먼저 확인하고 전환합니다.
네트워크 실패 재시도도 관련 의존성과 설정을 명시적으로 검토합니다.

세부 동작은 [Config Client 4.3](https://docs.spring.io/spring-cloud-config/reference/4.3/client.html), 일반 우선순위는 [Boot 외부 설정](https://docs.spring.io/spring-boot/3.5/reference/features/external-config.html)을 참고합니다.

## 자주 묻는 질문

### 기동 로그의 여러 요청에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.

### 설정이 적용됐는지 확인합니다에서 무엇을 확인하나요?

최소 설정으로 동작을 확인한 뒤 확장합니다. 성공과 실패를 경로별로 기록합니다.
