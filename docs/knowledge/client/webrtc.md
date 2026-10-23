---
format: md
id: k-webrtc
title: "webRTC"
description: "WebRTC PeerConnection과 미디어 서버가 필요한 이유를 설명한 하이퍼커넥트 기술 블로그 메모입니다."
tags:
  - WebRTC
  - Media
status: active
slug: /knowledge/k-webrtc
---
# webRTC

## 개요

WebRTC PeerConnection과 미디어 서버가 필요한 이유를 설명한 하이퍼커넥트 기술 블로그 메모입니다.

> 1:1 PeerConnection과 1:N 중계 구조의 차이만 짧게 남깁니다.
하이퍼커넥트 기술 블로그는 Hakuna Live, Azar Live 등 WebRTC 라이브 서비스의 미디어 서버를 소개합니다.
HTTP처럼 요청마다 끝나는 프로토콜과 달리, WebRTC는 연결이 유지되는 stateful 프로토콜이라 확장 전략이 다릅니다.
두 사용자는 시그널링 서버로 IP, 포트, 코덱 등 세션 정보를 교환한 뒤 PeerConnection으로 미디어를 주고받습니다.
시그널링 자체는 표준 전송이 정해져 있지 않아 WebSocket, STOMP, gRPC 등으로 구현합니다.
일반적인 Offer/Answer 흐름은 다음과 같습니다.
1. Alice가 Offer(세션 정보)를 보냅니다.
2. Bob이 Answer로 응답합니다.
3. PeerConnection이 맺어지면 미디어를 전송합니다.
시청자가 많아지면 호스트가 모든 시청자와 직접 PeerConnection을 맺는 구조는 단말·대역폭 부담이 시청자 수에 비례해 커집니다.
HLS는 지연이 수초에서 수십초라, 저지연 상호작용에는 WebRTC가 필요합니다.
그래서 호스트는 미디어 서버와 연결하고, 시청자도 미디어 서버와 연결한 뒤, 서버가 미디어를 중계하는 구성을 씁니다.

<details>
<summary>참고 자료</summary>

- [글로벌 라이브 스트리밍을 지탱하는 하이퍼커넥트 미디어 서버 인프라를 소개합니다](https://hyperconnect.github.io/2022/12/30/introduction-to-media-server.html) — 하이퍼커넥트의 글로벌 라이브 스트리밍 플랫폼 서비스의 기반이 되는 미디어 서버 인프라를 구조적인 측면에서 소개합니다.
</details>
