---
format: md
id: k-dockerfile
title: "dockerFile"
description: "dockerFile"
tags:
  - Docker
  - Git
  - Java
  - Spring
status: active
slug: /knowledge/k-dockerfile
---
# dockerFile

vi chatbot.dockerfile

![dockerfile-1.png](/img/dockerfile/dockerfile-1.png)

civi 파일로 해당파일을 염

ARG ARG_PROFILE

프로퍼티 사용할 이름을 입력시킴

![dockerfile-2.png](/img/dockerfile/dockerfile-2.png)

```docker
FROM amazoncorretto:11
ENV TZ Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && ehco $TZ > /etc/timezon

RUN mkdir -p /app/admin/app
RUN mkdir -p /app/admin/logs
WORKDIR /app/admin/app

RUN git init
RUN git pull -address-
COPY target/spring*.jar app.jar

ENTRYPOINT [                                                
    "java",                                                 
    "-jar",                                                 
    "-Djava.security.egd=file:/dev/./urandom",  
		-Dspring.profile.active.dev,
		-Dspring.profile.active.prd,
		-Dspring.profile.active.local,            
    "-Dsun.net.inetaddr.ttl=0",                             
    "my-app-0.0.1-SNAPSHOT.jar"              
]
```
