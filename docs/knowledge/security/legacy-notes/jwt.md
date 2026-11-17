---
format: md
id: k-jwt
title: "JWT"
description: "JWT 발급·검증과 게이트웨이에서 Bearer 토큰을 확인하는 메모입니다."
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-jwt
---
# JWT

## 개요

JWT는 헤더, 클레임(payload), 서명으로 이뤄진 토큰입니다.
Access 토큰은 짧게 두고, 재발급용 Refresh는 더 길게 두는 구성이 흔합니다.
서명 검증만으로는 폐기(로그아웃)를 표현하기 어려워, Access를 Redis 같은 저장소에 두고 존재 여부를 함께 보는 경우도 있습니다.

## 게이트웨이에서 Bearer 확인

API Gateway 앞단에서는 `Authorization: Bearer ...`를 읽고, 허용 경로는 건너뛴 뒤 나머지만 검증합니다.
검증이 실패하면 401로 응답을 끝냅니다.

```java
public boolean isJwtValid(ServerHttpRequest request) throws AuthenticationException {
    String path = request.getPath().toString();
    boolean allow = ALLOWED_PATHS.stream()
            .anyMatch(p -> path.matches(p.replace("**", ".*")));
    if (allow) {
        return true;
    }

    String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return false;
    }
    String token = authHeader.substring(7).trim();
    return jwtTokenAuthenticationProvider.verifyAccessToken(token);
}
```

Access 확인은 “캐시에 있으면 통과, 없으면 서명 검증”처럼 단계를 나눌 수 있습니다.

```java
public boolean verifyAccessToken(String token) {
    Boolean exists = redisTemplate.hasKey("access:" + token);
    if (exists != null && exists) {
        return true;
    }
    // Redis에 없을 때 RSA/HMAC 서명 검증을 이어서 수행
    parse(token);
    return true;
}

public Claims parse(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody();
}
```

키 회전이 있으면 헤더의 `kid`로 JWK를 고르는 `SigningKeyResolver`를 씁니다.
jjwt 0.11대는 `parserBuilder()`와 `Keys.hmacShaKeyFor`를 쓰고, 예전 0.9대 API(`parser().setSigningKey(...)`)와 호출 모양이 다릅니다.

## 간단한 발급·조회 예

로컬에서 HS256으로 subject와 만료만 다루는 최소 예입니다.
비밀키와 만료 시간은 설정으로 빼고, 소스에 하드코딩하지 않는 편이 좋습니다.

```java
@Service
public class JwtService {

    private final Key signKey;

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.signKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(String subject, long expMillis) {
        if (expMillis <= 0) {
            throw new IllegalArgumentException("expiration must be positive");
        }
        return Jwts.builder()
                .setSubject(subject)
                .signWith(signKey, SignatureAlgorithm.HS256)
                .setExpiration(new Date(System.currentTimeMillis() + expMillis))
                .compact();
    }

    public String getSubject(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
```

의존성 예(Gradle):

```gradle
implementation 'io.jsonwebtoken:jjwt-api:0.11.2'
runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.2'
runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.2'
```

Java 11 이상에서 XML DatatypeConverter가 필요하면 JAXB를 별도로 넣었던 과거 예도 있으나, `Keys.hmacShaKeyFor`를 쓰면 그 경로는 없어도 됩니다.

## Access / Refresh 흐름(개념)

1. 로그인 시 Access와 Refresh를 발급합니다.
2. Access가 짧아 만료되면 Refresh가 유효할 때 Access만 다시 발급합니다.
3. 둘 다 만료되면 다시 로그인합니다.
4. Refresh를 Redis에 두고, 로그아웃 시 키를 지우면 재발급을 막을 수 있습니다.

쿠키에 토큰을 실을지는 프론트·CSRF·도메인 정책에 따라 정합니다.
게이트웨이 검증과 발급 API의 책임은 나누어 두는 편이 추적하기 쉽습니다.

<details>
<summary>참고 자료</summary>

- [Token Life Cycle And Cookie](https://jydlove.tistory.com/61) — Access/Refresh 생명주기와 쿠키·Redis 조합 설명
- [jjwt library 사용방법](https://bamdule.tistory.com/123) — jjwt로 토큰 생성·검증(구버전 API 예 포함)
</details>
