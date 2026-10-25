---
format: md
id: k-webex-ciscopark
title: "Webex Ciscopark"
description: "Cisco Webex REST API를 호출하는 Java SDK(webex-java-sdk) 참고"
tags:
  - Java
  - Webex
  - Git
status: active
slug: /knowledge/k-webex-ciscopark
---
# Webex Ciscopark

## 개요

Cisco Webex REST API를 호출하는 Java SDK(webex-java-sdk) 참고입니다.

> 원본 메모의 “Json 센드 라이브러리” 의도를 유지합니다.
저장소 는 Cisco Webex RESTful API용 Java 라이브러리입니다.
2018년 리브랜딩 이전 이름인 Spark를 코드와 문서에 남기고 있어 README에는 spark-java-sdk로도 소개됩니다.
필요 환경은 Java 8과 Maven입니다.
개발자 토큰은 에서 발급합니다.
룸 목록 조회, 멤버십 추가, 메시지와 파일 전송 같은 작업도 같은 클라이언트에서 이어갈 수 있습니다.
토큰과 비밀 값은 저장소나 문서에 넣지 않습니다.
원본에 첨부된 SDK/사용 화면입니다.

![webex-ciscopark-1](/img/webex-ciscopark/webex-ciscopark-1.png)

## 예제·코드

```java
String accessToken = "<<secret>>";

Spark spark = Spark.builder()
        .baseUrl(URI.create("https://api.ciscospark.com/v1"))
        .accessToken(accessToken)
        .build();

Message message = new Message();
message.setRoomId(room.getId());
message.setText("Hello World!");
spark.messages().post(message);
```

<details>
<summary>참고 자료</summary>

- [webex/webex-java-sdk](https://github.com/webex/webex-java-sdk) — Java library for consuming RESTful APIs for Cisco Spark - webex/webex-java-sdk
- [Webex for Developers](https://developer.webex.com) — Build the future of business collaboration with Webex! Learn more about the Webex API and SDKs to create the next great collaboration app on the Webex Platform.
- [https://api.ciscospark.com/v1](https://api.ciscospark.com/v1)
</details>
