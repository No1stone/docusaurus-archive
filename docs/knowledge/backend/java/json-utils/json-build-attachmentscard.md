---
format: md
id: k-json-build-attachmentscard
title: "Json Build (attachmentsCard)"
description: "Json Build (attachmentsCard)"
tags:
  - Java
status: active
slug: /knowledge/k-json-build-attachmentscard
---
# Json Build (attachmentsCard)

기존에 개발되어있는카드는

Actions[Action.Submit] 을 사용했다.

액션스는 버튼이 5개밖에 셋팅이 안된다.

!json-build-attachmentscard-1.png/Untitled.png)

액션스를반복하면서 작업을 추가하니 5덩어리로 나누어져서 보기가 싫었음.

개선을하고싶어서 찾아보니

selectAction이 존재함.

우선 Json작업이 끝난 셀렉트액션

!json-build-attachmentscard-2.png/Untitled%201.png)

Json이 내기준엔 엄청복잡하게 되어있어서 고생을 했다.

!json-build-attachmentscard-3.png/Untitled%202.png)

중괄호와 대괄호가 난발한다... 키값으로만 나눠보았다..

```java
package GsonBuilder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;
import org.apache.logging.log4j.message.StringFormattedMessage;
import com.google.gson.Gson;
import com.google.gson.JsonArray;

public class CardBuilderTestprin {
	public static void main(String[] args) {
		//카드이펙트 맨위 설명줄이다
		//셋팅될 라인(셀렉트액션)보다 위에 냅둬야해서 선언하면서 값을 셋팅
		//셀렉트액션은 add로 검색된 크기만큼 추가
		JsonArrayBuilder ja = Json.createArrayBuilder()
.add(MesimpleBuilder.CardSelectActionTextTitle("원하시는 검색어를 눌러주세요"));

		//카드에 셋팅될 라인 이름과 세팅될 데이터
		for(int i = 0 ; i < 6 ; ++i) {
		ja.add(MesimpleBuilder.CardSelectActionName(
String.format("스트링 포멧 테스트: %d", i+1), "DATATEST"));
		}

		JsonObject cardattchmen = MesimpleBuilder.CardAttachments(
MesimpleBuilder.CardContents(ja));		

		System.out.println(cardattchmen);
	}
}

```

```json
//줄맞춤을 전부 실행하기에 뎁스가 너무 깊다.
//토큰부분과 룸번호 마크다운등 생략
{"contentType":"application/vnd.microsoft.card.adaptive",
"content":{
"type":"AdaptiveCard",
"version":"1.1",
"body":[{
"type":"TextBlock",
"text":"원하시는 검색어를 눌러주세요",
"color":"dark"},{
"type":"Container",
"style":"emphasis",
"items":[{
"type":"TextBlock",
"color":"accent",
"text":"스트링 포멧 테스트: 1"}],
"selectAction":{
"type":"Action.Submit",
"data":"DATATEST"}},{
"type":"Container",
"style":"emphasis",
"items":[{
"type":"TextBlock",
"color":"accent",
"text":"스트링 포멧 테스트: 2"}],
"selectAction":{
"type":"Action.Submit",
"data":"DATATEST"}},{
"type":"Container",
"style":"emphasis",
"items":[{
"type":"TextBlock",
"color":"accent",
"text":"스트링 포멧 테스트: 3"}],
"selectAction":{
"type":"Action.Submit",
"data":"DATATEST"}},{
"type":"Container",
"style":"emphasis",
"items":[{
"type":"TextBlock",
"color":"accent",
"text":"스트링 포멧 테스트: 4"}],
"selectAction":{
"type":"Action.Submit",
"data":"DATATEST"}},{
"type":"Container",
"style":"emphasis",
"items":[{
"type":"TextBlock",
"color":"accent",
"text":"스트링 포멧 테스트: 5"}],
"selectAction":{
"type":"Action.Submit",
"data":"DATATEST"}},{
"type":"Container",
"style":"emphasis",
"items":[{
"type":"TextBlock",
"color":"accent",
"text":"스트링 포멧 테스트: 6"}],
"selectAction":{
"type":"Action.Submit",
"data":"DATATEST"}}]}}
    ]
}

```

Json 빌드한부분

```java
package GsonBuilder;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;

public class MesimpleBuilder {
	
	public static JsonObject CardAttachments(JsonObject cardcontents){
		return Json.createObjectBuilder()
				.add("contentType", "application/vnd.microsoft.card.adaptive")
				.add("content", cardcontents)
				.build();
		}
	
	public static JsonObject CardContents(JsonArrayBuilder ja){
		return Json.createObjectBuilder()
				.add("type", "AdaptiveCard")
				.add("version", "1.1")
				.add("body",ja).build();
		}
	//말그대로 텍스트의 이름(검색어를눌러주세여)
	public static JsonObject CardSelectActionTextTitle(String TextTitle) {
		return Json.createObjectBuilder()
				.add("type", "TextBlock")
				.add("text", TextTitle)
				.add("color", "dark")
				.build();
		}
	//클릭될 라인의 텍스트와 설정될 데이터값이다.
	public static JsonObject CardSelectActionName(String IMText, String ImDATA){
		return Json.createObjectBuilder()
				.add("type","Container")
				.add("style", "emphasis")
				.add("items", Json.createArrayBuilder().add(Json.createObjectBuilder()
						.add("type", "TextBlock")
						.add("color", "accent")
						.add("text", IMText).build())
						.build())
				.add("selectAction", Json.createObjectBuilder()
						.add("type", "Action.Submit")
						.add("data", ImDATA).build())
				.build();
		}
	

	}
```

※주의할점

빌더로 Json을 만들땐 꼭 JsonArray와 JsonObject를 쓰도록 하자.

JavaCollection List, ArrayList, Map을쓰니 키값이 들어가서 뎁스가 한단계 더 발생함

그리고Webex이넘들.. 겁나복잡하게만들어놧네...ㅆ...........

이제 Database에 값을설정해서 검색된만큼의 결과를 나오게 하는걸 만들어보자...
