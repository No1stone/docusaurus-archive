---
id: redis-session-token
title: "세션과 토큰 — 저장, 만료, 재발급"
description: "Redis에 세션, 액세스 토큰을 두고 TTL로 만료, 재발급하는 흐름과 boot-base 수동 KV 경로를 정리합니다."
slug: /knowledge/data/redis/patterns/session-and-token
sidebar_position: 2
tags: [Redis]
---
# 세션과 토큰 — 저장, 만료, 재발급

> **개요:** 세션과 토큰은 캐시 라이브러리와 별개로, 키와 TTL을 직접 관리하는 경우가 많습니다.

## 상황

여러 앱 인스턴스가 같은 로그인 상태를 보려면 서버 메모리가 아니라 공유 저장소가 필요합니다.<br />
만료된 토큰은 자동으로 사라져야 합니다.

## 예: 액세스 토큰 존재 확인

boot-base 게이트웨이, 인증 경로에서는 JWT KV를 `@Cacheable`이 아니라 **`CachePort` 직접** 사용합니다.<br />
키 예시는 `access:…` 형태입니다.

```text
발급 → SET access:{tokenId} … EX {ttl}
요청 → EXISTS/GET access:{tokenId}
로그아웃, 폐기 → DEL
재발급 → 새 키 SET, 옛 키 DEL 또는 짧은 유예 TTL
```

## 세션 Hash

```bash
HSET session:{sid} userId 1
EXPIRE session:{sid} 1800
```

요청마다 TTL을 연장하면 슬라이딩 세션이 됩니다.

## 적용할 때

토큰 저장은 lib-cache의 도메인 `@Cacheable` 경로와 섞지 않습니다.<br />
직렬화 형식, 시계 오차, 재발급 시 동시 요청을 설계에 넣습니다.<br />

Ref: [boot-base](https://github.com/No1stone/boot-base), [키 설계와 TTL](/docs/knowledge/data/redis/keys/key-design-and-ttl)
