---
id: amazon-s3-api-reference
title: Amazon S3 API Reference 안내
description: S3 API Reference Welcome이 다루는 REST API 범위와 관련 API 안내
tags:
  - AWS
  - S3
status: active
slug: /knowledge/amazon-s3-api-reference
---
# Amazon S3 API Reference 안내

## 개요

S3 API Reference Welcome이 다루는 REST API 범위와 관련 API 안내입니다.

이 글은 Welcome이 설명하는 REST API 범위에 머뭅니다.
스토리지 클래스 선택, 콘솔 조작, 버킷 설계 같은 종합 가이드는 다루지 않습니다.
Amazon S3 API Reference는 S3의 애플리케이션 프로그래밍 인터페이스를 설명합니다.
HTTP를 지원하는 도구로 REST API를 호출할 수 있고, 익명 읽기가 허용된 객체는 브라우저로도 가져올 수 있습니다.
REST API는 표준 HTTP 헤더와 상태 코드를 사용합니다.
접근 제어처럼 HTTP에 기능을 더한 경우에도 기존 HTTP 사용 방식에 맞춰 두었다고 안내합니다.
문서에 적힌 현재 API 버전은 `2006-03-01`입니다.
인증, 요청 서명, 코드 예제, 오류 처리는 API Reference가 아니라 Amazon S3 Developer Guide를 보라고 안내합니다.
SOAP over HTTP는 deprecated이며 HTTPS에서는 아직 가능할 수 있으나, 새 기능은 SOAP에 추가되지 않습니다.
REST API 또는 AWS SDK 사용을 권장합니다.
Welcome 페이지는 S3 본 API 외에 다음 영역을 함께 안내합니다.
문서 구조는 시점에 따라 달라질 수 있으므로, 상세는 각 링크의 최신 페이지를 확인합니다.

| 영역 | Welcome에서의 역할 |
|------|-------------------|
| Amazon S3 (본 API) | 객체 스토리지 REST API |
| Amazon S3 Control | 컨트롤 플레인 작업 |
| Amazon S3 Files | 버킷을 파일 시스템처럼 접근하는 인터페이스 안내 |
| Amazon S3 on Outposts | Outposts의 S3 작업 |
| Amazon S3 Tables | Apache Iceberg 형식 테이블 버킷 관련 API |
| Amazon S3 Vectors | 벡터 버킷·인덱스·유사도 검색용 API |

<details>
<summary>참고 자료</summary>

- [Amazon S3 API Reference — Welcome](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html) — Welcome to the Amazon S3 API Reference . This guide explains the Amazon Simple Storage Service (Amazon S3) application programming interface (API).
</details>
