---
format: md
id: k-vpc-creation-order
title: VPC 생성 순서
description: 일괄 생성 UI 이전에 수동으로 VPC를 구성하던 때의 순서 메모
tags:
  - AWS
  - VPC
status: active
draft: true
slug: /knowledge/k-vpc-creation-order
---
# VPC 생성 순서

> **개요:** AWS 콘솔의 일괄 생성 UI가 자리 잡기 전에, 리소스를 하나씩 만들던 때의 순서 기록입니다.
> 작성자 확인으로 게시는 보류합니다. 원본과 이 작성본은 보존합니다.

## 원본 메모

```text
vpc → subnet → internet gateway → route table
```

당시에는 VPC, 서브넷, 인터넷 게이트웨이, 라우트 테이블을 이 순서로 수동 구성했습니다.
현재 콘솔의 VPC 마법사나 CloudFormation 같은 일괄 생성 흐름과는 다를 수 있습니다.

## 게시 상태

게시 보류(작성자 재검토 대기).
프로덕션 빌드에는 포함하지 않습니다.
