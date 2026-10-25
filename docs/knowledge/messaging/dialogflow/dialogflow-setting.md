---
format: md
id: k-dialogflow-setting
title: "DialogFlow Setting"
description: "DialogFlow Setting"
tags:
  - Spring
status: active
slug: /knowledge/k-dialogflow-setting
---
# DialogFlow Setting

GCP와 Dialogflow 프로잭트가 일치해야하며

접속 Json 파일은 아래에서 받는다

IAM 및 관리자 → 서비스계정 → 키

![dialogflow-setting-1.png](/img/dialogflow-setting/dialogflow-setting-1.png)

다이알로그 플로어 Agen 생성할때 해당 프로잭트 선택

받은Json 파일이 GCP를통해 다이얼로그를 호출함

미국버전만 지원함                           GCP프로잭트랑 일치시켜야함

![dialogflow-setting-2.png](/img/dialogflow-setting/dialogflow-setting-2.png)

ngok 으로 웹훅설정을해줌 URL만 지정하면됨

![dialogflow-setting-3.png](/img/dialogflow-setting/dialogflow-setting-3.png)

인텐트 내부 제일 밑에도 풀필먼트 웹훅 사용으로 지정

![dialogflow-setting-4.png](/img/dialogflow-setting/dialogflow-setting-4.png)

![dialogflow-setting-5.png](/img/dialogflow-setting/dialogflow-setting-5.png)

![dialogflow-setting-6.png](/img/dialogflow-setting/dialogflow-setting-6.png)

디텍티드 인텐트로 값을 받는듯함

                                                                queryResult 가 디텍티드인텐트값임

![dialogflow-setting-7.png](/img/dialogflow-setting/dialogflow-setting-7.png)

조회된 인텐트를 핸들러 빌더에 넣어서 보내버림

![dialogflow-setting-8.png](/img/dialogflow-setting/dialogflow-setting-8.png)

핸들러빌더된것을 겟해서 사용한다

![dialogflow-setting-9.png](/img/dialogflow-setting/dialogflow-setting-9.png)
