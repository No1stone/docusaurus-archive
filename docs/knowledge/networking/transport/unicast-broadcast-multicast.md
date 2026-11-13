---
id: unicast-broadcast-multicast
title: "유니캐스트, 브로드캐스트, 멀티캐스트"
description: "한 수신자, 전체, 그룹으로 나뉘는 전달 범위를 예로 구분합니다. 메시징 Fan-out과는 계층이 다릅니다."
keywords:
  - 유니캐스트
  - 브로드캐스트
  - 멀티캐스트
  - IP 전달 범위
  - Fan-out
  - networking
tags:
  - networking
  - transport
status: active
sidebar_position: 8
slug: "/knowledge/networking/transport/unicast-broadcast-multicast"
---

# 유니캐스트, 브로드캐스트, 멀티캐스트

메시지를 보낼 때 **누가 받는지**에 따라 전달 범위를 나눕니다.<br />
여기에서는 IP·로컬 네트워크에서 흔히 말하는 유니캐스트, 브로드캐스트, 멀티캐스트를 예로 구분합니다.

애플리케이션이 브로커에 한 번 발행하고 여러 구독자가 받는 **메시징 Fan-out**은 네트워크 broadcast와 같은 계층이 아닙니다.<br />
SNS 등으로 구독자에게 복제하는 예는 [Fan-out](/docs/patterns/architecture-patterns/fan-out)을 봅니다.

## 유니캐스트

한 송신자가 **한 수신자**에게 보냅니다.<br />
목적지 주소가 그 수신자와 맞을 때 전달됩니다.

예: 브라우저가 `https://api.example.com/orders/42`로 GET을 보내면, 그 요청은 해당 서버(또는 로드밸런서 뒤의 한 연결 대상)로 갑니다.<br />
다른 호스트는 그 TCP 연결의 수신자가 아닙니다.

## 브로드캐스트

한 송신자가 **같은 브로드캐스트 도메인에 있는 전체**를 향해 보냅니다.<br />
수신 측은 자기에게 해당하는 프레임만 골라 처리합니다.

예: 로컬 LAN에서 ARP 요청은 같은 세그먼트의 호스트들이 들을 수 있는 범위로 나갑니다.<br />
인터넷 전체로 “모두에게” 보내는 방식과는 다릅니다.

애플리케이션에서 “모든 구독 서비스에 알린다”는 요구는 보통 네트워크 broadcast가 아니라 메시징 Fan-out으로 구현합니다.<br />
AWS SNS 학습 예시는 [Fan-out](/docs/patterns/architecture-patterns/fan-out)의 SNS 절을 봅니다.

## 멀티캐스트

한 송신자가 **특정 그룹에 가입한 수신자**에게 보냅니다.<br />
그룹에 속하지 않은 노드는 그 트래픽을 받지 않습니다(또는 중계하지 않습니다).

예: 같은 멀티캐스트 그룹에 가입한 여러 호스트가 실시간 미디어 스트림을 받습니다.<br />
유니캐스트처럼 수신자마다 연결을 하나씩 두지 않고, 그룹 주소로 한 흐름을 나눕니다.

토픽 이름에 맞춰 구독하는 메시징도 “관심 있는 소비자만”이라는 점에서는 비슷하게 느껴질 수 있습니다.<br />
다만 구현은 브로커 구독 모델이며, IP 멀티캐스트와 동일하지 않습니다.

## 한눈에

| 방식 | 수신자 | 짧은 예 |
|---|---|---|
| 유니캐스트 | 한 대상 | HTTP 요청 한 건 |
| 브로드캐스트 | 같은 도메인의 전체 | LAN ARP 요청 |
| 멀티캐스트 | 그룹에 가입한 대상 | 그룹 주소 미디어 스트림 |

관련: [Transport](/docs/knowledge/networking/transport), [Fan-out](/docs/patterns/architecture-patterns/fan-out), [TCP](/docs/knowledge/k-tcp)
