---
format: md
id: k-webrtc-012ba8
title: "webrtc"
description: "WebRTC 저지연 스트리밍과 시그널링과 렌더링을 다룬 참고 링크 요약"
tags:
  - WebRTC
  - HTTP
status: active
slug: /knowledge/k-webrtc-012ba8
---
# webrtc

## 개요

WebRTC 저지연 스트리밍과 시그널링과 렌더링을 다룬 참고 링크 요약입니다.

> 프로토콜 전체 스펙이 아니라, 저장 당시 의도에 맞는 개념만 남깁니다.
는 라이브커머스에 WebRTC를 쓴 모바일(Flutter) 관점 글입니다.
WebRTC는 음성, 영상, 데이터를 낮은 지연으로 주고받기 위한 기술로, RTMP, HLS보다 지연이 짧은 편입니다.
글에서는 지연이 QoE에 미치는 영향과, 앱 쪽에서 특히 Signalling과 Rendering에 집중하면 된다는 점을 강조합니다.
Signalling에서는 SDP Offer/Answer와 ICE Candidate를 교환합니다.
Rendering에서는 remote stream을 `RTCVideoRenderer`와 Texture에 붙이고, 오디오 채널, 볼륨, 트랙 생명주기를 화면 수명에 맞게 관리합니다.
두 번째 링크는 WebRTC를 웹과 모바일 실시간 통신으로 소개하는 Medium 글입니다.
작성 시점에 본문 조회가 실패했습니다(HTTP 403).
링크는 유지하며, 브라우저에서 원문을 확인합니다.
개요 수준의 입문은 위 GS리테일 글과 , 로 보완할 수 있습니다.

## 예제·코드

```text
https://medium.com/@abdularis/introduction-to-webrtc-as-web-mobile-real-time-communication-2f02cfbd5e24
```

<details>
<summary>참고 자료</summary>

- [샤피라이브 2편: WebRTC 정복하기](https://gsretail.tistory.com/14) — IT 기술 블로그들의 최신 포스트를 한곳에서 보세요.
- [MDN WebRTC API](https://developer.mozilla.org/docs/Web/API/WebRTC_API) — WebRTC (Web Real-Time Communication) is a technology that enables Web applications and sites to capture and optionally stream audio and/or video media, as well as to exchange arbit
- [webrtc.org](https://webrtc.org/)
</details>
