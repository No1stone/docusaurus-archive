---
id: pattern-gateway-authorization-routing
title: Gateway 권한 라우팅
description: API Gateway에서 인증·허용 경로·하류 라우팅을 나누는 패턴. boot-base 코드와 아이컴시스 사례의 정책 저장 방식을 구분합니다.
tags:
  - patterns
  - Spring Cloud Gateway
  - Redis
status: active
slug: /patterns/architecture-patterns/gateway-authorization-routing
---
# Gateway 권한 라우팅

> **개요:** API Gateway는 인증·인가·라우팅을 입구에서 맞춘 뒤, 허용된 요청만 하류 서비스로 넘깁니다.
> “토큰이 있는지만 본다”와 “URL·메서드별 권한 정책으로 라우팅한다”는 구현 수준이 다릅니다.

## 적용 상황

- 클라이언트가 여러 마이크로서비스를 직접 알지 않고 하나의 입구를 통하게 할 때
- 공통 인증을 Gateway에 모으고, 서비스 발견(Eureka 등)으로 인스턴스를 찾을 때

Config Server·Eureka는 Gateway 권한 로직과 역할이 다릅니다.
설정 외부화와 서비스 등록은 [Spring Cloud 메모](../../development/spring/spring-cloud/)로 연결합니다.

## 일반 권한 검사와 라우팅 정책

| 관심사 | 하는 일 |
|--------|---------|
| 인증 | 호출자가 누구인지 (토큰 검증, 세션 등) |
| 허용 경로 | 로그인·문서처럼 인증 없이 통과할 경로 |
| 인가·정책 | 이 호출자가 이 URL·동작을 해도 되는지 |
| 라우팅 | 어떤 하류 서비스·경로로 프록시할지 |

인가 없이 인증만 통과시키면, 하류가 다시 권한을 검사해야 합니다.
반대로 Gateway에 세밀한 정책을 두면 정책 저장·무효화·배포를 입구에서 관리합니다.

## boot-base에서 확인한 구현

참조: `boot-base` 커밋 `5e70210`, Spring Boot 3.5.x, Java 17, Spring Cloud Gateway.
모듈: `gateway/`, 토큰 발급 측 `api-auth/`.

확인된 흐름은 다음과 같습니다.

1. `ConfigFilter`가 `/auth/**` 경로를 `lb://api-auth`로 라우팅합니다.
2. `JwtAuthenticationFilter`가 허용 경로 목록(`AuthServerAllowPath`)이면 통과합니다.
3. 그 외 요청은 `Authorization: Bearer` 토큰을 읽고, Redis 키 `access:{token}` 존재 여부를 먼저 봅니다 (`JwtTokenAuthenticationProvider.verifyAccessToken`).
4. 발급 측(`VaultJwtTokenProvider`)은 로그인 성공 시 Redis에 `access:` 키를 넣습니다.

즉 현재 코드 기준으로 Gateway는 **액세스 토큰 존재(및 일부 검증 경로)** 와 **경로 라우팅**이 중심입니다.
아이컴시스 사례처럼 “그룹 권한 정책을 Redis에 직렬화해 URL별로 분기”하는 로직은 이 커밋의 Gateway 필터에서 확인하지 못했습니다.

허용 경로 목록은 코드 상수이며, 주석에 Config Server로 뺄 수 있다는 메모가 있습니다.
실제 Config Server 연동으로 바뀐 상태는 이 경로만으로 단정하지 않습니다.

관련 경로:

- `gateway/.../filter/ConfigFilter.java`
- `gateway/.../filter/JwtAuthenticationFilter.java`
- `gateway/.../filter/JwtTokenAuthenticationProvider.java`
- `gateway/.../conf/dto/AuthServerAllowPath.java`
- `api-auth/.../provider/VaultJwtTokenProvider.java`

## 아이컴시스 사례와의 연결

사례 본문은 Postmortems에 있습니다.

- 로그인 후 그룹 권한 정책을 조회해 Redis에 두고, Gateway가 조회한 뒤 권한에 맞게 라우팅한다는 서술: [애플리케이션 서비스](../../architecture/postmortems/icomsys-msa-iam-portfolio/application-services.md)
- 읽기(1)·수정(2) 수준으로 Gateway에서 URL을 라우팅한다는 서술: [권한·메뉴 개선](../../architecture/postmortems/icomsys-msa-iam-portfolio/iam-and-menu-improvement.md)
- 서버 다이어그램상 Gateway 뒤 Eureka·Config·Auth 등: [설계 개요와 비용](../../architecture/postmortems/icomsys-msa-iam-portfolio/design-and-runtime.md)

사례의 정책 모델과 boot-base 현재 코드를 한 구현으로 합쳐 설명하지 않습니다.

## 실패 처리와 주의점

- 허용 경로 오설정은 인증 우회입니다. 목록 관리를 코드·설정 중 어디에 둘지 명확히 합니다.
- Redis에만 의존하는 토큰 존재 검사는 Redis 장애 시 전부 실패하거나, 구현에 따라 과도하게 통과할 수 있습니다. boot-base 일부 경로에는 Redis 미스 후 서명 검증이 주석 처리된 구간이 있어, 운영 전에 검증 정책을 확인해야 합니다.
- `lb://` 라우팅은 서비스 발견이 함께 동작해야 합니다. Eureka 설명은 Gateway 글에 합치지 않고 [Eureka](../../development/spring/spring-cloud/eureka.md)로 둡니다.

## 관련 글

- [API GATEWAY](../../development/spring/spring-cloud/api-gateway.md)
- [Config Server](../../development/spring/spring-cloud/config-server.md)
- [Eureka](../../development/spring/spring-cloud/eureka.md)
- [아이컴시스 포트폴리오 개요](../../architecture/postmortems/icomsys-msa-iam-portfolio/overview.md)

## 참고

- [Spring Cloud Gateway Reference](https://docs.spring.io/spring-cloud-gateway/reference/)
