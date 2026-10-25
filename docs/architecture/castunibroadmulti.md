---
format: md
id: arch-castunibroadmulti
title: "cast(uni,broad,multi)"
description: "유니캐스트, 브로드캐스트, 멀티캐스트 메시지 전달 방식과 AWS fanout 참고입니다."
tags:
  - AWS
  - HTTP
  - Spring
status: active
---
# cast(uni,broad,multi)

## 개요

메시지 전달 범위를 유니, 브로드, 멀티로 구분해 둔 메모입니다.
브로드캐스트는 AWS SNS fanout 아키텍처와 연결해 두었습니다.

## 구분

유니: 내 주소와 목적지 주소가 맞는 것입니다.
simple notification에 해당합니다.

브로드: 전체 시스템 중 맞는 것입니다.
AWS fanout 아키텍처를 참고합니다.

[https://aws.amazon.com/ko/blogs/compute/messaging-fanout-pattern-for-serverless-architectures-using-amazon-sns/](https://aws.amazon.com/ko/blogs/compute/messaging-fanout-pattern-for-serverless-architectures-using-amazon-sns/)

메시징 Fan-out 개념과 네트워크 broadcast 구분은 [Fan-out 패턴](/docs/patterns/architecture-patterns/fan-out)을 봅니다.
SNS 구성은 학습 예제로 둡니다.

멀티: 토픽에 일치하는 것입니다.
