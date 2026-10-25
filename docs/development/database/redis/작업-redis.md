---
format: md
id: k-작업-redis
title: "작업 redis"
description: "작업 redis 관련 원문 링크 범위 안내"
tags:
  - Redis
  - Linux
status: active
slug: /knowledge/k-작업-redis
---
# 작업 redis

## 개요

작업 redis 관련 원문 링크 범위 안내입니다.

상세 절차와 최신 옵션은 위 링크의 원문을 확인합니다.
이 글은 링크 보관과 범위 안내만 하며, 특정 환경의 실측 수치를 주장하지 않습니다.

## Redis 연결

부트베이스 게이트웨이는 Lettuce로 `RedisConnectionFactory`를 만들고 캐시 TTL을 둡니다.

```java
@Bean
public RedisConnectionFactory redisConnectionFactory() {
    return new LettuceConnectionFactory(host, port);
}
```

Access 토큰 존재 여부는 `StringRedisTemplate.hasKey("access:" + token)` 형태로 확인합니다.

<details>
<summary>참고 자료</summary>

- [Redis beginners Tutorial - YouTube](https://www.youtube.com/watch?v=LMWl9eocWzw&list=PLVCgi5HZ0-Yvjwi_oqWG0g7a2K2m0Umna) — Courses https://techbloomeracademy.com/store/. connect on Fiverr for job support: https://www.fiverr.com/automateanythin.. For meeting: https://calendly.com/...
</details>
