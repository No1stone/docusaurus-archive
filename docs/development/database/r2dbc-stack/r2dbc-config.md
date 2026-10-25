---
format: md
id: k-r2dbc-config
title: "R2dbc config"
description: "R2dbc config"
tags:
  - GoF
  - Java
  - PostgreSQL
  - Spring
status: active
slug: /knowledge/k-r2dbc-config
---
# R2dbc config

```java
package com.example.client.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.r2dbc.connection.TransactionAwareConnectionFactoryProxy;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.reactive.TransactionalOperator;

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import io.r2dbc.spi.ConnectionFactory;

@Configuration
public class DatabaseConfig {

    @Value("${db.driver.name}") private String driverName;
    @Value("${db.host}") private String host;
    @Value("${db.port}") private String port;
    @Value("${db.database.name}") private String databaseName;
    @Value("${db.username}") private String username;
    @Value("${db.password}") private String password;
	
    @Primary
    @Bean
    public ConnectionFactory connectionFactory() {
        return new PostgresqlConnectionFactory(
                PostgresqlConnectionConfiguration.builder()
                        .host(host)
                        .database(databaseName)
                        .username(username)
                        .password(password)
                        .build()
        );
    }
    
    @Bean
    TransactionAwareConnectionFactoryProxy transactionAwareConnectionFactoryProxy(ConnectionFactory connectionFactory) {
        return new TransactionAwareConnectionFactoryProxy(connectionFactory);
    }

    @Bean
    DatabaseClient databaseClient(ConnectionFactory connectionFactory) {
        return DatabaseClient.builder()
                .connectionFactory(connectionFactory)
                .namedParameters(true)
                .build();
    }

    @Bean
    ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }

    @Bean
    TransactionalOperator transactionalOperator(ReactiveTransactionManager transactionManager) {
        return TransactionalOperator.create(transactionManager);
    }
    
	@Bean
	R2dbcEntityTemplate r2dbcEntityTemplate() {
		return new R2dbcEntityTemplate(connectionFactory());
	}
	
    
}
```

```java
@Configuration
@EnableR2dbcRepositories(basePackageClasses = TestModel.class)
@ComponentScan(basePackageClasses = TestModel.class)
public class R2dbcConfig {
@Bean
public ConnectionFactory connectionFactory() {
return ConnectionFactories.get("r2dbc:mariadb://root:1234@localhost:3306/firstdatabase");
```

```java
@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
@Table("r2dbctesttable")
public class TestModel {
	
	
	@Id
	private String firstname;
	private String lastname;

}
```

```java
public interface interfaceaaa extends R2dbcRepository<TestModel, String> {

}
```

```java
@RestController
public class Controller {
@Autowired
	private interfaceaaa aaaa;
@GetMapping(path="/monotest")
	public Flux<TestModel> monotest(){
	//	Flux<TestModel> asd = (Flux<TestModel>) aaaa.findAll().subscribe();
		return aaaa.findAll();
	}

@GetMapping(path="asdasd")
	public Subscriber<TestModel> subscriptest(){
		
		return (Subscriber<TestModel>) aaaa.findAll().subscribe();
	}
}
```
