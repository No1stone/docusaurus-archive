---
format: "md"
id: "spring-settings-application-yml-and-properties"
title: "application.yml과 properties"
description: "YAML과 properties의 계층 표현, 리스트, 문서 분리와 설정 파일 선택 시 주의점을 설명합니다."
slug: "/knowledge/backend/spring/settings/application-yml-and-properties"
sidebar_position: 1
status: "active"
tags:
  - "Spring"
keywords:
  - "application.yml과 properties"
  - "Spring"
  - "application.yml"
  - "Profile"
  - "ConfigurationProperties"
  - "@Value"
  - "Environment"
  - "Spring 설정"
---
# application.yml과 properties

설정 파일은 코드 밖에서 실행 환경을 조정하는 입력입니다.
형식이 읽기 편하더라도 키가 틀리거나 다른 설정에 덮이면 기대한 동작은 나오지 않습니다.
여기서는 Boot 3.5의 Config Data를 기준으로 두 형식을 비교합니다.

## 같은 설정을 표현하는 방법

```yaml
server:
  port: 8090
app:
  client:
    base-url: https://api.example.invalid
    timeout: 2s
    allowed-types:
      - STANDARD
      - EXPRESS
```

```properties
server.port=8090
app.client.base-url=https://api.example.invalid
app.client.timeout=2s
app.client.allowed-types[0]=STANDARD
app.client.allowed-types[1]=EXPRESS
```

`app.client`는 예제용 사용자 설정입니다.
키를 파일에 추가하는 것만으로 기능이 생기지는 않으며, 코드에서 읽거나 설정 객체로 바인딩해야 합니다.
`timeout`을 `Duration`으로 바인딩한다면 단위를 명시해 숫자의 의미를 분명하게 합니다.

| 형식 | 장점 | 주의할 부분 |
|---|---|---|
| YAML | 계층과 목록을 읽기 쉽습니다. | 들여쓰기와 타입 해석을 확인합니다. |
| properties | 한 줄마다 키가 완성됩니다. | 긴 접두사와 배열 인덱스가 반복됩니다. |

같은 위치에 두 형식이 모두 있으면 Boot에서는 properties가 우선합니다.
두 파일을 나눠 써서 어떤 값이 적용되는지 추적하기 어려워지지 않게 한 형식을 기본으로 정합니다.

## 여러 문서를 한 파일에 둘 때

```yaml
app:
  client:
    timeout: 2s
---
spring:
  config:
    activate:
      on-profile: local
app:
  client:
    timeout: 5s
```

이 예제는 local 프로필에만 두 번째 문서를 적용합니다.
프로필이 없는 기본 문서와 환경 전용 문서를 구분합니다.
프로필 문서 안에서 다시 `spring.profiles.active`를 지정하는 방식은 사용하지 않습니다.

YAML 들여쓰기를 잘못하면 같은 이름이 다른 경로에 생길 수 있습니다.
파서는 성공하지만 바인딩 대상에는 값이 전달되지 않는 경우도 있으므로 문법 검사와 실제 바인딩 검증은 다릅니다.
중복 키와 리스트 덮어쓰기 동작도 확인합니다.

## 파일과 실행 환경을 함께 봅니다

```bash
java -jar app.jar --server.port=8091
```

기본 설정이 8090이어도 일반적인 Boot 실행에서는 위 인수가 더 높은 우선순위로 적용됩니다.
설정 파일을 수정했는데 포트가 바뀌지 않으면 실행 인수와 환경 변수까지 확인합니다.
비밀번호는 예제나 저장소에 실값을 넣지 않고 별도 주입 경로를 사용합니다.

확인할 때는 값을 사용하는 기능의 실제 동작과 바인딩 결과를 함께 봅니다.
전체 Environment를 로그에 출력하면 민감 정보가 노출될 수 있으므로 필요한 비밀이 아닌 항목만 확인합니다.

파일 위치와 우선순위는 [Boot 외부 설정](https://docs.spring.io/spring-boot/3.5/reference/features/external-config.html)을 참고합니다.

## 자주 묻는 질문

### profile과 외부 설정 중 무엇이 우선하나요?

Spring Environment의 우선순위 규칙을 따릅니다. 로컬 파일과 환경 변수, 커맨드라인 인자를 함께 봅니다.

### @Value와 ConfigurationProperties는 언제 쓰나요?

단일 값은 @Value, 묶음 설정과 검증은 ConfigurationProperties가 읽기 쉽습니다.

