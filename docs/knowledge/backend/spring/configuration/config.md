---
format: md
id: k-config
title: "Config"
description: "Config"
tags:
  - GoF
  - Java
  - Spring
status: active
slug: /knowledge/k-config
---
# Config

```java
@Configuration
@MapperScan(value = "com.costlab.msgbot.mybatis.mapper.first", sqlSessionFactoryRef = "firstSqlSessionFactory")
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
