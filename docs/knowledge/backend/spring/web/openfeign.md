---
format: md
id: k-openfeign
title: "openfeign"
description: "Spring Cloud OpenFeign으로 선언적 HTTP 클라이언트를 구성하고 공통 헤더·재시도·에러를 맞추는 메모입니다."
tags:
  - Spring
  - HTTP
status: active
slug: /knowledge/k-openfeign
---
# openfeign

## 개요

OpenFeign은 인터페이스와 어노테이션으로 REST 호출을 선언하는 클라이언트입니다.
Spring Cloud LoadBalancer·서비스 디스커버리와 붙이면 서비스 이름으로 호출하고, `url`을 주면 고정 호스트로 붙습니다.
동기 MVC 스택에서 여러 내부 API를 같은 방식으로 호출할 때 쓰기 좋습니다.

## 의존성과 활성화

```gradle
implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'
```

Spring Cloud BOM과 버전을 맞춘 뒤 애플리케이션에 `@EnableFeignClients`를 둡니다.

```java
@SpringBootApplication
@EnableFeignClients
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@FeignClient(name = "stores")
public interface StoreClient {
    @GetMapping("/stores")
    List<Store> getStores();
}
```

`name`은 LoadBalancer 클라이언트 이름입니다.
로컬·외부 URL이면 `@FeignClient(name = "partner", url = "${partner.base-url}")`처럼 둡니다.

## 공통 설정

인증 헤더, 재시도, 로깅, 날짜 포맷, 상태 코드별 예외를 Feign 설정 빈으로 모읍니다.

```java
@Configuration
public class FeignClientConfig {

    @Bean
    public RequestInterceptor requestInterceptor(
            @Value("${security.jwt.token}") String fallbackToken
    ) {
        return template -> {
            String token = Optional.ofNullable(AuthContextUtils.getJwtToken())
                    .filter(s -> !s.isBlank())
                    .orElse(fallbackToken);
            template.header("Authorization", "Bearer " + token);
        };
    }

    @Bean
    Retryer.Default retryer() {
        return new Retryer.Default(100L, TimeUnit.SECONDS.toMillis(3L), 5);
    }

    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public ErrorDecoder feignErrorDecoder() {
        return (methodKey, response) -> {
            // status별 도메인 예외로 변환
            throw new BizErrorException(ResponseType.UNKNOWN);
        };
    }
}
```

`@FeignClient(configuration = FeignClientConfig.class)`로 클라이언트마다 설정을 나눌 수 있습니다.
단순 외부 호출 한두 건이면 [RestAPI](./restapi-9f6eac.md)의 `RestClient`가 더 가볍습니다.

<details>
<summary>참고 자료</summary>

- [Spring Cloud OpenFeign](https://docs.spring.io/spring-cloud-openfeign/reference/spring-cloud-openfeign.html) — 선언적 클라이언트, 설정, LoadBalancer
- [goodteacher.tistory.com/446](https://goodteacher.tistory.com/446) — 원본 블로그(작성 시점 접속 실패 이력 있음)
</details>
