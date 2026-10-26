---
id: msa-application-services
title: 애플리케이션 서비스
description: Service, AuthServer, Gateway, Config, Eureka와 패키지 구조
tags:
  - Spring Cloud Gateway
  - JWT
  - Redis
status: active
slug: "/postmortems/msa-iam-portfolio/application-services"
---
# 애플리케이션 서비스

> **개요:** 「Service」 하위와 Gateway·Auth 구조입니다.

## Service

서비스의 버전은

Java 17 

Spring 6.X

Spring Boot 3.X 버전을 기반으로 개발합니다.

[https://github.com/querydsl/querydsl/issues/3296](https://github.com/querydsl/querydsl/issues/3296)

[https://github.com/querydsl/querydsl/issues/3296](https://github.com/querydsl/querydsl/issues/3296)

[https://jskim1991.medium.com/spring-boot-exploring-spring-boot-3-with-querydsl-part-2-7b563c382192](https://jskim1991.medium.com/spring-boot-exploring-spring-boot-3-with-querydsl-part-2-7b563c382192)

## AuthService

Git 

[https://git.origemite.com/resume/authserver.git](https://git.origemite.com/resume/authserver.git)

![auth-service-1.png](/img/msa-iam-portfolio/auth-service-1.png)

gradle

![auth-service-2.png](/img/msa-iam-portfolio/auth-service-2.png)

![auth-service-3.png](/img/msa-iam-portfolio/auth-service-3.png)

컨피그설정 및 주입.

![auth-service-4.png](/img/msa-iam-portfolio/auth-service-4.png)

도커파일 추가 및 빌드테스트 

![auth-service-5.png](/img/msa-iam-portfolio/auth-service-5.png)

test

![auth-service-6.png](/img/msa-iam-portfolio/auth-service-6.png)

## AuthService 구조

```
com.origemite.authserver
.
├── advice
│   ├── AdviceHandler.java
│   ├── ErrorResult.java
│   └── excep
│   ├── CustomBadRequestException.java
│   ├── CustomNoSuchFieldException.java
│   ├── CustomNotFoundException.java
│   ├── CustomRuntimeException.java
│   └── TokenException.java
├── AuthserverApplication.java
├── biz
│   ├── controller
│   │   ├── auth
│   │   │   ├── AuthController.java
│   │   │   └── vo
│   │   │   ├── OrigemiteToken.java
│   │   │   ├── ReqSignin.java
│   │   │   ├── ReqSignup.java
│   │   │   └── ResToken.java
│   │   ├── policy
│   │   │   ├── PolicyController.java
│   │   │   ├── PolicyGroupController.java
│   │   │   └── vo
│   │   │   ├── ReqPolicyGroupBulkSave.java
│   │   │   ├── ReqPolicyGroupDelete.java
│   │   │   ├── ReqPolicyGroupSave.java
│   │   │   ├── ReqPolicyGroupSelect.java
│   │   │   ├── ReqPolicySave.java
│   │   │   ├── ResPolicyGroupSelect.java
│   │   │   ├── ResPolicyId.java
│   │   │   └── ResPolicySelect.java
│   │   ├── svc
│   │   │   ├── SvcController.java
│   │   │   └── vo
│   │   │   └── ResSVC.java
│   │   ├── TestController.java
│   │   └── user
│   │   ├── UserController.java
│   │   ├── UserPolicyController.java
│   │   └── vo
│   │   ├── ReqUser.java
│   │   ├── ReqUserPolicyDelete.java
│   │   ├── ReqUserPolicySave.java
│   │   ├── ResUser.java
│   │   └── ResUserPolicySelect.java
│   └── service
│   ├── AuthenticationService.java
│   ├── JwtService.java
│   ├── PolicyGroupService.java
│   ├── PolicyService.java
│   ├── TestService.java
│   ├── UserPolicyService.java
│   └── UserService.java
├── cmm
│   ├── ev
│   │   ├── EnumValidatorImpl.java
│   │   └── EnumValidator.java
│   ├── JwtAuthenticationFilter.java
│   ├── MyFormatter.java
│   └── ServiceCode.java
├── config
│   ├── ConfigDatasource.java
│   ├── ConfigErrorDecoder.java
│   ├── ConfigFeign.java
│   ├── ConfigIntercepter.java
│   ├── ConfigKafka.java
│   ├── ConfigMessage.java
│   ├── ConfigModelMapper.java
│   ├── ConfigPasswordEncoder.java
│   ├── ConfigRedis.java
│   ├── ConfigRestTemplate.java
│   ├── ConfigSecurity.java
│   ├── ConfigSpringDoc.java
│   ├── ConfigSqlQuery.java
│   └── ConfigWeb.java
├── data
│   ├── db
│   │   ├── entity
│   │   │   ├── id
│   │   │   │   ├── TbPolicyGroupId.java
│   │   │   │   └── TbUserPolicyId.java
│   │   │   ├── TbPolicyGroup.java
│   │   │   ├── TbPolicy.java
│   │   │   ├── TbTest.java
│   │   │   ├── TbUser.java
│   │   │   └── TbUserPolicy.java
│   │   └── repo
│   │   ├── dsl
│   │   │   ├── TbUserDslImpl.java
│   │   │   ├── TbUserDsl.java
│   │   │   └── vo
│   │   │   └── UserPolicyDto.java
│   │   ├── TbPolicyGroupRepo.java
│   │   ├── TbPolicyRepo.java
│   │   ├── TbTestRepo.java
│   │   ├── TbUserPolicyRepo.java
│   │   └── TbUserRepo.java
│   └── redis
│   ├── entity
│   │   ├── HdTokenAccess.java
│   │   ├── HdTokenPolicy.java
│   │   └── HdTokenRefresh.java
│   └── repo
│   ├── HdTokenAccessRepo.java
│   ├── HdTokenPolicyRepo.java
│   └── HdTokenRefreshRepo.java
└── mq
 ├── dto
 │   ├── Field.java
 │   ├── KafkaDto.java
 │   └── Schema.java
 ├── KafkaProducer.java
 ├── payload
 │   └── UserPayload.java
 └── TbProducer.java

└── test
 └── java
 └── com
 └── origemite
 └── authserver
 ├── annotation
 │   ├── FilterMvcConfiguration.java
 │   └── FilterMvc.java
 ├── api
 │   └── AuthControllerTest.java
 └── AuthserverApplicationTests.java
```

## signin

로그인을 하면

유저 Policy를 DB에서 조회 하고

권한을 직렬화 하여 하여 Redis 에 저장합니다.

저장된 데이터는 Gateway에서 조회후 권한에 맞게 라우팅 처리합니다.

![signin-1.png](/img/msa-iam-portfolio/signin-1.png)

## Mock Test

필터 통과용 어노테이션 생성.

![mock-test-1.png](/img/msa-iam-portfolio/mock-test-1.png)

필터객체 바꿔치기.

추후에 데이터가 필요하면

넘겨줄 데이터까지 생성하겠습니다.

![mock-test-2.png](/img/msa-iam-portfolio/mock-test-2.png)

필터 시큐리티 통과.

![mock-test-3.png](/img/msa-iam-portfolio/mock-test-3.png)

![mock-test-4.png](/img/msa-iam-portfolio/mock-test-4.png)

## ConfigServer

ConfigServer Git

[https://git.origemite.com/resume/configserver.git](https://git.origemite.com/resume/configserver.git)

Config YML Git

[https://git.origemite.com/JANGWONSEOK/confgyml.git](https://git.origemite.com/JANGWONSEOK/confgyml.git)

gradle

![config-server-1.png](/img/msa-iam-portfolio/config-server-1.png)

EnableConfig

![config-server-2.png](/img/msa-iam-portfolio/config-server-2.png)

![config-server-3.png](/img/msa-iam-portfolio/config-server-3.png)

![config-server-4.png](/img/msa-iam-portfolio/config-server-4.png)

YML Setting

![config-server-5.png](/img/msa-iam-portfolio/config-server-5.png)

Get test

![config-server-6.png](/img/msa-iam-portfolio/config-server-6.png)

docker file 추가

![config-server-7.png](/img/msa-iam-portfolio/config-server-7.png)

docker-compose 추가

![config-server-8.png](/img/msa-iam-portfolio/config-server-8.png)

build test

![config-server-9.png](/img/msa-iam-portfolio/config-server-9.png)

docker logs 확인

![config-server-10.png](/img/msa-iam-portfolio/config-server-10.png)

server test 

![config-server-11.png](/img/msa-iam-portfolio/config-server-11.png)

## EurekaServer

Git 

[https://git.origemite.com/resume/eurekaserver.git](https://git.origemite.com/resume/eurekaserver.git)

gradle

![eureka-server-1.png](/img/msa-iam-portfolio/eureka-server-1.png)

Enable Config

![eureka-server-2.png](/img/msa-iam-portfolio/eureka-server-2.png)

yml

![eureka-server-3.png](/img/msa-iam-portfolio/eureka-server-3.png)

get test

![eureka-server-4.png](/img/msa-iam-portfolio/eureka-server-4.png)

Dockerfile And dockercompose

![eureka-server-5.png](/img/msa-iam-portfolio/eureka-server-5.png)

![eureka-server-6.png](/img/msa-iam-portfolio/eureka-server-6.png)

build test

![eureka-server-7.png](/img/msa-iam-portfolio/eureka-server-7.png)

get Test

![eureka-server-8.png](/img/msa-iam-portfolio/eureka-server-8.png)

## Gateway

[https://github.com/spring-guides/gs-gateway/blob/main/complete/build.gradle](https://github.com/spring-guides/gs-gateway/blob/main/complete/build.gradle)

[https://cloud.spring.io/spring-cloud-netflix/multi/multi__service_discovery_eureka_clients.html](https://cloud.spring.io/spring-cloud-netflix/multi/multi__service_discovery_eureka_clients.html)

유레카 버전이 변해서

yml에서 intllij 서제스트에 속성이표시되지않아

문서를 찾아보았습니다.

![gateway-1.png](/img/msa-iam-portfolio/gateway-1.png)

![gateway-2.png](/img/msa-iam-portfolio/gateway-2.png)

다행이 정상적으로 등록되었습니다.

![gateway-3.png](/img/msa-iam-portfolio/gateway-3.png)

이름넣고 다시캡쳐

Dockerfile And dockercompose

![gateway-4.png](/img/msa-iam-portfolio/gateway-4.png)

네트워크는 호스트를 사용하는것으로 설정하겠습니다.

![gateway-5.png](/img/msa-iam-portfolio/gateway-5.png)

도커 빌드 테스트 

![gateway-6.png](/img/msa-iam-portfolio/gateway-6.png)

![gateway-7.png](/img/msa-iam-portfolio/gateway-7.png)

## Gateway 구조

```
com.origemite.gateway
.
├── conf
│ ├─ ConfigFilter
│ └─ ConfigRedis 
├── data 
│ └─ redis
│ ├─ entity
│ │ ├─ HdTokenAccess
│ │ ├─ HdTokenPolicy
│ │ ├─ HdTokenRefresh
│ └─ repo
│ │ ├─ HdTokenAccessRepo
│ │ ├─ HdTokenPolicyRepo
│ │ ├─ HdTokenRefreshRepo
├── filter 
│ └─ JwtAuthenticationFilter
└── service
 ├─ vo
 │ └─ (...)
 ├─ AuthServerAllowPath
 ├─ AuthService(ServerService...)
 └─ CmmService
```

## Route

Yml 작성이 아닌 자바코드로 라우팅 코드를 작성하였습니다.

![route-1.png](/img/msa-iam-portfolio/route-1.png)

커스텀 필터의 구현을 최소한으로 하고 각 서버들마다 권한설정을 

커스텀할수있게 한곳에서 처리하려합니다.

`GatewayFilterSpec` 정보를 유지하며 마지막리턴때 필터스펙 부분에서 path를 수정해서 반환합니다.

![route-2.png](/img/msa-iam-portfolio/route-2.png)

서버네임을 유지하고 이것을 기준으로하여

서비스별로 분기처리합니다.

ServerHttpRequest에서 Path를 수정하면

변환되서 사용할수있으나

Gateway는 GatewayFillterSpec 을사용하여 로드밸런싱을 처리하는곳에서는

변환이 일어나지 않습니다.

## Server Service

각 서비스들마다 허용할 URL과 규칙이 다를수있어

분리하여 관리합니다.

![server-service-1.png](/img/msa-iam-portfolio/server-service-1.png)

분리를하더라도 

서버별로 허용해야할 path

redis 조회 데이터유무.

user Role을 가져오는 부분은 CmmService로 공통처리 합니다.

Role 1 경우 읽기 Get Method만처리하고

이외 HttpMethod는 FullAccess로 처리하여

Role 2 권한으로 검증합니다.

## CmmService

![cmm-service-1.png](/img/msa-iam-portfolio/cmm-service-1.png)

`isAllow` 는

서버별로 인증없이 허용할 path들을 정리해두고 검증합니다.

![cmm-service-2.png](/img/msa-iam-portfolio/cmm-service-2.png)

`jwtValid`

jwt검증이라고 작성해두었지만

실질적인 파싱은 하지않습니다.

헤더에 토큰이 있는지 검사합니다.

Redis에 토큰이 있는것 자체만으로도 검증이 된다 생각하여 

jwt토큰검증은 하지않았습니다.

`tokenToPolicy`

토큰을 가지고 Redis에서 정보를가져와서

직렬화된 데이터를 역직렬화해서 반환해줍니다.

![cmm-service-3.png](/img/msa-iam-portfolio/cmm-service-3.png)

Exception은 `JwtAuthenticationFilter`에서 **`*UNAUTHORIZED`로 반환합니다.***

![cmm-service-4.png](/img/msa-iam-portfolio/cmm-service-4.png)

검사 및 라우팅 테스트.

![cmm-service-5.png](/img/msa-iam-portfolio/cmm-service-5.png)

## 관련 글

- [권한·메뉴 개선](/docs/postmortems/msa-iam-portfolio/iam-and-menu-improvement)
- [Gateway 권한 라우팅](../../patterns/architecture-patterns/gateway-authorization-routing.md)
- [Config Server](/docs/knowledge/k-config-server)
- [Eureka](/docs/knowledge/k-eureka)
- [서버 설정과 데이터 경로](/docs/postmortems/msa-iam-portfolio/runtime-data-path)
