---
title: "요청과 경로 전달"
description: "listen, server_name, location, proxy_pass, rewrite, 헤더와 SPA 정적 파일 전달을 다루는 입구입니다."
slug: "/knowledge/networking/proxy/routing"
sidebar_position: 0
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "location"
  - "proxy_pass"
  - "rewrite"
  - "X-Forwarded-For"
  - "SPA"
  - "Nginx 라우팅"
---

# 요청과 경로 전달

| 글 | 다루는 내용 |
|---|---|
| [listen, server_name, location](./listen-server-name-location.md) | 한 Nginx에서 여러 사이트를 제공하려면 포트, 호스트와 경로가 어떤 순서로 사용되는지 이해해야 합니다. |
| [location 매칭 우선순위](./location-matching.md) | location은 요청 경로를 분류합니다. |
| [proxy_pass와 마지막 슬래시](./proxy-pass-uri.md) | 리버스 프록시를 붙인 뒤 앱에서 404가 나면 전달 경로부터 확인합니다. |
| [rewrite, return과 리다이렉트](./rewrite-and-redirect.md) | 외부 주소를 바꾸는 리다이렉트와 내부 전달 경로를 바꾸는 rewrite는 요청 흐름이 다릅니다. |
| [root, alias, try_files와 SPA 배포](./static-files-and-spa.md) | React나 Vue 빌드 결과를 제공할 때는 요청 경로와 디스크 경로의 관계가 중요합니다. |
| [Host, Forwarded 헤더와 실제 클라이언트 IP](./forwarded-headers-real-ip.md) | 리버스 프록시 뒤의 앱이 보는 연결 상대는 프록시입니다. |

설정 예제는 [Compose 실습](../getting-started/docker-compose-lab.md)을 바탕으로 하며, TLS와 Stream 예제는 각 글의 준비 조건을 함께 확인합니다.

## 자주 묻는 질문

### proxy_pass 끝에 슬래시가 왜 중요한가요?

URI를 붙이면 location 접두사가 바뀌어 upstream 경로가 달라집니다. trailing slash 유무를 먼저 확인합니다.

### rewrite와 return 중 무엇을 쓰나요?

단순 리다이렉트는 return이 읽기 쉽고, 경로만 바꿔 프록시할 때는 rewrite를 쓰는 경우가 많습니다.

