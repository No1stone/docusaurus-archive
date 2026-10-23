---
format: md
id: k-http-is-all
title: "Http is All"
description: "HTTP가 다루는 데이터와 버전(0.9~3.0) 요약 메모"
tags:
  - HTTP
status: active
slug: /knowledge/k-http-is-all
---
# Http is All

> **개요:** HTTP(Hypertext Transfer Protocol)가 거의 모든 형태의 데이터를 나를 수 있다는 점과, 버전별 특징을 적어 둔 메모입니다.

## 전송 대상

텍스트 HTML뿐 아니라 이미지, 음성, 비디오, 파일, JSON, XML 등 여러 데이터를 보냅니다.

## 버전 메모

| 버전 | 메모 |
|---|---|
| 0.9 | GET 메서드 |
| 1.0 | 메서드, 헤더 |
| 1.1 | 보편화된 버전 (현재 주로 사용) |
| 2.0 | 성능 개선 (TCP 위에서 동작) |
| 3.0 | 진행 중, UDP 사용으로 성능 개선 |

TCP를 쓰는 쪽은 1.1, 2.0, UDP를 쓰는 쪽은 3.0이라는 메모입니다.
