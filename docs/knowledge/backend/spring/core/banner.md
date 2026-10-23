---
format: md
id: k-banner
title: "Banner"
description: "Spring Resource로 배너·프로퍼티 파일을 읽어 기동 시 출력하는 메모입니다."
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-banner
---
# Banner

## 개요

기동 시 텍스트 배너나 할인 안내처럼 클래스패스·파일·URL에 있는 내용을 읽어 출력할 때 `Resource`를 씁니다.
`ClassPathResource`, `FileSystemResource`, `UrlResource`로 위치를 바꾸고, `@PostConstruct`에서 한 번 출력하는 패턴이 흔합니다.

## 배너 로더

```java
public class BannerLoader {

    private Resource banner;

    public void setBanner(Resource banner) {
        this.banner = banner;
    }

    @PostConstruct
    public void showBanner() throws IOException {
        Files.lines(Paths.get(banner.getURI()), StandardCharsets.UTF_8)
                .forEachOrdered(System.out::println);
    }
}
```

## Resource 종류

```java
// 클래스패스 프로퍼티
Resource classpath = new ClassPathResource("discounts.properties");
Properties props = PropertiesLoaderUtils.loadProperties(classpath);

// 로컬 파일
Resource file = new FileSystemResource("c:/shop/banner.txt");

// HTTP(S) URL
Resource url = new UrlResource("https://example.com/banner.txt");
```

Boot의 `banner.txt` / `spring.banner.location`과도 같은 “기동 시 리소스 출력” 계열입니다.
외부 URL을 쓰면 기동 지연·실패에 대비해 timeout과 fallback을 둡니다.

<details>
<summary>참고 자료</summary>

- [Spring Framework Resource](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/io/Resource.html)
</details>
