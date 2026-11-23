---
title: "프록시 이해하기"
description: "포워드 프록시, 리버스 프록시, 로드밸런서, API Gateway, L4와 L7 차이를 요청 흐름으로 정리한 입구입니다."
slug: "/knowledge/networking/proxy/basics"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "포워드 프록시"
  - "리버스 프록시"
  - "로드밸런서"
  - "API Gateway"
  - "L4"
  - "L7"
  - "Nginx"
---

# 프록시 이해하기

| 글 | 다루는 내용 |
|---|---|
| [프록시란? 포워드 프록시와 리버스 프록시](./forward-and-reverse-proxy.md) | 브라우저에서 서비스에 접속할 때 요청이 곧바로 앱 서버에 도착한다고 생각하기 쉽습니다. |
| [프록시, 로드밸런서, API Gateway의 역할](./proxy-load-balancer-api-gateway.md) | Nginx와 Spring Cloud Gateway를 함께 배치하면 둘 다 요청을 전달합니다. |
| [L4와 L7 프록시의 차이](./layer4-and-layer7.md) | 프록시 설정을 볼 때 `http`와 `stream`이 등장합니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### 포워드 프록시와 리버스 프록시는 무엇이 다른가요?

포워드 프록시는 클라이언트를 대신해 밖으로 나가고, 리버스 프록시는 서버 앞에서 들어온 요청을 내부로 넘깁니다. Nginx는 보통 리버스 프록시로 둡니다.

### 로드밸런서와 API Gateway는 같은가요?

둘 다 요청을 넘기지만 책임이 다릅니다. 로드밸런서는 트래픽 분산에 가깝고, API Gateway는 인증, 라우팅, 정책까지 포함하는 경우가 많습니다.

