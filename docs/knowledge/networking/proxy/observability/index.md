---
title: "로그와 장애 분석"
description: "access와 error 로그, log_format, 요청 ID, 타이밍, 499, 502, 504, 로그 로테이션을 다루는 입구입니다."
slug: "/knowledge/networking/proxy/observability"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "access.log"
  - "error.log"
  - "request id"
  - "502"
  - "504"
  - "Nginx 로그"
---

# 로그와 장애 분석

| 글 | 다루는 내용 |
|---|---|
| [access.log와 error.log](./access-and-error-log.md) | 사용자가 오류를 신고했을 때 먼저 요청이 Nginx까지 왔는지 확인합니다. |
| [log_format으로 접근 로그 구성하기](./log-format.md) | 기본 접근 로그는 요청과 상태를 보는 데 편하지만 업스트림과 시간 분석을 더하려면 필드를 정해야 합니다. |
| [요청 ID로 Nginx와 앱 로그 연결하기](./request-id.md) | Nginx와 앱 로그를 시각만으로 연결하면 동시 요청이 많을수록 찾기 어렵습니다. |
| [요청 시간과 업스트림 응답 시간 분석](./timing.md) | 사용자가 느리다고 느끼는 시간과 앱 처리 시간은 서로 다른 구간을 포함합니다. |
| [499, 502, 503, 504 원인 찾기](./status-codes.md) | 프록시 오류를 분석할 때 HTTP 상태만으로 원인을 확정하기 어렵습니다. |
| [로그 로테이션과 컨테이너 로그 수집](./log-rotation.md) | 로그를 파일로 쌓으면 보관과 교체가 필요합니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### 502와 504를 먼저 어디서 보나요?

error.log와 upstream 시간 필드로 Nginx와 백엔드 중 어디서 끊겼는지 나눕니다.

### 요청 ID는 왜 넣나요?

Nginx와 앱 로그를 같은 ID로 묶어 한 요청의 경로를 따라가기 쉽게 합니다.

