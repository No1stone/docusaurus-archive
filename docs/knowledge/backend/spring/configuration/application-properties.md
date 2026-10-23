---
format: md
id: k-application-properties
title: "application properties"
description: "application properties"
tags:
  - Spring
status: active
slug: /knowledge/k-application-properties
---
# application properties

여러가지 데이터베이스 사용방법

spring.first.datasource.jdbc-url=
spring.first.datasource.username=
spring.first.datasource.password=
spring.first.datasource.driver-class-name=
spring.first.first.datasource.validation-query=

spring.second.datasource.jdbc-url=
spring.second.datasource.username=
spring.second.datasource.password=
spring.second.datasource.driver-class-name=
spring.second.first.datasource.validation-query=

#disbale Spring banner
spring.main.banner-mode=console
server.port = 7001
spring.first.datasource.jdbc-url=
spring.first.datasource.username=
spring.first.datasource.password=
spring.first.datasource.validation-query=SELECT 1
spring.second.datasource.jdbc-url=
spring.second.datasource.username=
spring.second.datasource.password=
spring.second.datasource.validation-query=SELECT 1
#spring.third.datasource.driver-class-name=
#spring.third.datasource.url=

#spring.third.datasource.username=
#spring.third.datasource.password=

# #HikariCP settings

# #spring.datasource.hikari.*

# #60 sec

spring.datasource.hikari.connection-timeout=60000

# #max 5

spring.datasource.hikari.maximum-pool-size=10

# #mybatis settings

mybatis.type-aliases-package=com.costlab.msgbot.mybatis.model
logging.level.net.com.costlab.msgbot.mybatis.mapper=TRACE
logging.config=classpath:logback-dev.xml
#AutoToken 암호화키
service.encrypt.key=
#WEB 토큰 유효시간(s, 12시간, 60 * 60 * 12) 테스트에서는 12시간으로 운영에서는 5분으로 할것!!
service.token.expire=43200
#Webex Bot Access Token
#webex.msgbot.accesstoken=
#webex.msgbot.id=
webex.msgbot.accesstoken=
webex.msgbot.id=
webex.chatbot.accesstoken=
webex.chatbot.id=
webex.chatbot.email=
mediopia.secret.key=
#CORS 허용 도메인 목록(,로 여러개 추가 가능)
service.alloworigins.list=*
#TOKEN 없어도 되는 URL 테스트 모드에서만 쓰임
service.tokenexc.url=/getAuthToken
#공지사항 메세지 한건당 전송 소요시간(초)
service.msg.persendtime=1
#공지사항 메세지를 전송 완료할 목표 시간(초)
service.msg.targettime=1800
#시스템 모드 TEST/REAL
service.mode=REAL
