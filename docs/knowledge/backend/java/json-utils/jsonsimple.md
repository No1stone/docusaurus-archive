---
format: md
id: k-jsonsimple
title: "JsonSimple"
description: "JsonSimple"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-jsonsimple
---
# JsonSimple

JSON Data 처리 라이브 러리

**json-simple 특징**

1.json-simple은 내부적으로 JSON 데이터를 처리하기 위해 Map과 List를 사용.

2.json-simple은 JSON 데이터를 구문 분석하고 JSON을 파일에 기록

3.json-simple의 가장 큰 특징은 타사 라이브러리에 대한 의존성이 없음

```xml
<dependency>

<groupId>com.googlecode.json-simple</groupId>

<artifactId>json-simple</artifactId>

<version>1.1.1</version>

</dependency>
```

```java
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class CardBuilderTestprin {

	public static void main(String[] args) {
		
        JSONObject obj = new JSONObject();
        obj.put("name", "jangwonseok");
        obj.put("age", 1989);
 
        JSONArray list = new JSONArray();
        list.add("jang1");
        list.add("won2");
        list.add("seok3");
 
        obj.put("messages", list);
 
 
        System.out.print(obj);
    
}
}
```
