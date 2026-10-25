---
format: md
id: k-webex-json-library-사용
title: "Webex Json library 사용"
description: "Webex Json library 사용"
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-webex-json-library-사용
---
# Webex Json library 사용

## 개요

Webex Json library 사용입니다.

Json RestAPI Send Bean설정

## 예제·코드

```java
@Bean(name = "spark") //모델 spark대신 네임을지정하여사용
public Spark spark() {
java.util.logging.Logger logger = 
java.util.logging.Logger.getLogger(WebConfig.class.getName());	
Spark spark = Spark.builder()
			.baseUrl(URI.create("<https://webexapis.com/v1>"))
			//.logger(logger)
			.accessToken(this.MSGBOT_ACCESS_TOKEN)
			.build();
	return spark;
}
@Bean
public Spark chatbotSpark() {
	Spark spark = Spark.builder()
			.baseUrl(URI.create("<https://webexapis.com/v1>"))
			.accessToken(this.CHATBOT_ACCESS_TOKEN)
			.build();
	return spark;
}
```

<details>
<summary>참고 자료</summary>

- [https://webexapis.com/v1](https://webexapis.com/v1)
</details>
