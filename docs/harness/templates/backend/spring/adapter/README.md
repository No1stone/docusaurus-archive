# JPA Adapter template

> **개요:** Port를 구현하는 JPA 기술 접근 계층입니다.
> Repository와 Spec을 쓰는 유일한 층입니다.
> 과거 `service/` 템플릿과 같은 메서드 계약입니다.
> **코드 수준 CQRS의 적용점은 이 Adapter입니다.**
> 캐시, 암호화 등도 같은 **Port → Adapter → Provider** 규칙을 씁니다.

메서드 목록은 고정입니다.
`findByIds`와 `deleteByIds`는 `Filter.ids`와 `Specs.of` 입니다.
`ids`가 비어 있으면 조회하지 않습니다.

## Port → Adapter → Provider

공통 규칙입니다.
Provider만 바꾸면 Port와 Facade는 그대로입니다.

```text
Port (능력)     →  Adapter (Port 구현)  →  Provider (제품·기술)
CachePort       →  CacheAdapter         →  RedisProvider
EncryptionPort  →  EncryptionAdapter    →  VaultProvider
TokenPort       →  TokenAdapter         →  KeycloakProvider / 자체 JwtProvider
OAuthPort       →  OAuthAdapter         →  KeycloakProvider / 기타 IdP Provider
MessagingPort   →  MessagingAdapter     →  Kafka / RabbitMQ / Redis PubSub / STOMP / WebSocket Provider
ExampleItemPort →  JpaExampleItemAdapter →  Read/Command Provider → Repository
```

| 이름 | 역할 |
|---|---|
| Port | 업무가 필요한 능력. Redis, Vault, Keycloak, Kafka 같은 제품명을 붙이지 않는다 |
| Adapter | Port를 구현하고 Provider를 고른다. 기술 응답을 Port 계약으로 변환한다 |
| Provider | Redis, Vault, KMS, Keycloak, 자체 JWT, Kafka, RabbitMQ, STOMP, WebSocket, JPA Repository 등 실제 접근 |

암호화 Port 예는 `EncryptionPort`입니다.
토큰, OAuth Port 예는 `TokenPort`, `OAuthPort`입니다.
메시징 Port 예는 `MessagingPort`입니다.
`VaultPort`, `KeycloakPort`, `KafkaPort`로 두지 않습니다.
Vault, Keycloak, Kafka, RabbitMQ, Redis, STOMP, WebSocket은 Provider입니다.

원셋 Java에는 Cache, Encryption Provider 클래스를 넣지 않습니다.
필요할 때 이 규칙을 따라 추가합니다.

## CQRS 적용점 (Provider로 Repository 분리)

원셋은 아직 Repository 하나를 Adapter가 직접 주입합니다.
조회와 변경을 나눌 때는 Facade가 아니라 **이 Adapter 아래**에서 Provider로 Repository를 나눕니다.

```text
ExampleItemPort
        ↓
JpaExampleItemAdapter          ← CQRS 적용점 (여기서 Provider를 고른다)
   ├─ ExampleItemReadProvider  ← 리드 데이터소스 / 조회용 Repository
   └─ ExampleItemCommandProvider ← CRUD 전체 Repository
        (JPA 수정은 조회가 필요하므로 Command Provider가 조회 포함 CRUD를 받는다)
        ↓
   Repository (지금은 하나, 나중엔 읽기, 쓰기 저장소로 확장 가능)
```

| 구성 | 역할 |
|---|---|
| Read Provider | 조회 전용 경로. 리드 데이터소스에 붙일 수 있다 |
| Command Provider | 저장, 수정, 삭제. JPA 특성상 수정 전 조회가 필요하면 조회도 포함한다 |
| JPA Adapter | Port를 구현하고, 어떤 Provider를 쓸지 고른다. 업무 조합은 하지 않는다 |

처음부터 Provider를 두지 않아도 됩니다.
원셋은 단일 Repository로 두고, 필요가 보일 때 Adapter 안에서 분리합니다.
물리 읽기 DB 분리는 그다음 단계입니다.
자세한 내용은 [CQRS](/docs/patterns/architecture-patterns/cqrs)를 봅니다.

## Files

- [`JpaExampleItemAdapter.java`](./JpaExampleItemAdapter.java)
