---
format: md
id: k-sending-emails-programmatically
title: "Sending Emails Programmatically"
description: "AWS SES와 Java SDK로 프로그램에서 메일을 보내는 메모입니다."
tags:
  - AWS
  - HTTP
status: active
slug: /knowledge/k-sending-emails-programmatically
---
# Sending Emails Programmatically

## 개요

프로그램에서 메일을 보낼 때 AWS SES와 AWS SDK for Java를 쓰는 경로를 모아 둔 글입니다.
샌드박스에서는 검증된 주소만 보낼 수 있고, 프로덕션 이동·도메인 검증·반송 처리가 필요합니다.
용어·콘솔 메모는 [AWS SES 용어](../../infrastructure/aws/aws-ses-info-용어.md)를 함께 봅니다.

## 구현 시 순서

1. SES에서 도메인 또는 이메일 주소를 검증합니다.
2. SDK v2로 클라이언트를 만들고 `SendEmail` / `SendRawEmail`을 호출합니다.
3. IAM 권한에 `ses:SendEmail` 등을 부여합니다.
4. 반송·불만 알림은 SNS 등으로 받아 재시도를 막습니다.

부트베이스·팜프로에는 SES 발송 전용 모듈이 없어, 공식 예제 코드를 출발점으로 둡니다.

<details>
<summary>참고 자료</summary>

- [AWS SDK for Java v2](https://github.com/aws/aws-sdk-java-v2/#using-the-sdk)
- [AWS SDK for Java — examples](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples.html)
- [SES SendEmail 예제 (aws-doc-sdk-examples)](https://github.com/awsdocs/aws-doc-sdk-examples/blob/master/javav2/example_code/ses/src/main/java/com/example/ses/SendMessageEmailRequest.java)
</details>
