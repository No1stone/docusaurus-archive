---
format: md
id: k-multidatabase
title: "MultiDataBase"
description: "MultiDataBase"
tags:
  - GoF
  - Java
  - Spring
status: active
slug: /knowledge/k-multidatabase
---
# MultiDataBase

```java
package com.example.demo.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
@MapperScan(value = "com.example.demo.controller", sqlSessionFactoryRef = "firstSqlSessionFactory")
public class FirstDataSourceConfiguration {

	@Primary    
    @Bean(name = "firstDataSource")
    @ConfigurationProperties(prefix = "spring.first.datasource")
    public DataSource firstDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean(name = "firstSqlSessionFactory")
    public SqlSessionFactory firstSqlSessionFactory(@Qualifier("firstDataSource") DataSource firstDataSource,
                                ApplicationContext applicationContext) throws Exception {
           SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
           sqlSessionFactoryBean.setDataSource(firstDataSource);
           sqlSessionFactoryBean.setTypeAliasesPackage("com.costlab.msgbot.mybatis.model");
           sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:com/costlab/msgbot/mybatis/mapper/first/**.xml"));
           return sqlSessionFactoryBean.getObject();
    }

    @Primary
    @Bean(name = "firstSessionTemplate")
    public SqlSessionTemplate firstSqlSessionTemplate(@Qualifier("firstSqlSessionFactory") SqlSessionFactory firstSqlSessionFactory) {
        return new SqlSessionTemplate(firstSqlSessionFactory);
    }
	
}
```

```java
package com.example.demo.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(value = "com.costlab.msgbot.mybatis.mapper.second", sqlSessionFactoryRef = "secondSqlSessionFactory")
public class SecondDataSourceConfiguration {

	@Bean(name = "secondDataSource")
    @ConfigurationProperties(prefix="spring.second.datasource")
    public DataSource SecondDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "secondSqlSessionFactory")
    public SqlSessionFactory secondSqlSessionFactory(@Qualifier("secondDataSource") DataSource secondDataSource,
                                                          ApplicationContext applicationContext) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(secondDataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage("com.costlab.msgbot.mybatis.model");
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:com/costlab/msgbot/mybatis/mapper/second/**.xml"));
        return sqlSessionFactoryBean.getObject();
    }

    @Bean(name = "secondSessionTemplate")
    public SqlSessionTemplate secondSqlSessionTemplate(@Qualifier("secondSqlSessionFactory") SqlSessionFactory secondSqlSessionFactory) {
        return new SqlSessionTemplate(secondSqlSessionFactory);
    }
	
}
```

```xml
#database setting
spring.first.datasource.url=jdbc:log4jdbc:mariadb://localhost:3306/wonderful?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul
spring.first.datasource.username=
spring.first.datasource.password=
spring.second.datasource.driver-class-name=net.sf.log4jdbc.sql.jdbcapi.DriverSpy
spring.second.datasource.validation-query=SELECT 1

spring.second.datasource.jdbc-url=jdbc:
spring.second.datasource.username=
spring.second.datasource.password=
spring.second.datasource.driver-class-name=net.sf.log4jdbc.sql.jdbcapi.DriverSpy
spring.second.datasource.validation-query=SELECT 1
```

application.properties
