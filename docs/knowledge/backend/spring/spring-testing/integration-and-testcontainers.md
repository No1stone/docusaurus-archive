---
format: "md"
id: "spring-spring-testing-integration-and-testcontainers"
title: "통합 테스트와 Testcontainers"
description: "실제 포트와 DB를 사용하는 통합 테스트 및 Testcontainers의 서비스 연결, 데이터 정리와 시나리오 경계를 설명합니다."
slug: "/knowledge/backend/spring/spring-testing/integration-and-testcontainers"
sidebar_position: 4
status: "active"
tags:
  - "Spring"
keywords:
  - "통합 테스트와 Testcontainers"
  - "Spring"
  - "Spring Test"
  - "@SpringBootTest"
  - "Testcontainers"
  - "@WebMvcTest"
  - "단위 테스트"
---
# 통합 테스트와 Testcontainers

통합 테스트는 실제 구성 요소 사이의 연결을 확인합니다.
외부 API를 더미로 대체하고 실제 DB를 사용하는 테스트와, 현장 시스템까지 연결한 테스트는 검증 범위가 다릅니다.
무엇을 실제로 연결했는지 먼저 적습니다.

## 운영 계열 DB를 일회성으로 띄웁니다

아래는 Boot 3.5와 Testcontainers 1.x의 MySQL API를 사용하는 부분 예제입니다.
테스트 의존성에는 Boot Testcontainers 지원, JUnit 통합, MySQL 모듈과 드라이버가 필요합니다.

```java
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CatalogApiIntegrationTest {
    @Container
    @ServiceConnection
    static MySQLContainer<?> database = new MySQLContainer<>("mysql:8.4");

    @Autowired TestRestTemplate http;

    @Test
    void respondsToHealthRequest() {
        ResponseEntity<String> response = http.getForEntity("/health", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
```

애플리케이션이 공개 `/health` 경로를 제공한다고 가정한 연결 예제입니다.
Actuator의 기본 경로가 `/health`라는 뜻은 아닙니다.
실제 업무 테스트에서는 생성 요청, ID 반환과 후속 조회까지 검증합니다.
예제의 메이저 이미지 태그는 설명용이며 CI 재현성이 필요하면 검증된 세부 버전과 digest를 고정합니다.

## ServiceConnection과 동적 속성

ServiceConnection은 지원 컨테이너에서 연결 정보를 만들어 Boot에 제공합니다.
모든 사용자 정의 서비스와 설정 키가 자동 연결되는 것은 아닙니다.
지원되지 않는 더미 API 주소 등은 DynamicPropertySource로 매핑된 포트를 전달할 수 있습니다.
호스트 포트를 고정하면 병렬 실행과 개발자 환경에서 충돌할 수 있습니다.

| 테스트 경계 | 실제로 확인하는 것 |
|---|---|
| 실제 DB와 Repository | SQL, 타입, 제약과 트랜잭션 |
| 실제 HTTP 서버와 DB | 바인딩부터 저장과 응답까지 |
| 더미 외부 API 포함 | 외부 요청 계약과 오류 변환 |
| 여러 요청의 시나리오 | 등록 후 조회, 중복 요청과 복구 흐름 |
| 실제 상대 시스템 | 인증, 네트워크와 현장 설정 |

## 데이터 정리와 커밋

RANDOM_PORT의 서버 요청은 테스트 메서드와 다른 스레드에서 실행됩니다.
테스트 메서드에 붙인 트랜잭션 롤백이 서버가 커밋한 데이터를 자동으로 지우지는 않습니다.
테스트별 식별자, 명시적 정리와 격리된 DB 범위 등을 사용합니다.
비동기 후속 작업은 완료 기준과 제한 시간을 두고 기다립니다.

Testcontainers가 DB를 띄웠어도 마이그레이션과 초기 데이터는 별도입니다.
운영에서 사용하는 스키마 변경 경로를 테스트에도 적용하면 수동 테스트 스키마와의 차이를 줄일 수 있습니다.
DB 제품과 버전을 맞췄다고 운영의 전체 데이터량과 네트워크까지 재현한 것은 아닙니다.

성공 API 한 건 외에도 중복, 잘못된 입력, 외부 지연과 부분 실패 후 재시도를 포함합니다.
부하 테스트는 별도 목표와 안전한 환경에서 수행하며 기능 통합 테스트와 분리합니다.

서비스 연결은 [Boot Testcontainers](https://docs.spring.io/spring-boot/3.5/reference/testing/testcontainers.html), 컨테이너 수명은 [Testcontainers JUnit 5](https://java.testcontainers.org/test_framework_integration/junit_5/)를 참고합니다.

## 자주 묻는 질문

### 슬라이스 테스트는 언제 쓰나요?

웹이나 JPA 등 계층만 빠르게 검증할 때 씁니다. 전체 맥락이 필요하면 @SpringBootTest로 올립니다.

### Testcontainers는 무엇에 쓰나요?

실제 DB나 브로커에 가까운 통합 검증에 사용합니다.

