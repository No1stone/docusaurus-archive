---
format: md
id: k-aws-s3-구조
title: "Aws S3 구조"
description: "Aws S3 구조"
tags:
  - AWS
  - Git
  - HTTP
  - Java
status: active
slug: /knowledge/k-aws-s3-구조
---
# Aws S3 구조

## 개요

Aws S3 구조입니다.

boot server 에서 s3 접속정보만 생성해서 front로 전달해주는 예제
브라우저 기반 파일업로드 기능
aws s3 multipart upload 사용
javascript api reference
백엔드서버에서 주소값을 저장하고
프론트페이지에서 S3 서버에 접근한다.
opensource
aws cors origin
javascript exame
===========아래 url 의 source code는
부트에서 s3로 전달하는 코드임
간단한 구조의 API server

## CORS

부트베이스 api-auth의 MVC CORS 예입니다. 운영에서는 허용 Origin을 환경별로 좁힙니다.

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("*")
            .allowedHeaders("*");
}
```

![aws-s3-구조-1.png](/img/aws-s3-구조/aws-s3-구조-1.png)

<details>
<summary>참고 자료</summary>

- [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/API/Type_API_Reference.html)
- [Amazon S3 버킷 생성, 나열, 삭제 - AWS SDK for Java 1.x](https://docs.aws.amazon.com/ko_kr/sdk-for-java/v1/developer-guide/examples-s3-buckets.html) — AWS SDK for Java를 사용하여 버킷을 생성, 나열 또는 삭제하는 방법.
- [aws-doc-sdk-examples/java/example_code/s3/src/main/java/aws/example/s3 at main · awsdocs/aws-doc-sdk-examples · GitHub](https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/java/example_code/s3/src/main/java/aws/example/s3) — Welcome to the AWS Code Examples Repository. This repo contains code examples used in the AWS documentation, AWS SDK Developer Guides, and more. For more information, see the Read
</details>
