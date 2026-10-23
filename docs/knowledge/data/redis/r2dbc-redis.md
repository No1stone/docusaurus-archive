---
format: md
id: k-r2dbc-redis
title: "R2dbc Redis"
description: "R2dbc Redis"
tags:
  - HTTP
  - Java
  - Redis
  - Spring
status: active
slug: /knowledge/k-r2dbc-redis
---
# R2dbc Redis

## 개요

R2dbc Redis에 대한 메모입니다.

reactive web
reactivceRedis
userEntity 등록필요

## Redis 연결

부트베이스 게이트웨이는 Lettuce로 `RedisConnectionFactory`를 만들고 캐시 TTL을 둡니다.

```java
@Bean
public RedisConnectionFactory redisConnectionFactory() {
    return new LettuceConnectionFactory(host, port);
}
```

Access 토큰 존재 여부는 `StringRedisTemplate.hasKey("access:" + token)` 형태로 확인합니다.

## 예제·코드

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.5.6</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.uinetworks.sparwk</groupId>
	<artifactId>WebfluxRedis</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>WebfluxRedis</name>
	<description>Demo project for Spring Boot</description>
	<properties>
		<java.version>1.8</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-redis-reactive</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-webflux</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>io.projectreactor</groupId>
			<artifactId>reactor-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
	</build>

</project>
```

```java
package com.uinetworks.sparwk.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.uinetworks.sparwk.entity.User;

@Configuration
public class RedisConfig {

	 @Autowired
	    RedisConnectionFactory factory;

	    @Bean
	    public ReactiveRedisTemplate<String, User> reactiveRedisTemplate(ReactiveRedisConnectionFactory factory) {

	        Jackson2JsonRedisSerializer<User> serializer = new Jackson2JsonRedisSerializer<>(User.class);

	        RedisSerializationContext.RedisSerializationContextBuilder<String, User> builder =
	                RedisSerializationContext.newSerializationContext(new StringRedisSerializer());

	        RedisSerializationContext<String, User> context = builder.value(serializer)
	                .build();

	        return new ReactiveRedisTemplate<>(factory, context);
	    }

}
```

```java
package com.uinetworks.sparwk.entity;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
//@AllArgsConstructor
public class User implements Serializable {

    private int id;
    private String fullName;

}
```

<details>
<summary>참고 자료</summary>

- [http://maven.apache.org/POM/4.0.0](http://maven.apache.org/POM/4.0.0)
- [http://www.w3.org/2001/XMLSchema-instance](http://www.w3.org/2001/XMLSchema-instance)
- [https://maven.apache.org/xsd/maven-4.0.0.xsd](https://maven.apache.org/xsd/maven-4.0.0.xsd)
</details>
