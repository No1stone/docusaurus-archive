---
format: md
id: k-java-time-add-opens
title: java time error
description: java.time 패키지에 대한 --add-opens 플래그와 모듈 강한 캡슐화 관련 메모
tags:
  - Java
  - JVM
status: active
slug: /knowledge/k-java-time-add-opens
---
# java time error

## 개요

JDK 모듈 시스템이 `java.time` 내부 필드에 대한 깊은 반사를 막을 때 `InaccessibleObjectException`이 날 수 있습니다.
실행 옵션 `--add-opens=java.base/java.time=ALL-UNNAMED`로 해당 패키지를 열 수 있으나, 가능하면 라이브러리 업데이트나 지원 API로 대체하는 편이 낫습니다.
원본 메모에 있던 한 줄만으로 과거 장애 원인을 단정하지 않습니다.

## 원본에 있던 문자열

```text
-add-opens=java.base/java.time=ALL-UNNAMED
```

문서·도구에서는 보통 하이픈이 두 개인 형태를 씁니다.

```text
--add-opens=java.base/java.time=ALL-UNNAMED
```

## 공식 의미

`--add-opens $MODULE/$PACKAGE=$REFLECTING_MODULE`은 실행 시점에 `$PACKAGE`를 열어, 지정 모듈(또는 클래스패스의 `ALL-UNNAMED`)이 비공개 멤버까지 반사로 접근하게 합니다.
컴파일 타임이 아니라 **런치 시점**에만 의미가 있습니다.

## 공개된 적용 사례

| 상황 | 증상 요약 | 출처 |
|---|---|---|
| Jackson 등이 `LocalDate` 필드에 반사 접근 | `InaccessibleObjectException` | [Stack Overflow](https://stackoverflow.com/questions/70412805/what-does-this-error-mean-java-lang-reflect-inaccessibleobjectexception-unable) |
| 테스트에서 OpenPojo 등이 `LocalDate`에 접근 | Surefire `argLine`에 `--add-opens` | [SUREFIRE-2053](https://issues.apache.org/jira/browse/SUREFIRE-2053), [OpenPojo #149](https://github.com/OpenPojo/openpojo/issues/149) |

```text
java --add-opens=java.base/java.time=ALL-UNNAMED -jar app.jar
```

```xml
<argLine>--add-opens java.base/java.time=ALL-UNNAMED</argLine>
```

스택에 `java.time`과 `InaccessibleObjectException`이 보일 때만 적용합니다.

<details>
<summary>참고 자료</summary>

- [dev.java — `--add-exports` / `--add-opens`](https://dev.java/learn/organizing/modules/add-exports-opens/)
- [JEP 403: Strongly Encapsulate JDK Internals](https://openjdk.org/jeps/403)
- [Stack Overflow — InaccessibleObjectException / java.time](https://stackoverflow.com/questions/70412805/what-does-this-error-mean-java-lang-reflect-inaccessibleobjectexception-unable)
- [SUREFIRE-2053](https://issues.apache.org/jira/browse/SUREFIRE-2053)
- [OpenPojo #149](https://github.com/OpenPojo/openpojo/issues/149)
</details>
