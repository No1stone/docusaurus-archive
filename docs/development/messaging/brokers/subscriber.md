---
format: md
id: k-subscriber
title: "Subscriber"
description: "Subscriber"
tags:
  - GoF
  - Java
  - Redis
  - Spring
status: active
slug: /knowledge/k-subscriber
---
# Subscriber

```java
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

config

```java
@Configuration
@EnableCaching
public class RedisConfig {

    /**
     * @EnableCaching 캐싱 기능을 사용
     * @Cacheable(value="test") 캐싱을 추가하는 메소드에 붙힌다.
     * @CacheEvict(value="test") 캐싱을 처리하고 캐쉬를 삭제할 메소드에 붙힌다.
     * @CachePut(value="test") 캐싱을 처리하고 캐쉬를 수정할 메소드에 붙힌다.
     * @Caching(value="test") 여러개를 처리할때 사용한다.
     */

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory());
        container.addMessageListener(messageListenerAdapter(), topic());
        return container;
    }

    @Bean
    public MessageListenerAdapter messageListenerAdapter(){
        return new MessageListenerAdapter(new RedisMessgeStringSubscriber());
    }

    @Bean
    public ChannelTopic topic(){
        return new ChannelTopic("ch01");
    }
```

```java
@Service
@Slf4j
public class RedisMessgeStringSubscriber implements MessageListener {

    @Override
    public void onMessage(Message message, byte[] pattern) {

        log.info("Redis Subscriber");
        log.info("Redis Subscriber -{}", new Gson().toJson(message));
        log.info("Redis Subscriber -{}", message.toString());
    }

}
```
