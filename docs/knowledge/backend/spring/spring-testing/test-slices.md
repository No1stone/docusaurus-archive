---
format: "md"
id: "spring-spring-testing-test-slices"
title: "테스트 슬라이스"
description: "WebMvcTest와 DataJpaTest의 선택 범위, MockitoBean과 필터 및 자동 롤백의 한계를 설명합니다."
slug: "/knowledge/backend/spring/spring-testing/test-slices"
sidebar_position: 3
status: "active"
tags:
  - "Spring"
keywords:
  - "테스트 슬라이스"
  - "Spring"
  - "Spring Test"
  - "@SpringBootTest"
  - "Testcontainers"
  - "@WebMvcTest"
  - "단위 테스트"
---
# 테스트 슬라이스

슬라이스 테스트는 특정 기술 경계만 좁게 로딩하는 테스트입니다.
Controller의 바인딩을 보려고 배치와 외부 클라이언트를 모두 띄울 필요는 없습니다.
반대로 좁힌 구성에서 통과했다고 전체 앱의 연결까지 검증한 것은 아닙니다.
이 글은 Boot 3.5와 Framework 6.2의 테스트 API를 사용합니다.

## 웹 계약을 좁혀 확인합니다

```java
@WebMvcTest(NoticeController.class)
class NoticeControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean NoticeService service;

    @Test
    void rejectsBlankTitle() throws Exception {
        mvc.perform(post("/api/notices")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\" \"}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(service);
    }
}
```

[Controller 예제](../spring-web/controller-and-mapping.md)를 대상으로 한 부분 코드입니다.
`@MockitoBean`은 `org.springframework.test.context.bean.override.mockito.MockitoBean`입니다.
이 테스트는 보안 의존성이 없는 기본 구성을 가정합니다.
Security가 적용되면 인증과 CSRF 조건을 갖춰야 검증 단계에 도달할 수 있습니다.
401이나 403을 DTO 검증 실패로 오해하지 않습니다.

| 슬라이스 | 주로 로딩하는 것 | 빠질 수 있는 것 |
|---|---|---|
| WebMvcTest | MVC 인프라와 웹 컴포넌트 | 일반 Service와 Repository |
| DataJpaTest | 엔티티와 JPA Repository | 일반 업무 서비스와 실제 운영 DB |
| JdbcTest | DataSource와 JDBC 지원 | 전체 애플리케이션 구성 |
| JsonTest | JSON 매퍼 | HTTP 매핑과 보안 필터 |

Boot의 기존 MockBean과 Framework의 MockitoBean은 버전에 따른 지원과 전환 방향을 확인합니다.
Boot 4의 패키지 이동 예제를 3.5에 그대로 복사하지 않습니다.

## JPA 슬라이스의 기본값을 확인합니다

DataJpaTest는 보통 테스트 트랜잭션을 사용하고 종료 후 롤백합니다.
임베디드 DB 교체 여부는 버전과 테스트 DataSource 구성에 따라 달라질 수 있으므로 실제 사용 DB를 확인합니다.
운영 계열 DB를 유지해야 하면 `@AutoConfigureTestDatabase(replace = NONE)` 등으로 의도를 드러냅니다.

엔티티를 저장한 뒤 같은 컨텍스트에서 다시 읽으면 DB가 아니라 관리 객체를 확인할 수 있습니다.
매핑과 제약을 확인하려면 flush와 clear를 적절히 사용합니다.
커밋 시점 오류는 자동 롤백 테스트만으로 발견하지 못할 수 있습니다.

슬라이스에 `@Import`를 계속 추가해 전체 앱과 비슷해지면 목적을 다시 봅니다.
정말 여러 경계의 조립을 확인하려는 테스트라면 SpringBootTest가 더 명확할 수 있습니다.

검증 결과에는 Controller 이후의 업무 구현이 mock인지, SQL이 실제 실행됐는지를 명시합니다.
웹 슬라이스로는 외부 통신 성공을 주장하지 않습니다.

종류별 범위는 [Boot 테스트 문서](https://docs.spring.io/spring-boot/3.5/reference/testing/spring-boot-applications.html), 빈 대체는 [MockitoBean 문서](https://docs.spring.io/spring-framework/reference/6.2/testing/annotations/integration-spring/annotation-mockitobean.html)를 참고합니다.

## 자주 묻는 질문

### 슬라이스 테스트는 언제 쓰나요?

웹이나 JPA 등 계층만 빠르게 검증할 때 씁니다. 전체 맥락이 필요하면 @SpringBootTest로 올립니다.

### Testcontainers는 무엇에 쓰나요?

실제 DB나 브로커에 가까운 통합 검증에 사용합니다.

