---
format: md
id: k-jsonfile읽는법dialogflowauth
title: "JsonFile읽는법(DialogFlowAuth)"
description: "Spring에서 Dialogflow 서비스 계정 JSON으로 GoogleCredentials를 만드는 예제입니다."
tags:
  - HTTP
  - Spring
status: active
slug: /knowledge/k-jsonfile읽는법dialogflowauth
---
# JsonFile읽는법(DialogFlowAuth)

## 개요

Spring에서 Dialogflow 서비스 계정 JSON으로 GoogleCredentials를 만드는 예제입니다.

Dialogflow 인증에 쓰는 서비스 계정 JSON을 classpath에서 읽어 `GoogleCredentials` 빈으로 등록하는 예제입니다.
스코프는 Dialogflow API입니다.
JSON 파일은 저장소에 올리지 말고, 배포 환경의 비밀 관리 방식에 맞게 주입하는 것이 안전합니다.

## 예제·코드

```java
@Bean
public GoogleCredentials gdfCredential() throws IOException {
    Resource resource = resourceLoader.getResource("classpath:submit-assignment-6921fb2fb3a6.json");
    return GoogleCredentials.fromStream(resource.getInputStream())
        .createScoped(Collections.singletonList("https://www.googleapis.com/auth/dialogflow"));
}
```

<details>
<summary>참고 자료</summary>

- [https://www.googleapis.com/auth/dialogflow](https://www.googleapis.com/auth/dialogflow)
</details>
