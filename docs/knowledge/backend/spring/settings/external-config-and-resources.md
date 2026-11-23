---
format: "md"
id: "spring-settings-external-config-and-resources"
title: "외부 설정과 리소스 로딩"
description: "Config Import와 외부 파일 및 classpath Resource를 구분하고 실행 jar의 리소스 접근과 비밀 설정 분리를 설명합니다."
slug: "/knowledge/backend/spring/settings/external-config-and-resources"
sidebar_position: 6
status: "active"
tags:
  - "Spring"
keywords:
  - "외부 설정과 리소스 로딩"
  - "Spring"
  - "application.yml"
  - "Profile"
  - "ConfigurationProperties"
  - "@Value"
  - "Environment"
  - "Spring 설정"
---
# 외부 설정과 리소스 로딩

외부 설정과 외부 리소스는 관련이 있지만 같은 기능은 아닙니다.
`spring.config.import`는 설정을 Environment에 추가하는 경로이고, Resource는 파일이나 클래스패스 콘텐츠를 읽는 추상화입니다.

## 기존 import 예제를 이어서 봅니다

Legacy에는 설정 파일을 나누어 불러온 실제 개발 화면이 남아 있습니다.
다음 캡처는 당시 환경의 기록이며, 최신 Redis 설정 키의 기준으로 사용하지는 않습니다.

![설정 파일에서 별도 YAML을 import한 기존 개발 화면](/img/application-yml-import/application-yml-import-1.png)

```yaml
spring:
  config:
    import:
      - classpath:client-defaults.yml
      - optional:file:./config/local-secrets.yml
```

classpath 파일은 jar에 포함될 수 있습니다.
file 경로는 실행 작업 디렉터리의 영향을 받으므로 IDE와 서비스 실행에서 위치가 달라질 수 있습니다.
운영에서는 절대 경로나 명확한 마운트 경로를 사용할지 결정합니다.
`optional:`은 파일 부재를 허용할 뿐, 존재하는 파일의 문법 오류와 유효성 검증을 모두 무시하는 옵션은 아닙니다.

## 파일 선택과 추가를 구분합니다

| 설정 | 의미 |
|---|---|
| spring.config.import | 현재 설정에서 다른 설정을 가져옵니다. |
| spring.config.location | 기본 탐색 위치를 대체합니다. |
| spring.config.additional-location | 기본 위치에 탐색 위치를 추가합니다. |

위치 관련 속성은 설정 탐색 전에 필요하므로 실행 환경이나 인수 등 초기 단계에 전달합니다.
탐색할 파일 안에 그 파일을 찾기 위한 경로만 적어 놓는 순환 구조를 만들지 않습니다.

## jar 안의 파일은 일반 파일이 아닐 수 있습니다

```java
Resource resource = new ClassPathResource("templates/notice.txt");
try (InputStream in = resource.getInputStream()) {
    String template = new String(in.readAllBytes(), StandardCharsets.UTF_8);
}
```

IDE에서는 `resource.getFile()`이 동작해도 실행 jar 내부에서는 실제 파일 경로로 바꿀 수 없을 수 있습니다.
읽기만 필요하다면 스트림을 사용합니다.
변경되는 파일은 jar 외부에 두고 권한과 갱신 방식을 별도로 정합니다.

## 비밀 값과 접근 권한

설정을 다른 파일로 나누는 것만으로 암호화되거나 안전해지는 것은 아닙니다.
별도 파일도 저장소에 커밋하면 같은 문제가 남습니다.
외부 파일 권한, 컨테이너 마운트, 비밀 저장소 인증과 로그 노출을 함께 관리합니다.
필수 비밀 파일에 optional을 남용해 잘못된 기본값으로 기동하지 않도록 합니다.

검증은 IDE 실행과 실제 bootJar 실행을 모두 구분합니다.
파일 누락 시 실패 여부, 작업 디렉터리 변경, jar 내부 리소스 읽기와 비밀 값 미출력을 확인합니다.
기존 사례는 [Legacy import 메모](/docs/knowledge/k-application-yml-import)에 보존돼 있습니다.

설정 탐색은 [Boot Config Data](https://docs.spring.io/spring-boot/3.5/reference/features/external-config.html), 콘텐츠 접근은 [Spring Resources](https://docs.spring.io/spring-framework/reference/6.2/core/resources.html)를 참고합니다.

## 자주 묻는 질문

### profile과 외부 설정 중 무엇이 우선하나요?

Spring Environment의 우선순위 규칙을 따릅니다. 로컬 파일과 환경 변수, 커맨드라인 인자를 함께 봅니다.

### @Value와 ConfigurationProperties는 언제 쓰나요?

단일 값은 @Value, 묶음 설정과 검증은 ConfigurationProperties가 읽기 쉽습니다.

