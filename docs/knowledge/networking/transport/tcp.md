---
format: md
id: k-tcp
title: "tcp"
description: "TCP 연결 지향, 순서, 신뢰성과 3-way handshake 메모"
tags:
  - HTTP
status: active
slug: /knowledge/k-tcp
---
# tcp

> **개요:** TCP(Transmission Control Protocol, 전송 제어 프로토콜)의 연결과 신뢰성 특성을 적어 둔 메모입니다.

## 패킷에 붙는 정보 순서 (메모)

1. IP: 출발지, 도착지
2. TCP: 전송 제어, 순서, 검증 정보
3. 전송 데이터
4. 포트 정보

## 특성

- 연결 지향
- 데이터 전달 보증
- 순서 보장
- 신뢰

## 핸드셰이크

3-way handshake로 연결을 맺습니다 (연결 → 응답 → 응답).
데이터를 전달한 뒤 응답까지 해야 종료 절차로 이어진다는 메모입니다.
