---
format: md
id: k-gson-to-json
title: "Gson To Json"
description: "Gson 의존성을 Maven과 Gradle로 추가하는 메모입니다."
tags:
  - Spring
status: active
slug: /knowledge/k-gson-to-json
---
# Gson To Json

## 개요

Google Gson으로 JSON을 다룰 때 쓰는 의존성 메모입니다.
DI로 주입해 쓰고, Maven과 Gradle 예시 버전을 남겨 두었습니다.

## Maven (pom.xml)

```xml
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.8.6</version>
</dependency>
```

## Gradle (build.gradle)

버전은 프로젝트에 맞게 정합니다.

```gradle
dependencies {
    compile "com.google.code.gson:gson:2.8.0"
}
```
